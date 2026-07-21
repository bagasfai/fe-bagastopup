"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import type {
  Transaction,
  TransactionStatus,
} from "@workspace/api-client/types/transaction"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

const allStatuses: TransactionStatus[] = [
  "pending",
  "processing",
  "success",
  "failed",
]

interface TransactionColumnsOptions {
  onUpdateStatus: (transaction: Transaction, status: TransactionStatus) => void
  isUpdating: (id: number) => boolean
}

export function getTransactionColumns({
  onUpdateStatus,
  isUpdating,
}: TransactionColumnsOptions): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "invoice_id",
      header: "Invoice ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.invoice_id}</span>
      ),
    },
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => row.original.product?.name ?? `#${row.original.product_id}`,
    },
    {
      accessorKey: "customer_game_id",
      header: "Customer Game ID",
    },
    {
      accessorKey: "sell_price",
      header: "Sell Price",
      cell: ({ row }) => formatCurrency(row.original.sell_price),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isUpdating(row.original.id)}
              >
                <MoreHorizontalIcon />
                <span className="sr-only">
                  Update status for {row.original.invoice_id}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Set status to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allStatuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  disabled={status === row.original.status}
                  onClick={() => onUpdateStatus(row.original, status)}
                  className="capitalize"
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
