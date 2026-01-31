// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.ViewModels.Shop
{
    public class RestaurantInfoVM
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? DescriptionVi { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? AddressVi { get; set; }
        public string? OpenHours { get; set; }
        public string? OpenHoursVi { get; set; }
        public SocialMediaVM? SocialMedia { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class SocialMediaVM
    {
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public string? Twitter { get; set; }
    }
}
