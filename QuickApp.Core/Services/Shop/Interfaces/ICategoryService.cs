using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Shop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.Services.Shop.Interfaces
{
 public interface ICategoryService
 {
 BaseResponse<List<ProductCategory>> GetAllCategory(CategorySearchCoreRequest request);
 BaseResponse<ProductCategory?> GetCategoryById(int id);
 Task<BaseResponse<ProductCategory?>> CreateCategoryAsync(ProductCategory category);
 Task<BaseResponse<ProductCategory?>> UpdateCategoryAsync(ProductCategory category);
 Task<BaseResponse<ProductCategory?>> DeleteCategoryAsync(int id);
 }
}
