using System.Collections.Generic;
using System.Linq;

namespace StoreWebApp.Models
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
        public int TotalPages { get; set; }
    }
}
