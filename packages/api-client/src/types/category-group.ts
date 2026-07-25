import type { Category } from "@workspace/api-client/types/category"

// The broad storefront grouping shown above Category on the customer
// homepage ("Mobile Game" / "Voucher" / "Entertainment") — see ADR-0002
// in be-bagastopup for why this is a separate resource rather than
// repurposing Category itself.
export interface CategoryGroup {
  id: number
  name: string
  slug: string
  icon_url: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Only present when the caller preloads it (e.g. the storefront read) —
  // admin CRUD list/detail responses omit this, same "omitempty" lazy-load
  // convention as be-bagastopup's Category.Products.
  categories?: Category[]
}

export interface CategoryGroupInput {
  name: string
  slug: string
  icon_url: string
  sort_order: number
  is_active: boolean
}
