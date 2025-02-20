using Microsoft.AspNetCore.Mvc;
using InclusiveLearnAPI.Models;
using InclusiveLearnAPI.Models.DTOs;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using InclusiveLearnAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;

namespace InclusiveLearnAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<UsersController> _logger;
    private readonly TokenService _tokenService;

    public UsersController(
        UserManager<ApplicationUser> userManager,
        ILogger<UsersController> logger,
        TokenService tokenService)
    {
        _userManager = userManager;
        _logger = logger;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegistrationDto registration)
    {
        if (await _userManager.FindByEmailAsync(registration.Email) != null)
        {
            return BadRequest(new { error = "Email already registered" });
        }

        var user = new ApplicationUser
        {
            UserName = registration.Username,
            Email = registration.Email
        };

        var result = await _userManager.CreateAsync(user, registration.Password);

        if (result.Succeeded)
        {
            _logger.LogInformation("User created successfully");
            var token = await _tokenService.GenerateJwtToken(user);
            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.AccessibilityPreferences,
                Token = token
            });
        }

        return BadRequest(new { error = string.Join(", ", result.Errors.Select(e => e.Description)) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto login)
    {
        var user = await _userManager.FindByEmailAsync(login.Email);
        if (user == null)
        {
            return Unauthorized(new { error = "Invalid email or password" });
        }

        var result = await _userManager.CheckPasswordAsync(user, login.Password);
        if (!result)
        {
            return Unauthorized(new { error = "Invalid email or password" });
        }

        var token = await _tokenService.GenerateJwtToken(user);

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.AccessibilityPreferences,
            Token = token
        });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPut("{id}/preferences")]
    public async Task<IActionResult> UpdatePreferences(string id, AccessibilityPreferences preferences)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        // Verify the user is updating their own preferences
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId != id)
        {
            return Forbid();
        }

        user.AccessibilityPreferences = preferences;
        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            _logger.LogInformation("User preferences updated successfully");
            return Ok(user.AccessibilityPreferences);
        }

        return BadRequest(new { error = "Failed to update preferences" });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        _logger.LogInformation($"Returning {users.Count} users");
        return Ok(users.Select(u => new { u.Id, u.UserName, u.Email, u.AccessibilityPreferences }));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }
        return Ok(new { user.Id, user.UserName, user.Email, user.AccessibilityPreferences });
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}