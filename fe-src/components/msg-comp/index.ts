export class Msg extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `
    .message-exito {
      width: 100%;
      margin-top: 20px;
      padding: 2px;
      border-radius: 4px;
      font-size: 20px;
      text-align: center;
      background-color: var(--color-header);
      color: var(--color-white);
    }

    .message-error {
      width: 100%;
      margin-top: 20px;
      padding: 2px;
      border-radius: 4px;
      font-size: 20px;
      text-align: center;
      background-color: var(--color-error);
      color: var(--color-header);
    }
   
    `;
    this.appendChild(style);
  }
}

customElements.define("msg-comp", Msg);
