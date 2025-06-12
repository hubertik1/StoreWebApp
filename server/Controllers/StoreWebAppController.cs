using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StoreWebApp.Data;
using StoreWebApp.Models;
using System.Security.Claims;
using System.IO;
using System;

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

        // Categories
        [HttpGet("GetCategories")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<Category>> GetCategories()
        {
            var query = _context.Categories.AsQueryable();

            if (!User.IsInRole("Admin"))
                query = query.Where(c => !c.IsDeleted);

            var categories = query
                .AsNoTracking()
                .ToList();

            return Ok(categories);
        }

        // PRODUCTS
        [HttpGet("GetProducts")]
        [AllowAnonymous]
        public ActionResult<PagedResult<Product>> GetProducts(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 4,
            [FromQuery] List<long>? categoryIds = null)
        {
            IQueryable<Product> query = _context.Products;

            if (!User.IsInRole("Admin"))
            {
                query = query.Where(p => !p.IsDeleted);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(p => EF.Functions.Like(p.Title.ToLower(), $"%{search}%"));
            }

            if (categoryIds is { Count: > 0 })
            {
                query = query.Where(p => p.Categories.Any(c => categoryIds.Contains(c.Id)));
            }

            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            List<Product> products = query
                .Include(p => p.Categories)
                .Include(p => p.Comments)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToList();

            var result = new PagedResult<Product>
            {
                Items = products,
                TotalPages = totalPages
            };

            return Ok(result);
        }   

        [HttpPost("UploadProduct")]
        [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Product>> UploadProduct(
            [FromForm] UploadProductDto dto)
        {
            string? imageUrl = null;
            if (dto.Image is { Length: > 0 })
            {
                var ext       = Path.GetExtension(dto.Image.FileName);
                var fileName  = $"{Guid.NewGuid()}{ext}";
                var imagePath = Path.Combine("wwwroot", "images", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(imagePath)!);
                await using var stream = new FileStream(imagePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                imageUrl = Path.Combine("images", fileName).Replace("\\", "/");
            }

            var product = new Product
            {
                Title        = dto.Title,
                Description  = dto.Description ?? string.Empty,
                ImageUrl     = imageUrl,
                IsDeleted    = false,
                CreationDate = DateTime.UtcNow
            };

            if (long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid))
                product.CreatorUserId = uid;

            if (dto.CategoryIds != null && dto.CategoryIds.Count > 0)
            {
                var categories = _context.Categories
                    .Where(c => dto.CategoryIds.Contains(c.Id) && !c.IsDeleted)
                    .ToList();

                foreach (var category in categories)
                    product.Categories.Add(category);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpDelete("DeleteProduct/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteProduct(long id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product is null)
                return NotFound();

            product.IsDeleted = true;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPost("RestoreProduct/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult RestoreProduct(long id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product is null)
                return NotFound();

            product.IsDeleted = false;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPut("EditProduct/{id}")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Product>> EditProduct(long id, [FromForm] EditProductDto dto)
        {
            var product = _context.Products
                .Include(p => p.Categories)
                .FirstOrDefault(p => p.Id == id);
            if (product is null)
                return NotFound();

            product.Title = dto.Title;
            product.Description = dto.Description ?? string.Empty;

            if (dto.Image is { Length: > 0 })
            {
                var ext = Path.GetExtension(dto.Image.FileName);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var imagePath = Path.Combine("wwwroot", "images", fileName);
                Directory.CreateDirectory(Path.GetDirectoryName(imagePath)!);
                await using var stream = new FileStream(imagePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                product.ImageUrl = Path.Combine("images", fileName).Replace("\\", "/");
            }

            if (dto.CategoryIds != null)
            {
                var categories = _context.Categories
                    .Where(c => dto.CategoryIds.Contains(c.Id) && !c.IsDeleted)
                    .ToList();
                product.Categories.Clear();
                foreach (var cat in categories)
                    product.Categories.Add(cat);
            }

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpPost("AddProductCategory")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddProductCategory(long productId, long categoryId)
        {
            var product = _context.Products
                .Include(p => p.Categories)
                .FirstOrDefault(p => p.Id == productId);
            if (product is null)
                return NotFound();

            var category = _context.Categories
                .FirstOrDefault(c => c.Id == categoryId && !c.IsDeleted);
            if (category is null)
                return NotFound();

            if (!product.Categories.Any(c => c.Id == categoryId))
            {
                product.Categories.Add(category);
                _context.SaveChanges();
            }

            return NoContent();
        }

        [HttpDelete("RemoveProductCategory")]
        [Authorize(Roles = "Admin")]
        public IActionResult RemoveProductCategory(long productId, long categoryId)
        {
            var product = _context.Products
                .Include(p => p.Categories)
                .FirstOrDefault(p => p.Id == productId);
            if (product is null)
                return NotFound();

            var category = product.Categories.FirstOrDefault(c => c.Id == categoryId);
            if (category is null)
                return NotFound();

            product.Categories.Remove(category);
            _context.SaveChanges();
            return NoContent();
        }

        // COMMENTS
        [HttpGet("GetComments/{productId}")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<Comment>> GetComments(long productId)
        {
            var commentsQuery = _context.Comments
                .Where(c => c.ProductId == productId);

            if (!User.IsInRole("Admin"))
                commentsQuery = commentsQuery.Where(c => !c.IsDeleted);

            var comments = commentsQuery
                .AsNoTracking()
                .ToList();

            return Ok(comments);
        }

        [HttpPost("AddComment")]
        [Authorize]
        public ActionResult<Comment> AddComment([FromBody] CommentDto dto)
        {
            if (!_context.Products.Any(p => p.Id == dto.ProductId && !p.IsDeleted))
                return NotFound();

            var comment = new Comment
            {
                Description  = dto.Description,
                ProductId    = dto.ProductId,
                IsDeleted    = false,
                CreationDate = DateTime.UtcNow
            };

            if (long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid))
                comment.CreatorUserId = uid;

            _context.Comments.Add(comment);
            _context.SaveChanges();

            return Ok(comment);
        }

        [HttpPost("RestoreComment/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult RestoreComment(long id)
        {
            var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (comment is null)
                return NotFound();

            comment.IsDeleted = false;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("DeleteComment/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteComment(long id)
        {
            var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (comment is null)
                return NotFound();

            comment.IsDeleted = true;
            _context.SaveChanges();
            return NoContent();
        }
    }

    public class CommentDto
    {
        public string Description { get; set; } = string.Empty;
        public long   ProductId   { get; set; }
    }

}