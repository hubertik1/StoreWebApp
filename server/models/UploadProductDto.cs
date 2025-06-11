using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace StoreWebApp.Models   // use the same namespace you keep your other DTOs in
{
    /// <summary>
    /// Represents the multipart/form-data payload sent to /api/StoreWebApp/UploadProduct
    /// </summary>
    public class UploadProductDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<long>? CategoryIds { get; set; }

        public IFormFile? Image { get; set; }
    }
}