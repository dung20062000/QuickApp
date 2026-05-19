using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using QuickApp.Core.Infrastructure;

namespace QuickApp.Server.ServerDtos.Request.Shop
{
#nullable enable
    public class CreateBlogPostDto
    {
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Slug { get; set; }

        public bool IsAvailable { get; set; } = true;

        public DateTime? PublishedDate { get; set; }

        public IFormFile? Thumbnail { get; set; }
    }

    public class UpdateBlogPostDto
    {
        [MaxLength(500)]
        public string? Title { get; set; }

        public string? Content { get; set; }

        [MaxLength(500)]
        public string? Slug { get; set; }

        public bool? IsAvailable { get; set; }

        public DateTime? PublishedDate { get; set; }

        public IFormFile? Thumbnail { get; set; }

        public bool DeleteThumbnail { get; set; } = false;
    }
#nullable restore
}
