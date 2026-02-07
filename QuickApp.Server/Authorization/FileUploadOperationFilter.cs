// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace QuickApp.Server.Authorization
{
    /// <summary>
    /// Swagger filter to handle [FromForm] with file uploads
    /// </summary>
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formFileParams = context.ApiDescription.ParameterDescriptions
                .Where(p => IsFileType(p.Type))
                .ToList();

            if (!formFileParams.Any())
                return;

            // Clear existing parameters
            operation.Parameters?.Clear();

            // Set request body for multipart/form-data
            operation.RequestBody = new OpenApiRequestBody
            {
                Required = true,
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = new Dictionary<string, OpenApiSchema>(),
                            Required = new HashSet<string>()
                        }
                    }
                }
            };

            var schema = operation.RequestBody.Content["multipart/form-data"].Schema;

            // Add all parameters from the action
            foreach (var param in context.ApiDescription.ParameterDescriptions)
            {
                var paramType = param.Type;

                if (paramType == typeof(IFormFile))
                {
                    // Single file
                    schema.Properties[ToCamelCase(param.Name)] = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary",
                        Description = "Upload single file"
                    };
                }
                else if (paramType == typeof(IFormFileCollection) || IsFileCollectionType(paramType))
                {
                    // Multiple files
                    schema.Properties[ToCamelCase(param.Name)] = new OpenApiSchema
                    {
                        Type = "array",
                        Items = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary"
                        },
                        Description = "Upload multiple files"
                    };
                }
                else
                {
                    // Skip file types (already handled above)
                    if (IsFileType(paramType))
                        continue;

                    // Check if it's a complex DTO type
                    if (paramType.IsClass && paramType != typeof(string))
                    {
                        // DTO object - flatten its properties
                        var properties = paramType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

                        foreach (var prop in properties)
                        {
                            var propName = ToCamelCase(prop.Name);
                            
                            // Skip if already exists (avoid duplicates)
                            if (schema.Properties.ContainsKey(propName))
                                continue;

                            var propSchema = new OpenApiSchema
                            {
                                Type = GetOpenApiType(prop.PropertyType),
                                Description = prop.Name
                            };

                            // Handle nullable types
                            var underlyingType = Nullable.GetUnderlyingType(prop.PropertyType);
                            if (underlyingType != null)
                            {
                                propSchema.Nullable = true;
                                propSchema.Type = GetOpenApiType(underlyingType);
                            }

                            // Check if required
                            var isRequired = IsPropertyRequired(prop);
                            
                            schema.Properties[propName] = propSchema;
                            
                            if (isRequired)
                            {
                                schema.Required.Add(propName);
                            }
                        }
                    }
                    else
                    {
                        // Simple type parameter
                        schema.Properties[ToCamelCase(param.Name)] = new OpenApiSchema
                        {
                            Type = GetOpenApiType(paramType)
                        };
                    }
                }
            }
        }

        private bool IsFileType(Type type)
        {
            return type == typeof(IFormFile) || 
                   type == typeof(IFormFileCollection) ||
                   IsFileCollectionType(type);
        }

        private bool IsFileCollectionType(Type type)
        {
            if (!type.IsGenericType)
                return false;

            var genericType = type.GetGenericTypeDefinition();
            return (genericType == typeof(IEnumerable<>) || 
                    genericType == typeof(ICollection<>) ||
                    genericType == typeof(List<>)) &&
                   type.GetGenericArguments().FirstOrDefault() == typeof(IFormFile);
        }

        private bool IsPropertyRequired(PropertyInfo prop)
        {
            // Check for [Required] attribute
            var hasRequiredAttribute = prop.GetCustomAttribute<System.ComponentModel.DataAnnotations.RequiredAttribute>() != null;
            
            // Check for required keyword in C#
            var isRequiredKeyword = prop.GetCustomAttribute<System.Runtime.CompilerServices.RequiredMemberAttribute>() != null;
            
            return hasRequiredAttribute || isRequiredKeyword;
        }

        private string GetOpenApiType(Type type)
        {
            var underlyingType = Nullable.GetUnderlyingType(type) ?? type;

            if (underlyingType == typeof(int) || underlyingType == typeof(long) || 
                underlyingType == typeof(short) || underlyingType == typeof(byte))
                return "integer";
            
            if (underlyingType == typeof(decimal) || underlyingType == typeof(double) || 
                underlyingType == typeof(float))
                return "number";
            
            if (underlyingType == typeof(bool))
                return "boolean";
            
            if (underlyingType == typeof(DateTime) || underlyingType == typeof(DateTimeOffset))
                return "string"; // Will add format: date-time if needed
            
            return "string";
        }

        private string ToCamelCase(string str)
        {
            if (string.IsNullOrEmpty(str) || char.IsLower(str[0]))
                return str;

            return char.ToLowerInvariant(str[0]) + str[1..];
        }
    }
}

