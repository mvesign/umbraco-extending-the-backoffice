using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Services;
using UmbracoExtendingTheBackoffice.Website.Models;

namespace UmbracoExtendingTheBackoffice.Website.Services;

public interface IAuditDataService
{
    Task<List<UserAuditData>> GetRecentlyEditedItems();
}

public class AuditDataService(
    IUserService userService,
    IContentService contentService,
    IAuditService auditService) : IAuditDataService
{
    private const string DocumentEntityType = "Document";
    private const string DateFormat = "yyyy-MM-dd HH:mm:ss";

    public async Task<List<UserAuditData>> GetRecentlyEditedItems()
    {
        var users = userService.GetAll(0, 100, out _);
        if (users == null || !users.Any())
        {
            return [];
        }

        var result = new List<UserAuditData>();

        foreach (var user in users)
        {
            var userAuditData = await GetRecentlyEditedItem(user);
            result.Add(userAuditData);
        }

        return result;
    }

    private async Task<UserAuditData> GetRecentlyEditedItem(IUser user)
    {
        var userAuditData = new UserAuditData(user.Key.ToString());

        var auditItems = await auditService.GetPagedItemsByUserAsync(user.Key, 0, int.MaxValue, Umbraco.Cms.Core.Direction.Descending, [AuditType.Save]);
        if (auditItems?.Items == null || !auditItems.Items.Any())
        {
            return userAuditData;
        }

        var documentItem = auditItems.Items
            .Where(item => item.EntityType == DocumentEntityType)
            .OrderByDescending(item => item.CreateDate)
            .FirstOrDefault();
        if (documentItem == null)
        {
            return userAuditData;
        }

        var lastEditedContent = contentService.GetById(documentItem.Id);
        if (lastEditedContent == null)
        {
            return userAuditData;
        }

        userAuditData.LastEditedContentId = lastEditedContent.Key.ToString();
        userAuditData.LastEditedDate = documentItem.CreateDate.ToString(DateFormat);
        return userAuditData;
    }
}
