"use client"

import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { ImageUpIcon, XIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Switch } from "@workspace/ui/components/switch"
import { ApiError } from "@workspace/api-client/client"
import {
  useCreateCategoryGroup,
  useUpdateCategoryGroup,
} from "@workspace/api-client/hooks/use-category-groups"
import { useUploadImage } from "@workspace/api-client/hooks/use-uploads"
import type { CategoryGroup } from "@workspace/api-client/types/category-group"

const categoryGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  // Same "backend-controlled, set from the /uploads response" story as
  // Category.logo_url — see category-form-dialog.tsx.
  icon_url: z.union([z.url("Must be a valid URL"), z.literal("")]),
  sort_order: z.number().int("Must be a whole number"),
  is_active: z.boolean(),
})

type CategoryGroupFormValues = z.infer<typeof categoryGroupSchema>

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function defaultValuesFor(group?: CategoryGroup | null): CategoryGroupFormValues {
  return {
    name: group?.name ?? "",
    slug: group?.slug ?? "",
    icon_url: group?.icon_url ?? "",
    sort_order: group?.sort_order ?? 0,
    is_active: group?.is_active ?? true,
  }
}

interface CategoryGroupFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: CategoryGroup | null
}

function CategoryGroupFormDialog({
  open,
  onOpenChange,
  group,
}: CategoryGroupFormDialogProps) {
  const isEditing = !!group
  const createCategoryGroup = useCreateCategoryGroup()
  const updateCategoryGroup = useUpdateCategoryGroup()
  const uploadImage = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-fills the slug from the name while creating, until the user edits
  // the slug field directly — then it stops overwriting their input. Same
  // pattern as CategoryFormDialog.
  const [slugTouched, setSlugTouched] = useState(isEditing)

  const form = useForm<CategoryGroupFormValues>({
    resolver: zodResolver(categoryGroupSchema),
    defaultValues: defaultValuesFor(group),
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValuesFor(group))
      setSlugTouched(!!group)
    }
  }, [open, group, form])

  const iconUrl = form.watch("icon_url")
  const isSubmitting = createCategoryGroup.isPending || updateCategoryGroup.isPending

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset so selecting the same file again still fires onChange.
    event.target.value = ""
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Icon must be 5MB or smaller." })
      return
    }

    uploadImage.mutate(
      { file, folder: "category-groups" },
      {
        onSuccess: (data) => {
          form.setValue("icon_url", data.url, { shouldValidate: true })
        },
        onError: (error: unknown) => {
          toast.error("Failed to upload icon", {
            description:
              error instanceof ApiError ? error.message : "Something went wrong.",
          })
        },
      }
    )
  }

  function onSubmit(values: CategoryGroupFormValues) {
    const mutate = isEditing
      ? updateCategoryGroup.mutateAsync({ id: group.id, ...values })
      : createCategoryGroup.mutateAsync(values)

    mutate
      .then(() => {
        toast.success(`"${values.name}" ${isEditing ? "updated" : "added"}`)
        onOpenChange(false)
      })
      .catch((error: unknown) => {
        toast.error(
          isEditing ? "Failed to update group" : "Failed to create group",
          {
            description:
              error instanceof ApiError ? error.message : "Something went wrong.",
          }
        )
      })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) form.reset()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category Group" : "Add Category Group"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this group's details."
              : "Create a new storefront grouping, e.g. \"Mobile Game\" or \"Voucher\"."}
          </DialogDescription>
        </DialogHeader>
        <form id="category-group-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Group Name</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  placeholder="e.g. Mobile Game"
                  {...form.register("name", {
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                      if (!slugTouched) {
                        form.setValue("slug", slugify(event.target.value), {
                          shouldValidate: true,
                        })
                      }
                    },
                  })}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <FieldContent>
                <Input
                  id="slug"
                  placeholder="e.g. mobile-game"
                  {...form.register("slug", {
                    onChange: () => setSlugTouched(true),
                  })}
                />
                <FieldError errors={[form.formState.errors.slug]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.icon_url}>
              <FieldLabel htmlFor="icon_upload">Icon (optional)</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className="rounded-lg">
                    <AvatarImage src={iconUrl || undefined} alt="" className="rounded-lg" />
                    <AvatarFallback className="rounded-lg">
                      {form.watch("name").slice(0, 1).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadImage.isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageUpIcon />
                    {uploadImage.isPending
                      ? "Uploading…"
                      : iconUrl
                        ? "Replace"
                        : "Upload"}
                  </Button>
                  {iconUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => form.setValue("icon_url", "", { shouldValidate: true })}
                    >
                      <XIcon />
                      <span className="sr-only">Remove icon</span>
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="icon_upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <FieldError errors={[form.formState.errors.icon_url]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.sort_order}>
              <FieldLabel htmlFor="sort_order">Sort Order</FieldLabel>
              <FieldContent>
                <Input
                  id="sort_order"
                  type="number"
                  step={1}
                  placeholder="0"
                  {...form.register("sort_order", { valueAsNumber: true })}
                />
                <FieldError errors={[form.formState.errors.sort_order]} />
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="is_active">Active</FieldLabel>
              <Controller
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <Switch
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="category-group-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CategoryGroupFormDialog }
