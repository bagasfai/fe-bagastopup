"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import type { CategoryGroup } from "@workspace/api-client/types/category-group"
import { formatDateTime } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

interface CategoryGroupColumnsOptions {
  onEdit: (group: CategoryGroup) => void
  onDelete: (group: CategoryGroup) => void
  isDeleting: (id: number) => boolean
}

export function getCategoryGroupColumns({
  onEdit,
  onDelete,
  isDeleting,
}: CategoryGroupColumnsOptions): ColumnDef<CategoryGroup>[] {
  return [
    {
      id: "icon",
      header: "",
      cell: ({ row }) => (
        <Avatar className="rounded-lg">
          <AvatarImage
            src={row.original.icon_url || undefined}
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
      header: "Group Name",
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
      accessorKey: "sort_order",
      header: "Sort Order",
      // Right-align via a numeric-looking cell rather than a header-only
      // class, so header and value line up the same way TanStack Table
      // renders every other plain numeric column in this app.
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.sort_order}</span>
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
