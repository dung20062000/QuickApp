// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using System.ComponentModel.DataAnnotations;

namespace QuickApp.Core.Models.Shop
{
    public class RestaurantInfo : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public required string Name { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(1000)]
        public string? DescriptionVi { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(500)]
        public string? AddressVi { get; set; }

        [MaxLength(200)]
        public string? OpenHours { get; set; }

        [MaxLength(200)]
        public string? OpenHoursVi { get; set; }

        [MaxLength(200)]
        public string? Facebook { get; set; }

        [MaxLength(200)]
        public string? Instagram { get; set; }

        [MaxLength(200)]
        public string? Twitter { get; set; }

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
