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
  useDeleteProduct,
  useProducts,
} from "@workspace/api-client/hooks/use-products"
import type { Product } from "@workspace/api-client/types/product"
import { getProductColumns } from "@/components/products/columns"
import { ProductFormDialog } from "@/components/products/product-form-dialog"

type StatusFilter = "all" | "active" | "inactive"

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: products, isLoading, isError, error, refetch } = useProducts()
  const deleteProduct = useDeleteProduct()

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return (products ?? []).filter((product) => {
      const matchesStatus =
        status === "all" ||
        (status === "active" ? product.is_active : !product.is_active)
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.category?.name.toLowerCase().includes(query) ?? false)

      return matchesStatus && matchesQuery
    })
  }, [products, search, status])

  function handleAdd() {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    (product: Product) => {
      if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) {
        return
      }

      setDeletingId(product.id)
      deleteProduct.mutate(product.id, {
        onSuccess: () => {
          toast.success(`"${product.name}" deleted`)
        },
        onError: (err: unknown) => {
          toast.error("Failed to delete product", {
            description: err instanceof ApiError ? err.message : "Something went wrong.",
          })
        },
        onSettled: () => {
          setDeletingId(null)
        },
      })
    },
    [deleteProduct]
  )

  const columns = useMemo(
    () =>
      getProductColumns({
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
              placeholder="Search products…"
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
          Add Product
        </Button>
      </div>
      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl py-16 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load products."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredProducts}
          isLoading={isLoading}
          emptyMessage="No products match your filters."
        />
      )}
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
      />
    </div>
  )
}
