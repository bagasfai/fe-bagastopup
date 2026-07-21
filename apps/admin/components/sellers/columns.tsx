"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import type { Seller } from "@workspace/api-client/types/seller"
import { formatCurrency } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

interface SellerColumnsOptions {
  onEdit: (seller: Seller) => void
  onDelete: (seller: Seller) => void
  isDeleting: (id: number) => boolean
}

export function getSellerColumns({
  onEdit,
  onDelete,
  isDeleting,
}: SellerColumnsOptions): ColumnDef<Seller>[] {
  return [
    {
      accessorKey: "seller_name",
      header: "Seller Name",
    },
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => row.original.product?.name ?? `#${row.original.product_id}`,
    },
    {
      accessorKey: "buyer_sku_code",
      header: "Buyer SKU Code",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          {row.original.buyer_sku_code}
        </code>
      ),
    },
    {
      accessorKey: "cost_price",
      header: "Cost Price",
      cell: ({ row }) => formatCurrency(row.original.cost_price),
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge
          variant={row.original.is_primary ? "default" : "outline"}
          className="capitalize"
        >
          {row.original.is_primary ? "Primary" : "Backup"}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? "active" : "inactive"} />
      ),
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
            <span className="sr-only">Edit {row.original.seller_name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isDeleting(row.original.id)}
            onClick={() => onDelete(row.original)}
          >
            <Trash2Icon />
            <span className="sr-only">Delete {row.original.seller_name}</span>
          </Button>
        </div>
      ),
    },
  ]
}
