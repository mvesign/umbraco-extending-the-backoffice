using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace UmbracoExtendingTheBackoffice.Website;

public class AuditDataSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SwaggerDoc(
            AuditDataOperationsFilter.ApiDocumentName,
            new OpenApiInfo
            {
                Title = AuditDataOperationsFilter.ApiTitle,
                Version = AuditDataOperationsFilter.ApiVersion
            });
        options.OperationFilter<AuditDataOperationsFilter>();
    }
}
