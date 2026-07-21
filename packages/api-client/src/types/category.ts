export interface Category {
  id: number
  name: string
  slug: string
  logo_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CategoryInput {
  name: string
  slug: string
  logo_url: string
  is_active: boolean
}
