import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@workspace/api-client/client"
import type { PaginatedResponse } from "@workspace/api-client/types/pagination"
import type {
  Transaction,
  TransactionStatus,
} from "@workspace/api-client/types/transaction"

interface UseTransactionsParams {
  status?: TransactionStatus | "all"
  page?: number
  limit?: number
}

const transactionsQueryKeyBase = ["transactions"] as const

function transactionsQueryKey(params: UseTransactionsParams) {
  return [...transactionsQueryKeyBase, params] as const
}

// Unlike useSellers, this intentionally returns the full envelope (not
// just `.data`) — the Transactions page needs `meta.total`/`meta.page` to
// drive its Previous/Next controls, since pagination here is server-side.
export function useTransactions(params: UseTransactionsParams = {}) {
  const { status = "all", page = 1, limit = 20 } = params

  return useQuery({
    queryKey: transactionsQueryKey({ status, page, limit }),
    queryFn: () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (status !== "all") {
        query.set("status", status)
      }
      return apiFetch<PaginatedResponse<Transaction>>(`/transactions?${query}`)
    },
    placeholderData: (previousData) => previousData,
  })
}

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TransactionStatus }) =>
      apiFetch<Transaction>(`/transactions/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKeyBase })
    },
  })
}
