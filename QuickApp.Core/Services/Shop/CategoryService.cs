using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QuickApp.Core.Services.Shop
{
    public class CategoryService: ICategoryService
    {
        private readonly ApplicationDbContext _dbContext;

        public CategoryService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public BaseResponse<List<ProductCategory>> GetAllCategory(CategorySearchCoreRequest request)
        {
            try
            {
                var query = _dbContext.ProductCategories.AsQueryable();
                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    var keyword = request.Name.Trim().ToLower();
                    query = query.Where(c => c.Name.ToLower().Contains(keyword));
                }
                var totalRecords = query.Count();
                var data = query.OrderBy(c => c.Name)
                                .Skip((request.PageIndex - 1) * request.PageSize)
                                .Take(request.PageSize)
                                .ToList();
                return new BaseResponse<List<ProductCategory>>()
                {
                    TotalRecords = totalRecords,
                    Data = data,
                    Message = "Success",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex) 
            {
                return new BaseResponse<List<ProductCategory>>()
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }

        public BaseResponse<ProductCategory?> GetCategoryById(int id) 
        {
            try
            {
                var query = _dbContext.ProductCategories.FirstOrDefault(x => x.Id == id);
                if (query == null)
                {
                    return new BaseResponse<ProductCategory?>
                    {
                        Message = "Không tìm thấy danh mục",
                        Status = ResponseStatus.NotFound,
                        Data = null
                    };
                }
                return new BaseResponse<ProductCategory>
                {
                    Data = query,
                    Message = "Success",
                    Status = ResponseStatus.Success
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail
                };
            }
        }
        public async Task<BaseResponse<ProductCategory?>> CreateProductAsync(ProductCategory category)
        {
            if (category == null)
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = "Dữ liệu danh mục không được để trống.",
                    Status = ResponseStatus.Fail,
                    
                };
            }
            try
            {
                _dbContext.ProductCategories.Add(category);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<ProductCategory?>
                {
                    Data = category,
                    Message = "Thêm mới danh mục thành công.",
                    Status = ResponseStatus.Success,

                };
            }
            catch (Exception ex) 
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,

                };
            }
        }
        public async Task<BaseResponse<ProductCategory?>> UpdateProductAsync(ProductCategory category)
        {
            if (category == null)
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = "Dữ liệu danh mục không được để trống.",
                    Status = ResponseStatus.Fail,

                };
            }
            try
            {
                _dbContext.ProductCategories.Update(category);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<ProductCategory?>
                {
                    Data = category,
                    Message = "Cập nhật danh mục thành công.",
                    Status = ResponseStatus.Success,

                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,

                };
            }
        }
        public async Task<BaseResponse<ProductCategory?>> DeleteProductAsync(ProductCategory category)
        {
            if (category == null)
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = "Dữ liệu danh mục không được để trống.",
                    Status = ResponseStatus.Fail,

                };
            }
            try
            {
                _dbContext.ProductCategories.Remove(category);
                await _dbContext.SaveChangesAsync();
                return new BaseResponse<ProductCategory?>
                {
                    Data = category,
                    Message = "Xóa danh mục thành công.",
                    Status = ResponseStatus.Success,

                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<ProductCategory?>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = ResponseStatus.Fail,

                };
            }
        }


    }
}
