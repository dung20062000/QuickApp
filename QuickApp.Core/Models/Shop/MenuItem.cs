// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using System.ComponentModel.DataAnnotations;

namespace QuickApp.Core.Models.Shop
{
    public class MenuItem : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public required string Name { get; set; }

        [MaxLength(200)]
        public string? NameVi { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? DescriptionVi { get; set; }

        public int ProductCategoryId { get; set; }
        public required ProductCategory ProductCategory { get; set; }

        public decimal Price { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public bool IsPopular { get; set; }
        public bool IsNew { get; set; }
        public bool IsVegetarian { get; set; }

        [MaxLength(1000)]
        public string? Ingredients { get; set; } // JSON string array

        [MaxLength(1000)]
        public string? IngredientsVi { get; set; } // JSON string array

        public decimal Rating { get; set; }
        public int Reviews { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
