using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using QuickApp.Server.Authorization;
using QuickApp.Server.ServerDtos.Request.Shop;
using QuickApp.Server.ViewModels.Account;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Route("api/nhacungcap")]
    [Authorize]
    public class NhaCungCapController : BaseApiController
    {
        private readonly ILogger<ProductController> _logger;
        private readonly IMapper _mapper;
        private readonly INhaCungCapService _nhaCungCapService;

        public NhaCungCapController(ILogger<ProductController> logger, IMapper mapper, INhaCungCapService nhaCungCapService)
            : base(logger, mapper)
        {
            _nhaCungCapService = nhaCungCapService;
            _mapper = mapper;
            _logger = logger;
        }
        [HttpGet]
        public IActionResult GetAll([FromQuery] NhaCungCapRequestServerDto request)
        {
            var searchRequest = _mapper.Map<NhaCungCapSearchCoreRequest>(request);
            var resp = _nhaCungCapService.GetAllNhaCungCap(searchRequest);
            var vms = _mapper.Map<List<NhaCungCapVM>>(resp.Data ?? new List<NhaCungCap>());
            var result = new BaseResponse<List<NhaCungCapVM>>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = vms
            };
            return Ok(result);
        }
        [HttpGet("{id:int}")]
        public IActionResult GetNhaCungCapById(int id)
        {
            var resp = _nhaCungCapService.GetNhaCungCapById(id);
            var result = new BaseResponse<NhaCungCapVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<NhaCungCapVM>(resp.Data) : null

            };
            if (resp.Status == ResponseStatus.NotFound)
                return NotFound(result);
            return Ok(result);
        }
        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> CreateNhaCungCap([FromBody] NhaCungCapRequestServerDto nhaCungCapDto)
        {
            if (nhaCungCapDto == null)
            {
                return BadRequest(new BaseResponse<NhaCungCapVM>
                {
                    Message = "Invalid request data",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new BaseResponse<NhaCungCapVM>
                {
                    Message = "Dữ liệu không hợp lệ",
                    Status = ResponseStatus.Fail,
                    Data = null,
                    Errors = errors
                });
            }
            var nhaCungCap = _mapper.Map<NhaCungCap>(nhaCungCapDto);
            var resp = await _nhaCungCapService.CreateNhaCungCap(nhaCungCap);
            var result = new BaseResponse<NhaCungCapVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<NhaCungCapVM>(resp.Data) : null
            };
            if (resp.Status == ResponseStatus.Success && result.Data != null)
            {
                return CreatedAtAction(nameof(GetNhaCungCapById), new { id = result.Data.Id }, result);
            }
            return BadRequest(result);
        }
        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> UpdateNhaCungCap(int id, [FromBody] NhaCungCapVM nhaCungCapVM)
        {
            if (nhaCungCapVM == null || nhaCungCapVM.Id != id)
            {
                return BadRequest(new BaseResponse<NhaCungCapVM>
                {
                    Message = "Invalid request data",
                    Status = ResponseStatus.Fail,
                    Data = null
                });
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new BaseResponse<NhaCungCapVM>
                {
                    Message = "Dữ liệu không hợp lệ",
                    Status = ResponseStatus.Fail,
                    Data = null,
                    Errors = errors
                });
            }
            var resp = _nhaCungCapService.GetNhaCungCapById(id);
            if (resp.Data == null)
            {
                return NotFound(new BaseResponse<NhaCungCapVM>
                {
                    Message = "Không tìn thấy nhà cung cấp",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });
            }
            var nhaCungCapExists = resp.Data;
            _mapper.Map(nhaCungCapVM, nhaCungCapExists);
            var respupdate = await _nhaCungCapService.UpdateNhaCungCap(nhaCungCapExists!);
            var result = new BaseResponse<NhaCungCapVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<NhaCungCapVM>(resp.Data) : null
            };
            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);
        }
        [HttpDelete("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        public async Task<IActionResult> DeleteNhaCungCap(int id)
        {
            var respCheck = _nhaCungCapService.GetNhaCungCapById(id);
            if (respCheck.Data == null)
            {
                return NotFound(new BaseResponse<NhaCungCapVM>
                {
                    Message = "Không tìm thấy nhà cung cấp",
                    Status = ResponseStatus.NotFound,
                    Data = null
                });
            }
            var resp = await _nhaCungCapService.DeleteNhaCungCap(id);
            var result = new BaseResponse<NhaCungCapVM>
            {
                Message = resp.Message,
                Status = resp.Status,
                Data = resp.Data != null ? _mapper.Map<NhaCungCapVM>(resp.Data) : null
            };
            if (resp.Status == ResponseStatus.Success)
                return Ok(result);

            return BadRequest(result);

        }
    }
}
