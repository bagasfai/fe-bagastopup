"use client"

import { memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2Icon } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

import { Badge } from "@workspace/ui/components/badge"
import { FieldError } from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { formatIDR } from "@/lib/format"
import { EASE_OUT } from "@/lib/motion"
import type { PackageOption } from "@/lib/dummy-product-detail"

import { NumberedStepCard } from "./numbered-step-card"
import type { PurchaseFormValues } from "./schema"

/**
 * Memoized so re-selecting a package only re-renders the two cards whose
 * `selected` prop actually changed, not all of them — `onSelect` is RHF's
 * `field.onChange`, which is a stable reference across renders, so the
 * memo comparison isn't defeated by a fresh callback each time.
 */
const PackageCard = memo(function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: PackageOption
  selected: boolean
  onSelect: (id: string) => void
}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(pkg.id)}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      aria-pressed={selected}
      className={cn(
        "border-border relative flex min-h-24 flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5 ring-primary ring-1" : "hover:border-primary/50",
      )}
    >
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute top-2 right-2"
          >
            <CheckCircle2Icon className="text-primary size-4" />
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-1">
        {pkg.isPopular && <Badge variant="secondary">Terlaris</Badge>}
        {pkg.bonusLabel && <Badge>{pkg.bonusLabel}</Badge>}
      </div>

      <span className="text-sm font-medium">{pkg.amountLabel}</span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-foreground text-sm font-semibold">{formatIDR(pkg.priceIDR)}</span>
        {pkg.originalPriceIDR && (
          <span className="text-muted-foreground text-xs line-through">{formatIDR(pkg.originalPriceIDR)}</span>
        )}
      </span>
    </motion.button>
  )
})

function StepPackages({ packages }: { packages: PackageOption[] }) {
  const form = useFormContext<PurchaseFormValues>()

  return (
    <NumberedStepCard step={2} title="Pilih Paket Top Up">
      <Controller
        control={form.control}
        name="packageId"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} selected={field.value === pkg.id} onSelect={field.onChange} />
            ))}
          </div>
        )}
      />
      <FieldError errors={[form.formState.errors.packageId]} className="mt-2" />
    </NumberedStepCard>
  )
}

export { StepPackages }
