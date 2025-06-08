using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreWebApp.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        public bool IsDeleted { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        /* ─────── FK → Product ─────── */
        public long ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}