---
name: api-security-best-practices
description: "Implement secure API patterns in ASP.NET Core 8. Covers OpenIddict authentication, FluentValidation, EF Core security, CORS, and OWASP Top 10 for this project."
risk: unknown
source: community
date_added: "2026-02-27"
---

# API Security Best Practices (.NET 8)

## Authentication (OpenIddict)

### Token Configuration

```csharp
// Program.cs — OpenIddict server configuration
builder.Services.AddOpenIddict()
    .AddServer(options => {
        options.SetTokenEndpointUris("connect/token");
        options.AllowPasswordFlow().AllowRefreshTokenFlow();
        
        options.RegisterScopes(Scopes.Profile, Scopes.Email, Scopes.Roles);
        
        // Production: use real certificates
        if (!builder.Environment.IsDevelopment()) {
            var cert = new X509Certificate2(path, password);
            options.AddEncryptionCertificate(cert).AddSigningCertificate(cert);
        }
    });
```

### Token Security Checklist

- [ ] Production certificates for token signing/encryption
- [ ] Refresh token rotation implemented
- [ ] Access token TTL set appropriately (e.g., 1 hour)
- [ ] Refresh token stored server-side (in DB or Redis)
- [ ] `DisableTransportSecurityRequirement()` removed in production
- [ ] Token audience/issuer validated

## Authorization (ASP.NET Core)

### Policy-Based Authorization

```csharp
// Program.cs — define policies
builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AuthPolicies.ViewAllUsersPolicy,
        policy => policy.RequireClaim(CustomClaims.Permission, ApplicationPermissions.ViewUsers))
    .AddPolicy(AuthPolicies.ManageAllUsersPolicy,
        policy => policy.RequireClaim(CustomClaims.Permission, ApplicationPermissions.ManageUsers));

// Controller — use policies
[Authorize(Policy = AuthPolicies.ManageAllUsersPolicy)]
public async Task<IActionResult> DeleteUser(string id) { ... }
```

### Always Filter by Current User

```csharp
// ❌ Vulnerable — returns any customer's data
[HttpGet("{id}")]
public async Task<IActionResult> GetCustomer(string id) {
    return Ok(await _context.Customers.FindAsync(id));
}

// ✅ Secure — filter by ownership
[HttpGet("{id}")]
public async Task<IActionResult> GetCustomer(string id) {
    var userId = GetCurrentUserId();
    var customer = await _context.Customers
        .FirstOrDefaultAsync(c => c.Id == id && c.CreatedBy == userId);
    return customer == null ? NotFound() : Ok(customer);
}
```

## Input Validation (FluentValidation)

### Validator Pattern

```csharp
// ServerDtos/Request/Shop/NhaCungCapRequestServerDto.cs
public class NhaCungCapValidator : AbstractValidator<NhaCungCapRequestServerDto>
{
    public NhaCungCapValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100);
        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
    }
}

// Program.cs — register
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<NhaCungCapValidator>();
```

### SanitizeModel Pattern

```csharp
// DTO implements ISanitizeModel
public class MyRequestDto : ISanitizeModel
{
    public string Name { get; set; } = string.Empty;
    
    public void SanitizeModel()
    {
        Name = HtmlSanitizer.Sanitize(Name);
    }
}

// Controller has [SanitizeModel] attribute
[SanitizeModel]
public class MyController : BaseApiController { }
```

## SQL Injection Prevention (EF Core)

```csharp
// ✅ Safe — LINQ queries parameterized automatically
var customer = await _context.Customers
    .Where(c => c.Name == searchTerm)
    .ToListAsync();

// ✅ Safe — parameterized raw query
await _context.Database.ExecuteSqlRawAsync(
    "UPDATE Customers SET Name = {0} WHERE Id = {1}", name, id);

// ❌ Never do this — string interpolation in SQL
await _context.Database.ExecuteSqlRawAsync($"UPDATE Customers SET Name = '{name}'");
```

## Error Handling — No Data Leaks

```csharp
// ❌ Never expose internal errors
catch (Exception ex) {
    _logger.LogError(ex, "Failed");
    return StatusCode(500, new { message = ex.Message }); // leaks info
}

// ✅ Return generic message
catch (Exception ex) {
    _logger.LogError(ex, "Failed");
    return StatusCode(500, new { message = "An error occurred. Please try again." });
}
```

## CORS Configuration

```csharp
// Program.cs — be strict in production
app.UseCors(builder => builder
    .AllowAnyOrigin()      // ❌ Only for development
    .AllowAnyHeader()
    .AllowAnyMethod());

// Production — specify exact origins
    .WithOrigins("https://yourdomain.com", "https://admin.yourdomain.com")
    .AllowCredentials();
```

## Security Headers

```csharp
// Program.cs — add security headers
app.Use(async (context, next) => {
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});
```

## Checklist

- [ ] OpenIddict configured with production certificates
- [ ] All API endpoints have `[Authorize]` or `[AllowAnonymous]`
- [ ] Policy authorization on sensitive operations
- [ ] All DTOs have FluentValidation validators
- [ ] `[SanitizeModel]` applied to controllers
- [ ] No raw SQL with string interpolation
- [ ] Audit fields (`IAuditableEntity`) on all entities
- [ ] Current user ID captured via `GetCurrentUserId()`
- [ ] Error responses do not leak internal details
- [ ] CORS restricted to known origins
- [ ] Rate limiting configured
- [ ] No secrets in code — use `appsettings.json`

## OWASP API Top 10 Quick Reference

1. **Broken Object Level Authorization** — filter by `CreatedBy` or ownership
2. **Broken Authentication** — OpenIddict configured correctly
3. **Broken Object Property Level Authorization** — select only needed fields
4. **Unrestricted Resource Consumption** — rate limiting + pagination
5. **Broken Function Level Authorization** — policy-based checks
6. **Mass Assignment** — explicit DTOs, no dynamic object binding
7. **Server-Side Request Forgery (SSRF)** — validate URLs
8. **Security Misconfiguration** — CORS, HTTPS, Swagger locked down
9. **Improper Inventory Management** — remove unused endpoints
10. **Unsafe Consumption of APIs** — validate third-party responses

## When to Use

- Designing new API endpoints
- Securing existing APIs
- Conducting API security reviews
- Preparing for security audits
