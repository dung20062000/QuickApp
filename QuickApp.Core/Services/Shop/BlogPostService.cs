using Microsoft.EntityFrameworkCore;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace QuickApp.Core.Services.Shop
{
#nullable enable
    public class BlogPostService : IBlogPostService
    {
        private readonly ApplicationDbContext _dbContext;

        public BlogPostService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> GenerateSlugAsync(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return string.Empty;

            var slug = title.ToLowerInvariant().Trim();
            slug = Regex.Replace(slug, @"[àáạảãâầấậẩẫăằắặẳẵ]", "a");
            slug = Regex.Replace(slug, @"[èéẹẻẽêềếệểễ]", "e");
            slug = Regex.Replace(slug, @"[ìíịỉĩ]", "i");
            slug = Regex.Replace(slug, @"[òóọỏõôồốộổỗơờớợởỡ]", "o");
            slug = Regex.Replace(slug, @"[ùúụủũưừứựửữ]", "u");
            slug = Regex.Replace(slug, @"[ỳýỵỷỹ]", "y");
            slug = Regex.Replace(slug, @"đ", "d");
            slug = Regex.Replace(slug, @"[^\w\s-]", "");
            slug = Regex.Replace(slug, @"[\s-]+", "-").Trim('-');

            var existingSlugs = await _dbContext.BlogPosts
                .Where(b => b.Slug.StartsWith(slug))
                .Select(b => b.Slug)
                .ToListAsync();

            if (!existingSlugs.Contains(slug))
                return slug;

            int counter = 1;
            string newSlug;
            do
            {
                newSlug = $"{slug}-{counter}";
                counter++;
            } while (existingSlugs.Contains(newSlug));

            return newSlug;
        }

        public BaseResponse<List<AppBlogPost>> GetAllBlogPosts(BlogPostSearchCoreRequest request)
        {
            try
            {
                var query = _dbContext.BlogPosts.AsQueryable();

                if (!string.IsNullOrWhiteSpace(request.Title))
                {
                    var keyword = request.Title.Trim().ToLower();
                    query = query.Where(b => b.Title.ToLower().Contains(keyword));
                }

                if (!string.IsNullOrWhiteSpace(request.Slug))
                {
                    var keyword = request.Slug.Trim().ToLower();
                    query = query.Where(b => b.Slug.ToLower().Contains(keyword));
                }

                if (!string.IsNullOrWhiteSpace(request.Content))
                {
                    var keyword = request.Content.Trim().ToLower();
                    query = query.Where(b => b.Content.ToLower().Contains(keyword));
                }

                if (request.PublishedDateFrom.HasValue)
                {
                    query = query.Where(b => b.PublishedDate >= request.PublishedDateFrom.Value);
                }

                if (request.PublishedDateTo.HasValue)
                {
                    query = query.Where(b => b.PublishedDate <= request.PublishedDateTo.Value);
                }

                if (request.IsAvailable.HasValue)
                {
                    query = query.Where(b => b.IsAvailable == request.IsAvailable.Value);
                }

                var totalRecords = query.Count();

                var dataFilter = query
                    .OrderByDescending(b => b.PublishedDate)
                    .ThenByDescending(b => b.Id)
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                return new BaseResponse<List<AppBlogPost>>
                {
                    Data = dataFilter,
                    TotalRecords = totalRecords,
                    Message = "Success",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<List<AppBlogPost>>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }

        public BaseResponse<AppBlogPost?> GetBlogPostById(int id)
        {
            try
            {
                var blogPost = _dbContext.BlogPosts.FirstOrDefault(b => b.Id == id);

                if (blogPost == null)
                {
                    return new BaseResponse<AppBlogPost?>
                    {
                        Data = null,
                        Message = "Bài viết không tồn tại",
                        Status = ResponseStatus.NotFound
                    };
                }

                return new BaseResponse<AppBlogPost?>
                {
                    Data = blogPost,
                    Message = "Success",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<AppBlogPost?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }

        public async Task<BaseResponse<AppBlogPost?>> CreateBlogPostAsync(AppBlogPost blogPost)
        {
            if (blogPost == null)
            {
                return new BaseResponse<AppBlogPost?>
                {
                    Data = null,
                    Message = "Bài viết không được trống",
                    Status = ResponseStatus.Fail
                };
            }

            try
            {
                blogPost.Slug = await GenerateSlugAsync(blogPost.Title);
                _dbContext.BlogPosts.Add(blogPost);
                await _dbContext.SaveChangesAsync();

                return new BaseResponse<AppBlogPost?>
                {
                    Data = blogPost,
                    Message = "Thêm bài viết thành công",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<AppBlogPost?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }

        public async Task<BaseResponse<AppBlogPost?>> UpdateBlogPostAsync(AppBlogPost blogPost)
        {
            if (blogPost == null)
            {
                return new BaseResponse<AppBlogPost?>
                {
                    Data = null,
                    Message = "Bài viết không được trống",
                    Status = ResponseStatus.Fail
                };
            }

            try
            {
                _dbContext.BlogPosts.Update(blogPost);
                await _dbContext.SaveChangesAsync();

                return new BaseResponse<AppBlogPost?>
                {
                    Data = blogPost,
                    Message = "Cập nhật bài viết thành công",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<AppBlogPost?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }

        public async Task<BaseResponse<AppBlogPost>> DeleteBlogPostAsync(int id)
        {
            try
            {
                var blogPost = await _dbContext.BlogPosts.FindAsync(id);

                if (blogPost == null)
                {
                    return new BaseResponse<AppBlogPost>
                    {
                        Data = default,
                        Message = "Bài viết không tồn tại",
                        Status = ResponseStatus.NotFound
                    };
                }

                _dbContext.BlogPosts.Remove(blogPost);
                await _dbContext.SaveChangesAsync();

                return new BaseResponse<AppBlogPost>
                {
                    Message = "Xóa bài viết thành công",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<AppBlogPost>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
    }
#nullable restore
}
