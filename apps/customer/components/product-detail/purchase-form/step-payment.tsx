"use client"

import { memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2Icon } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

import { FieldError } from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"

import { PaymentMethodIcon } from "@/components/product-detail/payment-method-icon"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { formatFee } from "@/lib/format"
import { EASE_OUT } from "@/lib/motion"
import type { PaymentMethod, PaymentMethodGroup } from "@/lib/product-detail-types"

import { NumberedStepCard } from "./numbered-step-card"
import type { PurchaseFormValues } from "./schema"

const PaymentMethodCard = memo(function PaymentMethodCard({
  method,
  selected,
  onSelect,
}: {
  method: PaymentMethod
  selected: boolean
  onSelect: (id: string) => void
}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <button
      type="button"
      onClick={() => onSelect(method.id)}
      aria-pressed={selected}
      className={cn(
        "border-border flex min-h-14 items-center gap-3 rounded-xl border p-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5 ring-primary ring-1" : "hover:border-primary/50",
      )}
    >
      <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
        <PaymentMethodIcon iconKey={method.iconKey} className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{method.name}</span>
        <span className="text-muted-foreground text-xs">{formatFee(method.feeIDR)}</span>
      </span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="shrink-0"
          >
            <CheckCircle2Icon className="text-primary size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
})

function StepPayment({ groups }: { groups: PaymentMethodGroup[] }) {
  const form = useFormContext<PurchaseFormValues>()

  if (groups.length === 0) {
    return (
      <NumberedStepCard step={3} title="Pilih Metode Pembayaran">
        <p className="text-muted-foreground text-sm">
          Metode pembayaran belum tersedia untuk produk ini. Coba lagi nanti atau hubungi CS kami.
        </p>
      </NumberedStepCard>
    )
  }

  return (
    <NumberedStepCard step={3} title="Pilih Metode Pembayaran">
      <Controller
        control={form.control}
        name="paymentMethodId"
        render={({ field }) => (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.id} className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs font-medium">{group.label}</span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {group.methods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      selected={field.value === method.id}
                      onSelect={field.onChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      />
      <FieldError errors={[form.formState.errors.paymentMethodId]} className="mt-2" />
    </NumberedStepCard>
  )
}

export { StepPayment }
