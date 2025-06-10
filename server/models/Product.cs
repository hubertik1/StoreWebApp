using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreWebApp.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public bool IsDeleted { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        public string? ImageUrl { get; set; }

        public long CreatorUserId { get; set; }

        public User? CreatorUser { get; set; }

        /* ─────── navigation ─────── */
        public ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public ICollection<Category> Categories { get; set; } = new HashSet<Category>();
    }
}