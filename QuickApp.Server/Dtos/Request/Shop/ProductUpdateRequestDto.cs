// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Dtos.Request.Shop
{
    public class ProductUpdateRequestDto
    {
        public string? Name { get; set; }
        public decimal? BuyingPrice { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? UnitsInStock { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDiscontinued { get; set; }
        public int? ProductCategoryId { get; set; }
    }
}
