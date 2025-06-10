using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using StoreWebApp.Data;
using StoreWebApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StoreWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly StoreDbContext _context;
        private readonly IPasswordHasher<User> _hasher;
        private readonly IConfiguration _config;

        public AuthController(StoreDbContext context, IPasswordHasher<User> hasher, IConfiguration config)
        {
            _context = context;
            _hasher = hasher;
            _config = config;
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUsers()
        {
            var users = _context.Users
                .Select(u => new { u.Id, u.Username, u.Role })
                .ToList();
            return Ok(users);
        }

        [HttpPost("updateRole/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateRole(long id, [FromBody] UpdateRoleDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound();
            if (dto.Role != "Admin" && dto.Role != "User")
                return BadRequest();

            user.Role = dto.Role;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginDto dto)
        {
            if (_context.Users.Any(u => u.Username == dto.Username))
                return BadRequest("User exists");

            var user = new User
            {
                Username = dto.Username,
                Role = "User"
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { token = GenerateToken(user), role = user.Role, username = user.Username });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == dto.Username);
            if (user == null)
                return BadRequest("User not found");

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return BadRequest("Wrong password");

            return Ok(new { token = GenerateToken(user), role = user.Role, username = user.Username });
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateRoleDto
    {
        public string Role { get; set; } = string.Empty;
    }
}
