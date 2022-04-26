import { Router } from "@vaadin/router";
import { state } from "../../state";

class MyPets extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  async listeners() {
    // Buscamos las referencias
    const noReportsEl = document.querySelector(".no-reports") as any;
    const cardsContainer = document.querySelector(".cards-container") as any;

    // Esperamos la respuesta de las mascotas que reportó el usuario
    const resUserPets = await state.userPets();
    // De la respuesta guardamos todas las mascotas
    const allPetsUser = resUserPets.allPets;

    // Si la cantidad de mascotas es (> a 0) las mostramos
    if (resUserPets.amount > 0) {
      // For of para recorrer todas las mascotas
      for (const pet of allPetsUser) {
        // Obtenemos los datos de cada mascota
        const {
          name,
          pictureURL,
          location,
          state,
          id,
          last_location_lat,
          last_location_lng,
        } = pet;

        const petcardCont = document.createElement("div");

        petcardCont.innerHTML = `
        <my-pet-card name="${name}" img="${pictureURL}" location="${location}" petId="${id}" estado="${state}" last_location_lat="${last_location_lat}" last_location_lng="${last_location_lng}"></my-pet-card>
        `;

        cardsContainer.appendChild(petcardCont);
      }
    }
    // Si la cantidad de mascotas es (< a 0) largamos este msj
    if (resUserPets.amount == 0) {
      noReportsEl.textContent = "Aún no reportaste mascotas perdidas";
    }
  }
  render() {
    this.innerHTML = `
      <section class="my-pets-page">
        <div class="my-pets-container">
          <my-text tag="h1" class="my-pets-title">Mis mascotas reportadas</my-text>
          <h2 class="no-reports"></h2>
        </div>
        <div class="cards-container"></div>
      </section>
    `;
    this.listeners();
  }
}

customElements.define("my-pets-reports", MyPets);
