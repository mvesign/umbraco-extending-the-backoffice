using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Core;
using Umbraco.Cms.Web.Common.Authorization;
using UmbracoExtendingTheBackoffice.Website.Services;

namespace UmbracoExtendingTheBackoffice.Website.Controllers;

[ApiController]
[ApiVersion(AuditDataOperationsFilter.ApiVersion)]
[MapToApi(AuditDataOperationsFilter.ApiDocumentName)]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
[Route("api/v{version:apiVersion}/")]
public class AuditDataController(IAuditDataService auditDataService) : ControllerBase
{
    [HttpGet("recently-edited-items")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecentlyEditedItems()
    {
        var result = await auditDataService.GetRecentlyEditedItems();
        return Ok(result);
    }
}
