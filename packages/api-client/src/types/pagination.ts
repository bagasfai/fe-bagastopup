// Shape of every paginated list endpoint's response envelope (sellers,
// transactions, …) — mirrors internal/handler/pagination.go's
// listResponse on the backend.
export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
