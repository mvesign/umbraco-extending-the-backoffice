import { LitElement, html, customElement, state, css, repeat, ifDefined } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbCurrentUserContext, UMB_CURRENT_USER_CONTEXT, type UmbCurrentUserModel } from "@umbraco-cms/backoffice/current-user"
import { type UmbUserDetailModel, UmbUserCollectionRepository } from '@umbraco-cms/backoffice/user';
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN, UmbDocumentDetailRepository } from "@umbraco-cms/backoffice/document";

type UserAuditData = {
  userId: string,
  lastEditedContentId: string,
  lastEditedDate: string,
  contentItemName: string,
  contentItemEditUrl: string,
};

@customElement("dashboard-training")
export class DashboardTraining
  extends UmbElementMixin(LitElement) {

  private _currentUserContext?: UmbCurrentUserContext;
  private userRepository = new UmbUserCollectionRepository(this);
  private documentRepository = new UmbDocumentDetailRepository(this);

  @state()
  private _currentUser?: UmbCurrentUserModel;
  @state()
  private _userData: Array<UmbUserDetailModel> = [];
  @state()
  private _userAuditData: Array<UserAuditData> = [];
  @state()
  private _isReady = false;

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
    if (!this._isReady) {
      return html`
        <uui-loader-bar style="color: blue"></uui-loader-bar>`;
    }

    if (this._isReady) {
      return html`
        <h1><umb-localize key="dashboardLocalization_heading"></umb-localize></h1>
        <h2><umb-localize key="dashboardLocalization_bodytext"></umb-localize></h2>
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

    let tagColor = "default";
    const currentUser  = this._userAuditData.find(u => u.userId == user.unique);
    if (currentUser?.lastEditedDate == "No Edit Date") {
      tagColor = "danger";
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
        <uui-table-cell>${currentUser?.contentItemName}</uui-table-cell>
        <uui-table-cell>
          <a href="${ifDefined(currentUser?.contentItemEditUrl)}">
            <uui-icon style="font-size: 20px; margin-bottom: 2px;" name="dashboard-icon-edit"></uui-icon>
            <small></small>
          </a>
        </uui-table-cell>
    	  <uui-table-cell>
          <uui-tag type="${tagColor}" style="font-size: 12px;">${currentUser?.lastEditedDate}</uui-tag>
        </uui-table-cell>
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
      
      this._getRecentlyEditedContentItems();
  }

  private async _getRecentlyEditedContentItems() {
    const AuthContext: any = await this.getContext(UMB_AUTH_CONTEXT);
    const Token = await AuthContext.getLatestToken();

    const response = await fetch('/api/v1/recently-edited-items', {
        method: 'GET',
        headers: { Authorization: `Bearer ${Token}` }
    });
    const data = await response.json();
    this._userAuditData = data;

    await this._addToUserAuditData();
    this._isReady = true;
  }

  private async _addToUserAuditData() {
    for (let i = 0; i < this._userData.length; i++) {
      const currentUser = this._userAuditData.find(u => u.userId === this._userData[i].unique);
      if (!currentUser) {
        continue;
      }
      
      // Check for "No Edits" cases.
      if (currentUser.lastEditedContentId === "No Edits") {
        currentUser.contentItemName = "NA";
        continue;
      }

      // Only make the request if there's a valid content ID
      const { data } = await this.documentRepository.requestByUnique(currentUser.lastEditedContentId);
      if (data && data.variants?.[0]) {
        const editPath = UMB_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN.generateAbsolute({ unique: currentUser.lastEditedContentId });
        currentUser.contentItemEditUrl = editPath;
        currentUser.contentItemName = data.variants[0].name;
      }
      else {
        currentUser.contentItemEditUrl = "/";
        currentUser.contentItemName = "NA";
      }
    }
  }
}

export {
  DashboardTraining as default
};