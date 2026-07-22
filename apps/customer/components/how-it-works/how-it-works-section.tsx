"use client"

import { motion } from "framer-motion"
import {
  CreditCardIcon,
  MousePointerClickIcon,
  PartyPopperIcon,
  UserRoundPenIcon,
  type LucideIcon,
} from "lucide-react"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { howItWorksSteps, type HowItWorksIconKey } from "@/lib/dummy-data"

const STEP_ICONS: Record<HowItWorksIconKey, LucideIcon> = {
  "mouse-pointer-click": MousePointerClickIcon,
  "user-round-pen": UserRoundPenIcon,
  "credit-card": CreditCardIcon,
  "party-popper": PartyPopperIcon,
}

// Client Component: each step animates into view on scroll (whileInView),
// which requires Framer Motion running on the client.
function HowItWorksSection() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="cara-kerja"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <h2 className="mb-10 text-center text-lg font-bold sm:text-2xl">
        Cara Kerja
      </h2>

      <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-4 sm:gap-4">
        <div
          aria-hidden
          className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-border sm:block"
        />

        {howItWorksSteps.map((step, index) => {
          const Icon = STEP_ICONS[step.iconKey]
          return (
            <motion.div
              key={step.id}
              className="relative flex flex-col items-center gap-3 text-center"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.4,
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
            >
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="max-w-48 text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export { HowItWorksSection }
