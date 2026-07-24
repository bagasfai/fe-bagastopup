"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { ApiError } from "@workspace/api-client/client"
import { useCategories } from "@workspace/api-client/hooks/use-categories"
import {
  useCreateProduct,
  useUpdateProduct,
} from "@workspace/api-client/hooks/use-products"
import type { Product } from "@workspace/api-client/types/product"

const productSchema = z.object({
  category_id: z.number().int().positive("Category is required"),
  name: z.string().min(1, "Product name is required").max(150),
  sell_price: z.number().int().positive("Sell price must be greater than 0"),
  is_active: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

function defaultValuesFor(product?: Product | null): ProductFormValues {
  return {
    category_id: product?.category_id ?? 0,
    name: product?.name ?? "",
    sell_price: product?.sell_price ?? 0,
    is_active: product?.is_active ?? true,
  }
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const isEditing = !!product
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValuesFor(product),
  })

  // Re-seed the form whenever the dialog opens for a (possibly different)
  // product, since the dialog instance is shared between create and edit.
  useEffect(() => {
    if (open) {
      form.reset(defaultValuesFor(product))
    }
  }, [open, product, form])

  const isSubmitting = createProduct.isPending || updateProduct.isPending

  function onSubmit(values: ProductFormValues) {
    const mutate = isEditing
      ? updateProduct.mutateAsync({ id: product.id, ...values })
      : createProduct.mutateAsync(values)

    mutate
      .then(() => {
        toast.success(`"${values.name}" ${isEditing ? "updated" : "added"}`)
        onOpenChange(false)
      })
      .catch((error: unknown) => {
        toast.error(
          isEditing ? "Failed to update product" : "Failed to create product",
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
          <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this product's category, name, or status."
              : "Create a new top-up product."}
          </DialogDescription>
        </DialogHeader>
        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.category_id}>
              <FieldLabel htmlFor="category_id">Game Category</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id="category_id" className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[form.formState.errors.category_id]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Product Name</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  placeholder="e.g. 86 Diamonds"
                  {...form.register("name")}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.sell_price}>
              <FieldLabel htmlFor="sell_price">Sell Price</FieldLabel>
              <FieldContent>
                <Input
                  id="sell_price"
                  type="number"
                  min={0}
                  step={1}
                  {...form.register("sell_price", { valueAsNumber: true })}
                />
                <FieldError errors={[form.formState.errors.sell_price]} />
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
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ProductFormDialog }
