using System.Collections.Generic;

namespace StoreWebApp.Models
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalPages { get; set; }
    }
}
