// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.Authorization;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(Microsoft.AspNetCore.Mvc.DefaultApiConventions))]
    [Route("api/restaurant-info")]
    public class RestaurantInfoController : BaseApiController
    {
        private readonly IRestaurantInfoService _restaurantInfoService;
        private readonly IMapper _mapper;

        public RestaurantInfoController(ILogger<RestaurantInfoController> logger, IMapper mapper, 
            IRestaurantInfoService restaurantInfoService)
            : base(logger, mapper)
        {
            _restaurantInfoService = restaurantInfoService;
            _mapper = mapper;
        }

        /// <summary>
        /// PUBLIC API - Get restaurant information
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetRestaurantInfo()
        {
            var resp = _restaurantInfoService.GetRestaurantInfo();
            var result = new BaseResponse<RestaurantInfoVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<RestaurantInfoVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.NotFound)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// PROTECTED API - Update restaurant information (requires authentication + permission)
        /// </summary>
        [HttpPut]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> UpdateRestaurantInfo([FromBody] RestaurantInfoVM restaurantInfoVM)
        {
            if (restaurantInfoVM == null)
                return BadRequest(new BaseResponse<RestaurantInfoVM>
                {
                    Message = "Restaurant info data is required.",
                    Status = ResponseStatus.Fail,
                    Data = null
                });

            // Get existing info
            var existingResp = _restaurantInfoService.GetRestaurantInfo();
            if (existingResp.Data == null)
                return NotFound(new BaseResponse<RestaurantInfoVM>
                {
                    Message = "Restaurant info not found.",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });

            var restaurantInfo = existingResp.Data;
            _mapper.Map(restaurantInfoVM, restaurantInfo);

            var resp = await _restaurantInfoService.UpdateRestaurantInfoAsync(restaurantInfo!);
            var result = new BaseResponse<RestaurantInfoVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<RestaurantInfoVM>(resp.Data) : null
            };

            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}
