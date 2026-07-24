import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import type { StorefrontCategory } from "@workspace/api-client/types/storefront-category"

import { GameCard } from "@/components/popular-games/game-card"

// Server Component: the section shell and layout are static; only the
// per-card hover/tap animation (GameCard) needs to be a Client Component.
// "Popular games" is every active Category from be-bagastopup — there's
// no separate "popularity" concept on the backend yet, so this just
// shows all of them (see the mapping note in all-products-section.tsx).
function PopularGamesSection({ categories }: { categories: StorefrontCategory[] }) {
  if (categories.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
        <h2 className="text-lg font-semibold sm:text-2xl">Game Populer</h2>
        <Link
          href="#produk"
          className="flex shrink-0 items-center gap-0.5 text-sm font-medium whitespace-nowrap text-primary underline-offset-4 hover:underline"
        >
          Lihat Semua
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
        {categories.map((category) => (
          <GameCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}

export { PopularGamesSection }
