import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export type CustomModalData = {
}

export type CustomModalValue = {
  icon: string;
  color: string;
}

export const CUSTOM_MODAL_TOKEN = new UmbModalToken<CustomModalData, CustomModalValue>('customModalTraining', {
  modal: {
    type: 'sidebar',
    size: 'small'
  }
});