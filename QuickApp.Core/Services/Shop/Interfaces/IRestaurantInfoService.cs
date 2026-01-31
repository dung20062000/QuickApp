// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using QuickApp.Core.Models.Shop;

namespace QuickApp.Core.Services.Shop.Interfaces
{
    public interface IRestaurantInfoService
    {
        // Public API
        BaseResponse<RestaurantInfo?> GetRestaurantInfo();

        // Protected APIs
        Task<BaseResponse<RestaurantInfo?>> UpdateRestaurantInfoAsync(RestaurantInfo restaurantInfo);
    }
}
