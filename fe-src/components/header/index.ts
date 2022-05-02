import { Router } from "@vaadin/router";
import { state } from "../../state";
import "./index.css";

const menuBurguer = require("../../assets/menu.png");
const menuX = require("../../assets/x.png");

export class Header extends HTMLElement {
  connectedCallback() {
    state.subscribe(() => {
      const cs = state.getState();
      const { email, token } = cs.user;
      this.email = email;
      this.token = token;
      this.render();
    });
    this.render();
  }
  email: string;
  token: string;
  addListeners() {
    // Listeners para el menú desplegable
    const windowEl = document.querySelector(".nav-container__menu-window") as any;
    const burguerEl = this.querySelector(".nav-container__menu-burguer") as any;
    const closeWindowEl = document.querySelector(".menu-window__close-window") as any;

    burguerEl.addEventListener("click", () => {
      windowEl.style.display = "flex";
    });
    closeWindowEl.addEventListener("click", () => {
      windowEl.style.display = "";
    });

    // Datos del state
    const cs = state.getState();
    const { emailExist, pageBefore } = cs.user;

    //listener para iniciar sesión
    const sessionEl = document.querySelector(".session") as any;

    sessionEl.addEventListener("click", () => {
      const textSession = sessionEl.textContent;
      windowEl.style.display = "";
      if (textSession == "Iniciar Sesión") {
        Router.go("/auth");
      } else if (textSession == "Cerrar Sesión") {
        state.closeSessionUser();
        Router.go("/");
      }
    });

    // listener my-data

    const myDataEl = document.querySelector(".my-data") as any;
    myDataEl.addEventListener("click", () => {
      windowEl.style.display = "";
      if (emailExist == "" || false) {
        state.setPageBefore("/my-data");
        Router.go("/auth");
      } else {
        Router.go("/my-data");
      }
    });

    // listener mis mascotas reportadas

    const mypetsReportsEl = document.querySelector(".my-pets") as any;
    mypetsReportsEl.addEventListener("click", () => {
      windowEl.style.display = "";
      if (emailExist == "" || false) {
        state.setPageBefore("/my-pets");
        Router.go("/auth");
      } else {
        Router.go("/my-pets");
      }
    });

    //listener reportar mascotas

    const reportPetsEl = document.querySelector(".report-pets") as any;

    reportPetsEl.addEventListener("click", () => {
      windowEl.style.display = "";
      if (emailExist == "" || false) {
        state.setPageBefore("/report-pet");
        Router.go("/auth");
      } else {
        Router.go("/report-pet");
      }
    });
  }
  render() {
    this.innerHTML = `
    <header class="nav-container">
    <my-paw></my-paw>
    <div class="nav-container__menu">
      <img class="nav-container__menu-burguer" src="${menuBurguer}" alt="burger">
      <div class="nav-container__menu-window">
        <div class="menu-window__containerX">
          <img src="${menuX}" alt="x" class="menu-window__close-window">
        </div>
        <div class="menu-window__contents">
          <a href="" class="menu-window__contents-title my-data"><my-text tag="h2">Mis datos</my-text></a>
          <a href="" class="menu-window__contents-title my-pets"><my-text tag="h2">Mis mascotas reportadas</my-text></a>
          <a href="" class="menu-window__contents-title report-pets"><my-text tag="h2">Reportar mascota</my-text></a>
          
          <div class="session-data">
            <my-text tag="h3" class="data-email">${
              this.email && this.token !== "" ? this.email : "Invitado/a"
            }</my-text>
            <my-text tag="h3" class="menu-window__contents-title session">${
              this.email && this.token !== ""
                ? "Cerrar Sesión"
                : "Iniciar Sesión"
            }</my-text>
          </div>

        </div>
      </div>
    </div>
    
    </header>
    `;
    this.addListeners();
  }
}
customElements.define("my-header", Header);
