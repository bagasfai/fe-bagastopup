import type { Category } from "@workspace/api-client/types/category"

export interface Product {
  id: number
  category_id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface ProductInput {
  category_id: number
  name: string
  is_active: boolean
}
