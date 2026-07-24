"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, type Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"

import type { ProductWithDetail, PromoCode } from "@/lib/product-detail-types"

import { BuyButton } from "./buy-button"
import { OrderSummary } from "./order-summary"
import { buildPurchaseSchema, defaultPurchaseValues, type PurchaseFormValues } from "./schema"
import { StepAccountFields } from "./step-account-fields"
import { StepPackages } from "./step-packages"
import { StepPayment } from "./step-payment"
import { StepPromo } from "./step-promo"
import { StickyMobileBar } from "./sticky-mobile-bar"

/**
 * Owns the single react-hook-form instance for the whole purchase flow
 * and hands it down via FormProvider — every step below reads/writes it
 * through useFormContext instead of prop-drilling `form`, and each step
 * only subscribes (register/Controller/useWatch) to the exact field(s) it
 * renders, so e.g. typing in the User ID field never re-renders the
 * package grid or the order summary.
 *
 * Promo code is deliberately NOT part of this form (see step-promo.tsx) —
 * it's lifted here as plain state only so OrderSummary/StickyMobileBar
 * can read the applied discount.
 */
function PurchaseForm({ product }: { product: ProductWithDetail }) {
  const schema = buildPurchaseSchema(product.inputFields)
  const form = useForm<PurchaseFormValues>({
    // The schema's exact key set is only known at runtime (it mirrors
    // `product.inputFields`), so zodResolver's inferred type can't line
    // up with the static PurchaseFormValues type — this cast bridges
    // that gap; the two are compatible in practice, every value is a
    // string either way.
    resolver: zodResolver(schema) as unknown as Resolver<PurchaseFormValues>,
    defaultValues: defaultPurchaseValues(product.inputFields),
    mode: "onTouched",
  })
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  async function onSubmit(values: PurchaseFormValues) {
    const selectedPackage = product.packages.find((pkg) => pkg.id === values.packageId)
    const selectedMethod = product.paymentMethodGroups
      .flatMap((group) => group.methods)
      .find((method) => method.id === values.paymentMethodId)

    // No backend yet — this is where the order-creation API call goes later.
    console.log("order submitted:", {
      productId: product.id,
      accountFields: values.accountFields,
      package: selectedPackage,
      paymentMethod: selectedMethod,
      promo: appliedPromo,
    })

    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success("Pesanan berhasil dibuat! Silakan selesaikan pembayaran.")
  }

  const submitForm = form.handleSubmit(onSubmit)

  return (
    <FormProvider {...form}>
      <div ref={sentinelRef} />
      <form onSubmit={submitForm} noValidate className="grid gap-4 pb-24 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-6 lg:pb-0">
        <div className="flex flex-col gap-4 lg:gap-6">
          <StepAccountFields fields={product.inputFields} />
          <StepPackages packages={product.packages} />
          <StepPayment groups={product.paymentMethodGroups} />
          <StepPromo promoCodes={product.promoCodes} onApply={setAppliedPromo} />
        </div>
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:gap-6">
          <OrderSummary product={product} appliedPromo={appliedPromo} />
          <BuyButton />
        </div>
      </form>
      <StickyMobileBar
        product={product}
        appliedPromo={appliedPromo}
        sentinelRef={sentinelRef}
        onBuyClick={submitForm}
      />
    </FormProvider>
  )
}

export { PurchaseForm }
