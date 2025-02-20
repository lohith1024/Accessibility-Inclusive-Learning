using IdentityServer4.Models;

namespace InclusiveLearnAPI;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new List<IdentityResource>
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email()
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new List<ApiScope>
        {
            new ApiScope("api1", "InclusiveLearn API")
        };

    public static IEnumerable<Client> Clients =>
        new List<Client>
        {
            new Client
            {
                ClientId = "angular",
                ClientName = "Angular Client",
                AllowedGrantTypes = GrantTypes.Code,
                RequirePkce = true,
                RequireClientSecret = false,
                RedirectUris = { "http://localhost:4200/callback" },
                PostLogoutRedirectUris = { "http://localhost:4200" },
                AllowedCorsOrigins = { "http://localhost:4200" },
                AllowedScopes = { "openid", "profile", "email", "api1" }
            }
        };
}