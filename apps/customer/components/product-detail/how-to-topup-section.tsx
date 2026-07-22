"use client"

import { motion } from "framer-motion"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_OUT } from "@/lib/motion"
import type { HowToStep } from "@/lib/dummy-product-detail"

/**
 * Client Component only because of the scroll-triggered reveal
 * (`whileInView`) — content itself is static. Step count is config-driven
 * (not assumed to always be 5), so the connecting line/grid degrade
 * gracefully instead of relying on a fixed column count.
 */
function HowToTopUpSection({ steps }: { steps: HowToStep[] }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="border-border mb-10 border-b pb-3 text-lg font-semibold sm:text-2xl">Cara Top Up</h2>

      <div className="relative grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        <div aria-hidden className="bg-border absolute top-6 right-[10%] left-[10%] hidden h-px lg:block" />

        {steps.map((step, index) => (
          <motion.div
            key={step.order}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-64px" }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: prefersReducedMotion ? 0 : index * 0.08 }}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            <div className="bg-primary text-primary-foreground relative z-10 flex size-12 items-center justify-center rounded-full font-semibold">
              {step.order}
            </div>
            <h3 className="text-sm font-semibold sm:text-base">{step.title}</h3>
            <p className="text-muted-foreground max-w-48 text-xs sm:text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export { HowToTopUpSection }
