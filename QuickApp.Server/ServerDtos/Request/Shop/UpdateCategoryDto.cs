using System.ComponentModel.DataAnnotations;

namespace QuickApp.Server.ServerDtos.Request.Shop
{
    public class UpdateCategoryDto
    {
        [Required]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [MaxLength(200, ErrorMessage = "Tên danh mục không được vượt quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
        public string? Description { get; set; }
        
        public string? Icon { get; set; }
    }
}
