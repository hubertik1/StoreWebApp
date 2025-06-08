using System.ComponentModel.DataAnnotations.Schema;

namespace StoreWebApp.Models
{
    [Table("product")]
    public class Product
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }
    }
}
