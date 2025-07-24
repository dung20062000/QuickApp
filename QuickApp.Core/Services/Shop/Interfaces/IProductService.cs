// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;

namespace QuickApp.Core.Services.Shop
{
    public interface IProductService
    {
        BaseResponse<List<Product>> GetAllProducts(ProductSearchCoreRequest searchRequest);
        BaseResponse<Product?> GetProductById(int id);
        Task<BaseResponse<Product?>> CreateProductAsync(Product product);
        Task<BaseResponse<Product?>> UpdateProductAsync(Product product);
        Task<BaseResponse<Product?>> DeleteProductAsync(Product product);
    }
}
