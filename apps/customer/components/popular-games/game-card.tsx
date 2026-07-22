"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { Card } from "@workspace/ui/components/card"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_OUT } from "@/lib/motion"
import type { PopularGame } from "@/lib/dummy-data"

function GameCard({ game }: { game: PopularGame }) {
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
          <div className="relative mx-auto size-14 overflow-hidden rounded-xl sm:size-20">
            <Image
              src={game.imageSrc}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <p className="truncate text-xs font-medium sm:text-sm">{game.name}</p>
        </Card>
      </Link>
    </motion.div>
  )
}

export { GameCard }
