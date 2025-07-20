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

        public IEnumerable<Product> GetAllProducts()
        {
            return _dbContext.Products
                .Include(p => p.ProductCategory)
                .OrderBy(p => p.Name)
                .ToList();
        }

        public Product? GetProductById(int id)
        {
            return _dbContext.Products
                .Include(p => p.ProductCategory)
                .FirstOrDefault(p => p.Id == id);
        }

        public async Task<(bool Succeeded, string[] Errors, Product? Product)> CreateProductAsync(Product product)
        {
            if (product == null)
                return (false, new[] { "Product cannot be null." }, null);

            try
            {
                _dbContext.Products.Add(product);
                await _dbContext.SaveChangesAsync();
                return (true, Array.Empty<string>(), product);
            }
            catch (Exception ex)
            {
                return (false, new[] { ex.Message }, null);
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateProductAsync(Product product)
        {
            if (product == null)
                return (false, new[] { "Product cannot be null." });

            try
            {
                _dbContext.Products.Update(product);
                await _dbContext.SaveChangesAsync();
                return (true, Array.Empty<string>());
            }
            catch (Exception ex)
            {
                return (false, new[] { ex.Message });
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteProductAsync(Product product)
        {
            if (product == null)
                return (false, new[] { "Product cannot be null." });

            try
            {
                _dbContext.Products.Remove(product);
                await _dbContext.SaveChangesAsync();
                return (true, Array.Empty<string>());
            }
            catch (Exception ex)
            {
                return (false, new[] { ex.Message });
            }
        }
    }
}
