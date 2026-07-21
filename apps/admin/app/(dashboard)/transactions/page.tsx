"use client"

import { useCallback, useMemo, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { DataTable } from "@workspace/ui/components/data-table"
import { ApiError } from "@workspace/api-client/client"
import {
  useTransactions,
  useUpdateTransactionStatus,
} from "@workspace/api-client/hooks/use-transactions"
import type {
  Transaction,
  TransactionStatus,
} from "@workspace/api-client/types/transaction"
import { getTransactionColumns } from "@/components/transactions/columns"

type StatusFilter = "all" | TransactionStatus

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
]

const PAGE_LIMIT = 20

export default function TransactionsPage() {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions({ status, page, limit: PAGE_LIMIT })
  const updateStatus = useUpdateTransactionStatus()

  const transactions = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1

  function handleStatusFilterChange(value: string) {
    setStatus(value as StatusFilter)
    setPage(1)
  }

  const handleUpdateStatus = useCallback(
    (transaction: Transaction, nextStatus: TransactionStatus) => {
      if (
        !window.confirm(
          `Change ${transaction.invoice_id} from "${transaction.status}" to "${nextStatus}"? This overrides the transaction manually.`
        )
      ) {
        return
      }

      setUpdatingId(transaction.id)
      updateStatus.mutate(
        { id: transaction.id, status: nextStatus },
        {
          onSuccess: () => {
            toast.success(`${transaction.invoice_id} marked as ${nextStatus}`)
          },
          onError: (err: unknown) => {
            toast.error("Failed to update transaction status", {
              description:
                err instanceof ApiError ? err.message : "Something went wrong.",
            })
          },
          onSettled: () => {
            setUpdatingId(null)
          },
        }
      )
    },
    [updateStatus]
  )

  const columns = useMemo(
    () =>
      getTransactionColumns({
        onUpdateStatus: handleUpdateStatus,
        isUpdating: (id) => updatingId === id,
      }),
    [updatingId, handleUpdateStatus]
  )

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={status} onValueChange={handleStatusFilterChange}>
        <TabsList className="w-full sm:w-fit">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl py-16 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load transactions."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={transactions}
            isLoading={isLoading}
            pageSize={PAGE_LIMIT}
            emptyMessage="No transactions match this filter."
          />
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Page {meta.page} of {totalPages} · {meta.total} total
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeftIcon />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                >
                  <ChevronRightIcon />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
