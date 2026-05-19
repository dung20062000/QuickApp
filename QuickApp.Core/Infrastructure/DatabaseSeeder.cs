// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuickApp.Core.Models;
using QuickApp.Core.Models.Account;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Account;

namespace QuickApp.Core.Infrastructure
{
    public class DatabaseSeeder(ApplicationDbContext dbContext, ILogger<DatabaseSeeder> logger,
        IUserAccountService userAccountService, IUserRoleService userRoleService) : IDatabaseSeeder
    {
        public async Task SeedAsync()
        {
            await dbContext.Database.MigrateAsync();
            await SeedDefaultUsersAsync();
            await SeedDemoDataAsync();
        }

        /************ DEFAULT USERS **************/

        private async Task SeedDefaultUsersAsync()
        {
            if (!await dbContext.Users.AnyAsync())
            {
                logger.LogInformation("Generating inbuilt accounts");

                const string adminRoleName = "administrator";
                const string userRoleName = "user";

                await EnsureRoleAsync(adminRoleName, "Default administrator",
                    ApplicationPermissions.GetAllPermissionValues());

                await EnsureRoleAsync(userRoleName, "Default user", []);

                await CreateUserAsync("admin",
                                      "tempP@ss123",
                                      "Inbuilt Administrator",
                                      "admin@ebenmonney.com",
                                      "+1 (123) 000-0000",
                                      [adminRoleName]);

                await CreateUserAsync("user",
                                      "tempP@ss123",
                                      "Inbuilt Standard User",
                                      "user@ebenmonney.com",
                                      "+1 (123) 000-0001",
                                      [userRoleName]);

                logger.LogInformation("Inbuilt account generation completed");
            }
        }

        private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
        {
            if (await userRoleService.GetRoleByNameAsync(roleName) == null)
            {
                logger.LogInformation("Generating default role: {roleName}", roleName);

                var applicationRole = new ApplicationRole(roleName, description);

                var result = await userRoleService.CreateRoleAsync(applicationRole, claims);

                if (!result.Succeeded)
                {
                    throw new UserRoleException($"Seeding \"{description}\" role failed. Errors: " +
                        $"{string.Join(Environment.NewLine, result.Errors)}");
                }
            }
        }

        private async Task<ApplicationUser> CreateUserAsync(
            string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
        {
            logger.LogInformation("Generating default user: {userName}", userName);

            var applicationUser = new ApplicationUser
            {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
            };

            var result = await userAccountService.CreateUserAsync(applicationUser, roles, password);

            if (!result.Succeeded)
            {
                throw new UserAccountException($"Seeding \"{userName}\" user failed. Errors: " +
                    $"{string.Join(Environment.NewLine, result.Errors)}");
            }

            return applicationUser;
        }

        /************ DEMO DATA **************/

        private async Task SeedDemoDataAsync()
        {
            if (!await dbContext.Customers.AnyAsync() && !await dbContext.ProductCategories.AnyAsync())
            {
                logger.LogInformation("Seeding demo data");

                var cust_1 = new Customer
                {
                    Name = "Ebenezer Monney",
                    Email = "contact@ebenmonney.com",
                    Gender = Gender.Male
                };

                var cust_2 = new Customer
                {
                    Name = "Itachi Uchiha",
                    Email = "uchiha@narutoverse.com",
                    PhoneNumber = "+81123456789",
                    Address = "Some fictional Address, Street 123, Konoha",
                    City = "Konoha",
                    Gender = Gender.Male
                };

                var cust_3 = new Customer
                {
                    Name = "John Doe",
                    Email = "johndoe@anonymous.com",
                    PhoneNumber = "+18585858",
                    Address = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                    Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at elementum imperdiet",
                    City = "Lorem Ipsum",
                    Gender = Gender.Male
                };

                var cust_4 = new Customer
                {
                    Name = "Jane Doe",
                    Email = "Janedoe@anonymous.com",
                    PhoneNumber = "+18585858",
                    Address = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                    Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at elementum imperdiet",
                    City = "Lorem Ipsum",
                    Gender = Gender.Male
                };

                var prodCat_1 = new ProductCategory
                {
                    Name = "None",
                    Description = "Default category. Products that have not been assigned a category"
                };

                var prod_1 = new Product
                {
                    Name = "BMW M6",
                    BuyingPrice = 109775,
                    SellingPrice = 114234,
                    UnitsInStock = 12,
                    IsActive = true,
                    ProductCategory = prodCat_1
                };

                var prod_2 = new Product
                {
                    Name = "Nissan Patrol",
                    BuyingPrice = 78990,
                    SellingPrice = 86990,
                    UnitsInStock = 4,
                    IsActive = true,
                    ProductCategory = prodCat_1
                };

                var ordr_1 = new Order
                {
                    Discount = 500,
                    Cashier = await dbContext.Users.OrderBy(u => u.UserName).FirstAsync(),
                    Customer = cust_1
                };

                var ordr_2 = new Order
                {
                    Cashier = await dbContext.Users.OrderBy(u => u.UserName).FirstAsync(),
                    Customer = cust_2
                };

                ordr_1.OrderDetails.Add(new()
                {
                    UnitPrice = prod_1.SellingPrice,
                    Quantity = 1,
                    Product = prod_1,
                    Order = ordr_1
                });
                ordr_1.OrderDetails.Add(new()
                {
                    UnitPrice = prod_2.SellingPrice,
                    Quantity = 1,
                    Product = prod_2,
                    Order = ordr_1
                });

                ordr_2.OrderDetails.Add(new()
                {
                    UnitPrice = prod_2.SellingPrice,
                    Quantity = 1,
                    Product = prod_2,
                    Order = ordr_2
                });

                dbContext.Customers.Add(cust_1);
                dbContext.Customers.Add(cust_2);
                dbContext.Customers.Add(cust_3);
                dbContext.Customers.Add(cust_4);

                dbContext.Products.Add(prod_1);
                dbContext.Products.Add(prod_2);

                dbContext.Orders.Add(ordr_1);
                dbContext.Orders.Add(ordr_2);

                await dbContext.SaveChangesAsync();

                logger.LogInformation("Seeding demo data completed");
            }

            // Seed Menu Categories and Items
            if (!await dbContext.MenuItems.AnyAsync())
            {
                logger.LogInformation("Seeding menu data");

                // Sushi Categories
                var cat1 = new ProductCategory { Name = "Nigiri Sushi", Description = "Traditional hand-pressed sushi", Icon = "🍣" };
                var cat2 = new ProductCategory { Name = "Maki Rolls", Description = "Rolled sushi with seaweed", Icon = "🍱" };
                var cat3 = new ProductCategory { Name = "Sashimi", Description = "Fresh sliced raw fish", Icon = "🐟" };
                var cat4 = new ProductCategory { Name = "Special Rolls", Description = "Chef's signature creations", Icon = "⭐" };
                var cat5 = new ProductCategory { Name = "Vegetarian", Description = "Plant-based options", Icon = "🥒" };

                dbContext.ProductCategories.AddRange(cat1, cat2, cat3, cat4, cat5);
                await dbContext.SaveChangesAsync();

                // Create a default Menu
                var defaultMenu = new Menu
                {
                    Name = "Main Menu",
                    Description = "Main restaurant menu",
                    IsActive = true
                };
                dbContext.Menus.Add(defaultMenu);
                await dbContext.SaveChangesAsync();

                // Create Products and MenuItems
                var menuItemData = new List<(string Name, string DisplayName, string DisplayNameVi, string Description, string DescriptionVi, ProductCategory Category, decimal Price, string Ingredients, string IngredientsVi, bool IsPopular, bool IsNew, bool IsVegetarian, decimal Rating)>
                {
                    ("Salmon Nigiri", "Salmon Nigiri", "Nigiri Ca Hoi", "Fresh Norwegian salmon on seasoned rice", "Ca hoi Na Uy tuoi tren com tron giam", cat1, 45000m, "[\"Salmon\",\"Sushi Rice\",\"Wasabi\"]", "[\"Ca hoi\",\"Com sushi\",\"Wasabi\"]", true, false, false, 4.8m),
                    ("Tuna Nigiri", "Tuna Nigiri", "Nigiri Ca Ngu", "Premium bluefin tuna", "Ca ngu vay xanh cao cap", cat1, 55000m, "[\"Tuna\",\"Sushi Rice\",\"Wasabi\"]", "[\"Ca ngu\",\"Com sushi\",\"Wasabi\"]", true, false, false, 4.9m),
                    ("California Roll", "California Roll", "Maki California", "Crab, avocado, cucumber", "Cua, bo, dua chuot", cat2, 75000m, "[\"Crab Stick\",\"Avocado\",\"Cucumber\",\"Tobiko\"]", "[\"Thanh cua\",\"Bo\",\"Dua chuot\",\"Trung ca\"]", true, false, false, 4.7m),
                    ("Spicy Tuna Roll", "Spicy Tuna Roll", "Maki Ca Ngu Cay", "Tuna with spicy mayo", "Ca ngu voi sot mayonnaise cay", cat2, 85000m, "[\"Tuna\",\"Spicy Mayo\",\"Cucumber\",\"Sesame\"]", "[\"Ca ngu\",\"Sot mayo cay\",\"Dua chuot\",\"Me\"]", true, false, false, 4.8m),
                    ("Salmon Sashimi", "Salmon Sashimi", "Sashimi Ca Hoi", "6 pieces of fresh salmon", "6 mieng ca hoi tuoi", cat3, 95000m, "[\"Premium Salmon\"]", "[\"Ca hoi cao cap\"]", true, false, false, 4.9m),
                    ("Dragon Roll", "Dragon Roll", "Maki Rong", "Eel, avocado topped with eel sauce", "Luon, bo phu sot luon", cat4, 120000m, "[\"Eel\",\"Avocado\",\"Cucumber\",\"Eel Sauce\"]", "[\"Luon\",\"Bo\",\"Dua chuot\",\"Sot luon\"]", true, false, false, 4.9m),
                    ("Rainbow Roll", "Rainbow Roll", "Maki Cau Vong", "California roll topped with assorted fish", "Maki California phu cac loai ca", cat4, 130000m, "[\"Salmon\",\"Tuna\",\"Avocado\",\"Crab\"]", "[\"Ca hoi\",\"Ca ngu\",\"Bo\",\"Cua\"]", true, true, false, 4.8m),
                    ("Avocado Roll", "Avocado Roll", "Maki Bo", "Fresh avocado with sesame", "Bo tuoi voi me", cat5, 50000m, "[\"Avocado\",\"Sesame\",\"Sushi Rice\"]", "[\"Bo\",\"Me\",\"Com sushi\"]", false, false, true, 4.5m)
                };

                foreach (var item in menuItemData)
                {
                    var product = new Product
                    {
                        Name = item.Name,
                        BuyingPrice = item.Price * 0.6m,
                        SellingPrice = item.Price,
                        UnitsInStock = 100,
                        IsActive = true,
                        IsDiscontinued = false,
                        ProductCategory = item.Category
                    };
                    dbContext.Products.Add(product);
                    await dbContext.SaveChangesAsync();

                    var menuItem = new MenuItem
                    {
                        Product = product,
                        Menu = defaultMenu,
                        ProductCategory = item.Category,
                        DisplayName = item.DisplayName,
                        DisplayNameVi = item.DisplayNameVi,
                        Description = item.Description,
                        DescriptionVi = item.DescriptionVi,
                        OverridePrice = item.Price,
                        Ingredients = item.Ingredients,
                        IngredientsVi = item.IngredientsVi,
                        IsPopular = item.IsPopular,
                        IsNew = item.IsNew,
                        IsVegetarian = item.IsVegetarian,
                        Rating = item.Rating,
                        Reviews = 0,
                        IsActive = true
                    };
                    dbContext.MenuItems.Add(menuItem);
                    await dbContext.SaveChangesAsync();
                }

                logger.LogInformation("Menu data seeding completed");
            }

            // Seed Restaurant Info
            if (!await dbContext.RestaurantInfos.AnyAsync())
            {
                logger.LogInformation("Seeding restaurant info");

                var restaurantInfo = new RestaurantInfo
                {
                    Name = "Muc Sushi House",
                    Description = "Experience authentic Japanese cuisine with our chef's special creations. Fresh ingredients, traditional techniques, and modern presentation.",
                    DescriptionVi = "Trai nghiem am thuc Nhat Ban chinh thong voi nhung sang tao dac biet cua dau bep. Nguyen lieu tuoi ngon, ky thuat truyen thong va cach trinh bay hien dai.",
                    Phone = "+84 123 456 789",
                    Email = "info@mucsushi.vn",
                    Address = "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
                    AddressVi = "123 Duong Nguyen Hue, Quan 1, TP. Ho Chi Minh",
                    OpenHours = "Mon-Sun: 10:00 AM - 10:00 PM",
                    OpenHoursVi = "T2-CN: 10:00 - 22:00",
                    Facebook = "https://facebook.com/mucsushi",
                    Instagram = "https://instagram.com/mucsushi",
                    Twitter = "https://twitter.com/mucsushi"
                };

                dbContext.RestaurantInfos.Add(restaurantInfo);
                await dbContext.SaveChangesAsync();

                logger.LogInformation("Restaurant info seeding completed");
            }
        }
    }
}
