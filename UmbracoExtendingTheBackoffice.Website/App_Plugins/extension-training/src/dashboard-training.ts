import { LitElement, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

@customElement("dashboard-training")
export class DashboardTraining extends UmbElementMixin(LitElement) {

  render() {
    return html`
      <h1>Hello, visitor!</h1>
      <div>
        I'm your custom dashboard
      </div>
    `;
  }
}

export {
  DashboardTraining as default
};