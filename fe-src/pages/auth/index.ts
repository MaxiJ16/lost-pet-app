import { Router } from "@vaadin/router";
import { state } from "../../state";

class Auth extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  listeners() {
    // FORMULARIO DEL EMAIL
    const authFormEl = document.querySelector(".auth-form") as any;

    authFormEl.addEventListener("submit", async (e: any) => {
      e.preventDefault();

      // OBTENEMOS EL VALOR DE EMAIL
      const email = e.target.email.value;
      const emailData = { email };
      // CUEQUEAMOS SI EXISTE
      const checkEmail = await state.checkEmail(emailData);
      // SI EXISTE
      if (checkEmail == true) {
        await state.setUserEmail(email);
        Router.go("/auth-2");
      }
      // SI NO EXISTE
      if (checkEmail == false) {
        await state.setUserEmail(email);
        Router.go("/my-data");
      }
    });
  }
  render() {
    this.innerHTML = `
      <section class="auth">
        <div class="auth-container">
          <my-text tag="h1" class="auth-title">Ingresar</my-text>
          <form class="auth-form">
            <label for="name" class="auth-form-label">
              <my-text tag="h4">Email</my-text>
            </label>
            <input type="email" name="email" class="auth-form-input input" required>
            <button type="submit" class="auth-form-button button"><my-text tag="h5">Siguiente</my-text</button>
          </form>
        </div>
      </section>
    `;
    this.listeners();
  }
}

customElements.define("auth-page", Auth);
