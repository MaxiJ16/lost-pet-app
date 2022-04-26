import { Router } from "@vaadin/router";
import { state } from "../../state";
import { nanoid } from "nanoid";

class MyData extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  pullUserData() {
    // Esta función sirve para rellenar el form de la page si el user ya existe
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

    // Formulario
    const formMyData = document.querySelector(".data-form") as any;

    formMyData.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = e.target as any;

      // Obtenemos los datos del formulario
      const fullname = target.fullname.value;
      const password = target.password.value;
      const repeatPassword = target["repeat-password"].value;

      // Buscamos el div para pegar nuestros mensajes de éxito o error
      const div = document.querySelector(".message") as any;

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
        div.style.backgroundColor = "rgb(31, 28, 28)";
        div.style.color = "#ff6868";
        div.textContent = "Las contraseñas ingresadas no coinciden";
      }

      // Si las contraseñas coinciden
      if (password == repeatPassword) {
        // Si el usuario existe y quiere modificar los datos
        if (emailExist == true) {
          const userModifiedData = { fullname, password };
          const updateUserData = await state.modifiedUser(userModifiedData);
          setFullnameAndPassword();
          div.style.backgroundColor = "#ff6868";
          div.style.color = "white";
          div.textContent = updateUserData.exito;
        }
        // Si el usuario no existe lo crea
        if (emailExist == false) {
          const objectSignUp = { fullname, email, password };
          // creamos el usuario
          const resSignUp = await state.signUp(objectSignUp);
          // Si se creo
          if (resSignUp.user) {
            cs.user.emailExist = true;
            // Agrega el mensaje de éxito
            div.textContent = resSignUp.message;
            // Lo autentica para iniciar sesión
            const resSignIn = await state.signIn({ email, password });
          }

          if (resSignUp.error) {
            div.textContent = resSignUp.error;
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
          <my-text tag="h1" class="data-title">Mis Datos 0.3</my-text>
          <form class="data-form">

            <label for="fullname" class="name-label">
              <my-text>Nombre</my-text>
              <input class="name-input input" type="text" id="name" name="fullname" required>
            </label>

            <label for="password" class="password-label">
              <my-text>Contraseña</my-text>
              <input class="password-input input" type="password" id="password" name="password" required>
            </label>

            <label for="repeat-password" class="repeat-password-label">
              <my-text>Repetir contraseña</my-text>
              <input class="repeat-password-input input" type="password" id="repeat-password" name="repeat-password" required>
            </label>
            
            <button type="submit" class="button">Guardar</button>
          </form>
          <div class="message"></div>
        </div>
      </section>
    `;
    this.pullUserData();
    this.listeners();
  }
}

customElements.define("my-data-page", MyData);
