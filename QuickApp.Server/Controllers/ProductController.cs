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
using QuickApp.Server.Services.FileUpload;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Route("api/products")]
    [Authorize]
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;
        private readonly IFileUploadService _fileUploadService;
        private readonly IMapper _mapper;

        public ProductController(ILogger<ProductController> logger, IMapper mapper, 
            IProductService productService, IFileUploadService fileUploadService)
            : base(logger, mapper)
        {
            _productService = productService;
            _fileUploadService = fileUploadService;
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
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(30 * 1024 * 1024)] // 30MB
        public async Task<IActionResult> Create(
            [FromForm] ProductCreateRequestDto request,
            [FromForm] IFormFileCollection? files)
        {
            try
            {
                List<string> imageUrls = new();

                // Upload images if provided
                if (files != null && files.Count > 0)
                {
                    var uploadOptions = new FileUploadOptions
                    {
                        MaxFileSize = 5 * 1024 * 1024, // 5MB
                        MaxFilesCount = 5,
                        UploadPath = "uploads/shop/products"
                    };

                    var uploadResult = await _fileUploadService.UploadFilesAsync(files, uploadOptions);
                    
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new BaseResponse<ProductVM>
                        {
                            Message = "Failed to upload images: " + uploadResult.Message,
                            Status = ResponseStatus.Fail,
                            Data = null
                        });
                    }

                    imageUrls = uploadResult.FileUrls;
                }

                // Create product
                var product = new Product
                {
                    Name = request.Name,
                    Description = request.Description,
                    Icon = request.Icon,
                    BuyingPrice = request.BuyingPrice,
                    SellingPrice = request.SellingPrice,
                    UnitsInStock = request.UnitsInStock,
                    IsActive = request.IsActive,
                    IsDiscontinued = request.IsDiscontinued,
                    ProductCategoryId = request.ProductCategoryId,
                    ProductCategory = null!, // Will be set by EF
                    ImageUrls = imageUrls.Count > 0 
                        ? System.Text.Json.JsonSerializer.Serialize(imageUrls) 
                        : null
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

                // Rollback: delete uploaded images if product creation fails
                if (imageUrls.Count > 0)
                {
                    await _fileUploadService.DeleteFilesAsync(imageUrls);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product with images");
                return StatusCode(500, new BaseResponse<ProductVM>
                {
                    Message = "An error occurred while creating product",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        /// <summary>
        /// Update product with images
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(30 * 1024 * 1024)]
        public async Task<IActionResult> Update(
            int id,
            [FromForm] ProductUpdateRequestDto request,
            [FromForm] IFormFileCollection? files)
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
                var oldImageUrls = new List<string>();

                // Parse old images
                if (!string.IsNullOrEmpty(product.ImageUrls))
                {
                    try
                    {
                        oldImageUrls = System.Text.Json.JsonSerializer
                            .Deserialize<List<string>>(product.ImageUrls) ?? new();
                    }
                    catch { }
                }

                // Update product fields if provided
                if (!string.IsNullOrEmpty(request.Name)) product.Name = request.Name;
                if (request.Description != null) product.Description = request.Description;
                if (request.Icon != null) product.Icon = request.Icon;
                if (request.BuyingPrice.HasValue) product.BuyingPrice = request.BuyingPrice.Value;
                if (request.SellingPrice.HasValue) product.SellingPrice = request.SellingPrice.Value;
                if (request.UnitsInStock.HasValue) product.UnitsInStock = request.UnitsInStock.Value;
                if (request.IsActive.HasValue) product.IsActive = request.IsActive.Value;
                if (request.IsDiscontinued.HasValue) product.IsDiscontinued = request.IsDiscontinued.Value;
                if (request.ProductCategoryId.HasValue) product.ProductCategoryId = request.ProductCategoryId.Value;

                // Handle new images
                if (files != null && files.Count > 0)
                {
                    var uploadOptions = new FileUploadOptions
                    {
                        MaxFileSize = 5 * 1024 * 1024,
                        MaxFilesCount = 5,
                        UploadPath = "uploads/shop/products"
                    };

                    var uploadResult = await _fileUploadService.UploadFilesAsync(files, uploadOptions);
                    
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new BaseResponse<ProductVM>
                        {
                            Message = "Failed to upload images: " + uploadResult.Message,
                            Status = ResponseStatus.Fail,
                            Data = null
                        });
                    }

                    // Combine with old images or replace
                    var newImageUrls = request.KeepOldImages 
                        ? oldImageUrls.Concat(uploadResult.FileUrls).ToList()
                        : uploadResult.FileUrls;

                    product.ImageUrls = System.Text.Json.JsonSerializer.Serialize(newImageUrls);

                    // Delete old images if replacing
                    if (!request.KeepOldImages && oldImageUrls.Count > 0)
                    {
                        _ = Task.Run(() => _fileUploadService.DeleteFilesAsync(oldImageUrls));
                    }
                }

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
                _logger.LogError(ex, "Error updating product with images");
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

            // Delete images if exist
            if (!string.IsNullOrEmpty(product.ImageUrls))
            {
                try
                {
                    var imageUrls = System.Text.Json.JsonSerializer
                        .Deserialize<List<string>>(product.ImageUrls);
                    
                    if (imageUrls != null && imageUrls.Count > 0)
                    {
                        await _fileUploadService.DeleteFilesAsync(imageUrls);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete images for product {ProductId}", id);
                    // Continue deleting product even if image deletion fails
                }
            }

            var resp = await _productService.DeleteProductAsync(product);
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