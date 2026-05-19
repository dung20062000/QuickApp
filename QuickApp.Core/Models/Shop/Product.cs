// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using System.ComponentModel.DataAnnotations;

namespace QuickApp.Core.Models.Shop
{
    public class Product : BaseEntity
    {
        //public required string Name { get; set; }
        //public string? Description { get; set; }
        //public string? Icon { get; set; }

        ///// <summary>
        ///// JSON array of image URLs (max 5)
        ///// Example: ["/uploads/shop/products/image1.jpg", "/uploads/shop/products/image2.jpg"]
        ///// </summary>
        //public string? ImageUrls { get; set; }

        //public decimal BuyingPrice { get; set; }
        //public decimal SellingPrice { get; set; }
        //public int UnitsInStock { get; set; }
        //public bool IsActive { get; set; }
        //public bool IsDiscontinued { get; set; }

        //public int? ParentId { get; set; }
        //public Product? Parent { get; set; }

        //public int ProductCategoryId { get; set; }
        //public required ProductCategory ProductCategory { get; set; }

        //public ICollection<Product> Children { get; } = [];
        //public ICollection<OrderDetail> OrderDetails { get; } = [];

        [Required]
        [MaxLength(200)]
        public required string Name { get; set; } // Tên hệ thống (vd: Sashimi Ca Hoi)
        public decimal BuyingPrice { get; set; } // Giá vốn (để tính lợi nhuận)
        public decimal SellingPrice { get; set; } // Giá bán gốc
        public int UnitsInStock { get; set; } // Tồn kho (với sushi có thể là 0 nếu làm tươi)
        public bool IsActive { get; set; }
        public bool IsDiscontinued { get; set; } // Ngừng kinh doanh

        // Các liên kết cấu trúc của QuickApp
        public int? ParentId { get; set; }
        public Product? Parent { get; set; }

        public int ProductCategoryId { get; set; }
        public required ProductCategory ProductCategory { get; set; }

        public ICollection<Product> Children { get; } = [];
        public ICollection<OrderDetail> OrderDetails { get; } = [];

        // Quan hệ 1-N: 1 Product có thể xuất hiện trên nhiều Menu dưới dạng MenuItem khác nhau
        public ICollection<MenuItem> MenuItems { get; } = [];
    }
}
