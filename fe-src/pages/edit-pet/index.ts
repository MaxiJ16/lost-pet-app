// Imports
import { Router } from "@vaadin/router";
import Dropzone from "dropzone";
import * as mapboxgl from "mapbox-gl";
import { mapboxClient, MAPBOX_TOKEN } from "../../lib/mapbox";
import { state } from "../../state";

// Creamos el objeto PetData
const petData = {};

class EditPet extends HTMLElement {
  map: any;
  connectedCallback() {
    this.render();
  }
  //Configuramos dropzone
  dropzoneConfig() {
    const buttonDropzoneEl = document.querySelector(".dropzone-button") as any;

    const myDropzone = new Dropzone(buttonDropzoneEl, {
      url: "/falsa",
      autoProcessQueue: false,
      thumbnailWidth: 250,
      thumbnailHeight: 250,
    });

    let imageUrl;

    myDropzone.on("thumbnail", function (file) {
      // Guardamos el valor de la img en dataURI con dropzone
      imageUrl = file.dataURL;

      //si subieron una imágen nueva seteamos el valor pictureURL nuevo
      if (imageUrl !== undefined) {
        petData["pictureURL"] = imageUrl;
      }
    });
  }
  initMap() {
    // mapbox
    const mapEl = document.querySelector(".container-map");

    mapboxgl.accessToken = MAPBOX_TOKEN;

    return new mapboxgl.Map({
      container: mapEl,
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }
  // Manejamos el estado de la mascota
  statePet() {
    const cs = state.getState();
    const { estado } = cs.user.petData;

    let estadoNuevo = "";

    // Botón de estado
    const stateButton = document.querySelector(".state-button") as any;

    // Si el estado no es encontrado
    if (estado !== "ENCONTRADO") {
      // El texto es Reportar como perdido
      stateButton.textContent = "Reportar como encontrado";
      // cuando haga click en el botón pasa a ser Perdido
      stateButton.addEventListener("click", (e) => {
        e.preventDefault();
        estadoNuevo = "ENCONTRADO";
        //Si el estado nuevo no es el string vacio por defecto, seteamos el nuevo estado para hacer el update
        if (estadoNuevo !== "") {
          petData["state"] = estadoNuevo;
          // Invocamos a chekKeys para ver si entraron los cambios
          this.checkKeys();

          setTimeout(() => {
            Router.go("/my-pets");
          }, 2500);
        }
      });
    }

    // Si el estado no es perdido
    if (estado !== "PERDIDO") {
      // El texto es Reportar como encontrado
      stateButton.textContent = "Reportar como perdido";
      // cuando haga click en el botón pasa a ser Perdido
      stateButton.addEventListener("click", (e) => {
        e.preventDefault();
        estadoNuevo = "PERDIDO";
        // Si el estado nuevo no es el string vacio por defecto, seteamos el nuevo estado para hacer el update
        if (estadoNuevo !== "") {
          petData["state"] = estadoNuevo;
          this.checkKeys();

          setTimeout(() => {
            Router.go("/my-pets");
          }, 2500);
        }
      });
    }
  }
  // Función para rellenar con los datos de la mascota el formulario
  pullPetData() {
    const cs = state.getState();

    const {
      namePet,
      imagePet,
      locationPet,
      last_location_lat,
      last_location_lng,
    } = cs.user.petData;

    // Formulario
    const formData = document.querySelector(".edit-form") as any;
    formData.name.value = namePet;
    formData.location.value = locationPet;

    // Imágen
    const petImg = document.querySelector(".pet-picture") as any;
    petImg.src = imagePet;

    // Mapa
    const coord = [last_location_lng, last_location_lat];
    new mapboxgl.Marker().setLngLat(coord).addTo(this.map);
    this.map.setCenter(coord);
    this.map.setZoom(14);
  }
  // Esta función chequea si el objeto petData no está vacío y sube los cambios
  async checkKeys() {
    const cs = state.getState();
    const { petId } = cs.user.petData;

    // Buscamos el div para pegar nuestros mensajes de éxito o error
    const div = document.querySelector(".message") as any;

    // si el objeto petData no tiene propiedades es porque no se realizaron cambios
    const objectKeys = Object.keys(petData).length == 0;

    if (objectKeys !== false) {
      div.className = "error";
      div.textContent = "No realizaste ningún cambio";
    }
    // Si el objeto tiene propiedades sufrió cambios entonces modificamos la mascota
    if (objectKeys !== true) {
      // Esperamos la respuesta de modificar la mascota
      const resEditPet = await state.modifiedPet(petData, petId);

      // Si se cumple la respuesta
      if (resEditPet.message) {
        div.style.backgroundColor = "#ff6868";
        div.style.color = "white";
        div.textContent = resEditPet.message;
      }

      // Si la respuesta devuelve un error
      if (resEditPet.error) {
        div.className = "error";
        div.textContent = resEditPet.error;
      }
    }
  }
  addListeners() {
    const cs = state.getState();
    // MAPBOX CONFIG
    const locationValue = document.querySelector(
      ".location-input"
    ) as HTMLInputElement;

    // Botón para la búsqueda de la ubicación
    const buttonSearch = document.querySelector(".button-search") as any;
    buttonSearch.style.backgroundColor = "#ff6868";

    buttonSearch.addEventListener("click", (e) => {
      e.preventDefault();

      mapboxClient.geocodeForward(
        locationValue.value,
        {
          country: "ar",
          autocomplete: true,
          language: "es",
        },
        (err, data, res) => {
          const firstResult = data.features[0];
          // obtenemos la lat y lng de firstResult.geometry.coordinates
          const [lng, lat] = firstResult.geometry.coordinates;

          state.setGeolocPet(lat, lng);

          petData["last_location_lat"] = lat;
          petData["last_location_lng"] = lng;

          new mapboxgl.Marker()
            .setLngLat(firstResult.geometry.coordinates)
            .addTo(this.map);

          this.map.setCenter(firstResult.geometry.coordinates);
          this.map.setZoom(14);
        }
      );
    });

    // Obtenemos datos del state
    const { namePet, locationPet, petId } = cs.user.petData;

    // Buscamos el div para pegar nuestros mensajes de éxito o error
    const div = document.querySelector(".message") as any;

    //form
    const formEl = document.querySelector(".edit-form") as any;
    formEl.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      div.textContent = "Espera un momento, modificando mascota...";

      // Si el nombre y la locación en el state es distinto al que enviamos por el form,
      // cambiamos el valor para modificar la mascota, si es igual no lo modifica

      if (namePet !== e.target.name.value) {
        petData["name"] = e.target.name.value;
      }

      if (locationPet !== e.target.location.value) {
        petData["location"] = e.target.location.value;
      }

      this.checkKeys();

      setTimeout(() => {
        Router.go("/my-pets");
      }, 2500);
    });

    // Link para eliminar la mascota
    const deleteLink = document.querySelector(".unpublish-link") as any;

    deleteLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const resDeletePet = await state.eliminatePet(petId);
      // Si se eliminó correctamente
      if (resDeletePet.message) {
        div.style.backgroundColor = "#ff6868";
        div.textContent = resDeletePet.message;
        setTimeout(() => {
          Router.go("/my-pets");
        }, 2500);
      }
      // Si la respuesta devuelve un error
      if (resDeletePet.error) {
        div.className = "error";
        div.textContent = resDeletePet.error;
      }
    });
  }

  render() {
    this.innerHTML = `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>
      
      <script src="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
      <script src="//unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>

      <section class="edit">
        <div class="edit-container">
          <my-text tag="h1" class="data-title">Editar mascota perdida</my-text>
          
          <form class="edit-form">
            <label for="name" class="namePet-label">
              <my-text>Nombre</my-text>
              <input class="name-input input" type="text" id="name" name="name" required>
            </label>

            <img class="pet-picture" src=""></img>
            <p class="button dropzone-button">Agregar/Modificar foto</p>
            
            <label for="location" class="location-label">
              <p>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
              <my-text>Ubicación</my-text>
              <input class="location-input input" type="search" id="location" name="location" required>
              <button class="button button-search">Buscar</button>
              <div class="container-map" style='width: 100%; height: 300px;'></div>         
            </label>
            
            <button type="submit" class="button state-button"></button>
            
            <button class="button">Guardar</button>
          </form>

          <a class="unpublish-link">DESPUBLICAR</a>
          <div class="message"></div>
        </div>
      </section>
    `;

    this.map = this.initMap();

    this.statePet();
    this.pullPetData();

    this.addListeners();
    this.dropzoneConfig();
  }
}

customElements.define("edit-pet-page", EditPet);
