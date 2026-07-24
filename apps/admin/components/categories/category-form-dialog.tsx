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
  useCreateCategory,
  useUpdateCategory,
} from "@workspace/api-client/hooks/use-categories"
import { useUploadImage } from "@workspace/api-client/hooks/use-uploads"
import type { Category } from "@workspace/api-client/types/category"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  // Backend-controlled now (set from the /uploads response, not typed by
  // the admin) — still validated as a URL as a sanity check, but there's
  // no user-facing "invalid URL" error path anymore since it's never
  // hand-typed.
  logo_url: z.union([z.url("Must be a valid URL"), z.literal("")]),
  is_active: z.boolean(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function defaultValuesFor(category?: Category | null): CategoryFormValues {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    logo_url: category?.logo_url ?? "",
    is_active: category?.is_active ?? true,
  }
}

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const isEditing = !!category
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const uploadImage = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-fills the slug from the name while creating, until the user edits
  // the slug field directly — then it stops overwriting their input.
  const [slugTouched, setSlugTouched] = useState(isEditing)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValuesFor(category),
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValuesFor(category))
      setSlugTouched(!!category)
    }
  }, [open, category, form])

  const logoUrl = form.watch("logo_url")
  const isSubmitting = createCategory.isPending || updateCategory.isPending

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset so selecting the same file again still fires onChange.
    event.target.value = ""
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Logo must be 5MB or smaller." })
      return
    }

    uploadImage.mutate(
      { file, folder: "categories" },
      {
        onSuccess: (data) => {
          form.setValue("logo_url", data.url, { shouldValidate: true })
        },
        onError: (error: unknown) => {
          toast.error("Failed to upload logo", {
            description:
              error instanceof ApiError ? error.message : "Something went wrong.",
          })
        },
      }
    )
  }

  function onSubmit(values: CategoryFormValues) {
    const mutate = isEditing
      ? updateCategory.mutateAsync({ id: category.id, ...values })
      : createCategory.mutateAsync(values)

    mutate
      .then(() => {
        toast.success(`"${values.name}" ${isEditing ? "updated" : "added"}`)
        onOpenChange(false)
      })
      .catch((error: unknown) => {
        toast.error(
          isEditing ? "Failed to update category" : "Failed to create category",
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
          <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this category's details."
              : "Create a new game category."}
          </DialogDescription>
        </DialogHeader>
        <form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Category Name</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  placeholder="e.g. Mobile Legends"
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
                  placeholder="e.g. mobile-legends"
                  {...form.register("slug", {
                    onChange: () => setSlugTouched(true),
                  })}
                />
                <FieldError errors={[form.formState.errors.slug]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.logo_url}>
              <FieldLabel htmlFor="logo_upload">Logo (optional)</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className="rounded-lg">
                    <AvatarImage src={logoUrl || undefined} alt="" className="rounded-lg" />
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
                      : logoUrl
                        ? "Replace"
                        : "Upload"}
                  </Button>
                  {logoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => form.setValue("logo_url", "", { shouldValidate: true })}
                    >
                      <XIcon />
                      <span className="sr-only">Remove logo</span>
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="logo_upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <FieldError errors={[form.formState.errors.logo_url]} />
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
          <Button type="submit" form="category-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CategoryFormDialog }
