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
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.Authorization;
using QuickApp.Server.Dtos.Request.Shop;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(Microsoft.AspNetCore.Mvc.DefaultApiConventions))]
    [Route("api/menu")]
    public class MenuController : BaseApiController
    {
        private readonly IMenuService _menuService;
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;

        public MenuController(ILogger<MenuController> logger, IMapper mapper,
            IMenuService menuService, ICategoryService categoryService)
            : base(logger, mapper)
        {
            _menuService = menuService;
            _categoryService = categoryService;
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetMenu()
        {
            var categoriesResp = _categoryService.GetAllCategory(new CategorySearchCoreRequest());
            var categories = categoriesResp.Data != null
                ? _mapper.Map<List<CategoryVM>>(categoriesResp.Data)
                : new List<CategoryVM>();

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

        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Create([FromBody] MenuItemCreateRequestDto request)
        {
            try
            {
                var menuItem = new MenuItem
                {
                    ProductId = request.ProductId,
                    Product = null!,
                    MenuId = request.MenuId,
                    Menu = null!,
                    ProductCategoryId = request.ProductCategoryId,
                    ProductCategory = null!,
                    DisplayName = request.DisplayName ?? string.Empty,
                    DisplayNameVi = request.DisplayNameVi,
                    Description = request.Description,
                    DescriptionVi = request.DescriptionVi,
                    OverridePrice = request.OverridePrice,
                    ImageUrls = request.ImageUrls,
                    IsPopular = request.IsPopular,
                    IsNew = request.IsNew,
                    IsVegetarian = request.IsVegetarian,
                    Ingredients = request.Ingredients,
                    IngredientsVi = request.IngredientsVi,
                    Rating = request.Rating,
                    Reviews = request.Reviews,
                    IsActive = request.IsActive
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

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating menu item");
                return StatusCode(500, new BaseResponse<MenuItemVM>
                {
                    Message = "An error occurred while creating menu item",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Update(int id, [FromBody] MenuItemUpdateRequestDto request)
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

                if (request.DisplayName != null) menuItem.DisplayName = request.DisplayName;
                if (request.DisplayNameVi != null) menuItem.DisplayNameVi = request.DisplayNameVi;
                if (request.Description != null) menuItem.Description = request.Description;
                if (request.DescriptionVi != null) menuItem.DescriptionVi = request.DescriptionVi;
                if (request.ProductCategoryId.HasValue) menuItem.ProductCategoryId = request.ProductCategoryId.Value;
                if (request.OverridePrice.HasValue) menuItem.OverridePrice = request.OverridePrice;
                if (request.ImageUrls != null) menuItem.ImageUrls = request.ImageUrls;
                if (request.IsPopular.HasValue) menuItem.IsPopular = request.IsPopular.Value;
                if (request.IsNew.HasValue) menuItem.IsNew = request.IsNew.Value;
                if (request.IsVegetarian.HasValue) menuItem.IsVegetarian = request.IsVegetarian.Value;
                if (request.Ingredients != null) menuItem.Ingredients = request.Ingredients;
                if (request.IngredientsVi != null) menuItem.IngredientsVi = request.IngredientsVi;
                if (request.Rating.HasValue) menuItem.Rating = request.Rating.Value;
                if (request.Reviews.HasValue) menuItem.Reviews = request.Reviews.Value;
                if (request.IsActive.HasValue) menuItem.IsActive = request.IsActive.Value;

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
                _logger.LogError(ex, "Error updating menu item");
                return StatusCode(500, new BaseResponse<MenuItemVM>
                {
                    Message = "An error occurred while updating menu item",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
        }

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
            var resp = await _menuService.DeleteMenuItemAsync(menuItem);
            var result = new BaseResponse<MenuItemVM>
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
