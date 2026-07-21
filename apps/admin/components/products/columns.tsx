"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import type { Product } from "@workspace/api-client/types/product"
import { formatDateTime } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

interface ProductColumnsOptions {
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  isDeleting: (id: number) => boolean
}

export function getProductColumns({
  onEdit,
  onDelete,
  isDeleting,
}: ProductColumnsOptions): ColumnDef<Product>[] {
  return [
    {
      id: "category",
      header: "Game Category",
      cell: ({ row }) => row.original.category?.name ?? `#${row.original.category_id}`,
    },
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? "active" : "inactive"} />
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Last Updated",
      cell: ({ row }) => formatDateTime(row.original.updated_at),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
          >
            <PencilIcon />
            <span className="sr-only">Edit {row.original.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isDeleting(row.original.id)}
            onClick={() => onDelete(row.original)}
          >
            <Trash2Icon />
            <span className="sr-only">Delete {row.original.name}</span>
          </Button>
        </div>
      ),
    },
  ]
}
