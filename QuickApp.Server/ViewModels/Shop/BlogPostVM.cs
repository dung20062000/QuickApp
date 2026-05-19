namespace QuickApp.Server.ViewModels.Shop
{
#nullable enable
    public class BlogPostVM
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string? ThumbnailImage { get; set; }

        public DateTime? PublishedDate { get; set; }

        public bool IsAvailable { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
#nullable restore
}
