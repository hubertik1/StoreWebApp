using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StoreWebApp.Data;
using StoreWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Security.Claims;

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
        [Route("GetCategories")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<Category>> GetCategories()
        {
            var categories = _context.Categories
                .Where(c => !c.IsDeleted)
                .AsNoTracking()
                .ToList();
            return Ok(categories);
        }

        [HttpGet]
        [Route("GetProducts")]
        [AllowAnonymous]
        public ActionResult<PagedResult<Product>> GetProducts(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 4)
        {
            var query = _context.Products
                .Where(p => !p.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(p =>
                    EF.Functions.Like(p.Title.ToLower(), $"%{search}%"));
            }

            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            List<Product> products = query
                .Include(p => p.Categories)
                .Include(p => p.Comments)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking().ToList();

            var result = new PagedResult<Product>
            {
                Items = products,
                TotalPages = totalPages
            };

            return Ok(result);
        }

        [HttpPost]
        [Route("AddProduct")]
        [Authorize]
        public ActionResult<Product> AddProduct([FromBody] Product product)
        {
            if (long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid))
            {
                product.CreatorUserId = uid;
            }
            _context.Products.Add(product);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpPost]
        [Route("UploadProduct")]
        [Authorize]
        public async Task<ActionResult<Product>> UploadProduct(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] long? categoryId,
            [FromForm] IFormFile? image)
        {
            string? imageUrl = null;

            if (image != null && image.Length > 0)
            {
                var ext = Path.GetExtension(image.FileName);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var imagePath = Path.Combine("wwwroot", "images", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(imagePath)!);
                using var stream = new FileStream(imagePath, FileMode.Create);
                await image.CopyToAsync(stream);

                imageUrl = Path.Combine("images", fileName).Replace("\\", "/");
            }

            var product = new Product
            {
                Title = title,
                Description = description,
                ImageUrl = imageUrl,
                IsDeleted = false,
                CreationDate = DateTime.UtcNow
            };
            if (long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid))
            {
                product.CreatorUserId = uid;
            }

            Category? category = null;
            if (categoryId.HasValue)
            {
                category = _context.Categories.FirstOrDefault(c => c.Id == categoryId.Value && !c.IsDeleted);
            }

            if (category != null)
            {
                product.Categories.Add(category);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpPut]
        [Route("UpdateProduct/{id}")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
