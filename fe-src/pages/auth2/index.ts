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

    const msgCom = document.querySelector("msg-comp");
    // LOADER
    const preloaderEl = document.querySelector("pre-loader") as any;

    // FORM
    const formEl = document.querySelector(".auth-form-2") as any;
    // SUBMIT DEL FORM
    formEl.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      preloaderEl.style.display = "initial";

      // SETEAMOS LA DATA CON EL EMAIL DEL STATE Y LA CONTRASEÑA INGRESADA EN EL INPUT
      const authData = { email, password: e.target.password.value };
      const authRes = await state.signIn(authData);
      
      // SI LA PROMESA DEL SIGIN NO SE RESUELVE
      if (authRes.error) {
        preloaderEl.style.display = "none";
        msgCom.className = "message-error";
        msgCom.textContent = authRes.error;
      }
      // SI SE RESUELVE NOS DEVUELVE EL TOKEN
      if (authRes.token) {
        // CON ESE TOKEN PEDIMOS LA DATA DEL USUARIO
        const getUserRes = await state.getUserData(authRes.token);
        // SI LA DATA DEL USUARIO SE RESUELVE
        if (getUserRes) {
          preloaderEl.style.display = "none";
          msgCom.className = "message-exito";
          msgCom.textContent = "Logueado con éxito";

          setTimeout(() => {
            Router.go(pageBefore);
          }, 2500);
        }
      }
    });

    // RECUPERAR CONTRASEÑA
    const forgottenPassword = document.querySelector(".auth-form-link");

    forgottenPassword.addEventListener("click", async (e) => {
      e.preventDefault();
      preloaderEl.style.display = "initial";
      // CREAMOS LA CONTRASEÑA TEMPORARIA CON NANOID
      const temporaryPassword = nanoid(6);
      // LA SETEAMOS
      const data = { email, password: temporaryPassword };
      const resTemporaryPassword = await state.newPassword(data);

      // SI NOS DEVUELVE UN 1 ES PORQUE LA CONTRASEÑA SE SETEO CORRECTAMENTE
      if (resTemporaryPassword.resNewPass[0] == 1) {
        preloaderEl.style.display = "none";
        msgCom.className = "message-exito";
        msgCom.textContent = resTemporaryPassword.message;
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
              <my-text tag="h4">Contraseña</my-text>
            </label>
            <input type="password" class="auth-form-input input" name="password" required>
            <my-text tag="h4" class="auth-form-link">Olvidé mi contraseña</my-text>          
            <button type="submit" class="auth-form-button button"><my-text tag="h5">Ingresar</my-text></button>
          </form>
          <pre-loader></pre-loader>
          <msg-comp></msg-comp>
        </div>
      </section>
    `;
    this.listeners();
  }
}

customElements.define("auth2-page", Auth);
