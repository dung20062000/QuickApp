// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Services.FileUpload
{
    public class FileUploadResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public List<string> UploadedFiles { get; set; } = new();
        public List<string> Errors { get; set; } = new();

        /// <summary>
        /// Relative URLs to access uploaded files (e.g., /uploads/shop/products/image.jpg)
        /// </summary>
        public List<string> FileUrls { get; set; } = new();
    }
}
