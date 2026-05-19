using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.Authorization;
using QuickApp.Server.ServerDtos.Request.Shop;
using QuickApp.Server.Services.FileUpload;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(Microsoft.AspNetCore.Mvc.DefaultApiConventions))]
    [Route("api/blogposts")]
    [Authorize]
    public class BlogPostController : BaseApiController
    {
        private readonly ILogger<ProductController> _logger;
        private readonly IMapper _mapper;
        private readonly IBlogPostService _blogPostService;
        private readonly IFileUploadService _fileUploadService;

        public BlogPostController(
            ILogger<ProductController> logger,
            IMapper mapper,
            IBlogPostService blogPostService,
            IFileUploadService fileUploadService)
            : base(logger, mapper)
        {
            _logger = logger;
            _mapper = mapper;
            _blogPostService = blogPostService;
            _fileUploadService = fileUploadService;
        }

        /// <summary>
        /// Get all blog posts with optional filtering
        /// </summary>
        [HttpGet]
        public IActionResult GetAll([FromQuery] BlogPostRequestServerDto request)
        {
            var searchRequest = new BlogPostSearchCoreRequest
            {
                Title = request.Title,
                Slug = request.Slug,
                Content = request.Content,
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };
            var resp = _blogPostService.GetAllBlogPosts(searchRequest);
            var vms = _mapper.Map<List<BlogPostVM>>(resp.Data ?? new List<AppBlogPost>());
            var result = new BaseResponse<List<BlogPostVM>>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = vms,
                TotalRecords = resp.TotalRecords
            };
            return Ok(result);
        }

        /// <summary>
        /// Get blog post by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public IActionResult GetBlogPostById(int id)
        {
            var resp = _blogPostService.GetBlogPostById(id);
            var result = new BaseResponse<BlogPostVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<BlogPostVM>(resp.Data) : null
            };
            if (resp.Status == ResponseStatus.NotFound)
                return NotFound(result);
            return Ok(result);
        }

        /// <summary>
        /// Create blog post with optional thumbnail upload
        /// Supports multipart/form-data for file upload
        /// </summary>
        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
        public async Task<IActionResult> CreateBlogPost([FromForm] CreateBlogPostDto dto)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Content))
                {
                    return BadRequest(new BaseResponse<BlogPostVM>
                    {
                        Message = "Title va Content la bat buoc",
                        Status = ResponseStatus.Fail,
                        Data = null
                    });
                }

                string? thumbnailUrl = null;

                // Upload thumbnail if provided
                if (dto.Thumbnail != null && dto.Thumbnail.Length > 0)
                {
                    var uploadResult = await _fileUploadService.UploadThumbnailAsync(dto.Thumbnail);
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new BaseResponse<BlogPostVM>
                        {
                            Message = "Loi upload thumbnail: " + uploadResult.Message,
                            Status = ResponseStatus.Fail,
                            Data = null
                        });
                    }
                    thumbnailUrl = uploadResult.FirstFileUrl;
                }

                // Generate slug if not provided
                var slug = dto.Slug;
                if (string.IsNullOrWhiteSpace(slug))
                {
                    slug = await _blogPostService.GenerateSlugAsync(dto.Title);
                }

                var blogPost = new AppBlogPost
                {
                    Title = dto.Title,
                    Slug = slug,
                    Content = dto.Content,
                    ThumbnailImage = thumbnailUrl,
                    IsAvailable = dto.IsAvailable,
                    PublishedDate = dto.PublishedDate
                };

                var resp = await _blogPostService.CreateBlogPostAsync(blogPost);
                var result = new BaseResponse<BlogPostVM>
                {
                    Message = resp.Message,
                    Status = resp.Status,
                    Data = resp.Data != null ? _mapper.Map<BlogPostVM>(resp.Data) : null
                };

                if (resp.Status == ResponseStatus.Success && result.Data != null)
                {
                    return CreatedAtAction(nameof(GetBlogPostById), new { id = result.Data.Id }, result);
                }

                // Rollback thumbnail upload if creation fails
                if (!string.IsNullOrEmpty(thumbnailUrl))
                {
                    await _fileUploadService.DeleteFileAsync(thumbnailUrl);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, new BaseResponse<BlogPostVM>
                {
                    Message = "Loi khi tao bai viet",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        /// <summary>
        /// Update blog post with optional thumbnail update
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
        public async Task<IActionResult> UpdateBlogPost(int id, [FromForm] UpdateBlogPostDto dto)
        {
            try
            {
                var respCheck = _blogPostService.GetBlogPostById(id);
                if (respCheck.Data == null)
                {
                    return NotFound(new BaseResponse<BlogPostVM>
                    {
                        Message = "Khong tim thay bai viet",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    });
                }

                var blogPost = respCheck.Data;
                var oldThumbnailUrl = blogPost.ThumbnailImage;
                string? newThumbnailUrl = null;

                // Handle thumbnail update
                if (dto.DeleteThumbnail && dto.Thumbnail == null)
                {
                    // Delete thumbnail
                    newThumbnailUrl = null;
                }
                else if (dto.Thumbnail != null && dto.Thumbnail.Length > 0)
                {
                    // Upload new thumbnail
                    var uploadResult = await _fileUploadService.UploadThumbnailAsync(dto.Thumbnail);
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new BaseResponse<BlogPostVM>
                        {
                            Message = "Loi upload thumbnail: " + uploadResult.Message,
                            Status = ResponseStatus.Fail,
                            Data = null
                        });
                    }
                    newThumbnailUrl = uploadResult.FirstFileUrl;
                }

                // Update fields
                if (!string.IsNullOrWhiteSpace(dto.Title))
                    blogPost.Title = dto.Title;
                if (!string.IsNullOrWhiteSpace(dto.Content))
                    blogPost.Content = dto.Content;
                if (!string.IsNullOrWhiteSpace(dto.Slug))
                    blogPost.Slug = dto.Slug;
                if (dto.IsAvailable.HasValue)
                    blogPost.IsAvailable = dto.IsAvailable.Value;
                if (dto.PublishedDate.HasValue)
                    blogPost.PublishedDate = dto.PublishedDate;
                
                // Update thumbnail
                if (newThumbnailUrl != null || dto.DeleteThumbnail)
                {
                    blogPost.ThumbnailImage = newThumbnailUrl;
                }

                var resp = await _blogPostService.UpdateBlogPostAsync(blogPost);
                var result = new BaseResponse<BlogPostVM>
                {
                    Message = resp.Message,
                    Status = resp.Status,
                    Data = resp.Data != null ? _mapper.Map<BlogPostVM>(resp.Data) : null
                };

                if (resp.Status == ResponseStatus.Success)
                {
                    // Delete old thumbnail if changed
                    if (!string.IsNullOrEmpty(oldThumbnailUrl) && oldThumbnailUrl != newThumbnailUrl)
                    {
                        await _fileUploadService.DeleteFileAsync(oldThumbnailUrl);
                    }
                    return Ok(result);
                }

                // Rollback new thumbnail if update fails
                if (!string.IsNullOrEmpty(newThumbnailUrl) && newThumbnailUrl != oldThumbnailUrl)
                {
                    await _fileUploadService.DeleteFileAsync(newThumbnailUrl);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post {Id}", id);
                return StatusCode(500, new BaseResponse<BlogPostVM>
                {
                    Message = "Loi khi cap nhat bai viet",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        /// <summary>
        /// Delete blog post and its thumbnail
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            try
            {
                var respCheck = _blogPostService.GetBlogPostById(id);
                if (respCheck.Data == null)
                {
                    return NotFound(new BaseResponse<BlogPostVM>
                    {
                        Message = "Khong tim thay bai viet",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    });
                }

                var thumbnailUrl = respCheck.Data.ThumbnailImage;
                var resp = await _blogPostService.DeleteBlogPostAsync(id);
                var result = new BaseResponse<BlogPostVM>
                {
                    Message = resp.Message,
                    Status = resp.Status,
                    Data = null
                };

                if (resp.Status == ResponseStatus.Success)
                {
                    // Delete thumbnail if exists
                    if (!string.IsNullOrEmpty(thumbnailUrl))
                    {
                        await _fileUploadService.DeleteFileAsync(thumbnailUrl);
                    }
                    return Ok(result);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post {Id}", id);
                return StatusCode(500, new BaseResponse<BlogPostVM>
                {
                    Message = "Loi khi xoa bai viet",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }
    }
}
