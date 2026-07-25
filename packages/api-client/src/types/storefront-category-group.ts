import type { Category } from "@workspace/api-client/types/category"
import type { CategoryGroup } from "@workspace/api-client/types/category-group"

/**
 * Response shape of the public GET /storefront/category-groups endpoint
 * (see ADR-0002 in be-bagastopup and
 * CategoryGroupRepository.FindAllActiveWithCategories) — every active
 * group with its active Categories preloaded, so apps/customer's
 * "Semua Produk" section can render one tab per group and one game card
 * per category without a second round trip.
 *
 * `categories` is always present here (unlike the optional field on the
 * plain CategoryGroup type used by admin CRUD), since this endpoint's
 * entire purpose is returning it preloaded. Includes a synthetic
 * "Lainnya" (id: 0) group for any active Category with no group assigned
 * yet — never persisted, only ever appears in this response.
 */
export interface StorefrontCategoryGroup extends CategoryGroup {
  categories: Category[]
}
