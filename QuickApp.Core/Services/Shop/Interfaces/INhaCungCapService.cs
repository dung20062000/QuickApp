using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.Services.Shop.Interfaces
{
    public interface INhaCungCapService
    {
        BaseResponse<NhaCungCap?> GetNhaCungCapById(int id);
        BaseResponse<List<NhaCungCap>> GetAllNhaCungCap(NhaCungCapSearchCoreRequest request);
        Task<BaseResponse<NhaCungCap?>> CreateNhaCungCap(NhaCungCap nhaCungCap);
        Task<BaseResponse<NhaCungCap?>> UpdateNhaCungCap(NhaCungCap nhaCungCap);
        Task<BaseResponse<NhaCungCap>> DeleteNhaCungCap(int id);
    }
}
