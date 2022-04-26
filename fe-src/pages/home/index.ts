import { state } from "../../state";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const containerEl = document.querySelector(".container-form") as any;

    // Botón para dar mi ubicación
    const buttonEl = document.querySelector(".form-button") as any;
    buttonEl.addEventListener("click", async (e) => {
      e.preventDefault();

      // Le pedimos al usuario que nos de su ubicación
      await navigator.geolocation.getCurrentPosition((geolocation) => {
        const lat = geolocation.coords.latitude;
        const lng = geolocation.coords.longitude;

        state.setUserGeoLoc(lat, lng);
      });

      const response = await state.lostPetsNearby();
      const findPets = response.findPet;
      console.log(response);

      if (response.length > 0) {
        
        // Si me da la respuesta eliminamos el texto y el botón que están dentro del container
        while (containerEl.firstChild) {
          containerEl.removeChild(containerEl.firstChild);
        }

        // Cambiamos el display a grid así se ven las grillas
        containerEl.style.display = "grid";

        // Obtenemos los datos de cada mascota que encontró
        for (const pet of findPets) {
          const { name, pictureURL, location, state, id } = pet;

          const petCard = document.createElement("div");

          petCard.innerHTML = `
            <my-pet-card name="${name}" img="${pictureURL}" location="${location}" petId="${id}" estado="${state}" ></my-pet-card>
        `;

          containerEl.appendChild(petCard);
        }
      }

      // si no hay mascotas cerca
      if (response.length == 0) {
        const divNotPetEl = document.querySelector(".notPet") as any;
        divNotPetEl.style.display = "initial";
      }
    });
  }
  render() {
    this.innerHTML = `
    <div class="page-home">
      <section class="container">
        <my-text class="title" tag="h1">Mascotas perdidas cerca tuyo</my-text>
        <div class="container-form">
          <my-text class="text">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</my-text>
          <button class="form-button button">Dar mi ubicación</button>
        </div>
        <div class="notPet">No se encontraron mascotas cerca de tu ubicación</div>
      </section>
    </div>
    `;
    this.addListeners();
  }
}

customElements.define("home-page", Home);
