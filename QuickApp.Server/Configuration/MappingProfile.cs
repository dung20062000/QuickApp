// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Identity;
using QuickApp.Core.CoreDtos.Request.Shop;
using QuickApp.Core.Models.Account;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Account;
using QuickApp.Server.Dtos.Request.Shop;
using QuickApp.Server.ServerDtos.Request.Shop;
using QuickApp.Server.ViewModels.Account;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Configuration
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ApplicationUser, UserVM>()
                   .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserVM, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserEditVM>()
                .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserEditVM, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserPatchVM>()
                .ReverseMap();

            CreateMap<ApplicationRole, RoleVM>()
                .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
                .ForMember(d => d.UsersCount, map => map.MapFrom(s => s.Users != null ? s.Users.Count : 0))
                .ReverseMap();
            CreateMap<RoleVM, ApplicationRole>()
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<IdentityRoleClaim<string>, ClaimVM>()
                .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
                .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
                .ReverseMap();

            CreateMap<ApplicationPermission, PermissionVM>()
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, PermissionVM>()
                .ConvertUsing(s => ((PermissionVM)ApplicationPermissions.GetPermissionByValue(s.ClaimValue))!);

            CreateMap<Customer, CustomerVM>()
                .ReverseMap();

            CreateMap<Product, ProductVM>()
                .ForMember(d => d.ProductCategoryName, map => map.MapFrom(s => s.ProductCategory.Name))
                .ReverseMap()
                .ForMember(d => d.ProductCategory, map => map.Ignore());

            CreateMap<Order, OrderVM>()
                .ReverseMap();

            CreateMap<ProductCategory, CategoryVM>()
                .ReverseMap();

            CreateMap<NhaCungCap, NhaCungCapVM>()
                .ReverseMap();

            // MenuItem Mapping
            CreateMap<MenuItem, MenuItemVM>()
                .ForMember(d => d.CategoryName, map => map.MapFrom(s => s.ProductCategory.Name))
                .ForMember(d => d.Ingredients, map => map.MapFrom(s => DeserializeStringArray(s.Ingredients)))
                .ForMember(d => d.IngredientsVi, map => map.MapFrom(s => DeserializeStringArray(s.IngredientsVi)));

            CreateMap<MenuItemVM, MenuItem>()
                .ForMember(d => d.Product, map => map.Ignore())
                .ForMember(d => d.Menu, map => map.Ignore())
                .ForMember(d => d.ProductCategory, map => map.Ignore())
                .ForMember(d => d.Ingredients, map => map.MapFrom(s => SerializeStringArray(s.Ingredients)))
                .ForMember(d => d.IngredientsVi, map => map.MapFrom(s => SerializeStringArray(s.IngredientsVi)))
                .ForMember(d => d.CreatedBy, map => map.Ignore())
                .ForMember(d => d.CreatedDate, map => map.Ignore())
                .ForMember(d => d.UpdatedBy, map => map.Ignore())
                .ForMember(d => d.UpdatedDate, map => map.Ignore());

            // RestaurantInfo Mapping
            CreateMap<RestaurantInfo, RestaurantInfoVM>()
                .ForMember(d => d.SocialMedia, map => map.MapFrom(s => new SocialMediaVM
                {
                    Facebook = s.Facebook,
                    Instagram = s.Instagram,
                    Twitter = s.Twitter
                }));

            CreateMap<RestaurantInfoVM, RestaurantInfo>()
                .ForMember(d => d.Facebook, map => map.MapFrom(s => s.SocialMedia != null ? s.SocialMedia.Facebook : null))
                .ForMember(d => d.Instagram, map => map.MapFrom(s => s.SocialMedia != null ? s.SocialMedia.Instagram : null))
                .ForMember(d => d.Twitter, map => map.MapFrom(s => s.SocialMedia != null ? s.SocialMedia.Twitter : null))
                .ForMember(d => d.IsActive, map => map.Ignore())
                .ForMember(d => d.CreatedBy, map => map.Ignore())
                .ForMember(d => d.CreatedDate, map => map.Ignore())
                .ForMember(d => d.UpdatedBy, map => map.Ignore())
                .ForMember(d => d.UpdatedDate, map => map.Ignore());



            //mappinh for Search DTO
            CreateMap<ProductRequestServerDto, ProductSearchCoreRequest>();
            CreateMap<CategoryRequestServerDto, CategorySearchCoreRequest>();
            CreateMap<NhaCungCapRequestServerDto, NhaCungCapSearchCoreRequest>();
            CreateMap<BlogPostRequestServerDto, BlogPostSearchCoreRequest>();

            // BlogPost Mapping
            CreateMap<AppBlogPost, BlogPostVM>().ReverseMap();
            CreateMap<BlogPostRequestServerDto, AppBlogPost>();
        }

        // Helper methods for JSON serialization
        private static string[]? DeserializeStringArray(string? json)
        {
            if (string.IsNullOrEmpty(json))
                return null;

            try
            {
                return System.Text.Json.JsonSerializer.Deserialize<string[]>(json);
            }
            catch
            {
                return null;
            }
        }

        private static string? SerializeStringArray(string[]? array)
        {
            if (array == null)
                return null;

            try
            {
                return System.Text.Json.JsonSerializer.Serialize(array);
            }
            catch
            {
                return null;
            }
        }
    }
}
