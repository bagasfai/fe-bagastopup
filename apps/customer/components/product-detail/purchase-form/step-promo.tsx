"use client"

import { useState } from "react"
import { CheckIcon, TicketPercentIcon, XIcon } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import type { PromoCode } from "@/lib/dummy-product-detail"

import { NumberedStepCard } from "./numbered-step-card"

/**
 * Promo code is intentionally kept outside the main react-hook-form
 * instance — it's optional, self-contained, and its own keystrokes
 * shouldn't trigger a re-render/re-validate pass on the (much larger)
 * purchase form. `onApply` lifts only the final applied-or-cleared result
 * up to PurchaseForm, which is all OrderSummary needs to compute totals.
 */
function StepPromo({
  promoCodes,
  onApply,
}: {
  promoCodes: PromoCode[]
  onApply: (promo: PromoCode | null) => void
}) {
  const [code, setCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleApply() {
    const trimmed = code.trim().toUpperCase()
    const match = promoCodes.find((promo) => promo.code === trimmed)
    if (!match) {
      setError("Kode promo tidak valid atau sudah kedaluwarsa.")
      setAppliedPromo(null)
      onApply(null)
      return
    }
    setError(null)
    setAppliedPromo(match)
    onApply(match)
  }

  function handleClear() {
    setCode("")
    setAppliedPromo(null)
    setError(null)
    onApply(null)
  }

  return (
    <NumberedStepCard step={4} title="Kode Promo">
      <Accordion type="single" collapsible>
        <AccordionItem value="promo" className="border-none">
          <AccordionTrigger className="gap-2 py-0 hover:no-underline">
            <span className="flex items-center gap-2">
              <TicketPercentIcon className="text-primary size-4" />
              {appliedPromo ? `Promo ${appliedPromo.code} diterapkan` : "Punya kode promo?"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {appliedPromo ? (
              <div className="bg-primary/5 border-primary/30 flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>
                  <span className="font-medium">{appliedPromo.code}</span> — {appliedPromo.description}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
                  <XIcon className="size-4" />
                  Hapus
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="Masukkan kode promo"
                    className="h-11 uppercase"
                  />
                  <Button type="button" onClick={handleApply} disabled={!code.trim()}>
                    <CheckIcon className="size-4" />
                    Terapkan
                  </Button>
                </div>
                {error && <p className="text-destructive text-xs">{error}</p>}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </NumberedStepCard>
  )
}

export { StepPromo }
