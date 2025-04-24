using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreWebApp.Data;
using StoreWebApp.Models;

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
            List<Product> products = _context.Products.AsNoTracking().ToList();
            return Ok(products);
        }
    }
}