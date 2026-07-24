import { HeartIcon, StarIcon } from "lucide-react"
import Image from "next/image"

import { Badge } from "@workspace/ui/components/badge"

import { ProductIcon } from "@/components/all-products/product-icon"
import type { ProductWithDetail } from "@/lib/product-detail-types"

/**
 * Server Component — every value here is either static dummy data or a
 * plain format call, nothing that needs client state. Mobile stacks image
 * above info (`flex-col`); desktop moves the image beside info
 * (`sm:flex-row`) per the design spec.
 */
function ProductHeader({
  categoryLabel,
  product,
}: {
  categoryLabel: string
  product: ProductWithDetail
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="border-border bg-card relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border sm:size-36">
          {product.heroImageSrc ? (
            <Image
              src={product.heroImageSrc}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 640px) 144px, 112px"
              className="object-contain p-4"
            />
          ) : (
            <ProductIcon iconKey={product.iconKey} className="text-primary size-12" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {product.isFavorite && (
              <Badge className="gap-1">
                <HeartIcon className="size-3" />
                Favorit
              </Badge>
            )}
          </div>

          <h1 className="text-foreground text-2xl font-bold text-balance sm:text-3xl">{product.name}</h1>

          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">{product.shortDescription}</p>

          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-sm sm:justify-start">
            <span className="text-primary flex items-center gap-1">
              <StarIcon className="size-4 fill-current" />
              <span className="text-foreground font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.reviewCount.toLocaleString("id-ID")} ulasan)</span>
            </span>
            <span aria-hidden="true">•</span>
            <span>Terjual {product.soldCount.toLocaleString("id-ID")} kali</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export { ProductHeader }
