using System.ComponentModel.DataAnnotations;

namespace StoreWebApp.Models
{

    public class UploadProductDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<long>? CategoryIds { get; set; }

        public IFormFile? Image { get; set; }
    }
}