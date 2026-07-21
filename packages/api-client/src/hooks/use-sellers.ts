import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import type { PaginatedResponse } from "@workspace/api-client/types/pagination"
import type { Seller, SellerInput } from "@workspace/api-client/types/seller"

interface UseSellersFilters {
  product_id?: number
}

// GET /sellers is paginated (see PaginatedResponse), but the Sellers page
// itself doesn't have pagination controls in this pass — it's a flat
// management table like Products/Categories. Asking for a generous limit
// keeps the whole list on one page for any realistic catalog size instead
// of silently truncating at the backend's default of 20.
const SELLERS_LIST_LIMIT = 100

function sellersQueryKey(filters: UseSellersFilters) {
  return ["sellers", filters] as const
}

export function useSellers(filters: UseSellersFilters = {}) {
  return useQuery({
    queryKey: sellersQueryKey(filters),
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(SELLERS_LIST_LIMIT) })
      if (filters.product_id) {
        params.set("product_id", String(filters.product_id))
      }
      return apiFetch<PaginatedResponse<Seller>>(`/sellers?${params}`)
    },
    select: (response) => response.data,
  })
}

export function useCreateSeller() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SellerInput) =>
      apiFetch<Seller>("/sellers", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] })
    },
  })
}

export function useUpdateSeller() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: SellerInput & { id: number }) =>
      apiFetch<Seller>(`/sellers/${id}`, { method: "PUT", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] })
    },
  })
}

export function useDeleteSeller() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/sellers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] })
    },
  })
}
