import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import type { StorefrontCategory } from "@workspace/api-client/types/storefront-category"

/**
 * fetchStorefrontCategoryBySlug is a plain async function, not a hook —
 * apps/customer's product detail page calls it directly from an async
 * Server Component (for SSR + generateMetadata), which is the first
 * place in this codebase apiFetch is used outside a React Query hook.
 * That's safe here specifically because this is the one public,
 * unauthenticated GET route in the API: apiFetch reads the auth store's
 * token (always null during SSR, no localStorage on the server) and
 * only attaches it if present, so an anonymous server-side call behaves
 * the same as an anonymous browser call — there's no session state this
 * route depends on either way.
 */
export function fetchStorefrontCategoryBySlug(slug: string) {
  return apiFetch<StorefrontCategory>(`/storefront/categories/${slug}`)
}

/**
 * useStorefrontCategory exists for any future client-side usage (e.g.
 * revalidating price/stock without a full page reload) — not currently
 * called anywhere, since the product detail page fetches server-side
 * for SEO. Kept here so this resource still has the same hook-per-file
 * shape as every other resource in this package.
 */
export function useStorefrontCategory(slug: string) {
  return useQuery({
    queryKey: ["storefront-category", slug],
    queryFn: () => fetchStorefrontCategoryBySlug(slug),
    enabled: slug.length > 0,
  })
}

/**
 * fetchStorefrontCategories powers apps/customer's homepage (popular
 * games strip + full catalog grouped by game) — same public,
 * unauthenticated story as fetchStorefrontCategoryBySlug above, but
 * returns every active category with its active Products preloaded in
 * one call instead of a single category by slug. Called directly from
 * the homepage Server Component for the same SSR-safety reason.
 */
export function fetchStorefrontCategories() {
  return apiFetch<StorefrontCategory[]>("/storefront/categories")
}

/**
 * useStorefrontCategories exists for the same "future client-side
 * usage" reason as useStorefrontCategory above — the homepage itself
 * fetches server-side via fetchStorefrontCategories directly.
 */
export function useStorefrontCategories() {
  return useQuery({
    queryKey: ["storefront-categories"],
    queryFn: fetchStorefrontCategories,
  })
}
