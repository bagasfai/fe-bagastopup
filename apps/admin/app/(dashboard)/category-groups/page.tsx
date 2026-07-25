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
  useCategoryGroups,
  useDeleteCategoryGroup,
} from "@workspace/api-client/hooks/use-category-groups"
import type { CategoryGroup } from "@workspace/api-client/types/category-group"
import { getCategoryGroupColumns } from "@/components/category-groups/columns"
import { CategoryGroupFormDialog } from "@/components/category-groups/category-group-form-dialog"

type StatusFilter = "all" | "active" | "inactive"

export default function CategoryGroupsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<CategoryGroup | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: groups, isLoading, isError, error, refetch } = useCategoryGroups()
  const deleteCategoryGroup = useDeleteCategoryGroup()

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase()

    return (groups ?? []).filter((group) => {
      const matchesStatus =
        status === "all" ||
        (status === "active" ? group.is_active : !group.is_active)
      const matchesQuery =
        !query ||
        group.name.toLowerCase().includes(query) ||
        group.slug.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [groups, search, status])

  function handleAdd() {
    setEditingGroup(null)
    setDialogOpen(true)
  }

  const handleEdit = useCallback((group: CategoryGroup) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    (group: CategoryGroup) => {
      if (!window.confirm(`Delete "${group.name}"? This can't be undone.`)) {
        return
      }

      setDeletingId(group.id)
      deleteCategoryGroup.mutate(group.id, {
        onSuccess: () => {
          toast.success(`"${group.name}" deleted`)
        },
        onError: (err: unknown) => {
          toast.error("Failed to delete group", {
            description: err instanceof ApiError ? err.message : "Something went wrong.",
          })
        },
        onSettled: () => {
          setDeletingId(null)
        },
      })
    },
    [deleteCategoryGroup]
  )

  const columns = useMemo(
    () =>
      getCategoryGroupColumns({
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
              placeholder="Search category groups…"
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
          Add Group
        </Button>
      </div>
      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl py-16 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load category groups."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredGroups}
          isLoading={isLoading}
          emptyMessage="No category groups match your filters."
        />
      )}
      <CategoryGroupFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        group={editingGroup}
      />
    </div>
  )
}
