using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.Models.Shop
{
    public class NhaCungCap : BaseEntity
    {
        public string MaNhaCungCap { get; set; }

        public string TenNhaCungCap { get; set; }
        public string DiaChi { get; set; }
        public string SoDienThoai { get; set; } 
        public string Email { get; set; }
        public string TenNguoiLienHe { get; set; }
        public string GhiChu { get; set; }
        public bool TrangThai { get; set; }
    }
}
