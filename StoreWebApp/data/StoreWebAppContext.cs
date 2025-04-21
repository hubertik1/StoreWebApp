using Microsoft.EntityFrameworkCore;
using StoreWebApp.Models;

namespace StoreWebApp.Data
{
    public class StoreWebAppContext : DbContext
    {
        public StoreWebAppContext(DbContextOptions<StoreWebAppContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
    }
}