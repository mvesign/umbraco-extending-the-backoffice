import { LitElement, html, customElement, state, css, repeat } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbCurrentUserContext, UMB_CURRENT_USER_CONTEXT, type UmbCurrentUserModel } from "@umbraco-cms/backoffice/current-user"
import { type UmbUserDetailModel, UmbUserCollectionRepository } from '@umbraco-cms/backoffice/user';

@customElement("dashboard-training")
export class DashboardTraining extends UmbElementMixin(LitElement) {

  private _currentUserContext?: UmbCurrentUserContext;

  @state()
  private _currentUser?: UmbCurrentUserModel;

  @state()
  private _userData: Array<UmbUserDetailModel> = [];
  userRepository = new UmbUserCollectionRepository(this);

  constructor() {
    super();
    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
      this._currentUserContext = instance;
      this.observe(this._currentUserContext?.currentUser, (currentUser) => {
        this._currentUser = currentUser;
      });
    });
    this._getPagedUserData();
  }

  render() {
    return html`
      <h1>Hello, ${this._currentUser?.name ?? "visitor"}!</h1>
      <div>
        I'm your custom dashboard
      </div>

      <div id="users-wrapper">
        ${repeat(this._userData, (user) => user.unique, (user) => this._renderUser(user))}
    </div>
    `;
  }

  private _renderUser(user: UmbUserDetailModel) {
    return html`<div class="user">
        <div><b>${user.name}</b></div>
        <div>${user.email}</div>
        <div>${user.state}</div>
        <div>Last Login: ${user.lastLoginDate}</div>
        <div>Failed Login Attempts: ${user.failedLoginAttempts}</div>
      </div>`;
  }

  static styles = [
    css`
        :host {
          display: block;
          padding: 24px;
        }

        #users-wrapper {
          border: 1px solid lightgray;
        }
        .user {
          padding: 5px 10px;
        }
        .user:not(:first-child) {
          border-top: 1px solid lightgray;
        }
      `,
  ];

  private async _getPagedUserData() {
    const { data } = await this.userRepository.requestCollection();
    this._userData = data?.items ?? [];
  }
}

export {
  DashboardTraining as default
};