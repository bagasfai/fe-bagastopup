import type { Product } from "@workspace/api-client/types/product"
import type { Seller } from "@workspace/api-client/types/seller"

export type TransactionStatus = "pending" | "processing" | "success" | "failed"

export interface Transaction {
  id: number
  invoice_id: string
  product_id: number
  seller_id?: number | null
  customer_game_id: string
  customer_server?: string | null
  sell_price: number
  status: TransactionStatus
  payment_method: string
  created_at: string
  updated_at: string
  product?: Product
  seller?: Seller
}
