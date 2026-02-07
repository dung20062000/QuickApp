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
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.Authorization;
using QuickApp.Server.Dtos.Request.Shop;
using QuickApp.Server.Services.FileUpload;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Route("api/menu")]
    public class MenuController : BaseApiController
    {
        private readonly IMenuService _menuService;
        private readonly ICategoryService _categoryService;
        private readonly IFileUploadService _fileUploadService;
        private readonly IMapper _mapper;

        public MenuController(ILogger<MenuController> logger, IMapper mapper, 
            IMenuService menuService, ICategoryService categoryService,
            IFileUploadService fileUploadService)
            : base(logger, mapper)
        {
            _menuService = menuService;
            _categoryService = categoryService;
            _fileUploadService = fileUploadService;
            _mapper = mapper;
        }

        /// <summary>
        /// PUBLIC API - Get complete menu (categories + items)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetMenu()
        {
            // Get categories - s? d?ng empty request ?? l?y t?t c?
            var categoriesResp = _categoryService.GetAllCategory(new CategorySearchCoreRequest());
            var categories = categoriesResp.Data != null 
                ? _mapper.Map<List<CategoryVM>>(categoriesResp.Data) 
                : new List<CategoryVM>();

            // Get menu items
            var itemsResp = _menuService.GetAllMenuItems();
            var items = itemsResp.Data != null 
                ? _mapper.Map<List<MenuItemVM>>(itemsResp.Data) 
                : new List<MenuItemVM>();

            var result = new BaseResponse<MenuResponseVM>
            {
                Message = "Success",
                Status = ResponseStatus.Success,
                Data = new MenuResponseVM
                {
                    Categories = categories,
                    Items = items
                }
            };

            return Ok(result);
        }

        /// <summary>
        /// PUBLIC API - Get menu items by category
        /// </summary>
        [HttpGet("category/{categoryId:int}")]
        [AllowAnonymous]
        public IActionResult GetItemsByCategory(int categoryId)
        {
            var resp = _menuService.GetMenuItemsByCategory(categoryId);
            var items = resp.Data != null 
                ? _mapper.Map<List<MenuItemVM>>(resp.Data) 
                : new List<MenuItemVM>();

            var result = new BaseResponse<List<MenuItemVM>>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = items
            };

            return Ok(result);
        }

        /// <summary>
        /// PUBLIC API - Get menu item by id
        /// </summary>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var resp = _menuService.GetMenuItemById(id);
            var result = new BaseResponse<MenuItemVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<MenuItemVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.NotFound)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// PROTECTED API - Create menu item (requires authentication + permission)
        /// </summary>
        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
        public async Task<IActionResult> Create(
            [FromForm] string name,
            [FromForm] string? nameVi,
            [FromForm] string? description,
            [FromForm] string? descriptionVi,
            [FromForm] int productCategoryId,
            [FromForm] decimal price,
            [FromForm] bool isPopular,
            [FromForm] bool isNew,
            [FromForm] bool isVegetarian,
            [FromForm] string? ingredients,
            [FromForm] string? ingredientsVi,
            [FromForm] decimal rating,
            [FromForm] int reviews,
            [FromForm] bool isActive,
            IFormFile? file)
        {
            try
            {
                string? imageUrl = null;

                // Upload image if provided
                if (file != null)
                {
                    var uploadOptions = new FileUploadOptions
                    {
                        MaxFileSize = 5 * 1024 * 1024, // 5MB
                        MaxFilesCount = 1,
                        UploadPath = "uploads/shop/menu"
                    };

                    var uploadResult = await _fileUploadService.UploadFileAsync(file, uploadOptions);
                    
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new BaseResponse<MenuItemVM>
                        {
                            Message = "Failed to upload image: " + uploadResult.Message,
                            Status = ResponseStatus.Fail,
                            Data = null
                        });
                    }

                    imageUrl = uploadResult.FileUrls.FirstOrDefault();
                }

                // Create menu item
                var menuItem = new MenuItem
                {
                    Name = name,
                    NameVi = nameVi,
                    Description = description,
                    DescriptionVi = descriptionVi,
                    ProductCategoryId = productCategoryId,
                    ProductCategory = null!, // Will be set by EF
                    Price = price,
                    ImageUrl = imageUrl,
                    IsPopular = isPopular,
                    IsNew = isNew,
                    IsVegetarian = isVegetarian,
                    Ingredients = ingredients,
                    IngredientsVi = ingredientsVi,
                    Rating = rating,
                    Reviews = reviews,
                    IsActive = isActive
                };

                var resp = await _menuService.CreateMenuItemAsync(menuItem);
                
                var result = new BaseResponse<MenuItemVM>
                {
                    Message = resp.Message,
                    Status = resp.Status,
                    Data = resp.Data != null ? _mapper.Map<MenuItemVM>(resp.Data) : null
                };

                if (resp.Status == ResponseStatus.Success && result.Data != null)
                {
                    return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
                }

                // Rollback: delete uploaded image if creation fails
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    await _fileUploadService.DeleteFileAsync(imageUrl);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating menu item with image");
                return StatusCode(500, new BaseResponse<MenuItemVM>
                {
                    Message = "An error occurred while creating menu item",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        /// <summary>
        /// PROTECTED API - Update menu item (requires authentication + permission)
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
        public async Task<IActionResult> Update(
            int id,
            [FromForm] string? name,
            [FromForm] string? nameVi,
            [FromForm] string? description,
            [FromForm] string? descriptionVi,
            [FromForm] int? productCategoryId,
            [FromForm] decimal? price,
            [FromForm] bool? isPopular,
            [FromForm] bool? isNew,
            [FromForm] bool? isVegetarian,
            [FromForm] string? ingredients,
            [FromForm] string? ingredientsVi,
            [FromForm] decimal? rating,
            [FromForm] int? reviews,
            [FromForm] bool? isActive,
            IFormFile? file)
        {
            try
            {
                var menuItemResp = _menuService.GetMenuItemById(id);
                if (menuItemResp.Data == null)
                    return NotFound(new BaseResponse<MenuItemVM>
                    {
                        Message = "Menu item not found.",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    });

                var menuItem = menuItemResp.Data;
                var oldImageUrl = menuItem.ImageUrl;

                // Update fields if provided
                if (!string.IsNullOrEmpty(name)) menuItem.Name = name;
                if (nameVi != null) menuItem.NameVi = nameVi;
                if (description != null) menuItem.Description = description;
                if (descriptionVi != null) menuItem.DescriptionVi = descriptionVi;
                if (productCategoryId.HasValue) menuItem.ProductCategoryId = productCategoryId.Value;
                if (price.HasValue) menuItem.Price = price.Value;
                if (isPopular.HasValue) menuItem.IsPopular = isPopular.Value;
                if (isNew.HasValue) menuItem.IsNew = isNew.Value;
                if (isVegetarian.HasValue) menuItem.IsVegetarian = isVegetarian.Value;
                if (ingredients != null) menuItem.Ingredients = ingredients;
                if (ingredientsVi != null) menuItem.IngredientsVi = ingredientsVi;
                if (rating.HasValue) menuItem.Rating = rating.Value;
                if (reviews.HasValue) menuItem.Reviews = reviews.Value;
                if (isActive.HasValue) menuItem.IsActive = isActive.Value;

                // Handle new image
                if (file != null)
                {
                    var uploadOptions = new FileUploadOptions
                    {
                        MaxFileSize = 5 * 1024 * 1024,
                        MaxFilesCount = 1,
                        UploadPath = "uploads/shop/menu"
                    };

                    var uploadResult = await _fileUploadService.UploadFileAsync(file, uploadOptions);
                    
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new BaseResponse<MenuItemVM>
                        {
                            Message = "Failed to upload image: " + uploadResult.Message,
                            Status = ResponseStatus.Fail,
                            Data = null
                        });
                    }

                    menuItem.ImageUrl = uploadResult.FileUrls.FirstOrDefault();

                    // Delete old image
                    if (!string.IsNullOrEmpty(oldImageUrl))
                    {
                        _ = Task.Run(() => _fileUploadService.DeleteFileAsync(oldImageUrl));
                    }
                }

                var resp = await _menuService.UpdateMenuItemAsync(menuItem);
                var result = new BaseResponse<MenuItemVM>
                {
                    Message = resp.Message,
                    Status = resp.Status,
                    Data = resp.Data != null ? _mapper.Map<MenuItemVM>(resp.Data) : null
                };

                if (resp.Status == ResponseStatus.Success)
                    return Ok(result);

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating menu item with image");
                return StatusCode(500, new BaseResponse<MenuItemVM>
                {
                    Message = "An error occurred while updating menu item",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        /// <summary>
        /// PROTECTED API - Delete menu item (requires authentication + permission)
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Delete(int id)
        {
            var menuItemResp = _menuService.GetMenuItemById(id);
            if (menuItemResp.Data == null)
                return NotFound(new BaseResponse<MenuItemVM>
                {
                    Message = "Menu item not found.",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });

            var menuItem = menuItemResp.Data;

            // Delete image if exists
            if (!string.IsNullOrEmpty(menuItem.ImageUrl))
            {
                try
                {
                    await _fileUploadService.DeleteFileAsync(menuItem.ImageUrl);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete image for menu item {MenuItemId}", id);
                    // Continue deleting menu item even if image deletion fails
                }
            }

            var resp = await _menuService.DeleteMenuItemAsync(menuItem);
            var result = new BaseResponse<MenuItemVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<MenuItemVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}
