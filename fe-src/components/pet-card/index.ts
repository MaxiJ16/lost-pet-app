import { Router } from "@vaadin/router";
import { state } from "../../state";

// const bobbyPicture = require("../../assets/bobby.png");
const lapizPicture = require("../../assets/lapiz.png");
const menuX = require("../../assets/xBlack.png");

export class Card extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  // Recibimos la data de la mascota
  receivePetData() {
    const imagePet = this.getAttribute("img");
    const namePet = this.getAttribute("name");
    const locationPet = this.getAttribute("location");
    const estado = this.getAttribute("estado");
    const last_location_lat = this.getAttribute("last_location_lat");
    const last_location_lng = this.getAttribute("last_location_lng");
    const petId = Number(this.getAttribute("petId"));

    // Armamos el objeto para poder setearlo en setPetData
    const petDataObj = {
      namePet,
      imagePet,
      locationPet,
      petId,
      last_location_lat,
      last_location_lng,
      estado,
    };

    return petDataObj;
  }
  connectedCallback() {
    this.render();
    // Buscamos la ubicación de la card dónde está REPORTAR INFORMACIÓN y la img del lapiz
    const reportInfo = this.shadow.querySelector(".content-link") as any;
    const editPetImg = this.shadow.querySelector(".picture") as any;

    // Si estamos en mis mascotas reportadas le agregamos la foto del lapiz para editar
    if (location.pathname == "/my-pets") {
      editPetImg.src = lapizPicture;
      // Cuando le hagan click al lapiz para editar tomamos los atributos para obtener los datos de esa mascota y los seteamos
      editPetImg.addEventListener("click", () => {
        state.setPetData(this.receivePetData());
        Router.go("/edit-pet");
      });
    }

    if (location.pathname !== "/my-pets") {
      editPetImg.src = "";
      reportInfo.textContent = "REPORTAR INFORMACIÓN";
      // Formulario para reportar infomación
      const formReportEl = this.shadow.querySelector(
        ".petCard-container-reportInfo"
      ) as any;

      // Si le hacen click a reportar información
      reportInfo.addEventListener("click", () => {
        state.setPetData(this.receivePetData());
        // Mostramos el formulario
        formReportEl.style.display = "initial";
      });

      // X para cerrar la venta de reporte
      const buttonX = this.shadow.querySelector(".menuX") as any;

      buttonX.addEventListener("click", () => {
        formReportEl.style.display = "none";
      });

      // Buscamos el div en el que mostramos el mensaje
      const message = this.shadow.querySelector(".message") as any;

      // Escuchamos el evento submit de reporte para tomar los datos y crear el reporte
      formReportEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        const cs = state.getState();
        const { petId } = cs.user.petData;

        const reportRes = await state.createReport({
          reporter: e.target.name.value,
          phone_number: e.target.phone.value,
          message: e.target.where.value,
          petId: petId,
        });

        if (reportRes.res) {
          message.style.backgroundColor = "#ff6868";
          message.textContent = reportRes.mensaje;

          setTimeout(() => {
            formReportEl.style.display = "none";
          }, 2000);
        }

        if (reportRes.error) {
          message.textContent = reportRes.error;
        }
      });
    }
  }
  render() {
    const { imagePet, namePet, locationPet, estado } = this.receivePetData();

    const divEl = document.createElement("div");
    divEl.className = "container-petCard";
    divEl.innerHTML = `
      <div class="petCard-container-img">
        <img class="img" src="${imagePet}" alt="pet" >
      </div>

      <div class="petCard-container-content">
        <div class="content-text">
          <my-text tag="h3" class="text-pet-name">${namePet}</my-text>
          <my-text class="text-pet-location">${locationPet}</my-text>
          <my-text class="text-pet-state">Estado: ${estado}</my-text>
        </div>
        <a class="content-link" href=""><img class="picture" src=""></img></a>
      </div>

      <div class="petCard-container-reportInfo">
      
        <form class="reportInfo-form">

          <div class="container-x">
            <img class="menuX" src="${menuX}"></img>
          </div>
  
          <my-text tag="h1">Reportar info de ${namePet}</my-text>
          
          <label for="name" class="label">
            <my-text>TU NOMBRE</my-text>
            <input class="input reportName-input" type="text" id="name" name="name"/ required>
          </label>

          <label for="phone" class="label">
            <my-text>TU TELÉFONO</my-text>
            <input class="input reportPhone-input" type="text" id="phone" name="phone"/ required>
          </label>

          <label for="where" class="label">
            <my-text>DONDE LO VISTE?</my-text>
            <textarea class="textarea reportWhere-textarea" type="text" id="where" name="where"/ required></textarea>
          </label>

          <button type="submit" class="button reportInfo-button">Enviar</button>
          <div class="message"></div>
        </form>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      * {
        box-sizing:border-box;
      }

      .container-petCard {
        margin: 0 auto;
        box-sizing: border-box;
        width: 335px;
        height: 300px;
        border: 2px solid #000000;
        border-radius: 4px;
        display:flex;
        flex-direction: column;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      }

      .container-petCard:hover {
        box-shadow: 0 8px 16px 0 grey;
      }

      .petCard-container-img{
        width: 100%;
        height: 200px;
      }

      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .petCard-container-content {
        width: 100%;
        height: 87px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px 11px;
      }

      .content-link{
        width: 122px;
        text-align: right;
      }

      .petCard-container-reportInfo {
        display: none;
        background-color: rgba(0, 0, 0 ,0.6);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px;
      }

      .reportInfo-form {
        background-color: white;
        padding: 20px;
        display: grid;
        margin-top: 30px;
        border-radius: 4px;
      }

      @media(min-width: 769px){
        .reportInfo-form {
          max-width: 700px;
          margin: 0 auto;
          margin-top: 100px;
          height: 70vh;
        }
      }

      .label {
        margin-bottom: 18px;
      }

      .container-x {
        display: grid;
        grid-template-columns: 1fr;
        margin-bottom: 10px;
      }

      .menuX {
        grid-column: main-end;
      }

      .input {
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        text-align: center;
        padding: 8px 0;
        border: 2px solid #000000;
        border-radius: 4px;
        margin-bottom: 10px;
      }

      .textarea {
        width: 100%;
        min-height: 127px;
        border: 2px solid #000000;
        border-radius: 4px;
      }

      .reportInfo-button {
        background-color: #FF9DF5;
        width: 100%;
        height: 50px;
        border-radius: 4px;
        border: none;
      }

      .message {
        text-align: center;
        margin-top: 5px;
        padding: 2px;
        border-radius: 4px;
        font-size: 20px;
        color: white;
      }
    `;
    this.shadow.appendChild(divEl);
    this.shadow.appendChild(style);
  }
}
customElements.define("my-pet-card", Card);
