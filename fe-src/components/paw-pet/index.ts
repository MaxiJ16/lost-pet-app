import { Router } from "@vaadin/router";

const pawPet = require("../../assets/patita.png");

export class PawPet extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const size = this.getAttribute("size") || "regular";

    const div = document.createElement("div");
    div.className = "container-img";
    div.innerHTML = `
      <img src=${pawPet} class=${size} >
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .regular {
        width: 40px;
        height: 34px;
      }

      .big {
        width: 100px;
        height: 100px;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(div);

    const pawPetImg = div.querySelector(".regular");
    pawPetImg.addEventListener("click", () => {
      Router.go("/")
    });
  }
}

customElements.define("my-paw", PawPet);
