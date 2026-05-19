namespace QuickApp.Core.Models.Shop
{
#nullable enable
    public class AppBlogPost : BaseEntity
    {
        public string Title { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string? ThumbnailImage { get; set; }

        public DateTime? PublishedDate { get; set; }

        public bool IsAvailable { get; set; }
    }
#nullable restore
}
