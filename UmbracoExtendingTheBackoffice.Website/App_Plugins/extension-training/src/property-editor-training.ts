import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { type UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";
import { LitElement, html, customElement, property, state, ifDefined } from "@umbraco-cms/backoffice/external/lit";

@customElement("property-editor-training")
export class PropertyEditorTraining extends LitElement {
    @state()
    private _renderedValue = "";
    @state()
    private _umbazeIndex = [ "H5YR!", "Umbazing!", "Unicorns!" ]
    @state()
    private _disabled?: boolean;
    @state()
    private _placeholder?: string;

    @property({ type: String})
    public value = "";
    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection) {
      this._disabled = config.getValueByAlias("disabled");
      this._placeholder = config.getValueByAlias("placeholder");
    }

    render() {
        return html`
        <input
          .value=${this.value || ""}
          @input="${this.#updateValue}"
          placeholder=${ifDefined(this._placeholder)}
          style="width: 400px;">
        <button
          ?disabled=${this._disabled}
          @click=${this.#onClick}>Umbaze</button>
        <hr>
        ${this._renderedValue}`;
    }

    #updateValue(event: Event) {
        this._renderedValue = (event.target as HTMLInputElement).value;
        this.value = this._renderedValue;
        this.#dispatchChangeEvent();
    }

     #onClick() {
        const randomIndex = (this._umbazeIndex.length * Math.random()) | 0;
        this.value = (this.value ?? "") + " " + this._umbazeIndex[randomIndex];
        this._renderedValue = this.value;
        this.#dispatchChangeEvent();
    }

    #dispatchChangeEvent() {
        this.dispatchEvent(new UmbChangeEvent());
    }
}

export {
  PropertyEditorTraining as default
};