// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace QuickApp.Server.Services.FileUpload
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileUploadService> _logger;

        public FileUploadService(IWebHostEnvironment environment, ILogger<FileUploadService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<FileUploadResult> UploadFilesAsync(IFormFileCollection files, FileUploadOptions options)
        {
            var result = new FileUploadResult();

            if (files == null || files.Count == 0)
            {
                result.Success = false;
                result.Message = "Khong co file nao duoc cung cap";
                return result;
            }

            if (files.Count > options.MaxFilesCount)
            {
                result.Success = false;
                result.Message = $"Chi cho phep toi da {options.MaxFilesCount} file(s)";
                return result;
            }

            var uploadPath = GetUploadPath(options.UploadPath);
            EnsureDirectoryExists(uploadPath);

            foreach (var file in files)
            {
                var validation = ValidateFile(file, options);
                if (!validation.IsValid)
                {
                    result.Errors.Add($"{file.FileName}: {validation.ErrorMessage}");
                    _logger.LogWarning("File validation failed: {FileName} - {Error}", file.FileName, validation.ErrorMessage);
                    continue;
                }

                try
                {
                    var fileName = GenerateUniqueFileName(file.FileName, options.GenerateUniqueFileName);
                    var filePath = Path.Combine(uploadPath, fileName);

                    await SaveFileAsync(file, filePath);
                    
                    var relativeUrl = $"/{options.UploadPath.Replace("\\", "/")}/{fileName}";
                    result.UploadedFiles.Add(fileName);
                    result.FileUrls.Add(relativeUrl);
                    
                    _logger.LogInformation("File uploaded: {FileName} -> {Path}", fileName, relativeUrl);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
                    result.Errors.Add($"{file.FileName}: {ex.Message}");
                }
            }

            result.Success = result.UploadedFiles.Count > 0;
            result.Message = result.Success
                ? $"Tai len thanh cong {result.UploadedFiles.Count} file(s)"
                : "Loi khi tai len file(s)";

            return result;
        }

        public async Task<FileUploadResult> UploadFileAsync(IFormFile file, FileUploadOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return new FileUploadResult
                {
                    Success = false,
                    Message = "File is empty"
                };
            }

            var files = new FormFileCollection { file };
            return await UploadFilesAsync(files, options);
        }

        public async Task<FileUploadResult> UploadThumbnailAsync(IFormFile file, string subPath = "thumbnails")
        {
            var options = FileUploadOptions.Thumbnail();
            options.UploadPath = Path.Combine("uploads", "blogposts", subPath);
            return await UploadFileAsync(file, options);
        }

        public async Task<FileUploadResult> UploadDocumentAsync(IFormFile file, string subPath = "documents")
        {
            var options = FileUploadOptions.Documents();
            options.UploadPath = Path.Combine("uploads", subPath);
            return await UploadFileAsync(file, options);
        }

        public async Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(fileUrl))
                    return false;

                var filePath = GetPhysicalPath(fileUrl);
                
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation("File deleted: {FileUrl}", fileUrl);
                    return true;
                }

                _logger.LogWarning("File not found for deletion: {FileUrl}", fileUrl);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FileUrl}", fileUrl);
                return false;
            }
        }

        public async Task<bool> DeleteFilesAsync(IEnumerable<string> fileUrls)
        {
            var allDeleted = true;
            foreach (var fileUrl in fileUrls)
            {
                var deleted = await DeleteFileAsync(fileUrl);
                if (!deleted)
                    allDeleted = false;
            }
            return allDeleted;
        }

        public (bool IsValid, string? ErrorMessage) ValidateFile(IFormFile file, FileUploadOptions options)
        {
            if (file == null || file.Length == 0)
                return (false, "File rong hoac khong ton tai");

            if (file.Length > options.MaxFileSize)
            {
                var maxSizeMB = options.MaxFileSize / (1024.0 * 1024.0);
                return (false, $"Kich thuoc file vuot qua gioi han {maxSizeMB:F2} MB");
            }

            var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(extension))
                return (false, "File khong co phan mo rong");

            if (!options.AllowedExtensions.Contains(extension))
            {
                return (false, $"Loai file '{extension}' khong duoc cho phep. Cho phep: {string.Join(", ", options.AllowedExtensions)}");
            }

            var contentType = file.ContentType?.ToLowerInvariant();
            if (!string.IsNullOrEmpty(contentType) && 
                !options.AllowedContentTypes.Contains(contentType) &&
                !IsSafeContentType(contentType, extension))
            {
                _logger.LogWarning("Content type mismatch for {Extension}: {ContentType}", extension, contentType);
            }

            return (true, null);
        }

        /// <summary>
        /// Get file info (size, extension, etc.) without saving
        /// </summary>
        public FileInfo GetFileInfo(IFormFile file)
        {
            return new FileInfo
            {
                FileName = file.FileName,
                Extension = Path.GetExtension(file.FileName)?.ToLowerInvariant() ?? "",
                SizeInBytes = file.Length,
                ContentType = file.ContentType,
                IsImage = IsImageFile(Path.GetExtension(file.FileName))
            };
        }

        /// <summary>
        /// Get all files in a directory
        /// </summary>
        public List<string> GetFiles(string relativePath)
        {
            var fullPath = GetPhysicalPath(relativePath);
            if (!Directory.Exists(fullPath))
                return new List<string>();

            return Directory.GetFiles(fullPath)
                .Select(f => $"/{relativePath.TrimStart('/').Replace("\\", "/")}/{Path.GetFileName(f)}")
                .ToList();
        }

        #region Private Methods

        private string GetUploadPath(string relativePath)
        {
            return Path.Combine(_environment.WebRootPath, relativePath.TrimStart('/'));
        }

        private string GetPhysicalPath(string relativeUrl)
        {
            var relativePath = relativeUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
            return Path.Combine(_environment.WebRootPath, relativePath);
        }

        private void EnsureDirectoryExists(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
                _logger.LogInformation("Created upload directory: {Path}", path);
            }
        }

        private async Task SaveFileAsync(IFormFile file, string filePath)
        {
            await using var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None, 
                bufferSize: 81920, useAsync: true);
            await file.CopyToAsync(stream);
        }

        private string GenerateUniqueFileName(string originalFileName, bool generateUnique)
        {
            var extension = Path.GetExtension(originalFileName)?.ToLowerInvariant() ?? "";
            var baseName = Path.GetFileNameWithoutExtension(originalFileName);

            if (generateUnique)
            {
                var safeName = SanitizeFileName(baseName);
                var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                var guid = Guid.NewGuid().ToString("N")[..8];
                return $"{timestamp}_{guid}_{safeName}{extension}";
            }

            return SanitizeFileName(originalFileName);
        }

        private string SanitizeFileName(string fileName)
        {
            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = string.Join("_", fileName.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
            return string.IsNullOrEmpty(sanitized) ? "file" : sanitized;
        }

        private bool IsImageFile(string? extension)
        {
            if (string.IsNullOrEmpty(extension)) return false;
            var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico" };
            return imageExtensions.Contains(extension.ToLowerInvariant());
        }

        private bool IsSafeContentType(string contentType, string extension)
        {
            var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico" };
            var knownImageTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml" };
            
            if (imageExtensions.Contains(extension) && knownImageTypes.Any(t => contentType.Contains(t.Split('/').Last())))
                return true;
                
            return false;
        }

        #endregion
    }
}
