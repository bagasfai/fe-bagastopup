"use client"

import { motion } from "framer-motion"
import { Loader2Icon } from "lucide-react"
import { useFormContext, useFormState } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

import { NumberedStepCard } from "./numbered-step-card"
import type { PurchaseFormValues } from "./schema"

function BuyButton() {
  const { control } = useFormContext<PurchaseFormValues>()
  const { isValid, isSubmitting } = useFormState({ control })
  const prefersReducedMotion = usePrefersReducedMotion()
  const disabled = !isValid || isSubmitting

  return (
    <NumberedStepCard step={6} title="Selesaikan Pembelian">
      <motion.div
        whileHover={disabled || prefersReducedMotion ? undefined : { scale: 1.01 }}
        whileTap={disabled || prefersReducedMotion ? undefined : { scale: 0.98 }}
      >
        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={disabled}>
          {isSubmitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Beli Sekarang"
          )}
        </Button>
      </motion.div>
    </NumberedStepCard>
  )
}

export { BuyButton }
