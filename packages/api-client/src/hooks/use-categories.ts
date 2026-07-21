import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import type { PaginatedResponse } from "@workspace/api-client/types/pagination"
import type { Category, CategoryInput } from "@workspace/api-client/types/category"

const categoriesQueryKey = ["categories"] as const

// See the matching comment in use-products.ts — GET /categories is
// paginated too, and this page has no pagination controls either.
const CATEGORIES_LIST_LIMIT = 100

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<Category>>(
        `/categories?limit=${CATEGORIES_LIST_LIMIT}`
      ),
    select: (response) => response.data,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CategoryInput) =>
      apiFetch<Category>("/categories", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: CategoryInput & { id: number }) =>
      apiFetch<Category>(`/categories/${id}`, { method: "PUT", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
    },
  })
}
