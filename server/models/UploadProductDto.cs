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

        public long? CategoryId { get; set; }

        public IFormFile? Image { get; set; }
    }
}