using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreWebApp.Data;
using StoreWebApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace StoreWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreWebAppController : ControllerBase
    {
        private readonly StoreDbContext _context;
        public StoreWebAppController(StoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetProducts")]
        public ActionResult<List<Product>> GetProducts([FromQuery] string? search)
        {
            var query = _context.Products
                .Where(p => !p.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(p =>
                    EF.Functions.Like(p.Title.ToLower(), $"%{search}%"));
            }

            List<Product> products = query
                .Include(p => p.Categories)
                .Include(p => p.Comments)
                .AsNoTracking().ToList();
            return Ok(products);
        }

        [HttpPost]
        [Route("AddProduct")]
        public ActionResult<Product> AddProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpPut]
        [Route("UpdateProduct/{id}")]
        public IActionResult UpdateProduct(long id, [FromBody] Product updatedProduct)
        {
            if (id != updatedProduct.Id)
                return BadRequest();

            var product = _context.Products
                .Include(p => p.Categories)
                .Include(p => p.Comments)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            product.Title = updatedProduct.Title;
            product.Description = updatedProduct.Description;
            product.ImageUrl = updatedProduct.ImageUrl;
            product.IsDeleted = updatedProduct.IsDeleted;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteProduct/{id}")]
        public IActionResult DeleteProduct(long id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound();

            product.IsDeleted = true;
            _context.SaveChanges();
            return NoContent();
        }
    }


}
