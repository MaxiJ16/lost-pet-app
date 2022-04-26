export class Text extends HTMLElement {
  shadow: ShadowRoot;
  tags: string[] = ["h1", "h3", "h4", "p", "h5"];
  tag: string = "p";

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    if (this.tags.includes(this.getAttribute("tag"))) {
      this.tag = this.getAttribute("tag") || this.tag;
    }
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const rootEl = document.createElement(this.tag);
    rootEl.textContent = this.textContent;

    const style = document.createElement("style");

    style.innerHTML = `
      h1 {
        font-size: 40px;
        font-weight: 700;
        margin: 0;
        line-height: 60px;
      }

      h2 {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
      }

      h3 {
        font-size: 24px;
        font-weight: 400;
        margin: 0;
      }

      h5 {
        font-size: 16px;
        font-weight: 700;
        margin: 0;
      }

      p {
        font-size: 16px;
        margin: 0;
      }

    `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(rootEl);
  }
}
customElements.define("my-text", Text);
