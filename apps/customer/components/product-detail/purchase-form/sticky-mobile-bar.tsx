"use client"

import { type RefObject, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useFormContext, useFormState } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { formatIDR } from "@/lib/format"
import { EASE_OUT } from "@/lib/motion"
import type { ProductWithDetail, PromoCode } from "@/lib/dummy-product-detail"

import { usePurchaseTotals } from "./order-summary"
import type { PurchaseFormValues } from "./schema"

/**
 * Mobile-only (`lg:hidden`) sticky CTA. Two visibility gates:
 *  - `pastSentinel`: an IntersectionObserver on a 1px marker at the top of
 *    the purchase form, so the bar only appears once the product header
 *    has scrolled out of view (not immediately on page load).
 *  - `keyboardOpen`: compares `window.innerHeight` to
 *    `visualViewport.height` — a large gap means the on-screen keyboard
 *    is covering the bottom of the page, so the bar hides instead of
 *    floating above (or getting clipped by) the keyboard.
 */
function StickyMobileBar({
  product,
  appliedPromo,
  sentinelRef,
  onBuyClick,
}: {
  product: ProductWithDetail
  appliedPromo: PromoCode | null
  sentinelRef: RefObject<HTMLDivElement | null>
  onBuyClick: () => void
}) {
  const { control } = useFormContext<PurchaseFormValues>()
  const { isValid, isSubmitting } = useFormState({ control })
  const { total } = usePurchaseTotals(product, appliedPromo)
  const prefersReducedMotion = usePrefersReducedMotion()

  const [pastSentinel, setPastSentinel] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver((entries) => setPastSentinel(!entries[0]?.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinelRef])

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    function onResize() {
      setKeyboardOpen(window.innerHeight - viewport!.height > 150)
    }
    viewport.addEventListener("resize", onResize)
    return () => viewport.removeEventListener("resize", onResize)
  }, [])

  const visible = pastSentinel && !keyboardOpen

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-40 border-t p-3 backdrop-blur-sm lg:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-muted-foreground text-xs">Total</span>
              <span className="text-primary truncate text-lg font-bold">{formatIDR(total)}</span>
            </div>
            <Button size="lg" className="h-12 shrink-0 px-6" disabled={!isValid || isSubmitting} onClick={onBuyClick}>
              {isSubmitting ? "Memproses..." : "Beli Sekarang"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { StickyMobileBar }
