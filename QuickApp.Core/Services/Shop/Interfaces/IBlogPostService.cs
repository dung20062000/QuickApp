using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuickApp.Core.Services.Shop.Interfaces
{
#nullable enable
    public interface IBlogPostService
    {
        BaseResponse<AppBlogPost?> GetBlogPostById(int id);
        BaseResponse<List<AppBlogPost>> GetAllBlogPosts(BlogPostSearchCoreRequest request);
        Task<BaseResponse<AppBlogPost?>> CreateBlogPostAsync(AppBlogPost blogPost);
        Task<BaseResponse<AppBlogPost?>> UpdateBlogPostAsync(AppBlogPost blogPost);
        Task<BaseResponse<AppBlogPost>> DeleteBlogPostAsync(int id);
        Task<string> GenerateSlugAsync(string title);
    }
#nullable restore
}
