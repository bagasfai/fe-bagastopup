import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import type { PaginatedResponse } from "@workspace/api-client/types/pagination"
import type {
  CategoryGroup,
  CategoryGroupInput,
} from "@workspace/api-client/types/category-group"

const categoryGroupsQueryKey = ["category-groups"] as const

// See the matching comment in use-categories.ts — GET /category-groups is
// paginated too, and this page has no pagination controls either (there
// are only ever a handful of storefront groups).
const CATEGORY_GROUPS_LIST_LIMIT = 100

export function useCategoryGroups() {
  return useQuery({
    queryKey: categoryGroupsQueryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<CategoryGroup>>(
        `/category-groups?limit=${CATEGORY_GROUPS_LIST_LIMIT}`
      ),
    select: (response) => response.data,
  })
}

export function useCreateCategoryGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CategoryGroupInput) =>
      apiFetch<CategoryGroup>("/category-groups", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryGroupsQueryKey })
    },
  })
}

export function useUpdateCategoryGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: CategoryGroupInput & { id: number }) =>
      apiFetch<CategoryGroup>(`/category-groups/${id}`, { method: "PUT", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryGroupsQueryKey })
    },
  })
}

export function useDeleteCategoryGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/category-groups/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryGroupsQueryKey })
    },
  })
}
