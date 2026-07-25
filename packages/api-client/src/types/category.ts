import type { CategoryGroup } from "@workspace/api-client/types/category-group"

export interface Category {
  id: number
  name: string
  slug: string
  logo_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Nullable: existing categories predate CategoryGroup and may have no
  // group assigned yet. See ADR-0002 in be-bagastopup.
  group_id: number | null
  group?: CategoryGroup
}

export interface CategoryInput {
  name: string
  slug: string
  logo_url: string
  is_active: boolean
  group_id: number | null
}
