import type { Category } from "@workspace/api-client/types/category"
import type { CategoryDetail } from "@workspace/api-client/types/category-detail"
import type { Product } from "@workspace/api-client/types/product"
import type { ProductReview } from "@workspace/api-client/types/product-review"

/**
 * Response shape of the public GET /storefront/categories/:slug
 * endpoint (see ADR-0001 in be-bagastopup and
 * CategoryRepository.FindBySlugWithDetail) — a Category with its
 * optional detail content, active Products (packages/pricing), and
 * active Reviews composed into one response so the customer product
 * detail page doesn't make 3+ separate calls.
 *
 * `products` deliberately never includes `sellers` — Seller.CostPrice
 * is internal cost data and this endpoint is unauthenticated.
 */
export interface StorefrontCategory extends Category {
  detail?: CategoryDetail
  products?: Product[]
  reviews?: ProductReview[]
}
