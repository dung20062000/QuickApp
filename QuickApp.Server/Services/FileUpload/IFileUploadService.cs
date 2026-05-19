// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Http;

namespace QuickApp.Server.Services.FileUpload
{
    public interface IFileUploadService
    {
        /// <summary>
        /// Upload multiple files with custom options
        /// </summary>
        Task<FileUploadResult> UploadFilesAsync(IFormFileCollection files, FileUploadOptions options);

        /// <summary>
        /// Upload single file with custom options
        /// </summary>
        Task<FileUploadResult> UploadFileAsync(IFormFile file, FileUploadOptions options);

        /// <summary>
        /// Upload thumbnail image for blog posts
        /// </summary>
        Task<FileUploadResult> UploadThumbnailAsync(IFormFile file, string subPath = "thumbnails");

        /// <summary>
        /// Upload document file
        /// </summary>
        Task<FileUploadResult> UploadDocumentAsync(IFormFile file, string subPath = "documents");

        /// <summary>
        /// Delete a file by its URL
        /// </summary>
        Task<bool> DeleteFileAsync(string fileUrl);

        /// <summary>
        /// Delete multiple files
        /// </summary>
        Task<bool> DeleteFilesAsync(IEnumerable<string> fileUrls);

        /// <summary>
        /// Validate file before upload
        /// </summary>
        (bool IsValid, string? ErrorMessage) ValidateFile(IFormFile file, FileUploadOptions options);

        /// <summary>
        /// Get file info without saving
        /// </summary>
        FileInfo GetFileInfo(IFormFile file);

        /// <summary>
        /// Get all files in a directory
        /// </summary>
        List<string> GetFiles(string relativePath);
    }
}
