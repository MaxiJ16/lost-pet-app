export class Preloader extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const div = document.createElement("div");
    div.className = "container-preloader";
    div.innerHTML = `
    <div class="preloader"></div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    .container-preloader {
      width: 100%;
    }

    .preloader {
      margin: 0 auto;
      width: 40px;
      height: 40px;
      border: 5px solid var(--color-header);
      border-top: 5px solid transparent;
      border-radius: 50%;
      animation-name: girar;
      animation-duration: 1.3s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
    
    @keyframes girar {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }
}

customElements.define("pre-loader", Preloader);
