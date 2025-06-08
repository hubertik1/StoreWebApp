using Microsoft.EntityFrameworkCore;
using StoreWebApp.Models;

namespace StoreWebApp.Data
{
    public class StoreDbContext : DbContext
    {
        public StoreDbContext(DbContextOptions<StoreDbContext> options)
            : base(options)
        {            
        }

        public DbSet<Product> Products { get; set; }
    }
}