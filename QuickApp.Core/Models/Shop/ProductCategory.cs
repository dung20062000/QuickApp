// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using System.ComponentModel.DataAnnotations;

namespace QuickApp.Core.Models.Shop
{
    public class ProductCategory : BaseEntity
    {
        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }

        public ICollection<Product> Products { get; } = [];
    }
}
