"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Gamepad2Icon } from "lucide-react"

import { Card } from "@workspace/ui/components/card"
import type { StorefrontCategory } from "@workspace/api-client/types/storefront-category"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_OUT } from "@/lib/motion"

function GameCard({ category }: { category: StorefrontCategory }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      // Single hover signal (lift only) — scale+translate together reads as
      // the generic "everything moves" AI hover tell.
      whileHover={prefersReducedMotion ? undefined : { y: -3 }}
      whileTap={prefersReducedMotion ? undefined : { y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="w-24 shrink-0 snap-start sm:w-auto"
    >
      <Link href="#produk" className="block">
        <Card
          size="sm"
          className="items-center gap-2 px-3 text-center shadow-none ring-1 ring-foreground/10 transition-colors hover:ring-primary/40"
        >
          <div className="relative mx-auto flex size-14 items-center justify-center overflow-hidden rounded-xl bg-muted sm:size-20">
            {category.logo_url ? (
              // Plain <img>, not next/image: the logo is served by
              // be-bagastopup (a different host per environment —
              // localhost in dev, api.bagastopup.com in prod), which
              // would need a matching next.config.ts remotePatterns
              // entry per environment. Not worth that coupling for a
              // small decorative thumbnail.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.logo_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Gamepad2Icon className="size-6 text-muted-foreground sm:size-8" />
            )}
          </div>
          <p className="truncate text-xs font-medium sm:text-sm">{category.name}</p>
        </Card>
      </Link>
    </motion.div>
  )
}

export { GameCard }
