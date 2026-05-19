---
name: frontend-security-coder
description: Expert in secure Angular 19 coding. Use PROACTIVELY when writing Angular components, services, or any frontend security patterns.
risk: unknown
source: community
date_added: "2026-02-27"
---

# Frontend Security Coder (Angular 19)

> Focus on **writing secure Angular code** — not auditing. Use `security-auditor` for audits/threat modeling.

## Architecture

This project uses **Angular 19** with:
- `quickapp.client/src/app/services/` — API services, auth, utilities
- `quickapp.client/src/app/components/` — Components (login, dashboard, etc.)
- `quickapp.client/src/app/models/` — TypeScript interfaces and types
- `quickapp.client/src/app/directives/` — Custom directives
- `quickapp.client/src/app/pipes/` — Custom pipes

## Key Patterns

### Authentication (OpenID Connect / OAuth2)

```typescript
// AuthService handles token storage and login
// Tokens stored in LocalStoreManager (session or permanent based on "remember me")
// Access token sent automatically via OidcHelperService interceptor

// Check if user is logged in
import { AuthService } from '../services/auth.service';
const isLoggedIn = authService.isLoggedIn;

// Get current user
const user = authService.currentUser;

// Get user permissions
const permissions = authService.userPermissions; // PermissionValues[]
```

### Permission Checking

```typescript
// In AccountService
userHasPermission(permissionValue: PermissionValues): boolean {
  return this.permissions.some(p => p === permissionValue);
}

// Available permissions
import { Permissions } from '../models/permission.model';
Permissions.viewUsers    // 'users.view'
Permissions.manageUsers  // 'users.manage'
Permissions.viewRoles    // 'roles.view'
Permissions.manageRoles  // 'roles.manage'
Permissions.assignRoles  // 'roles.assign'
```

### Route Guards

```typescript
// Use AuthGuard on protected routes in app.routes.ts
// auth.guard.ts checks isLoggedIn and redirects to login

// In component: redirect if not authorized
import { AuthService } from '../services/auth.service';
if (!this.authService.isLoggedIn) {
  this.authService.redirectForLogin();
}
```

### XSS Prevention

```typescript
// ✅ Safe — never use innerHTML with user input
// Use textContent or Angular binding (automatically sanitized)
<span>{{ userInput }}</span>  // Angular sanitizes by default

// ❌ Dangerous — bypass Angular's sanitization
// <div [innerHTML]="userHtml"></div>

// If you must render HTML, sanitize first with DOMPurify
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
```

### URL / Navigation Security

```typescript
// Validate external URLs before navigation
function isSafeRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// External links must have rel="noopener noreferrer"
<a [href]="externalUrl" target="_blank" rel="noopener noreferrer">
```

### Token Storage

```typescript
// AuthService manages this — but be aware:
// Remember me = permanent storage (survives browser close)
// No remember me = session storage (cleared on browser close)
// NEVER store sensitive data in localStorage (vulnerable to XSS)
```

### HTTP Interceptors

```typescript
// OidcHelperService handles:
// 1. Attaching access token to requests
// 2. Refreshing tokens when expired
// 3. Redirecting to login on 401

// Never modify tokens manually — use AuthService methods
authService.logout();
authService.loginWithPassword(username, password, rememberMe);
```

### Form Validation

```typescript
// Use reactive forms with built-in validators
import { FormBuilder, Validators } from '@angular/forms';
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});

// Validate before API calls
if (this.form.invalid) return;
```

## Checklist

- [ ] All protected routes have AuthGuard
- [ ] Permission checks before showing sensitive UI
- [ ] Never use `innerHTML` with untrusted content — use `{{ expression }}`
- [ ] External links have `rel="noopener noreferrer"`
- [ ] All API calls go through service layer (not direct HTTP)
- [ ] Forms validated before submission
- [ ] No sensitive data in URL query params
- [ ] Tokens never stored in localStorage (only sessionStorage or server-side)
- [ ] Redirect URLs validated before navigation

## When to Use

- Writing Angular components, services, or directives
- Implementing login/logout flows
- Building protected routes
- Rendering user-generated content
- Making HTTP requests to API
- Reviewing Angular code for security issues
