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
                    Description = "Yet another masterpiece from the world's best car manufacturer",
                    BuyingPrice = 109775,
                    SellingPrice = 114234,
                    UnitsInStock = 12,
                    IsActive = true,
                    ProductCategory = prodCat_1
                };

                var prod_2 = new Product
                {
                    Name = "Nissan Patrol",
                    Description = "A true man's choice",
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

                // Menu Items
                var menuItems = new List<MenuItem>
                {
                    // Nigiri Sushi
                    new() { Name = "Salmon Nigiri", NameVi = "Nigiri Cá Hồi", Description = "Fresh Norwegian salmon on seasoned rice",
                        DescriptionVi = "Cá hồi Na Uy tươi trên cơm trộn giấm", ProductCategory = cat1, Price = 45000,
                        Ingredients = "[\"Salmon\",\"Sushi Rice\",\"Wasabi\"]", IngredientsVi = "[\"Cá hồi\",\"Cơm sushi\",\"Wasabi\"]",
                        IsPopular = true, Rating = 4.8m, Reviews = 124 },
                    
                    new() { Name = "Tuna Nigiri", NameVi = "Nigiri Cá Ngừ", Description = "Premium bluefin tuna",
                        DescriptionVi = "Cá ngừ vây xanh cao cấp", ProductCategory = cat1, Price = 55000,
                        Ingredients = "[\"Tuna\",\"Sushi Rice\",\"Wasabi\"]", IngredientsVi = "[\"Cá ngừ\",\"Cơm sushi\",\"Wasabi\"]",
                        IsPopular = true, Rating = 4.9m, Reviews = 98 },

                    // Maki Rolls
                    new() { Name = "California Roll", NameVi = "Maki California", Description = "Crab, avocado, cucumber",
                        DescriptionVi = "Cua, bơ, dưa chuột", ProductCategory = cat2, Price = 75000,
                        Ingredients = "[\"Crab Stick\",\"Avocado\",\"Cucumber\",\"Tobiko\"]",
                        IngredientsVi = "[\"Thanh cua\",\"Bơ\",\"Dưa chuột\",\"Trứng cá\"]",
                        IsPopular = true, Rating = 4.7m, Reviews = 156 },

                    new() { Name = "Spicy Tuna Roll", NameVi = "Maki Cá Ngừ Cay", Description = "Tuna with spicy mayo",
                        DescriptionVi = "Cá ngừ với sốt mayonnaise cay", ProductCategory = cat2, Price = 85000,
                        Ingredients = "[\"Tuna\",\"Spicy Mayo\",\"Cucumber\",\"Sesame\"]",
                        IngredientsVi = "[\"Cá ngừ\",\"Sốt mayo cay\",\"Dưa chuột\",\"Mè\"]",
                        IsPopular = true, Rating = 4.8m, Reviews = 143 },

                    // Sashimi
                    new() { Name = "Salmon Sashimi", NameVi = "Sashimi Cá Hồi", Description = "6 pieces of fresh salmon",
                        DescriptionVi = "6 miếng cá hồi tươi", ProductCategory = cat3, Price = 95000,
                        Ingredients = "[\"Premium Salmon\"]", IngredientsVi = "[\"Cá hồi cao cấp\"]",
                        IsPopular = true, Rating = 4.9m, Reviews = 201 },

                    // Special Rolls
                    new() { Name = "Dragon Roll", NameVi = "Maki Rồng", Description = "Eel, avocado topped with eel sauce",
                        DescriptionVi = "Lươn, bơ phủ sốt lươn", ProductCategory = cat4, Price = 120000,
                        Ingredients = "[\"Eel\",\"Avocado\",\"Cucumber\",\"Eel Sauce\"]",
                        IngredientsVi = "[\"Lươn\",\"Bơ\",\"Dưa chuột\",\"Sốt lươn\"]",
                        IsPopular = true, Rating = 4.9m, Reviews = 112 },

                    new() { Name = "Rainbow Roll", NameVi = "Maki Cầu Vồng", Description = "California roll topped with assorted fish",
                        DescriptionVi = "Maki California phủ các loại cá", ProductCategory = cat4, Price = 130000,
                        Ingredients = "[\"Salmon\",\"Tuna\",\"Avocado\",\"Crab\"]",
                        IngredientsVi = "[\"Cá hồi\",\"Cá ngừ\",\"Bơ\",\"Cua\"]",
                        IsPopular = true, IsNew = true, Rating = 4.8m, Reviews = 95 },

                    // Vegetarian
                    new() { Name = "Avocado Roll", NameVi = "Maki Bơ", Description = "Fresh avocado with sesame",
                        DescriptionVi = "Bơ tươi với mè", ProductCategory = cat5, Price = 50000,
                        Ingredients = "[\"Avocado\",\"Sesame\",\"Sushi Rice\"]",
                        IngredientsVi = "[\"Bơ\",\"Mè\",\"Cơm sushi\"]",
                        IsVegetarian = true, Rating = 4.5m, Reviews = 56 }
                };

                dbContext.MenuItems.AddRange(menuItems);
                await dbContext.SaveChangesAsync();

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
                    DescriptionVi = "Trải nghiệm ẩm thực Nhật Bản chính thống với những sáng tạo đặc biệt của đầu bếp. Nguyên liệu tươi ngon, kỹ thuật truyền thống và cách trình bày hiện đại.",
                    Phone = "+84 123 456 789",
                    Email = "info@mucsushi.vn",
                    Address = "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
                    AddressVi = "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
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
