// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop;
using QuickApp.Server.Authorization;
using QuickApp.Server.Dtos.Request.Shop;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Route("api/products")]
    [Authorize]
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductController(ILogger<ProductController> logger, IMapper mapper, IProductService productService)
            : base(logger, mapper)
        {
            _productService = productService;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] ProductRequestServerDto request)
        {
            var searchRequest = _mapper.Map<ProductSearchCoreRequest>(request);
            var resp = _productService.GetAllProducts(searchRequest);
            var vms = _mapper.Map<List<ProductVM>>(resp.Data ?? new List<Product>());
            var result = new BaseResponse<List<ProductVM>>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = vms
            };
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var resp = _productService.GetProductById(id);
            var result = new BaseResponse<ProductVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<ProductVM>(resp.Data) : null
            };
            if (resp.Status == ResponseStatus.NotFound)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Create([FromBody] ProductVM productVM)
        {
            if (productVM == null)
                return BadRequest(new BaseResponse<ProductVM>
                {
                    Message = "Product data is required.",
                    Status = ResponseStatus.Fail,
                    Data = null
                });

            var product = _mapper.Map<Product>(productVM);
            var resp = await _productService.CreateProductAsync(product);
            var result = new BaseResponse<ProductVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<ProductVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success && result.Data != null)
                return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);

            return BadRequest(result);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Update(int id, [FromBody] ProductVM productVM)
        {
            if (productVM == null)
                return BadRequest(new BaseResponse<ProductVM>
                {
                    Message = "Product data is required.",
                    Status = ResponseStatus.Fail,
                    Data = null
                });

            var productResp = _productService.GetProductById(id);
            if (productResp.Data == null)
                return NotFound(new BaseResponse<ProductVM>
                {
                    Message = "Product not found.",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });

            var product = productResp.Data;
            _mapper.Map(productVM, product);

            var resp = await _productService.UpdateProductAsync(product!);
            var result = new BaseResponse<ProductVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<ProductVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Delete(int id)
        {
            var productResp = _productService.GetProductById(id);
            if (productResp.Data == null)
                return NotFound(new BaseResponse<ProductVM>
                {
                    Message = "Product not found.",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });

            var resp = await _productService.DeleteProductAsync(productResp.Data!);
            var result = new BaseResponse<ProductVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<ProductVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}