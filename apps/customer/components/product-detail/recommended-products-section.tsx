import { Carousel, CarouselContent, CarouselItem } from "@workspace/ui/components/carousel"

import { ProductCard } from "@/components/all-products/product-card"
import { products } from "@/lib/dummy-data"

/**
 * Server Component — resolves `recommendedProductIds` back to full
 * `Product` records and reuses the homepage's `ProductCard` so the
 * "similar products" grid looks identical to the rest of the catalog
 * instead of a bespoke card. Carousel itself is a Client Component
 * (embla), but this wrapper holds no state of its own.
 */
function RecommendedProductsSection({ productIds }: { productIds: string[] }) {
  const recommended = productIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h2 className="text-foreground mb-4 text-base font-semibold sm:text-lg">Produk Serupa</h2>
      {recommended.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada rekomendasi untuk produk ini.</p>
      ) : (
        <Carousel opts={{ align: "start", dragFree: true }}>
          <CarouselContent>
            {recommended.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </section>
  )
}

export { RecommendedProductsSection }
