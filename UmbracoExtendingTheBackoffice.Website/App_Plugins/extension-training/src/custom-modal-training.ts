import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { html, LitElement, customElement, state, property } from "@umbraco-cms/backoffice/external/lit";
import { UMB_ICON_REGISTRY_CONTEXT, UmbIconRegistryContext } from "@umbraco-cms/backoffice/icon";
import type { UmbModalContext, UmbModalExtensionElement } from "@umbraco-cms/backoffice/modal";
import type { CustomModalData, CustomModalValue } from "./custom-modal-token";

@customElement('custom-modal-training')
export class CustomModalTraining
  extends UmbElementMixin(LitElement)
  implements UmbModalExtensionElement<CustomModalData, CustomModalValue> {

  _iconRegistryContext?: UmbIconRegistryContext;
  _modalContext?: UmbModalContext<CustomModalData, CustomModalValue>;

  @property({ attribute: false })
  public set modalContext(value: UmbModalContext<CustomModalData, CustomModalValue> | undefined) {
    this._modalContext = value;
  }

  @state()
  private icons: string[] = [];
  @state()
  private colors: { name: string; code: string }[] = [ 
    { name: 'yellow', code: '#F6DA46' },
    { name: 'black', code: '#060606' },
    { name: 'pink', code: '#F4C3BD' },
    { name: 'blue', code: '#423BAE' },
    { name: 'light-blue', code: '#506FFB' },
    { name: 'red', code: '#D22D56' },
    { name: 'green', code: '#2AC37E' },
    { name: 'brown', code: '#9B825A' },
    { name: 'grey', code: '#9B9B9B' }
  ];
  @state()
  private selectedColor: string = "";
  @state()
  private selectedIcon: string = "";

  constructor() {
    super();
    this.consumeContext(UMB_ICON_REGISTRY_CONTEXT, (instance) => {
      this._iconRegistryContext = instance;
      this._getIconNames();
    });
  }

  render() {
    return html`
      <uui-dialog-layout>
        <div>
          <h2>Select icon and color</h2>
        </div>
        <!-- Dropdown for icon selection -->
        <label for="icon-select">Select an Icon:</label>
        <select id="icon-select" @change=${this._handleIconChange}>
            <option value="">-- Choose an icon --</option>
            ${this.icons.map(icon => html`<option value="${icon}">${icon}</option>`)}
        </select>
        <!-- Dropdown for color selection -->
        <div style="margin-top: 1rem;">
          <label for="color-select">Select a Color:</label>
          <select id="color-select" @change=${this._handleColorChange} style="display: block; margin-top: 0.5rem;">
            <option value="">-- Choose a color --</option>
            ${this.colors.map(color => html`<option value="${color.name}">${color.name}</option>`)}
          </select>
        </div>
        <!-- Display the selected icon in the selected color -->
        <div style="margin-top: 1rem; display: flex; align-items: center;">
          ${this.selectedIcon
            ? html`<uui-icon name="${this.selectedIcon}" style="color: ${this.colors.find(c => c.name === this.selectedColor)?.code}; font-size: 8rem;"></uui-icon>` 
            : html`<span>No icon selected</span>`}
        </div>
        <div slot="actions">
          <uui-button
            look="secondary"
            label="Cancel"
            @click=${this._handleCancel}
            style="margin-right: 0.5rem;">
            Cancel
          </uui-button>
          <uui-button
            look="primary"
            label="Submit"
            @click=${this._handleSubmit}
            ?disabled=${!this.selectedIcon || !this.selectedColor}>
            Submit
          </uui-button>
        </div>
      </uui-dialog-layout>`;
  }

  private async _getIconNames() {
    const iconsObservable = await this._iconRegistryContext?.icons;
    this.observe(iconsObservable, (icons) => {
      if (icons) {
        this.icons = icons.map((icon: { name: any; }) => icon.name);
      }
    });
  }

  private _handleIconChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedIcon = target.value;
  }

  private _handleColorChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedColor = target.value;
  }

  private _handleCancel() {
    this._modalContext?.submit();
  }

  private _handleSubmit() {
    this._modalContext?.updateValue({
      color: this.selectedColor,
      icon: this.selectedIcon
    });
    this._modalContext?.submit();
  }
}

export {
  CustomModalTraining as default
};