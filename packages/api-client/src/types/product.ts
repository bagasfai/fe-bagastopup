import type { Category } from "@workspace/api-client/types/category"

export interface Product {
  id: number
  category_id: number
  name: string
  // sell_price is the customer-facing price in rupiah for this specific
  // nominal/denomination — see ADR-0001 in be-bagastopup for why this
  // lives on Product rather than Category.
  sell_price: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface ProductInput {
  category_id: number
  name: string
  sell_price: number
  is_active: boolean
}
