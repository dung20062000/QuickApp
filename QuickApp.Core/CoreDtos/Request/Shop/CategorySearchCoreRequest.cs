using QuickApp.Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.CoreDtos.Request.Shop
{
    public class CategorySearchCoreRequest : BaseRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
