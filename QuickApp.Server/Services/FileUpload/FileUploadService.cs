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
                result.Message = "No files provided";
                return result;
            }

            // Check max files count
            if (files.Count > options.MaxFilesCount)
            {
                result.Success = false;
                result.Message = $"Maximum {options.MaxFilesCount} files allowed";
                return result;
            }

            // Create upload directory if not exists
            var uploadPath = Path.Combine(_environment.WebRootPath, options.UploadPath);
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            foreach (var file in files)
            {
                var validation = ValidateFile(file, options);
                if (!validation.IsValid)
                {
                    result.Errors.Add($"{file.FileName}: {validation.ErrorMessage}");
                    continue;
                }

                try
                {
                    var fileName = options.GenerateUniqueFileName
                        ? GenerateUniqueFileName(file.FileName)
                        : file.FileName;

                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    result.UploadedFiles.Add(fileName);
                    // Generate URL: /uploads/shop/products/filename.jpg
                    result.FileUrls.Add($"/{options.UploadPath.Replace("\\", "/")}/{fileName}");

                    _logger.LogInformation("File uploaded successfully: {FileName}", fileName);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
                    result.Errors.Add($"{file.FileName}: {ex.Message}");
                }
            }

            result.Success = result.UploadedFiles.Count > 0;
            result.Message = result.Success
                ? $"Successfully uploaded {result.UploadedFiles.Count} file(s)"
                : "Failed to upload files";

            return result;
        }

        public async Task<FileUploadResult> UploadFileAsync(IFormFile file, FileUploadOptions options)
        {
            var files = new FormFileCollection { file };
            return await UploadFilesAsync(files, options);
        }

        public Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                // Convert URL to physical path
                // e.g., /uploads/shop/products/file.jpg -> wwwroot/uploads/shop/products/file.jpg
                var relativePath = fileUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
                var filePath = Path.Combine(_environment.WebRootPath, relativePath);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation("File deleted successfully: {FileUrl}", fileUrl);
                    return Task.FromResult(true);
                }

                _logger.LogWarning("File not found for deletion: {FileUrl}", fileUrl);
                return Task.FromResult(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FileUrl}", fileUrl);
                return Task.FromResult(false);
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
            // Check if file is null or empty
            if (file == null || file.Length == 0)
            {
                return (false, "File is empty");
            }

            // Check file size
            if (file.Length > options.MaxFileSize)
            {
                var maxSizeMB = options.MaxFileSize / 1024.0 / 1024.0;
                return (false, $"File size exceeds maximum allowed size of {maxSizeMB:F2} MB");
            }

            // Check file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!options.AllowedExtensions.Contains(extension))
            {
                return (false, $"File type '{extension}' is not allowed. Allowed types: {string.Join(", ", options.AllowedExtensions)}");
            }

            // Additional security check: validate content type
            var allowedContentTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
            if (!allowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                return (false, $"Invalid content type: {file.ContentType}");
            }

            return (true, null);
        }

        private string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName);
            var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);
            
            // Sanitize filename: remove special characters
            fileNameWithoutExtension = string.Join("", fileNameWithoutExtension.Split(Path.GetInvalidFileNameChars()));
            
            // Generate unique name: timestamp_guid_originalname.ext
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var guid = Guid.NewGuid().ToString("N").Substring(0, 8);
            
            return $"{timestamp}_{guid}_{fileNameWithoutExtension}{extension}";
        }
    }
}
