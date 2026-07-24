export interface ProductReview {
  id: number
  category_id: number
  name: string
  rating: number
  comment: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductReviewInput {
  category_id: number
  name: string
  rating: number
  comment: string
  is_active: boolean
}
