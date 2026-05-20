using QuickApp.Core.Infrastructure;

namespace QuickApp.Server.ServerDtos.Request.Shop
{
    public class BlogPostRequestServerDto : BaseRequest
    {
        public string? Title { get; set; }

        public string? Slug { get; set; }

        public string? Content { get; set; }

        public string? ThumbnailImage { get; set; }

        public DateTime? PublishedDate { get; set; }

        public bool? IsAvailable { get; set; }

        public string? SortField { get; set; }

        public int SortOrder { get; set; } = -1;
    }
}
