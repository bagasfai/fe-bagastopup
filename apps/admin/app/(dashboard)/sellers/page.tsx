"use client"

import { useCallback, useMemo, useState } from "react"
import { PlusIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"
import { DataTable } from "@workspace/ui/components/data-table"
import { ApiError } from "@workspace/api-client/client"
import {
  useDeleteSeller,
  useSellers,
} from "@workspace/api-client/hooks/use-sellers"
import type { Seller } from "@workspace/api-client/types/seller"
import { getSellerColumns } from "@/components/sellers/columns"
import { SellerFormDialog } from "@/components/sellers/seller-form-dialog"

type StatusFilter = "all" | "active" | "inactive"

export default function SellersPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: sellers, isLoading, isError, error, refetch } = useSellers()
  const deleteSeller = useDeleteSeller()

  const filteredSellers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return (sellers ?? []).filter((seller) => {
      const matchesStatus =
        status === "all" ||
        (status === "active" ? seller.is_active : !seller.is_active)
      const matchesQuery =
        !query ||
        seller.seller_name.toLowerCase().includes(query) ||
        seller.buyer_sku_code.toLowerCase().includes(query) ||
        (seller.product?.name.toLowerCase().includes(query) ?? false)

      return matchesStatus && matchesQuery
    })
  }, [sellers, search, status])

  function handleAdd() {
    setEditingSeller(null)
    setDialogOpen(true)
  }

  const handleEdit = useCallback((seller: Seller) => {
    setEditingSeller(seller)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    (seller: Seller) => {
      if (
        !window.confirm(`Delete "${seller.seller_name}"? This can't be undone.`)
      ) {
        return
      }

      setDeletingId(seller.id)
      deleteSeller.mutate(seller.id, {
        onSuccess: () => {
          toast.success(`"${seller.seller_name}" deleted`)
        },
        onError: (err: unknown) => {
          toast.error("Failed to delete seller", {
            description: err instanceof ApiError ? err.message : "Something went wrong.",
          })
        },
        onSettled: () => {
          setDeletingId(null)
        },
      })
    },
    [deleteSeller]
  )

  const columns = useMemo(
    () =>
      getSellerColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        isDeleting: (id) => deletingId === id,
      }),
    [deletingId, handleEdit, handleDelete]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sellers…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd}>
          <PlusIcon />
          Add Seller
        </Button>
      </div>
      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl py-16 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load sellers."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSellers}
          isLoading={isLoading}
          emptyMessage="No sellers match your filters."
        />
      )}
      <SellerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        seller={editingSeller}
      />
    </div>
  )
}
