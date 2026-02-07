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
        /// Upload single file
        /// </summary>
        Task<FileUploadResult> UploadFileAsync(IFormFile file, FileUploadOptions options);

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
    }
}
