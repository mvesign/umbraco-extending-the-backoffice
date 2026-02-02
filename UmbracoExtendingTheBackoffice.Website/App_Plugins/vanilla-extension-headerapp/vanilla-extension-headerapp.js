import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

const template = document.createElement("template");
template.innerHTML = `<uui-icon name="icon-alert-alt" />`;

export default class VanillaElement extends UmbElementMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("vanilla-extension-headerapp", VanillaElement);