import Link from "next/link"
import { GemIcon } from "lucide-react"

import { Card } from "@workspace/ui/components/card"
import type { Product } from "@workspace/api-client/types/product"

import { formatIDR } from "@/lib/format"

/**
 * Homepage-only card for a real be-bagastopup Product (a single
 * nominal/denomination, e.g. "86 Diamonds"). Deliberately separate from
 * components/all-products/product-card.tsx, which the product detail
 * page's RecommendedProductsSection still renders from
 * lib/dummy-data.ts's dummy Product shape (iconKey, startingPriceIDR) —
 * that's a known gap carried forward from ADR-0001, out of scope here.
 * Real Products have no per-item icon, so this always renders one
 * generic icon rather than reintroducing an iconKey field that doesn't
 * exist on the backend.
 *
 * Links to /product/<categorySlug>, not the Product's own id — per
 * ADR-0001, app/product/[id]/page.tsx's [id] is actually a Category
 * slug (one game = one detail/purchase page listing every
 * denomination), not a per-Product page. categorySlug is passed down
 * rather than read off product.category because the storefront list
 * endpoint doesn't preload Product.Category (it's redundant — the
 * caller already knows which category it's iterating).
 */
function StorefrontProductCard({
  product,
  categorySlug,
}: {
  product: Product
  categorySlug: string
}) {
  return (
    <Link href={`/product/${categorySlug}`} className="block">
      <Card
        size="sm"
        className="flex-row items-center gap-3 px-3 shadow-none ring-1 ring-foreground/10 transition-colors hover:bg-muted/60"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <GemIcon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">{formatIDR(product.sell_price)}</p>
        </div>
      </Card>
    </Link>
  )
}

export { StorefrontProductCard }
