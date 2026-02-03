namespace UmbracoExtendingTheBackoffice.Website.Models;

public class UserAuditData(string userId)
{
    private const string DefaultLastEditedContentId = "No Edits";
    private const string DefaultLastEditedDate = "No Edit Date";

    public string UserId { get; set; } = userId;

    public string LastEditedContentId { get; set; } = DefaultLastEditedContentId;

    public string LastEditedDate { get; set; } = DefaultLastEditedDate;
}
