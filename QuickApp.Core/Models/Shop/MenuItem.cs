// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using System.ComponentModel.DataAnnotations;

namespace QuickApp.Core.Models.Shop
{
    public class MenuItem : BaseEntity  //sẽ là lớp vỏ bọc chứa thông tin marketing (bilingual, hình ảnh đẹp, rating) cho một Product cụ thể
    {

        // Liên kết cốt lõi để sau này làm Order
        public int ProductId { get; set; }
        public required Product Product { get; set; }

        public int MenuId { get; set; }
        public required Menu Menu { get; set; }

        // Có thể kế thừa category từ Product, nhưng để linh hoạt khi lọc trên web thì lưu lại
        public int ProductCategoryId { get; set; }
        public required ProductCategory ProductCategory { get; set; }

        // --- Thông tin hiển thị cho Public CMS ---
        [Required]
        [MaxLength(200)]
        public required string DisplayName { get; set; } // Tên hiển thị (vd: Sashimi Cá Hồi Thượng Hạng)

        [MaxLength(200)]
        public string? DisplayNameVi { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? DescriptionVi { get; set; }

        // Giá linh hoạt: Nếu món ăn này nằm trong "Menu Khai Trương", giá có thể rẻ hơn giá gốc của Product
        public decimal? OverridePrice { get; set; }

        /// <summary>
        /// JSON array of image URLs (max 5) cho trang giới thiệu
        /// </summary>
        [MaxLength(2000)]
        public string? ImageUrls { get; set; }

        public bool IsPopular { get; set; } // Món bán chạy
        public bool IsNew { get; set; } // Món mới
        public bool IsVegetarian { get; set; } // Đồ chay

        [MaxLength(1000)]
        public string? Ingredients { get; set; } // JSON: ["Salmon", "Rice", "Nori"]

        [MaxLength(1000)]
        public string? IngredientsVi { get; set; } // JSON: ["Cá hồi", "Cơm", "Rong biển"]

        public decimal Rating { get; set; }
        public int Reviews { get; set; }

        public bool IsActive { get; set; } = true;
        //[Required]
        //[MaxLength(200)]
        //public required string Name { get; set; }

        //[MaxLength(200)]
        //public string? NameVi { get; set; }

        //[MaxLength(500)]
        //public string? Description { get; set; }

        //[MaxLength(500)]
        //public string? DescriptionVi { get; set; }

        //public int ProductCategoryId { get; set; }
        //public required ProductCategory ProductCategory { get; set; }

        //public decimal Price { get; set; }

        //[MaxLength(500)]
        //public string? ImageUrl { get; set; }

        //public bool IsPopular { get; set; }
        //public bool IsNew { get; set; }
        //public bool IsVegetarian { get; set; }

        //[MaxLength(1000)]
        //public string? Ingredients { get; set; } // JSON string array

        //[MaxLength(1000)]
        //public string? IngredientsVi { get; set; } // JSON string array

        //public decimal Rating { get; set; }
        //public int Reviews { get; set; }

        //public bool IsActive { get; set; } = true;
    }
}
