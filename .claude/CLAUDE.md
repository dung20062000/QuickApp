# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Start dev server with Turbopack
yarn build            # Production build with Turbopack
yarn start            # Start production server
yarn lint             # Run ESLint

yarn prisma:generate  # Generate Prisma client
yarn prisma:db:pull   # Pull schema from database
yarn prisma:setup     # Pull schema + generate (run after DB changes)
yarn dev:fresh        # prisma:setup + dev server (use for fresh start)
```

## Code Style

- **Formatter:** Prettier — 4-space indent, 120-char line width, double quotes, semicolons
- **ESLint:** Strict TypeScript + React Hooks; max function length 1000 lines; no unused imports
- **Path alias:** `@/*` maps to repo root (e.g., `@/components/base/...`)

## Architecture Overview

**Next.js 16 App Router** with React 19, TypeScript, Tailwind CSS 4, Shadcn/UI.

### Route Groups

- `app/(authenticated)/` — All protected pages (dashboard, nhan-su, employee, bao-cao, system, etc.)
- `app/api/` — REST API endpoints
- `app/login/`, `app/select-company/`, `app/403/` — Public/error pages

### Layers

| Layer | Location | Purpose |
|-------|----------|---------|
| Route Handlers (API) | `app/api/**` | HTTP endpoints — thin, call service functions |
| Services | `services/` | Business logic (database + transformations) |
| Utilities | `utils/` | Shared helpers (API wrapper, file upload, validators) |
| Stores | `stores/` | Zustand global state |
| Schemas/DTOs | `@schema/api/` | Zod schemas shared across frontend & backend |

**Rule:** Business logic belongs in `services/` or `utils/`, not in JSX/component files.

### API Route Pattern

All API routes must use the `apiHandler` wrapper from `utils/ApiUtils.ts`:

```typescript
import { createApiRoute } from "@/utils/ApiUtils";

export const { GET, POST } = createApiRoute({
    GET: apiHandler(async (req, user) => { ... }),
    POST: apiHandler(async (req, user) => { ... }),
});
```

`apiHandler` automatically:
- Authenticates the request (JWT from NextAuth session or `x-mobile-session` header)
- Checks permissions via `checkAPIRoute(path, method, user)`
- Returns 401/403 responses
- Logs requests to MongoDB asynchronously

**API response format:**
```typescript
{ status: 1, data: T }         // success
{ status: 0, message: string } // error
```

The Axios client in `lib/api.ts` unwraps `response.data` automatically.

### File Uploads

Use `utils/FileUploader.ts` exclusively — never write custom file-handling logic.

### Permission System

1. **Backend:** `apiHandler` calls `checkAPIRoute()` for every request. Super admins bypass checks.
2. **Middleware:** `middleware.ts` checks route-level permissions with a 15-second cache (max 1000 entries).
3. **Components:** `<PermissionGuard permission="PERM_NAME">` hides UI for unauthorized users.
4. **Hook:** `useCurrentUserStore().hasPermission("PERM_NAME")` for conditional logic.

Permissions are stored in Redis (`cwuser:{userId}:permissions`) and versioned — changing permissions increments `permissionVersion` in the JWT to invalidate caches.

### State Management (Zustand)

Key stores in `stores/`:
- `useCurrentUserStore` — Authenticated user, permission set, `hasPermission()`
- `useProjectStore` — Project/sprint context (persisted to localStorage)
- `useSidebarStore` — Sidebar collapse state
- `useConfirmDialog` / `useDialogState` — UI dialog state

### Authentication (NextAuth v5)

- Strategy: JWT (30-day session, 24-hour refresh)
- Login flow: Credentials → `AuthService.login()` → verifies against `AspNetUsers` (bcrypt) → fetches permissions → stores in Redis → JWT issued
- Company selection: stored in JWT, updatable via `trigger: "update"` callback
- Mobile apps: send `x-mobile-session` header (base64 MobileSession object)

### Database

- **ORM:** Prisma 6 → SQL Server (primary data)
- **Cache/Sessions:** Redis (ioredis)
- **Audit Logs:** MongoDB (`lib/connectToMongo.ts`) — async, non-blocking
- After any schema change: run `yarn prisma:setup`

### i18n

`next-intl` with Vietnamese (vi, default) and English (en). Locale stored in `NEXT_LOCALE` cookie. Translation messages in `i18n/message/`.

### Key Component Patterns

- **Data tables:** `components/base/data-table/` (TanStack Table) or AG Grid — use these, don't build custom grids
- **Forms:** React Hook Form + Zod; schemas from `@schema/api/`; errors from `enums/errorMessages.ts`
- **URL state:** `nuqs` for type-safe query params (filters, pagination, sorting)
- **Toasts:** Sonner (`toast.success`, `toast.error`)

### Multi-Tenancy

The system supports multiple companies. `CompanyId` is embedded in the JWT and must be included in all Prisma queries to filter data by company.
