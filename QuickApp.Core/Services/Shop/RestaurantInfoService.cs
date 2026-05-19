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
    public class RestaurantInfoService : IRestaurantInfoService
    {
        private readonly ApplicationDbContext _dbContext;

        public RestaurantInfoService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // PUBLIC API - Get restaurant info
        public BaseResponse<RestaurantInfo?> GetRestaurantInfo()
        {
            try
            {
                var restaurantInfo = _dbContext.RestaurantInfos
                    .FirstOrDefault(r => r.IsActive);

                if (restaurantInfo == null)
                {
                    return new BaseResponse<RestaurantInfo?>
                    {
                        Message = "Không tìm thấyy thông tin nhà hàng",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    };
                }

                return new BaseResponse<RestaurantInfo?>
                {
                    Message = "Success",
                    Status = ResponseStatus.Success,
                    Data = restaurantInfo
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<RestaurantInfo?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        // PROTECTED API - Update restaurant info
        public async Task<BaseResponse<RestaurantInfo?>> UpdateRestaurantInfoAsync(RestaurantInfo restaurantInfo)
        {
            if (restaurantInfo == null)
            {
                return new BaseResponse<RestaurantInfo?>
                {
                    Message = "Restaurant info cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                _dbContext.RestaurantInfos.Update(restaurantInfo);
                await _dbContext.SaveChangesAsync();
                
                return new BaseResponse<RestaurantInfo?>
                {
                    Message = "C?p nh?t thông tin nhà hàng thành công",
                    Status = ResponseStatus.Success,
                    Data = restaurantInfo
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<RestaurantInfo?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }
    }
}
