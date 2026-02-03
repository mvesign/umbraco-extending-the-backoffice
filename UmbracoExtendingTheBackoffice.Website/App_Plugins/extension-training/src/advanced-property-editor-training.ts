import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_ICON_PICKER_MODAL } from '@umbraco-cms/backoffice/icon';
import { UMB_MODAL_MANAGER_CONTEXT, UMB_CONFIRM_MODAL, UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
import { LitElement, html, customElement, state, property } from "@umbraco-cms/backoffice/external/lit";
import { extractUmbColorVariable } from "@umbraco-cms/backoffice/resources";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { CUSTOM_MODAL_TOKEN } from "./custom-modal-token";

type SelectedIconValue = {
  icon?: string;
  color?: string;
};

@customElement("advanced-property-editor-training")
export class AdvancedPropertyEditorTraining
  extends UmbElementMixin(LitElement) {

  private _modalManagerContext?: UmbModalManagerContext;

  @state()
  private color = "";
  @state()
  private icon = "";

  @property({ type: Object })
  public set value(value: SelectedIconValue | undefined) {
    if (!value) {
      return;
    }

    this.icon = value.icon ?? "";
    this.color = value.color ?? "";
  }

  public get value(): SelectedIconValue {
    return {
      icon: this.icon,
      color: this.color,
    };
  }

  constructor() {
    super();
    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
      this._modalManagerContext = _instance;
    });
  }

  render() {
    return html`
      <uui-table id="users-wrapper">
        <uui-table-head>
          <uui-table-head-cell>
            <!-- Umbraco Icon Picker Modal -->
            <uui-button look="primary"
              color="default"
              label="Pick an icon"
              @click=${this._openIconPicker}></uui-button>
            <!-- Custom Icon Picker Modal -->
            <uui-button look="primary"
              color="default"
              label="Icon Picker Dropdown"
              @click=${this._openCustomModal}></uui-button>
          </uui-table-head-cell>
        </uui-table-head>
        <uui-table-row>
          <uui-table-cell>
            <uui-icon name="${this.icon}" style="color:var(${extractUmbColorVariable(this.color)})"></uui-icon>
            <pre>${this.icon} ${this.color}</pre>
          </uui-table-cell>
        </uui-table-row>
        <uui-table-row>
          <!-- Custom Dialog Modal -->
          <uui-table-cell>
            <uui-button look="primary"
              color="default"
              label="Open dialog"
              @click=${this.#startDialogOnRequest}></uui-button>
          </uui-table-cell>
        </uui-table-row>
      </uui-table>`;
  }

  private async _openIconPicker() {
    const pickerContext = this._modalManagerContext?.open(
      this,
      UMB_ICON_PICKER_MODAL,
      {value: { color: undefined, icon: undefined }});
    const data = await pickerContext?.onSubmit();
    if (!data) {
        return;
    }

    if (data.color) {
      this.color = data.color as string;
    }

    if (data.icon) {
      this.icon = data.icon as string;
    }

    this.#dispatchChangeEvent();
  }

  private async _openCustomModal() {
    const pickerContext = this._modalManagerContext?.open(
      this,
      CUSTOM_MODAL_TOKEN);
    const data = await pickerContext?.onSubmit();
    if (!data) {
      return;
    }

    if (data.color) {
      this.color = data.color as string;
    }
    
    if (data.icon) {
      this.icon = data.icon as string;
    }
    this.#dispatchChangeEvent();
  }

  #dispatchChangeEvent() {
    const icon = this.icon;
    const color = this.color;
    this.value = { icon, color };
    this.dispatchEvent(new UmbChangeEvent());
  }

  #startDialogOnRequest() {
    const modalContext = this._modalManagerContext?.open(
        this,
        UMB_CONFIRM_MODAL,
        { data: {
          headline: "Hello, awesome person!",
          content: "Do you like pinacoladas? And getting caught in the rain?",
          color: "positive",
          confirmLabel: "Yes",
          cancelLabel: "No" } }
    );
    modalContext?.onSubmit()
      .then(() => {
        console.log("Custom dialog was confirmed");
      })
      .catch(() => {
        console.log("Custom dialog was cancelled");
      });
  }
}

export{
  AdvancedPropertyEditorTraining as default
};