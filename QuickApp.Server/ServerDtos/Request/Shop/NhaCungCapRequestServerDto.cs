using QuickApp.Core.Infrastructure;

namespace QuickApp.Server.ServerDtos.Request.Shop
{
    public class NhaCungCapRequestServerDto : BaseRequest
    {
        public string MaNhaCungCap { get; set; }

        public string TenNhaCungCap { get; set; }
        public string DiaChi { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }
        public string TenNguoiLienHe { get; set; }
        public string GhiChu { get; set; }
        public bool? TrangThai { get; set; }
    }
}
