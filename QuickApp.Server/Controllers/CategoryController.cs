using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.ServerDtos.Request.Shop;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Route("api/categories")]
    [Authorize]
    public class CategoryController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly ICategoryService _categoryService;

        public CategoryController(ILogger<BaseApiController> logger, IMapper mapper, ICategoryService categoryService) : base(logger, mapper)
        {
            _mapper = mapper;
            _categoryService = categoryService;
        }
        [HttpGet]
        public IActionResult GetAllCategory([FromQuery] CategoryRequestServerDto requestServer)
        {
            var searchRequest = _mapper.Map<CategorySearchCoreRequest>(requestServer);
            var resp = _categoryService.GetAllCategory(searchRequest);
            var vms = _mapper.Map<List<CategoryVM>>(resp.Data ?? new List<ProductCategory>());
            var result = new BaseResponse<List<CategoryVM>>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = vms
            };
            return Ok(result);

        }
    }
}
