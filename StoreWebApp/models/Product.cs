using System.ComponentModel.DataAnnotations.Schema;

namespace StoreWebApp.Models
{
    [Table("product", Schema = "dbo")]
    public class Product
    {
        public long id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string image_url { get; set; }
    }
}