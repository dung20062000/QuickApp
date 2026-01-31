// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.ViewModels.Shop
{
    public class MenuItemVM
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? NameVi { get; set; }
        public string? Description { get; set; }
        public string? DescriptionVi { get; set; }
        public int ProductCategoryId { get; set; }
        public string? CategoryName { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsPopular { get; set; }
        public bool IsNew { get; set; }
        public bool IsVegetarian { get; set; }
        public string[]? Ingredients { get; set; }
        public string[]? IngredientsVi { get; set; }
        public decimal Rating { get; set; }
        public int Reviews { get; set; }
    }
}
