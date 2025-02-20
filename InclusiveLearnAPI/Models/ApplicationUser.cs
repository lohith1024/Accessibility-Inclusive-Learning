using Microsoft.AspNetCore.Identity;

namespace InclusiveLearnAPI.Models;

public class ApplicationUser : IdentityUser
{
    public AccessibilityPreferences? AccessibilityPreferences { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AccessibilityPreferences
{
    public bool HighContrast { get; set; }
    public string FontSize { get; set; } = "medium";
    public bool ScreenReader { get; set; }
    public string ColorScheme { get; set; } = "light";
    public bool ReducedMotion { get; set; }
}