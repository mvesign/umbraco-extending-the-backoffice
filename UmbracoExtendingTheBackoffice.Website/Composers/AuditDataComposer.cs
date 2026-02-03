using Umbraco.Cms.Core.Composing;

namespace UmbracoExtendingTheBackoffice.Website.Composers;

public class AuditDataComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder) =>
        builder.Services.ConfigureOptions<AuditDataSwaggerOptions>();
}
