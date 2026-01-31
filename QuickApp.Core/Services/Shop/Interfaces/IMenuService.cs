// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using QuickApp.Core.Models.Shop;

namespace QuickApp.Core.Services.Shop.Interfaces
{
    public interface IMenuService
    {
        // Public APIs
        BaseResponse<List<MenuItem>> GetAllMenuItems();
        BaseResponse<List<MenuItem>> GetMenuItemsByCategory(int categoryId);
        BaseResponse<MenuItem?> GetMenuItemById(int id);

        // Protected APIs
        Task<BaseResponse<MenuItem?>> CreateMenuItemAsync(MenuItem menuItem);
        Task<BaseResponse<MenuItem?>> UpdateMenuItemAsync(MenuItem menuItem);
        Task<BaseResponse<MenuItem?>> DeleteMenuItemAsync(MenuItem menuItem);
    }
}
