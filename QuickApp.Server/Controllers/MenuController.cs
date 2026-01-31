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
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
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
        public async Task<IActionResult> Create([FromBody] MenuItemVM menuItemVM)
        {
            if (menuItemVM == null)
                return BadRequest(new BaseResponse<MenuItemVM>
                {
                    Message = "Menu item data is required.",
                    Status = ResponseStatus.Fail,
                    Data = null
                });

            var menuItem = _mapper.Map<MenuItem>(menuItemVM);
            var resp = await _menuService.CreateMenuItemAsync(menuItem);
            
            var result = new BaseResponse<MenuItemVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<MenuItemVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success && result.Data != null)
                return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);

            return BadRequest(result);
        }

        /// <summary>
        /// PROTECTED API - Update menu item (requires authentication + permission)
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> Update(int id, [FromBody] MenuItemVM menuItemVM)
        {
            if (menuItemVM == null)
                return BadRequest(new BaseResponse<MenuItemVM>
                {
                    Message = "Menu item data is required.",
                    Status = ResponseStatus.Fail,
                    Data = null
                });

            var menuItemResp = _menuService.GetMenuItemById(id);
            if (menuItemResp.Data == null)
                return NotFound(new BaseResponse<MenuItemVM>
                {
                    Message = "Menu item not found.",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });

            var menuItem = menuItemResp.Data;
            _mapper.Map(menuItemVM, menuItem);

            var resp = await _menuService.UpdateMenuItemAsync(menuItem!);
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

            var resp = await _menuService.DeleteMenuItemAsync(menuItemResp.Data!);
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
