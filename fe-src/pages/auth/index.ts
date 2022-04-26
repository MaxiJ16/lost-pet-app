import { Router } from "@vaadin/router";
import { state } from "../../state";

class Auth extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  listeners() {
    const cs = state.getState();
    // Formularío del email
    const authFormEl = document.querySelector(".auth-form") as any;

    authFormEl.addEventListener("submit", async (e: any) => {
      e.preventDefault();

      const email = e.target.email.value;
      const emailData = { email };

      const checkEmail = await state.checkEmail(emailData);
      
      if (checkEmail == true) {
        await state.setUserEmail(email);
        Router.go("/auth-2");
      }

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
              <my-text>Email</my-text>
            </label>
            <input type="email" name="email" class="auth-form-input input" required>
            <button type="submit" class="auth-form-button button">Siguiente</button>
          </form>
        </div>
      </section>
    `;
    this.listeners();
  }
}

customElements.define("auth-page", Auth);
