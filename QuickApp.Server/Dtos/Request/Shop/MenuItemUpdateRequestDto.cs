// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Dtos.Request.Shop
{
    /// <summary>
    /// DTO for updating menu item with file upload
    /// </summary>
    public class MenuItemUpdateRequestDto
    {
        public string? Name { get; set; }
        public string? NameVi { get; set; }
        public string? Description { get; set; }
        public string? DescriptionVi { get; set; }
        public int? ProductCategoryId { get; set; }
        public decimal? Price { get; set; }
        public bool? IsPopular { get; set; }
        public bool? IsNew { get; set; }
        public bool? IsVegetarian { get; set; }
        public string? Ingredients { get; set; } // JSON string array
        public string? IngredientsVi { get; set; } // JSON string array
        public decimal? Rating { get; set; }
        public int? Reviews { get; set; }
        public bool? IsActive { get; set; }
    }
}
