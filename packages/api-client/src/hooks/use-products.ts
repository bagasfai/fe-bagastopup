import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import type { PaginatedResponse } from "@workspace/api-client/types/pagination"
import type { Product, ProductInput } from "@workspace/api-client/types/product"

const productsQueryKey = ["products"] as const

// GET /products is paginated like every other list endpoint (see
// PaginatedResponse), but this page has no pagination controls — it's a
// flat management table. Asking for a generous limit keeps the whole
// catalog on one page instead of silently truncating at the backend's
// default of 20.
const PRODUCTS_LIST_LIMIT = 100

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<Product>>(
        `/products?limit=${PRODUCTS_LIST_LIMIT}`
      ),
    select: (response) => response.data,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProductInput) =>
      apiFetch<Product>("/products", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: ProductInput & { id: number }) =>
      apiFetch<Product>(`/products/${id}`, { method: "PUT", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}
