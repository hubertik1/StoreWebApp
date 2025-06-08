using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreWebApp.Data;
using StoreWebApp.Models;
using System.Linq;

namespace StoreWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreWebAppController : ControllerBase
    {
        private readonly StoreWebAppContext _context;
        public StoreWebAppController(StoreWebAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetProducts")]
        public ActionResult<List<Product>> GetProducts()
        {
            List<Product> products = _context.Products
                .AsNoTracking()
                .Where(p => !p.IsDeleted)
                .ToList();
            return Ok(products);
        }

        [HttpPost]
        [Route("AddProduct")]
        public async Task<ActionResult<Product>> AddProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpPut]
        [Route("UpdateProduct/{id}")]
        public async Task<IActionResult> UpdateProduct(long id, Product product)
        {
            if (id != product.Id)
                return BadRequest();

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        [Route("DeleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.IsDeleted = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}