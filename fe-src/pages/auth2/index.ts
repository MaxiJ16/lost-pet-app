import { Router } from "@vaadin/router";
import { nanoid } from "nanoid";
import { state } from "../../state";

class Auth extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  listeners() {
    const cs = state.getState();
    const { pageBefore, email } = cs.user;

    //Form
    const formEl = document.querySelector(".auth-form-2") as any;
    const divMessage = document.querySelector(".message-auth") as any;

    formEl.addEventListener("submit", async (e: any) => {
      e.preventDefault();

      const authData = {
        email,
        password: e.target.password.value,
      };

      const authRes = await state.signIn(authData);

      if (authRes.error) {
        divMessage.style.backgroundColor = "rgb(31, 28, 28)";
        divMessage.style.color = "#ff6868";
        divMessage.textContent = authRes.error;
      }

      if (authRes.token) {
        const getUserRes = await state.getUserData(authRes.token);

        if (getUserRes) {
          divMessage.style.backgroundColor = "#ff6868";
          divMessage.style.color = "white";
          divMessage.textContent = "Logueado con éxito";

          setTimeout(() => {
            Router.go(pageBefore);
          }, 2500);
        }
      }
    });

    // Recuperar contraseña
    const forgottenPassword = document.querySelector(".auth-form-link");

    forgottenPassword.addEventListener("click", async (e) => {
      e.preventDefault();
      // Creamos la contraseña temporarria con nanoId
      const temporaryPassword = nanoid(6);
    
      const data = {
        email,
        password: temporaryPassword,
      };

      const resTemporaryPassword = await state.newPassword(data);

      // Si nos devuelve un 1 es porque la contraseña se cambió correctamente y mostramos el mensaje
      if (resTemporaryPassword.resNewPass[0] == 1) {
        divMessage.textContent = resTemporaryPassword.message;
        divMessage.style.backgroundColor = "#ff6868";
        divMessage.style.color = "white";
      }
    });
  }
  render() {
    this.innerHTML = `
      <section class="auth">
        <div class="auth-container">
          <my-text tag="h1" class="auth-title">Ingresar</my-text>
        
          <form class="auth-form-2">
            <label for="password" class="auth-form-label">
              <my-text>CONTRASEÑA</my-text>
            </label>
            <input type="password" class="auth-form-input input" name="password" required>
            <a class="auth-form-link">OLVIDÉ MI CONTRASEÑA<a/>          
            <button type="submit" class="auth-form-button button">Ingresar</button>
          </form>

          <div class="message-auth"></div>
        </div>
      </section>
    `;
    this.listeners();
  }
}

customElements.define("auth2-page", Auth);
