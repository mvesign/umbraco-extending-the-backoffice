using Umbraco.Cms.Api.Management.OpenApi;

namespace UmbracoExtendingTheBackoffice.Website;

public class AuditDataOperationsFilter : BackOfficeSecurityRequirementsOperationFilterBase
{
    public const string ApiDocumentName = "custom-api";
    public const string ApiTitle = "Custom API";
    public const string ApiVersion = "1.0";

    protected override string ApiName => ApiDocumentName;
}
