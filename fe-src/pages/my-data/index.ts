import { Router } from "@vaadin/router";
import { state } from "../../state";
import { nanoid } from "nanoid";

class MyData extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  // Esta función sirve para rellenar el form de la page si el user ya existe
  pullUserData() {
    const cs = state.getState();
    const { fullname, passwordId, emailExist } = cs.user;

    if (emailExist) {
      const formData = document.querySelector(".data-form") as any;
      formData.fullname.value = fullname;
      formData.password.value = passwordId;
      formData["repeat-password"].value = passwordId;
    }
  }
  listeners() {
    const cs = state.getState();

    // Buscamos el custom element para pegar nuestros mensajes de éxito o error
    const msgEl = document.querySelector("msg-comp") as any;
    const preloaderEl = document.querySelector("pre-loader") as any;

    // Formulario
    const formMyData = document.querySelector(".data-form") as any;

    formMyData.addEventListener("submit", async (e) => {
      e.preventDefault();
      preloaderEl.style.display = "initial";
      
      // Obtenemos los datos del formulario
      const target = e.target as any;
      const fullname = target.fullname.value;
      const password = target.password.value;
      const repeatPassword = target["repeat-password"].value;

      // obtenemos el email del state
      const { email, emailExist } = cs.user;

      // Función para setear fullname/ password
      function setFullnameAndPassword() {
        state.setUserFullname(fullname);
        const passId = nanoid(password.length);
        state.setPasswordId(passId);
      }

      // Si las contraseñas ingresada son distintas
      if (password !== repeatPassword) {
        preloaderEl.style.display = "none";
        msgEl.className = "message-error";
        msgEl.textContent = "Las contraseñas ingresadas no coinciden";
      }

      // Si las contraseñas coinciden
      if (password == repeatPassword) {
        // Si el usuario existe y quiere modificar los datos
        if (emailExist == true) {
          const userModifiedData = { fullname, password };
          const updateUserData = await state.modifiedUser(userModifiedData);
          setFullnameAndPassword();

          preloaderEl.style.display = "none";
          msgEl.className = "message-exito"
          msgEl.textContent = updateUserData.exito;
        }

        // Si el usuario no existe lo crea
        if (emailExist == false) {
          const objectSignUp = { fullname, email, password };
          // creamos el usuario
          const resSignUp = await state.signUp(objectSignUp);
          // Si se creo
          if (resSignUp.user) {
            cs.user.emailExist = true;
            preloaderEl.style.display = "none";
            // Agrega el mensaje de éxito
            msgEl.className = "message-exito"
            msgEl.textContent = resSignUp.message;
            // Lo autentica para iniciar sesión
            const resSignIn = await state.signIn({ email, password });
          }

          if (resSignUp.error) {
            preloaderEl.style.display = "none";
            msgEl.textContent = resSignUp.error;
            msgEl.className = "message-error"
          }

          setFullnameAndPassword();
        }
      }
    });
  }
  render() {
    this.innerHTML = `
      <section class="data">
        <div class="data-container">
          <my-text tag="h1" class="data-title">Mis Datos</my-text>
          <form class="data-form">

            <label for="fullname" class="name-label">
              <my-text tag="h4">Nombre</my-text>
              <input class="name-input input" type="text" id="name" name="fullname" required>
            </label>

            <label for="password" class="password-label">
              <my-text tag="h4">Contraseña</my-text>
              <input class="password-input input" type="password" id="password" name="password" required>
            </label>

            <label for="repeat-password" class="repeat-password-label">
              <my-text tag="h4">Repetir contraseña</my-text>
              <input class="repeat-password-input input" type="password" id="repeat-password" name="repeat-password" required>
            </label>
            
            <button type="submit" class="button">Guardar</button>
            </form>
            <msg-comp></msg-comp>
            <pre-loader></pre-loader>

        </div>
      </section>
    `;
    this.pullUserData();
    this.listeners();
  }
}

customElements.define("my-data-page", MyData);
