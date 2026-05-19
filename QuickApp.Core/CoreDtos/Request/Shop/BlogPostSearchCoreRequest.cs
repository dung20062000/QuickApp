using QuickApp.Core.Infrastructure;

namespace QuickApp.Core.CoreDtos.Request.Shop
{
#nullable enable
    public class BlogPostSearchCoreRequest : BaseRequest
    {
        public string? Title { get; set; }

        public string? Slug { get; set; }

        public string? Content { get; set; }

        public DateTime? PublishedDateFrom { get; set; }

        public DateTime? PublishedDateTo { get; set; }

        public bool? IsAvailable { get; set; }
    }
#nullable restore
}
