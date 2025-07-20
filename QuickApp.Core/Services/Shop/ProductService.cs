// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.EntityFrameworkCore;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;

namespace QuickApp.Core.Services.Shop
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _dbContext;

        public ProductService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public BaseResponse<List<Product>> GetAllProducts()
        {
            try
            {
                var products = _dbContext.Products
                    .Include(p => p.ProductCategory)
                    .OrderBy(p => p.Name)
                    .ToList();

                return new BaseResponse<List<Product>>
                {
                    Message = "Success",
                    Status = ResponseStatus.Susscess,
                    Data = products
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<List<Product>>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        public BaseResponse<Product?> GetProductById(int id)
        {
            try
            {
                var product = _dbContext.Products
                    .Include(p => p.ProductCategory)
                    .FirstOrDefault(p => p.Id == id);

                if (product == null)
                {
                    return new BaseResponse<Product?>
                    {
                        Message = "Không tìm thấy sản phẩm",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    };
                }

                return new BaseResponse<Product?>
                {
                    Message = "Success",
                    Status = ResponseStatus.Susscess,
                    Data = product
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<Product?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        public async Task<BaseResponse<Product?>> CreateProductAsync(Product product)
        {
            if (product == null)
            {
                return new BaseResponse<Product?>
                {
                    Message = "Product cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                _dbContext.Products.Add(product);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<Product?>
                {
                    Message = "Thêm sản phẩm thành công",
                    Status = ResponseStatus.Susscess,
                    Data = product
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<Product?>
                {
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        public async Task<BaseResponse<Product?>> UpdateProductAsync(Product product)
        {
            if (product == null)
            {
                return new BaseResponse<Product?>
                {
                    Message = "Product cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                _dbContext.Products.Update(product);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<Product?>
                {
                    Message = "Cập nhật sản phẩm thành công",
                    Status = ResponseStatus.Susscess,
                    Data = product
                };
            }
            catch
            {
                return new BaseResponse<Product?>
                {
                    Message = "Lỗi hệ thống",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }

        public async Task<BaseResponse<Product?>> DeleteProductAsync(Product product)
        {
            if (product == null)
            {
                return new BaseResponse<Product?>
                {
                    Message = "Product cannot be null.",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }

            try
            {
                _dbContext.Products.Remove(product);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<Product?>
                {
                    Message = "Xóa sản phẩm thành công",
                    Status = ResponseStatus.Susscess,
                    Data = product
                };
            }
            catch
            {
                return new BaseResponse<Product?>
                {
                    Message = "Lỗi hệ thống",
                    Status = ResponseStatus.Fail,
                    Data = null
                };
            }
        }
    }
}
