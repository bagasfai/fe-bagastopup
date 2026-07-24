/**
 * Mirrors be-bagastopup's domain.CategoryDetail (see ADR-0001). The
 * jsonb content fields are typed loosely here (`unknown[]`) rather than
 * with their precise shape, since this raw type is meant to match the
 * wire format exactly — callers that know the exact shape (the
 * customer product detail page) narrow/validate them at the point of
 * use instead of this shared type baking in a frontend-specific
 * structure.
 */
export interface CategoryDetail {
  id: number
  category_id: number
  hero_image_url: string
  short_description: string
  input_fields: unknown[]
  description_sections: unknown[]
  how_to_steps: unknown[]
  important_notes: unknown[]
  faq: unknown[]
  info_highlights: unknown[]
  created_at: string
  updated_at: string
}

export interface CategoryDetailInput {
  hero_image_url: string
  short_description: string
  input_fields: unknown[]
  description_sections: unknown[]
  how_to_steps: unknown[]
  important_notes: unknown[]
  faq: unknown[]
  info_highlights: unknown[]
}
