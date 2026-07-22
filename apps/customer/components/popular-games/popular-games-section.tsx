import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { GameCard } from "@/components/popular-games/game-card"
import type { PopularGame } from "@/lib/dummy-data"

// Server Component: the section shell and layout are static; only the
// per-card hover/tap animation (GameCard) needs to be a Client Component.
function PopularGamesSection({ games }: { games: PopularGame[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-2xl">Game Populer</h2>
        <Link
          href="#produk"
          className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

export { PopularGamesSection }
