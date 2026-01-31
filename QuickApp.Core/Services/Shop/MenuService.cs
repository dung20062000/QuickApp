// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.EntityFrameworkCore;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;

namespace QuickApp.Core.Services.Shop
{
    public class MenuService : IMenuService
    {
        private readonly ApplicationDbContext _dbContext;

        public MenuService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // PUBLIC API - Get all menu items
        public BaseResponse<List<MenuItem>> GetAllMenuItems()
        {
            try
            {
                var menuItems = _dbContext.MenuItems
                    .Include(m => m.ProductCategory)
                    .Where(m => m.IsActive)
                    .OrderBy(m => m.ProductCategoryId)
                    .ThenBy(m => m.Name)
                    .ToList();

                return new BaseResponse<List<MenuItem>>
                {
                    Message = "Success",
                    Status = ResponseStatus.Success,
                    Data = menuItems
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<List<MenuItem>>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        // PUBLIC API - Get menu items by category
        public BaseResponse<List<MenuItem>> GetMenuItemsByCategory(int categoryId)
        {
            try
            {
                var menuItems = _dbContext.MenuItems
                    .Include(m => m.ProductCategory)
                    .Where(m => m.ProductCategoryId == categoryId && m.IsActive)
                    .OrderBy(m => m.Name)
                    .ToList();

                return new BaseResponse<List<MenuItem>>
                {
                    Message = "Success",
                    Status = ResponseStatus.Success,
                    Data = menuItems
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<List<MenuItem>>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        // PUBLIC API - Get menu item by id
        public BaseResponse<MenuItem?> GetMenuItemById(int id)
        {
            try
            {
                var menuItem = _dbContext.MenuItems
                    .Include(m => m.ProductCategory)
                    .FirstOrDefault(m => m.Id == id && m.IsActive);

                if (menuItem == null)
                {
                    return new BaseResponse<MenuItem?>
                    {
                        Message = "Không tìm th?y món ?n",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    };
                }

                return new BaseResponse<MenuItem?>
                {
                    Message = "Success",
                    Status = ResponseStatus.Success,
                    Data = menuItem
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        // PROTECTED API - Create menu item
        public async Task<BaseResponse<MenuItem?>> CreateMenuItemAsync(MenuItem menuItem)
        {
            if (menuItem == null)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = "Menu item cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                _dbContext.MenuItems.Add(menuItem);
                await _dbContext.SaveChangesAsync();
                
                return new BaseResponse<MenuItem?>
                {
                    Message = "Thêm món ?n thành công",
                    Status = ResponseStatus.Success,
                    Data = menuItem
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        // PROTECTED API - Update menu item
        public async Task<BaseResponse<MenuItem?>> UpdateMenuItemAsync(MenuItem menuItem)
        {
            if (menuItem == null)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = "Menu item cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                _dbContext.MenuItems.Update(menuItem);
                await _dbContext.SaveChangesAsync();
                
                return new BaseResponse<MenuItem?>
                {
                    Message = "C?p nh?t món ?n thành công",
                    Status = ResponseStatus.Success,
                    Data = menuItem
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        // PROTECTED API - Delete menu item (soft delete)
        public async Task<BaseResponse<MenuItem?>> DeleteMenuItemAsync(MenuItem menuItem)
        {
            if (menuItem == null)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = "Menu item cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                menuItem.IsActive = false;
                _dbContext.MenuItems.Update(menuItem);
                await _dbContext.SaveChangesAsync();
                
                return new BaseResponse<MenuItem?>
                {
                    Message = "Xóa món ?n thành công",
                    Status = ResponseStatus.Success,
                    Data = menuItem
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<MenuItem?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }
    }
}
