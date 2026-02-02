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
      <uui-box headline="Welcome, ${this._currentUser?.name ?? 'Unknown'}!">
        <uui-table id="users-wrapper">
          <uui-table-row>
            <uui-table-head-cell></uui-table-head-cell>
            <uui-table-head-cell>Name</uui-table-head-cell>
            <uui-table-head-cell>Email</uui-table-head-cell>
            <uui-table-head-cell>Status</uui-table-head-cell>
            <uui-table-head-cell>Last Login</uui-table-head-cell>
            <uui-table-head-cell>Failed Login Attempts</uui-table-head-cell>
          </uui-table-row>
          ${repeat(this._userData, (user) => user.unique, (user) => this._renderUser(user))}
        </uui-table>
      </uui-box>`;
  }

  private _renderUser(user: UmbUserDetailModel) {
    if (!user) {
      return;
    }

    let shortLoginDate = "";
    if(user.lastLoginDate != null) {
      shortLoginDate = user.lastLoginDate.slice(0,19).replace("T", " ");
    }

    if(user.lastLoginDate == null) {
      shortLoginDate = "000-00-00 00:00:00";
    }

    return html`
      <uui-table-row class="user">
        <uui-table-cell>
          <uui-icon style="font-size: 30px; margin-bottom: 9px;" name="dashboard-icon-user"></uui-icon>
          <small></small>
        </uui-table-cell>
        <uui-table-cell>
          <b>${user.name}</b>
        </uui-table-cell>
        <uui-table-cell>${user.email}</uui-table-cell>
        <uui-table-cell>${user.state}</uui-table-cell>
        <uui-table-cell>${shortLoginDate}</uui-table-cell>
        <uui-table-cell>${user.failedLoginAttempts}</uui-table-cell>
      </uui-table-row>`;
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

    // Sort the array based on the last login date.
    this._userData
      .sort(function(a, b) { 
        if (a.lastLoginDate != null && b.lastLoginDate != null) { 
          return a.lastLoginDate.localeCompare(b.lastLoginDate)
        } else {
          return null as any;
        }})
      .reverse();

    // Sort the array based on the state so 'Active' will be at the top.
    this._userData
      .sort(function(a, b) {
        if (a.state != null && b.state != null) { 
          return a.state.localeCompare(b.state)
        } else {
          return null as any;
        }})
  }
}

export {
  DashboardTraining as default
};