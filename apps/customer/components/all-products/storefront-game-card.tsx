import Link from "next/link"
import { ChevronRightIcon, Gamepad2Icon } from "lucide-react"

import { Card } from "@workspace/ui/components/card"
import type { Category } from "@workspace/api-client/types/category"

/**
 * Game card for the "Semua Produk" grid — one per Category inside the
 * active CategoryGroup tab (see ADR-0002). Deliberately separate from
 * components/popular-games/game-card.tsx: that card links to "#produk"
 * because it's a homepage teaser meant to scroll down into this very
 * section, whereas this card already IS the destination, so it links
 * straight to the real per-game product detail page
 * (`/product/<slug>`, same routing StorefrontProductCard used before
 * this section showed games instead of denominations).
 */
function StorefrontGameCard({ category }: { category: Category }) {
  return (
    <Link href={`/product/${category.slug}`} className="block">
      <Card
        size="sm"
        className="flex-row items-center gap-3 px-3 shadow-none ring-1 ring-foreground/10 transition-colors hover:bg-muted/60"
      >
        <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/15 text-primary">
          {category.logo_url ? (
            // Plain <img>, not next/image — same cross-environment-host
            // reasoning as popular-games/game-card.tsx's logo rendering.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.logo_url}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Gamepad2Icon className="size-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{category.name}</p>
        </div>
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
      </Card>
    </Link>
  )
}

export { StorefrontGameCard }
