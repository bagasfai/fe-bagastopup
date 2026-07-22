@AGENTS.md

# fe-bagastopup

Turborepo monorepo for BagasTopup, a game top-up reseller business in Indonesia.
Two Next.js apps share one UI package so the customer site and admin dashboard
stay visually consistent without duplicating components. This repo is
frontend-only — it talks to a separate Go backend (`be-bagastopup`) over a
REST API, never touches the database directly.

## Structure

```
apps/
  customer/   # customer-facing site   — http://localhost:3000
  admin/      # admin dashboard        — http://localhost:3001
packages/
  ui/                  # shared shadcn/ui components (@workspace/ui)
  api-client/           # shared fetch wrapper, TanStack Query hooks, auth store, types (@workspace/api-client)
  eslint-config/         # shared ESLint config
  typescript-config/     # shared tsconfig base
```

Package manager: **npm workspaces** (not pnpm/yarn) — run `npm install` once
at the repo root. Build orchestration: **Turborepo** (`turbo.json`).

## Core stack (versions as installed — check each `package.json` before assuming)

- Next.js 16 (App Router), React 19
- TailwindCSS v4 + shadcn/ui (style: `radix-nova`, icon library: `lucide`)
- TanStack Query v5, TanStack Table v8
- React Hook Form + Zod v4 (`@hookform/resolvers`)
- Zustand v5 (with `persist` middleware) — lives in `@workspace/api-client`, not per-app
- Framer Motion — installed per app, used for page/feature-level animation
- Sonner — toasts, lives in `@workspace/ui`
- next-themes — theme provider lives per app

## Conventions — read before writing code

**Study existing code before adding to it.** This codebase already has
established patterns for every layer (API hooks, form dialogs, table
columns, layout). Before implementing a new resource or page, open an
existing equivalent (e.g. `use-products.ts` for a new hook, `product-form-
dialog.tsx` for a new form dialog) and mirror its structure, naming, and
error handling exactly. Do not introduce a new pattern, library, or state-
management approach without a clear reason — flag it and ask first.

**Exports**: named exports declared at the bottom of the file
(`export { ComponentName }`), not `export default` and not inline
`export function`.

**File naming**: kebab-case for all files (`product-form-dialog.tsx`,
`use-products.ts`). Components are PascalCase, hooks are camelCase
prefixed with `use`.

**Imports**: always via the `@workspace/ui/*` and `@workspace/api-client/*`
workspace aliases — never relative-path into another workspace package.

**Comments**: this codebase writes comments that explain *why*, not *what*
— especially for non-obvious tradeoffs (see `client.ts`'s `SESSION_EXEMPT_
PATHS` comment or `auth-store.ts`'s hydration comment as the bar to match).
Keep this standard for new code.

## `packages/api-client` — the shared data layer

All server communication goes through this package, consumed by both apps.
Never `fetch()` directly from a component.

- `client.ts` — the `apiFetch<T>()` wrapper. Reads `NEXT_PUBLIC_API_URL`
  (default `http://localhost:8080`), prefixes all paths with `/api/v1`,
  attaches `Authorization: Bearer <token>` automatically from the auth
  store, throws a typed `ApiError` on non-2xx, and globally handles 401 by
  clearing the session and redirecting to `/login` (except on
  `/auth/login` itself — see `SESSION_EXEMPT_PATHS`).
- `auth-store.ts` — Zustand store (`useAuthStore`) holding
  `{ token, user, isAuthenticated }`, persisted to localStorage. Also
  writes a **non-authoritative** cookie (`bagastopup_admin_session`) purely
  so `middleware.ts` (which runs on the edge, no localStorage access) can
  do a cheap "was logged in" check. The real validity check is always
  client-side via `useMe()`. Also exports `useAuthHydrated()` — any
  component that branches on auth state must gate on this first to avoid
  SSR/client hydration mismatches.
- `hooks/use-*.ts` — one file per resource (`use-products.ts`,
  `use-sellers.ts`, `use-categories.ts`, `use-transactions.ts`,
  `use-auth.ts`). Each follows the same shape: a module-level
  `xQueryKey`, a `useX()` list query, and `useCreateX()` / `useUpdateX()`
  / `useDeleteX()` mutations that `invalidateQueries` on success. List
  queries hit paginated endpoints (`PaginatedResponse<T>`) and `select`
  out `.data`; check the per-hook comment for the limit/pagination
  strategy used (not all list pages have pagination controls — e.g.
  Products intentionally requests a large flat limit instead).
- `types/*.ts` — one file per domain entity, matching the Go backend's
  JSON shape exactly. If the backend response shape ever changes, this is
  the single place to update it.

## Auth flow (admin app)

- Login → `useLogin()` → `setSession(token, user)` in the auth store →
  cookie set → redirect to dashboard.
- `middleware.ts` only checks the cookie (edge-safe, cheap, not a real
  auth check) to stop a logged-out visitor from seeing the dashboard shell
  flash before client checks run.
- `RequireAuth` component (client-side) does the real check via `useMe()`
  once hydrated, and is what actually gates protected content.
- Logout clears both the store and the cookie, redirects to `/login`.
- A global 401 from any API call (session expired server-side) triggers
  the same clear-and-redirect flow automatically from `client.ts` — no
  page needs to handle this itself.

## `packages/ui` — shared components

Add new shared shadcn/ui components from the **monorepo root**, targeting
this package explicitly:

```bash
npx shadcn@latest add <component> -c packages/ui
```

Never run `shadcn add` from inside `apps/customer` or `apps/admin` for
anything meant to be shared — that installs a local duplicate instead of
extending the shared package. Only add a component directly inside an app
if it's genuinely app-specific and not reusable (e.g. `hero-carousel.tsx`
lives in `apps/customer`, not in `packages/ui`).

Forms use the shadcn `<Field>` primitive (`field.tsx`) for layout/markup
only — this replaces the older codegen'd `form.tsx` pattern. Actual form
logic is wired per-app with `useForm` + `Controller` from React Hook Form;
see `product-form-dialog.tsx` as the reference implementation (Zod schema
→ `zodResolver` → `defaultValuesFor()` helper → `useEffect` to re-seed on
open → mutation on submit → `toast.success`/`toast.error`).

## Theming

Colors are defined once as CSS variables in
`packages/ui/src/styles/globals.css` (OKLCH color space) — never hardcode
a Tailwind color class for brand colors. Light mode is pastel blue; dark
mode is a deeper navy background with a brighter, more saturated blue
accent (not a naive invert of the light palette — see the comment block
above `:root` in that file for the reasoning, including the
light-pastel-primary + dark-foreground button contrast decision). If a new
component needs a color not already covered by an existing CSS variable,
add the variable to `globals.css` rather than reaching for an arbitrary
Tailwind color.

## Running the project

```bash
npm install        # once, at repo root
npm run dev         # turbo dev — runs both apps in parallel (customer :3000, admin :3001)
npm run build        # turbo build
npm run lint          # turbo lint
npm run typecheck      # turbo typecheck
npm run format          # turbo format (prettier, with prettier-plugin-tailwindcss)
```

Each app has its own `.env.example` — copy to `.env.local` per app and set
`NEXT_PUBLIC_API_URL` to point at the Go backend before wiring real data.

## Deployment target

Both apps use `output: "standalone"` in `next.config.ts` (with
`outputFileTracingRoot` pointed at the repo root so the monorepo's
`packages/ui`/`packages/api-client` dependencies trace correctly) — this
targets **self-hosted Docker on a VPS**, not Vercel. Dockerfiles aren't
written yet. Planned domain layout: `bagastopup.com` (customer),
`admin.bagastopup.com` (admin), `api.bagastopup.com` (Go backend) — each
as an independently deployable container behind Caddy/Nginx.

## What's still dummy/unwired

- `apps/customer` — the entire app still runs on hardcoded data in
  `lib/dummy-data.ts`. No `packages/api-client` wiring yet. Product detail
  and checkout pages don't exist yet.
- `apps/admin` — Categories, Products, Sellers, Transactions, and auth are
  fully wired to the real API. Nothing else in admin is known to be
  outstanding as of this file's last update.

## Explicitly out of scope for this repo

- No direct database or RabbitMQ access — that's `be-bagastopup`'s job.
  This repo only ever talks to it over HTTP.
- Don't add a new state-management library, CSS-in-JS solution, or
  component library alongside shadcn/ui without discussing it first.