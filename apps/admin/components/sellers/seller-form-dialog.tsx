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
  FieldDescription,
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
import { useProducts } from "@workspace/api-client/hooks/use-products"
import {
  useCreateSeller,
  useUpdateSeller,
} from "@workspace/api-client/hooks/use-sellers"
import type { Seller } from "@workspace/api-client/types/seller"

const sellerSchema = z.object({
  product_id: z.number().int().positive("Product is required"),
  seller_name: z.string().min(1, "Seller name is required").max(100),
  buyer_sku_code: z.string().min(1, "Buyer SKU code is required").max(100),
  cost_price: z.number().int().positive("Cost price must be greater than 0"),
  is_primary: z.boolean(),
  is_active: z.boolean(),
})

type SellerFormValues = z.infer<typeof sellerSchema>

function defaultValuesFor(seller?: Seller | null): SellerFormValues {
  return {
    product_id: seller?.product_id ?? 0,
    seller_name: seller?.seller_name ?? "",
    buyer_sku_code: seller?.buyer_sku_code ?? "",
    cost_price: seller?.cost_price ?? 0,
    is_primary: seller?.is_primary ?? false,
    is_active: seller?.is_active ?? true,
  }
}

interface SellerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seller?: Seller | null
}

function SellerFormDialog({ open, onOpenChange, seller }: SellerFormDialogProps) {
  const isEditing = !!seller
  const { data: products } = useProducts()
  const createSeller = useCreateSeller()
  const updateSeller = useUpdateSeller()

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: defaultValuesFor(seller),
  })

  // Re-seed the form whenever the dialog opens for a (possibly different)
  // seller, since the dialog instance is shared between create and edit.
  useEffect(() => {
    if (open) {
      form.reset(defaultValuesFor(seller))
    }
  }, [open, seller, form])

  const isSubmitting = createSeller.isPending || updateSeller.isPending

  function onSubmit(values: SellerFormValues) {
    const mutate = isEditing
      ? updateSeller.mutateAsync({ id: seller.id, ...values })
      : createSeller.mutateAsync(values)

    mutate
      .then(() => {
        toast.success(`"${values.seller_name}" ${isEditing ? "updated" : "added"}`)
        onOpenChange(false)
      })
      .catch((error: unknown) => {
        toast.error(
          isEditing ? "Failed to update seller" : "Failed to create seller",
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
          <DialogTitle>{isEditing ? "Edit Seller" : "Add Seller"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this seller's product, pricing, or status."
              : "Configure a new supplier for a product."}
          </DialogDescription>
        </DialogHeader>
        <form id="seller-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.product_id}>
              <FieldLabel htmlFor="product_id">Product</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id="product_id" className="w-full">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={String(product.id)}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[form.formState.errors.product_id]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.seller_name}>
              <FieldLabel htmlFor="seller_name">Seller Name</FieldLabel>
              <FieldContent>
                <Input
                  id="seller_name"
                  placeholder="e.g. Digiflazz"
                  {...form.register("seller_name")}
                />
                <FieldError errors={[form.formState.errors.seller_name]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.buyer_sku_code}>
              <FieldLabel htmlFor="buyer_sku_code">Buyer SKU Code</FieldLabel>
              <FieldContent>
                <Input
                  id="buyer_sku_code"
                  placeholder="e.g. mldl86"
                  {...form.register("buyer_sku_code")}
                />
                <FieldError errors={[form.formState.errors.buyer_sku_code]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.cost_price}>
              <FieldLabel htmlFor="cost_price">Cost Price</FieldLabel>
              <FieldContent>
                <Input
                  id="cost_price"
                  type="number"
                  min={0}
                  step={1}
                  {...form.register("cost_price", { valueAsNumber: true })}
                />
                <FieldError errors={[form.formState.errors.cost_price]} />
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="is_primary">Primary Seller</FieldLabel>
              <Controller
                control={form.control}
                name="is_primary"
                render={({ field }) => (
                  <Switch
                    id="is_primary"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>
            <FieldDescription className="-mt-3">
              Marking this seller as primary automatically unsets any other
              primary seller for the same product — if another row&apos;s badge
              changes after saving, that&apos;s why.
            </FieldDescription>
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
          <Button type="submit" form="seller-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Seller"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { SellerFormDialog }
