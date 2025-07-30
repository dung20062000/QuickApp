using Microsoft.EntityFrameworkCore;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.Services.Shop
{
    public class NhaCungCapService : INhaCungCapService
    {
        private readonly ApplicationDbContext _dbContext;

        public NhaCungCapService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<string> GenerateMaNhaCungCapAsync()
        {
            int count = await _dbContext.NhaCungCaps.CountAsync();
            return $"NCC{(count + 1):D4}"; // ví dụ NCC0001, NCC0002
        }
        public BaseResponse<List<NhaCungCap>> GetAllNhaCungCap(NhaCungCapSearchCoreRequest request)
        {
            try
            {
                //var data = _dbContext.NhaCungCaps.AsQueryable();
                //if (!string.IsNullOrWhiteSpace(request.TenNhaCungCap))
                //{
                //    var keyword = request.TenNhaCungCap.Trim().ToLower();
                //    data = data.Where(c => c.TenNhaCungCap.ToLower().Contains(keyword));
                //}
                //if (!string.IsNullOrWhiteSpace(request.MaNhaCungCap))
                //{
                //    var keyword = request.MaNhaCungCap.Trim().ToLower();
                //    data = data.Where(c => c.MaNhaCungCap.ToLower().Contains(keyword));
                //}
                //if (!string.IsNullOrWhiteSpace(request.DiaChi))
                //{
                //    var keyword = request.DiaChi.Trim().ToLower();
                //    data = data.Where(c => c.DiaChi.ToLower().Contains(keyword));
                //}
                //if (!string.IsNullOrWhiteSpace(request.SoDienThoai))
                //{
                //    var keyword = request.SoDienThoai.Trim().ToLower();
                //    data = data.Where(c => c.SoDienThoai.ToLower().Contains(keyword));
                //}
                //if (!string.IsNullOrWhiteSpace(request.Email))
                //{
                //    var keyword = request.Email.Trim().ToLower();
                //    data = data.Where(c => c.Email.ToLower().Contains(keyword));
                //}
                //if (!string.IsNullOrWhiteSpace(request.TenNguoiLienHe))
                //{
                //    var keyword = request.TenNguoiLienHe.Trim().ToLower();
                //    data = data.Where(c => c.TenNguoiLienHe.ToLower().Contains(keyword));
                //}
                //if (request.TrangThai.HasValue)
                //{
                //    data = data.Where(c => c.TrangThai == request.TrangThai.Value);
                //}
                var query = _dbContext.NhaCungCaps.Where(c =>
                    (string.IsNullOrWhiteSpace(request.TenNhaCungCap) || c.TenNhaCungCap.ToLower().Contains(request.TenNhaCungCap.ToLower().Trim())) &&
                    (string.IsNullOrWhiteSpace(request.MaNhaCungCap) || c.MaNhaCungCap.ToLower().Contains(request.MaNhaCungCap.ToLower().Trim())) &&
                    (string.IsNullOrWhiteSpace(request.DiaChi) || c.DiaChi.ToLower().Contains(request.DiaChi.ToLower().Trim())) &&
                    (string.IsNullOrWhiteSpace(request.SoDienThoai) || c.SoDienThoai.ToLower().Contains(request.SoDienThoai.ToLower().Trim())) &&
                    (string.IsNullOrWhiteSpace(request.Email) || c.Email.ToLower().Contains(request.Email.ToLower().Trim())) &&
                    (string.IsNullOrWhiteSpace(request.TenNguoiLienHe) || c.TenNguoiLienHe.ToLower().Contains(request.TenNguoiLienHe.ToLower().Trim())) &&
                    (!request.TrangThai.HasValue || c.TrangThai == request.TrangThai.Value)
                );
                var totalRecords = query.Count();
                var dataFilter = query.OrderBy(c => c.TenNhaCungCap)
                           .Skip((request.PageIndex - 1) * request.PageSize)
                           .Take(request.PageSize).ToList();

                return new BaseResponse<List<NhaCungCap>>()
                {
                    Data = dataFilter,
                    TotalRecords = totalRecords,
                    Message = "Success",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<List<NhaCungCap>>()
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
        public BaseResponse<NhaCungCap?> GetNhaCungCapById(int id)
        {
            try
            {
                var nhaCungCap = _dbContext.NhaCungCaps.FirstOrDefault(c => c.Id == id);
                if (nhaCungCap == null)
                {
                    return new BaseResponse<NhaCungCap?>()
                    {
                        Data = null,
                        Message = "Nhà cung cấp không tồn tại",
                        Status = ResponseStatus.Fail
                    };
                }
                return new BaseResponse<NhaCungCap?>()
                {
                    Data = nhaCungCap,
                    Message = "Success",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<NhaCungCap?>()
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
        public async Task<BaseResponse<NhaCungCap?>> CreateNhaCungCap(NhaCungCap nhaCungCap)
        {
            if (nhaCungCap == null)
            {
                return new BaseResponse<NhaCungCap>()
                {
                    Data = null,
                    Message = "Nhà cung cấp không được trống",
                    Status = ResponseStatus.Fail
                };
            }
            try
            {
                nhaCungCap.MaNhaCungCap = await GenerateMaNhaCungCapAsync();
                _dbContext.NhaCungCaps.Add(nhaCungCap);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<NhaCungCap>()
                {
                    Data = nhaCungCap,
                    Message = "Thêm nhà cung cấp thành công",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<NhaCungCap>()
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
        public async Task<BaseResponse<NhaCungCap?>> UpdateNhaCungCap(NhaCungCap nhaCungCap)
        {
            if (nhaCungCap == null)
            {
                return new BaseResponse<NhaCungCap>()
                {
                    Data = null,
                    Message = "Nhà cung cấp không được trống",
                    Status = ResponseStatus.Fail
                };
            }
            try
            {
                //var existingNhaCungCap = await _dbContext.NhaCungCaps.FindAsync(nhaCungCap.Id);
                //if (existingNhaCungCap == null)
                //{
                //    return new BaseResponse<NhaCungCap>()
                //    {
                //        Data = null,
                //        Message = "Nhà cung cấp không tồn tại",
                //        Status = ResponseStatus.NotFound
                //    };
                //}
                //existingNhaCungCap.TenNhaCungCap = nhaCungCap.TenNhaCungCap;
                //existingNhaCungCap.DiaChi = nhaCungCap.DiaChi;
                //existingNhaCungCap.SoDienThoai = nhaCungCap.SoDienThoai;
                //existingNhaCungCap.Email = nhaCungCap.Email;
                //existingNhaCungCap.TenNguoiLienHe = nhaCungCap.TenNguoiLienHe;
                //existingNhaCungCap.GhiChu = nhaCungCap.GhiChu;
                //existingNhaCungCap.TrangThai = nhaCungCap.TrangThai;
                //_dbContext.NhaCungCaps.Update(existingNhaCungCap);
                //await _dbContext.SaveChangesAsync();
                _dbContext.NhaCungCaps.Update(nhaCungCap);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<NhaCungCap>()
                {
                    Data = nhaCungCap,
                    Message = "Sửa nhà cung cấp thành công",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<NhaCungCap>()
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
        public async Task<BaseResponse<NhaCungCap>> DeleteNhaCungCap(int id)
        {
            try
            {
                var nhaCungCap = await _dbContext.NhaCungCaps.FindAsync(id);
                if (nhaCungCap == null)
                {
                    return new BaseResponse<NhaCungCap>()
                    {
                        Data = null,
                        Message = "Nhà cung cấp không tồn tại",
                        Status = ResponseStatus.NotFound
                    };
                }
                _dbContext.NhaCungCaps.Remove(nhaCungCap);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<NhaCungCap>()
                {
                    Message = "Xóa nhà cung cấp thành công",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<NhaCungCap>()
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
    }
}
