# fe-bagastopup

Turborepo monorepo for the BagasTopup game top-up reseller frontend. Two Next.js
apps share a common UI package so the customer site and the admin dashboard stay
visually consistent without duplicating components.

```
apps/
  customer/   # customer-facing site — http://localhost:3000
  admin/      # admin dashboard        — http://localhost:3001
packages/
  ui/                  # shared shadcn/ui components (@workspace/ui)
  eslint-config/        # shared ESLint config
  typescript-config/    # shared tsconfig base
```

## Install

```bash
npm install
```

Run once at the repo root — npm workspaces links `apps/*` and `packages/*`
together, so there's no need to install inside each app individually.

## Develop

```bash
npm run dev
```

Runs `turbo dev`, which starts both apps in parallel:

- `customer` on [http://localhost:3000](http://localhost:3000)
- `admin` on [http://localhost:3001](http://localhost:3001)

Each app also has an `.env.example` — copy it to `.env.local` in the
respective app folder and point `NEXT_PUBLIC_API_URL` at your backend before
you need real API data.

## Adding a shared UI component

Shared components live in `packages/ui/src/components` and are consumed as
`@workspace/ui/components/<name>`. To add a new shadcn/ui component, run the
shadcn CLI from the **monorepo root**, targeting the `ui` package with `-c`:

```bash
npx shadcn@latest add <component> -c packages/ui
```

This installs the component (and its dependencies) into `packages/ui`, not
into an individual app — so both `customer` and `admin` can import it
immediately:

```tsx
import { Button } from "@workspace/ui/components/button"
```

Do **not** run `shadcn add` from inside `apps/customer` or `apps/admin` for
shared components — that would install a duplicate copy local to that app
instead of the shared package.

## Other commands

```bash
npm run build       # turbo build — builds both apps
npm run lint         # turbo lint
npm run typecheck    # turbo typecheck
```

## Notes on the stack

- **next-themes** — theme provider lives in each app (`apps/*/components/theme-provider.tsx`)
  since dark-mode defaults can differ per app, but the `sonner` toaster in
  `packages/ui` also reads the active theme so toasts stay in sync.
- **TanStack Query** — `QueryClientProvider` is set up per app
  (`apps/*/components/query-provider.tsx`) since query defaults/devtools are
  typically app-specific.
- **TanStack Table** — installed in `packages/ui` alongside the shared
  `table.tsx` primitive; build data tables using `@tanstack/react-table` plus
  `@workspace/ui/components/table`.
- **React Hook Form + Zod** — the shared `field.tsx` component in
  `packages/ui` provides layout/markup only; forms are wired up per app with
  `useForm` + `Controller`, following the current shadcn/ui form guidance
  (the old codegen'd `form.tsx` has been superseded by this `<Field>` pattern
  upstream).
- **Framer Motion** — installed per app for page/feature-level animation.

## Deployment

Both apps are configured with `output: "standalone"` in `next.config.ts`
(with `outputFileTracingRoot` pointed at the repo root so the monorepo's
`packages/ui` dependency is traced correctly) — this produces a minimal,
self-contained build for Docker. Dockerfiles aren't set up yet; that's a
separate step.
