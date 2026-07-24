"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import type { Category } from "@workspace/api-client/types/category"
import { formatDateTime } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

interface CategoryColumnsOptions {
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  isDeleting: (id: number) => boolean
}

export function getCategoryColumns({
  onEdit,
  onDelete,
  isDeleting,
}: CategoryColumnsOptions): ColumnDef<Category>[] {
  return [
    {
      id: "logo",
      header: "",
      cell: ({ row }) => (
        <Avatar className="rounded-lg">
          <AvatarImage
            src={row.original.logo_url || undefined}
            alt=""
            className="rounded-lg"
          />
          <AvatarFallback className="rounded-lg">
            {row.original.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "name",
      header: "Category Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          {row.original.slug}
        </code>
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
