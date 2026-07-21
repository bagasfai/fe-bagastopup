import type { Product } from "@workspace/api-client/types/product"

export interface Seller {
  id: number
  product_id: number
  seller_name: string
  buyer_sku_code: string
  cost_price: number
  is_primary: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  product?: Product
}

export interface SellerInput {
  product_id: number
  seller_name: string
  buyer_sku_code: string
  cost_price: number
  is_primary: boolean
  is_active: boolean
}
