"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { Card } from "@workspace/ui/components/card"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import type { PopularGame } from "@/lib/dummy-data"

function GameCard({ game }: { game: PopularGame }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { scale: 1.04, y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="w-24 shrink-0 snap-start sm:w-auto"
    >
      <Link href="#produk" className="block">
        <Card
          size="sm"
          className="items-center gap-2 px-3 text-center shadow-none transition-shadow hover:shadow-md"
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
