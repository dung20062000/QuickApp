// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Dtos.Request.Shop
{
    public class MenuItemUpdateRequestDto
    {
        public required string DisplayName { get; set; }
        public string? DisplayNameVi { get; set; }
        public string? Description { get; set; }
        public string? DescriptionVi { get; set; }
        public int? ProductCategoryId { get; set; }
        public decimal? OverridePrice { get; set; }
        public string? ImageUrls { get; set; }
        public bool? IsPopular { get; set; }
        public bool? IsNew { get; set; }
        public bool? IsVegetarian { get; set; }
        public string? Ingredients { get; set; }
        public string? IngredientsVi { get; set; }
        public decimal? Rating { get; set; }
        public int? Reviews { get; set; }
        public bool? IsActive { get; set; }
    }
}
