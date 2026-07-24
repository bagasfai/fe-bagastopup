"use client"

import { useFormContext, useWatch } from "react-hook-form"

import { Separator } from "@workspace/ui/components/separator"

import { formatIDR } from "@/lib/format"
import type { ProductWithDetail, PromoCode } from "@/lib/product-detail-types"

import { NumberedStepCard } from "./numbered-step-card"
import type { PurchaseFormValues } from "./schema"

/** Computes and returns { subtotal, adminFee, discount, total } for the currently selected package/payment/promo. */
function usePurchaseTotals(product: ProductWithDetail, appliedPromo: PromoCode | null) {
  const { control } = useFormContext<PurchaseFormValues>()
  const packageId = useWatch({ control, name: "packageId" })
  const paymentMethodId = useWatch({ control, name: "paymentMethodId" })

  const selectedPackage = product.packages.find((p) => p.id === packageId)
  const selectedMethod = product.paymentMethodGroups.flatMap((group) => group.methods).find((m) => m.id === paymentMethodId)

  const subtotal = selectedPackage?.priceIDR ?? 0
  const adminFee = selectedMethod?.feeIDR ?? 0

  let discount = 0
  if (appliedPromo && subtotal > 0) {
    discount = appliedPromo.discountPercent
      ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
      : (appliedPromo.discountIDR ?? 0)
  }

  const total = Math.max(subtotal + adminFee - discount, 0)

  return { selectedPackage, selectedMethod, subtotal, adminFee, discount, total }
}

/**
 * Only subscribes (via useWatch) to `packageId`/`paymentMethodId` — typing
 * into the account-ID fields elsewhere in the form does not re-render
 * this component, since useWatch scopes the subscription to those two
 * field names instead of the whole form.
 */
function OrderSummary({ product, appliedPromo }: { product: ProductWithDetail; appliedPromo: PromoCode | null }) {
  const { selectedPackage, selectedMethod, subtotal, adminFee, discount, total } = usePurchaseTotals(
    product,
    appliedPromo,
  )

  return (
    <NumberedStepCard step={5} title="Ringkasan Pesanan">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Produk</span>
          <span className="truncate text-right font-medium">{product.name}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Paket</span>
          <span className="truncate text-right font-medium">
            {selectedPackage ? selectedPackage.amountLabel : "Belum dipilih"}
          </span>
        </div>

        <Separator className="my-1" />

        <div className="flex justify-between">
          <span className="text-muted-foreground">Harga</span>
          <span>{formatIDR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Biaya Admin</span>
          <span>{selectedMethod ? formatIDR(adminFee) : "-"}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Diskon</span>
            <span>-{formatIDR(discount)}</span>
          </div>
        )}

        <Separator className="my-1" />

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-base font-semibold">Total</span>
          <span className="text-primary text-xl font-bold">{formatIDR(total)}</span>
        </div>
      </div>
    </NumberedStepCard>
  )
}

export { OrderSummary, usePurchaseTotals }
