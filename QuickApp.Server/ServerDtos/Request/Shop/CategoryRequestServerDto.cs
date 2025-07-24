using QuickApp.Core.Infrastructure;

namespace QuickApp.Server.ServerDtos.Request.Shop
{
    public class CategoryRequestServerDto : BaseRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
