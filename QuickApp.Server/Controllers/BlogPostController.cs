using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.Authorization;
using QuickApp.Server.ServerDtos.Request.Shop;
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

        public BlogPostController(
            ILogger<ProductController> logger,
            IMapper mapper,
            IBlogPostService blogPostService)
            : base(logger, mapper)
        {
            _logger = logger;
            _mapper = mapper;
            _blogPostService = blogPostService;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] BlogPostRequestServerDto request)
        {
            var searchRequest = _mapper.Map<BlogPostSearchCoreRequest>(request);
            //searchRequest.PublishedDateTo = null;
            //searchRequest.PublishedDateFrom = null;
            //searchRequest.Slug = null;
            //searchRequest.Title = null;
            //searchRequest.Content = null;
            //searchRequest.IsAvailable = null;
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

        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> CreateBlogPost([FromBody] BlogPostRequestServerDto requestDto)
        {
            if (requestDto == null)
            {
                return BadRequest(new BaseResponse<BlogPostVM>
                {
                    Message = "Du lieu khong hop le",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new BaseResponse<BlogPostVM>
                {
                    Message = "Du lieu khong hop le",
                    Status = ResponseStatus.Fail,
                    Data = null,
                    Errors = errors
                });
            }

            var blogPost = _mapper.Map<AppBlogPost>(requestDto);
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

            return BadRequest(result);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> UpdateBlogPost(int id, [FromBody] BlogPostVM blogPostVm)
        {
            if (blogPostVm == null || blogPostVm.Id != id)
            {
                return BadRequest(new BaseResponse<BlogPostVM>
                {
                    Message = "Du lieu khong hop le",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new BaseResponse<BlogPostVM>
                {
                    Message = "Du lieu khong hop le",
                    Status = ResponseStatus.Fail,
                    Data = null,
                    Errors = errors
                });
            }

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

            var blogPostExists = respCheck.Data;
            _mapper.Map(blogPostVm, blogPostExists);
            var resp = await _blogPostService.UpdateBlogPostAsync(blogPostExists);
            var result = new BaseResponse<BlogPostVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<BlogPostVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> DeleteBlogPost(int id)
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

            var resp = await _blogPostService.DeleteBlogPostAsync(id);
            var result = new BaseResponse<BlogPostVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = null
            };

            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}
