---
name: security-auditor
description: Expert security auditor for ASP.NET Core + Angular applications. Use for security audits, penetration testing, and compliance reviews.
risk: unknown
source: community
date_added: "2026-02-27"
---

# Security Auditor (.NET 8 + Angular 19)

> Focus on **auditing & assessing** security posture — not writing code. Use `backend-security-coder` / `frontend-security-coder` for implementation.

## Project Architecture

| Layer | Technology | Security Focus |
|-------|-----------|----------------|
| API | ASP.NET Core 8 + OpenIddict | Authentication, authorization, input validation |
| Data | EF Core + SQL Server | SQL injection, data access, audit trails |
| Frontend | Angular 19 + RxJS | XSS, auth flows, route guards |
| Auth | OpenIddict + Identity | Token management, claims, policies |

## Audit Checklist

### Authentication (OpenIddict + ASP.NET Identity)

- [ ] OpenIddict Password Flow properly configured
- [ ] Refresh tokens implemented and stored securely
- [ ] Token expiration enforced (access token TTL)
- [ ] Password complexity enforced via Identity options
- [ ] Account lockout configured (max failed attempts)
- [ ] Production certificates for token signing/encryption (not dev certs)
- [ ] `DisableTransportSecurityRequirement()` removed in production

### Authorization (ASP.NET Core Policies)

- [ ] All API endpoints have `[Authorize]` or `[AllowAnonymous]`
- [ ] Policy-based authorization for sensitive operations
- [ ] `GetCurrentUserId()` used correctly in controllers
- [ ] `IUserIdAccessor` injected in services for audit trails
- [ ] Claims checked via `RequireClaim()` — not just authentication
- [ ] Role-based checks use `CustomClaims.Permission` (not role names)

### Input Validation

- [ ] FluentValidation on all DTOs in `ServerDtos/` and `Dtos/`
- [ ] `[SanitizeModel]` applied to controllers handling user input
- [ ] `HtmlSanitizer` used to strip dangerous HTML/script
- [ ] String length limits enforced (MaxLength on all strings)
- [ ] Decimal precision set explicitly (`decimal(18,2)`)
- [ ] Required fields marked `[Required]` in validators

### Data Access (EF Core)

- [ ] No raw SQL with string concatenation
- [ ] LINQ queries parameterized automatically by EF Core
- [ ] `IAuditableEntity` implemented on all entities
- [ ] Audit fields (`CreatedBy`, `UpdatedBy`) captured
- [ ] Soft delete pattern considered for critical data
- [ ] Foreign keys enforced at database level

### Angular Frontend

- [ ] AuthGuard on all protected routes
- [ ] Permission checks in UI (AccountService.userHasPermission)
- [ ] No `innerHTML` with user-generated content
- [ ] Tokens stored in sessionStorage (not localStorage)
- [ ] API calls through service layer (not direct HTTP)
- [ ] External URLs validated before navigation
- [ ] No sensitive data in URL query params

### API Security

- [ ] CORS restricted to known origins (not `AllowAnyOrigin`)
- [ ] HTTPS enforced in production
- [ ] Rate limiting configured
- [ ] No stack traces in API responses
- [ ] Swagger disabled or restricted in production
- [ ] Error messages do not leak internal details

### OWASP Top 10 Quick Reference

| # | Vulnerability | Checklist Item |
|---|---------------|----------------|
| A01 | Broken Access Control | Policy authorization on all endpoints |
| A02 | Cryptographic Failures | Production certs for OpenIddict |
| A03 | Injection | FluentValidation + no raw SQL |
| A04 | Insecure Design | Threat model for business logic |
| A05 | Security Misconfiguration | CORS, HTTPS, Swagger locked down |
| A06 | Vulnerable Components | NuGet packages up to date |
| A07 | Auth Failures | OpenIddict configured correctly |
| A08 | Data Integrity Failures | Audit trails on all entities |
| A09 | Logging Failures | Failed auth attempts logged |
| A10 | SSRF | URL validation on external requests |

## Severity Classification

| Severity | CVSS | Action |
|----------|------|--------|
| Critical | 9.0–10.0 | Fix immediately |
| High | 7.0–8.9 | Fix within 1 week |
| Medium | 4.0–6.9 | Fix within 1 month |
| Low | 0.1–3.9 | Fix within next quarter |

## Output Format

```markdown
## Findings

### [CRITICAL] <Title>
- **Description**: ...
- **Affected**: Endpoint / Component
- **Impact**: ...
- **Remediation**: ...

### [HIGH] <Title>
...
```

## Safety

- Do not run intrusive tests in production without written approval
- Protect sensitive data — never expose secrets in reports
- Document all testing scope and methodology

## When to Use

- Requesting a full security audit
- Preparing for compliance certification
- Validating security controls after implementation
- Threat modeling for new features
- Post-incident security review
