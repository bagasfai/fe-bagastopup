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
  useCategories,
  useDeleteCategory,
} from "@workspace/api-client/hooks/use-categories"
import type { Category } from "@workspace/api-client/types/category"
import { getCategoryColumns } from "@/components/categories/columns"
import { CategoryFormDialog } from "@/components/categories/category-form-dialog"

type StatusFilter = "all" | "active" | "inactive"

export default function CategoriesPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: categories, isLoading, isError, error, refetch } = useCategories()
  const deleteCategory = useDeleteCategory()

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()

    return (categories ?? []).filter((category) => {
      const matchesStatus =
        status === "all" ||
        (status === "active" ? category.is_active : !category.is_active)
      const matchesQuery =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [categories, search, status])

  function handleAdd() {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    (category: Category) => {
      if (!window.confirm(`Delete "${category.name}"? This can't be undone.`)) {
        return
      }

      setDeletingId(category.id)
      deleteCategory.mutate(category.id, {
        onSuccess: () => {
          toast.success(`"${category.name}" deleted`)
        },
        onError: (err: unknown) => {
          toast.error("Failed to delete category", {
            description: err instanceof ApiError ? err.message : "Something went wrong.",
          })
        },
        onSettled: () => {
          setDeletingId(null)
        },
      })
    },
    [deleteCategory]
  )

  const columns = useMemo(
    () =>
      getCategoryColumns({
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
              placeholder="Search categories…"
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
          Add Category
        </Button>
      </div>
      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl py-16 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load categories."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          isLoading={isLoading}
          emptyMessage="No categories match your filters."
        />
      )}
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  )
}
