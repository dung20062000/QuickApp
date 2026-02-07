// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Dtos.Request.Shop
{
    /// <summary>
    /// DTO for creating product with file upload
    /// </summary>
    public class ProductCreateRequestDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public decimal BuyingPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public int UnitsInStock { get; set; }
        public bool IsActive { get; set; }
        public bool IsDiscontinued { get; set; }
        public int ProductCategoryId { get; set; }
    }
}
