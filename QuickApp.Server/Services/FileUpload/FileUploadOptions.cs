// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Services.FileUpload
{
    /// <summary>
    /// Upload category types for organizing files
    /// </summary>
    public enum UploadCategory
    {
        Images,      // .jpg, .jpeg, .png, .gif, .webp, .svg, .bmp, .ico
        Documents,   // .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv
        All          // All supported types
    }

    /// <summary>
    /// File upload configuration options
    /// </summary>
    public class FileUploadOptions
    {
        /// <summary>
        /// Maximum file size in bytes (default: 10MB)
        /// </summary>
        public long MaxFileSize { get; set; } = 10 * 1024 * 1024; // 10MB

        /// <summary>
        /// Maximum number of files per upload (default: 5)
        /// </summary>
        public int MaxFilesCount { get; set; } = 5;

        /// <summary>
        /// Allowed file extensions (default: all supported types)
        /// </summary>
        public string[] AllowedExtensions { get; set; } = new[]
        {
            // Images
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico",
            // Documents
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv"
        };

        /// <summary>
        /// Upload directory path (relative to wwwroot)
        /// </summary>
        public string UploadPath { get; set; } = "uploads";

        /// <summary>
        /// Generate unique filename (default: true)
        /// </summary>
        public bool GenerateUniqueFileName { get; set; } = true;

        /// <summary>
        /// Allowed content types (for additional validation)
        /// </summary>
        public string[] AllowedContentTypes { get; set; } = new[]
        {
            // Images
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
            "image/svg+xml", "image/bmp", "image/x-icon",
            // Documents
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain", "text/csv"
        };

        /// <summary>
        /// Preset configurations for common use cases
        /// </summary>
        public static FileUploadOptions Images(int maxSizeMB = 5, int maxFiles = 5)
        {
            return new FileUploadOptions
            {
                MaxFileSize = maxSizeMB * 1024 * 1024,
                MaxFilesCount = maxFiles,
                AllowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico" },
                AllowedContentTypes = new[]
                {
                    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
                    "image/svg+xml", "image/bmp", "image/x-icon"
                }
            };
        }

        public static FileUploadOptions Documents(int maxSizeMB = 20, int maxFiles = 5)
        {
            return new FileUploadOptions
            {
                MaxFileSize = maxSizeMB * 1024 * 1024,
                MaxFilesCount = maxFiles,
                AllowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv" },
                AllowedContentTypes = new[]
                {
                    "application/pdf", "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    "text/plain", "text/csv"
                }
            };
        }

        public static FileUploadOptions ImagesAndDocuments(int maxSizeMB = 10, int maxFiles = 10)
        {
            return new FileUploadOptions
            {
                MaxFileSize = maxSizeMB * 1024 * 1024,
                MaxFilesCount = maxFiles
            };
        }

        public static FileUploadOptions Thumbnail(int maxSizeMB = 2)
        {
            return Images(maxSizeMB, 1);
        }
    }
}
