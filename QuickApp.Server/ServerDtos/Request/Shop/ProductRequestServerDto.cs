using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;

namespace QuickApp.Server.Dtos.Request.Shop
{
    public class ProductRequestServerDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? BuyingPrice { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? UnitsInStock { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDiscontinued { get; set; }
        public int? ParentId { get; set; }
        public int? ProductCategoryId { get; set; }
        public int PageIndex { get; set; } = DefaultValues.PageIndex;
        public int PageSize { get; set; } = DefaultValues.PageSize;
    }
}
