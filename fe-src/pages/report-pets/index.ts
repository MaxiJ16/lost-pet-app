import { Router } from "@vaadin/router";
import Dropzone from "dropzone";

//mapbox
import * as mapboxgl from "mapbox-gl";
import { mapboxClient, MAPBOX_TOKEN } from "../../lib/mapbox";
import { state } from "../../state";

class ReportPets extends HTMLElement {
  map: any;
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const cs = state.getState();

    // CONFIGURAMOS DROPZONE
    const buttonDropzoneEl = document.querySelector(".dropzone-button") as any;

    const myDropzone = new Dropzone(buttonDropzoneEl, {
      url: "/falsa",
      autoProcessQueue: false,
      thumbnailWidth: 250,
      thumbnailHeight: 250,
    });

    // Guardamos el valor de la img en dataURI con dropzone
    let imageUrl;

    myDropzone.on("thumbnail", function (file) {
      imageUrl = file.dataURL;
    });

    // Cancelar
    const cancelButton = document.querySelector(".button-cancel") as any;
    cancelButton.addEventListener("click", () => {
      Router.go("/");
    });

    // Buscamos el div para pegar nuestros mensajes de éxito o error
    const msgEl = document.querySelector("msg-comp") as any;

    //form
    const formEl = document.querySelector(".report-form") as any;
    formEl.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      const { lat, lng } = cs.user._geoloc;

      msgEl.className = "message-error";
      msgEl.textContent = "Aguarda un momento...";

      if (lat && lng) {
        // Tomamos los datos de la mascota y los ponemos en el objeto petData
        const petData = {
          name: e.target.name.value,
          pictureURL: imageUrl,
          state: "PERDIDO",
          last_location_lat: lat,
          last_location_lng: lng,
          location: e.target.location.value,
        };

        // Esperamos la respuesta
        const resNewPet = await state.newPet(petData);

        // Si se cumple la respuesta
        if (resNewPet.message) {
          msgEl.className = "message-exito";
          msgEl.textContent = resNewPet.message;
          // Una vez creada la mascota lo redirige a sus mascotas reportadas
          setTimeout(() => {
            Router.go("/my-pets");
          }, 2000);
        }

        // Si la respuesta devuelve un error
        if (resNewPet.error) {
          msgEl.className = "message-error";
          msgEl.textContent = resNewPet.error;
        }
      } else {
        msgEl.className = "message-error";
        msgEl.textContent = "Tenemos problemas con las coordenadas vuelve a intentarlo";
      }
    });
  }
  render() {
    this.innerHTML = `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>
      
      <script src="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
      <script src="//unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>

      <section class="report">
        <div class="report-container">
          <my-text tag="h1" class="data-title">Reportar mascota perdida</my-text>
          
          <form class="report-form">
            
            <label for="name" class="namePet-label">
              <my-text tag="h4">Nombre</my-text>
              <input class="name-input input" type="text" id="name" name="name" required>
            </label>

            <p class="button dropzone-button">Agregar/Modificar foto</p>
            
            <label for="location" class="location-label">
              <p class="location-p">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
    
              <my-text tag="h4">Ubicación</my-text>
              <input class="location-input input" type="search" id="location" name="location" required>
              
              <button class="button button-search">Buscar</button>
              <div class="container-map" style='width: 100%; height: 300px;'></div>         
            </label>
            
            <button type="submit" class="button lost-button">Reportar como perdido</button>
            </form>
            
            <button class="button button-cancel">Cancelar</button>
            <msg-comp></msg-comp>
        </div>
      </section>
    `;

    // MAPBOX
    const mapa = document.querySelector(".container-map");
    const locationValue = document.querySelector(
      ".location-input"
    ) as HTMLInputElement;

    // Función para inicializar el mapa
    function initMap() {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      return new mapboxgl.Map({
        container: mapa,
        style: "mapbox://styles/mapbox/streets-v11",
      });
    }

    // BUTTON PARA BUSCAR LA UBICACIÓN
    const buttonSearch = document.querySelector(".button-search") as any;

    function initSearchForm(callback) {
      buttonSearch.addEventListener("click", (e) => {
        e.preventDefault();

        mapboxClient.geocodeForward(
          locationValue.value,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          function (err, data, res) {
            if (!err) callback(data.features);
          }
        );
      });
    }

    // FUNCTION AUTOEJECUTABLE PARA QUE FUNCIONE MAPBOX
    (function () {
      let map = initMap();

      initSearchForm(function (results) {
        const firstResult = results[0];

        const marker = new mapboxgl.Marker()
          .setLngLat(firstResult.geometry.coordinates)
          .addTo(map);

        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);

        // obtenemos la lat y lng de firstResult.geometry.coordinates
        const [lng, lat] = firstResult.geometry.coordinates;
        // Seteamos la lat y lng en el state
        state.setGeolocPet(lat, lng);

        // hace un centro del lugar que encontró
        map.setCenter(firstResult.geometry.coordinates);
        // le hace zoom al mapa
        map.setZoom(14);
      });
    })();

    this.addListeners();
  }
}

customElements.define("report-pet-page", ReportPets);
