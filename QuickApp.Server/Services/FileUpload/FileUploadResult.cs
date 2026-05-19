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
        /// Relative URLs to access uploaded files (e.g., /uploads/blogposts/thumbnails/image.jpg)
        /// </summary>
        public List<string> FileUrls { get; set; } = new();

        /// <summary>
        /// Get the first file URL (for single file uploads)
        /// </summary>
        public string? FirstFileUrl => FileUrls.FirstOrDefault();
    }

    /// <summary>
    /// File information (metadata)
    /// </summary>
    public class FileInfo
    {
        public string FileName { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
        public long SizeInBytes { get; set; }
        public string? ContentType { get; set; }
        public bool IsImage { get; set; }
    }
}
