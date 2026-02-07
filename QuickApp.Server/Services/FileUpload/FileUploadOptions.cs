// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Services.FileUpload
{
    public class FileUploadOptions
    {
        /// <summary>
        /// Maximum file size in bytes (default: 5MB)
        /// </summary>
        public long MaxFileSize { get; set; } = 5 * 1024 * 1024; // 5MB

        /// <summary>
        /// Maximum number of files per upload (default: 5)
        /// </summary>
        public int MaxFilesCount { get; set; } = 5;

        /// <summary>
        /// Allowed file extensions (default: common image formats)
        /// </summary>
        public string[] AllowedExtensions { get; set; } = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        /// <summary>
        /// Upload directory path (relative to wwwroot)
        /// </summary>
        public string UploadPath { get; set; } = "uploads/shop";

        /// <summary>
        /// Generate unique filename (default: true)
        /// </summary>
        public bool GenerateUniqueFileName { get; set; } = true;
    }
}
