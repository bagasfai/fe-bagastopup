"use client"

import { motion } from "framer-motion"
import {
  BadgePercentIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { Card } from "@workspace/ui/components/card"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { trustPoints, type TrustPointIconKey } from "@/lib/dummy-data"

const TRUST_ICONS: Record<TrustPointIconKey, LucideIcon> = {
  zap: ZapIcon,
  "shield-check": ShieldCheckIcon,
  headset: HeadsetIcon,
  "badge-percent": BadgePercentIcon,
}

// Client Component: fade/slide-in as this section enters the viewport.
function TrustRowSection() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustPoints.map((point, index) => {
          const Icon = TRUST_ICONS[point.iconKey]
          return (
            <motion.div
              key={point.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.35,
                delay: prefersReducedMotion ? 0 : index * 0.08,
              }}
            >
              <Card className="h-full gap-3 p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {point.description}
                </p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export { TrustRowSection }
