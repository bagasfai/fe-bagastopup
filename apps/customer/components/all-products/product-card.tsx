import Link from "next/link"

import { Card } from "@workspace/ui/components/card"
import { formatIDR } from "@/lib/format"
import type { Product } from "@/lib/dummy-data"
import { ProductIcon } from "@/components/all-products/product-icon"

// Server Component — no interactivity of its own, just a static link/card.
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href="#" className="block">
      <Card
        size="sm"
        className="flex-row items-center gap-3 px-3 shadow-none ring-1 ring-foreground/10 transition-colors hover:bg-muted/60"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <ProductIcon iconKey={product.iconKey} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            mulai dari {formatIDR(product.startingPriceIDR)}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export { ProductCard }
