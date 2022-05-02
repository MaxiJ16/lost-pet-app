import { state } from "../../state";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    // CONTENEDOR
    const containerEl = document.querySelector(".container-form") as any;
    // PRELOADER
    const preloaderEl = document.querySelector(".preloader") as any;
    // BOTÓN PARA PEDIR LA UBICACIÓN
    const buttonEl = document.querySelector(".form-button") as any;

    buttonEl.addEventListener("click", async (e) => {
      e.preventDefault();
      preloaderEl.style.display = "initial";
      // LE PEDIMOS AL USUARIO LA UBICACIÓN
      navigator.geolocation.getCurrentPosition(async (geolocation) => {
        const lat = geolocation.coords.latitude;
        const lng = geolocation.coords.longitude;
        // SETEAMOS LA LATITUD Y LONGITUD EN EL STATE
        state.setUserGeoLoc(lat, lng);
        // LLAMAMOS A LA FUNCIÓN QUE BUSCA LAS MASCOTAS
        const response = await state.lostPetsNearby(lat, lng);
        //FIND PETS NOS TRAE TODAS LAS MASCOTAS QUE ENCONTRÓ
        const findPets = response.findPet;

        // SI ENCONTRÓ 1 MÁSCOTA O MÁS
        if (response.length > 0) {
          // ELIMINAMOS EL TEXTO Y EL BOTÓN PARA DAR LA UBICACIÓN
          while (containerEl.firstChild) {
            containerEl.removeChild(containerEl.firstChild);
          }
          // DEJAMOS DE MOSTRAR EL PRELOADER
          preloaderEl.style.display = "none";
          // CAMBIAMOS EL DISPLAY A GRID
          containerEl.style.display = "grid";

          // RECORREMOS LAS MASCOTAS ENCONTRADAS
          for (const pet of findPets) {
            // OBTENEMOS LOS DATOS
            const { name, pictureURL, location, state, id } = pet;
            // Y LOS AGREGAMOS A LAS CARD
            const petCard = document.createElement("div");
            petCard.innerHTML = `
              <my-pet-card name="${name}" img="${pictureURL}" location="${location}" petId="${id}" estado="${state}" ></my-pet-card>
            `;
            // AGREGAMOS LAS CARD AL CONTENEDOR
            containerEl.appendChild(petCard);
          }
        }

        // SI NO ENCONTRÓ NINGUNA MASCOTA CERCA, MOSTRAMOS EL MENSAJE DE QUE NO HAY MASCOTAS CERCA
        if (response.length == 0) {
          preloaderEl.style.display = "none";
          const divNotPetEl = document.querySelector(".notPet") as any;
          divNotPetEl.style.display = "initial";
        }
      });
    });
  }
  render() {
    this.innerHTML = `
    <div class="page-home">
      <section class="container">
        <my-text class="title" tag="h1">Mascotas perdidas cerca tuyo </my-text>
        <div class="container-form">
          <my-text tag="h4" class="text">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</my-text>
          <button class="form-button button"><my-text tag="h5">Dar mi ubicación</my-text></button>
        </div>
        <div class="notPet">No se encontraron mascotas cerca de tu ubicación</div>
        <pre-loader class="preloader"></pre-loader>
      </section>
    </div>
    `;
    this.addListeners();
  }
}

customElements.define("home-page", Home);
