using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Core.Infrastructure
{
    public class BaseRequest
    {
        public int PageIndex { get; set; } = DefaultValues.PageIndex;
        public int PageSize { get; set; } = DefaultValues.PageSize;
    }
}
