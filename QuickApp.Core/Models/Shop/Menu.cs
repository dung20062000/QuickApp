using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.Models.Shop
{
    public class Menu : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public required string Name { get; set; } // Tên menu (vd: Menu Mùa Hè)

        [MaxLength(500)]
        public string? Description { get; set; } // Mô tả menu

        public bool IsActive { get; set; } = true;

        // Liên kết với hệ thống Đa cơ sở
        // Nếu null là áp dụng toàn hệ thống, nếu có Id là menu riêng của cơ sở đó
        public int? BranchId { get; set; }

        // Quan hệ 1-N: 1 Menu có nhiều MenuItem
        public ICollection<MenuItem> MenuItems { get; } = [];
    }
}
