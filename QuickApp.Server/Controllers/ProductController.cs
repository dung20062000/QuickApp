// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop;
using QuickApp.Server.Authorization;
using QuickApp.Server.Dtos.Request.Shop;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(Microsoft.AspNetCore.Mvc.DefaultApiConventions))]
    [Route("api/products")]
    [Authorize]
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductController(ILogger<ProductController> logger, IMapper mapper,
            IProductService productService)
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
        public async Task<IActionResult> Create([FromBody] ProductCreateRequestDto request)
        {
            try
            {
                var product = new Product
                {
                    Name = request.Name,
                    BuyingPrice = request.BuyingPrice,
                    SellingPrice = request.SellingPrice,
                    UnitsInStock = request.UnitsInStock,
                    IsActive = request.IsActive,
                    IsDiscontinued = request.IsDiscontinued,
                    ProductCategoryId = request.ProductCategoryId,
                    ProductCategory = null!
                };

                var resp = await _productService.CreateProductAsync(product);
                var result = new BaseResponse<ProductVM>
                {
                    Message = resp.Message,
                    Status = resp.Status,
                    Data = resp.Data != null ? _mapper.Map<ProductVM>(resp.Data) : null
                };

                if (resp.Status == ResponseStatus.Success && result.Data != null)
                {
                    return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new BaseResponse<ProductVM>
                {
                    Message = "An error occurred while creating product",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateRequestDto request)
        {
            try
            {
                var productResp = _productService.GetProductById(id);
                if (productResp.Data == null)
                    return NotFound(new BaseResponse<ProductVM>
                    {
                        Message = "Product not found.",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    });

                var product = productResp.Data;

                if (!string.IsNullOrEmpty(request.Name)) product.Name = request.Name;
                if (request.BuyingPrice.HasValue) product.BuyingPrice = request.BuyingPrice.Value;
                if (request.SellingPrice.HasValue) product.SellingPrice = request.SellingPrice.Value;
                if (request.UnitsInStock.HasValue) product.UnitsInStock = request.UnitsInStock.Value;
                if (request.IsActive.HasValue) product.IsActive = request.IsActive.Value;
                if (request.IsDiscontinued.HasValue) product.IsDiscontinued = request.IsDiscontinued.Value;
                if (request.ProductCategoryId.HasValue) product.ProductCategoryId = request.ProductCategoryId.Value;

                var resp = await _productService.UpdateProductAsync(product);
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product");
                return StatusCode(500, new BaseResponse<ProductVM>
                {
                    Message = "An error occurred while updating product",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
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

            var product = productResp.Data;
            var resp = await _productService.DeleteProductAsync(product);
            var result = new BaseResponse<ProductVM>
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
