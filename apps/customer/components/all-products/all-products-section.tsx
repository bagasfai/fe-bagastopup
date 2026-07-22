"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_IN, EASE_OUT } from "@/lib/motion"
import { ProductCard } from "@/components/all-products/product-card"
import {
  productCategories,
  products,
  type ProductCategoryId,
} from "@/lib/dummy-data"

// Client Component: switching categories is interactive state, and the
// animated crossfade between tabs needs Framer Motion on the client.
function AllProductsSection() {
  const [activeCategory, setActiveCategory] = React.useState<ProductCategoryId>(
    productCategories[0]!.id
  )
  const prefersReducedMotion = usePrefersReducedMotion()

  const activeProducts = React.useMemo(
    () => products.filter((product) => product.categoryId === activeCategory),
    [activeCategory]
  )

  return (
    <section id="produk" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-5 border-b border-border pb-3 text-lg font-semibold sm:text-2xl">
        Semua Produk
      </h2>

      <Tabs
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as ProductCategoryId)}
      >
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          {productCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="shrink-0"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              // Opacity-only crossfade per the tab-change recipe — no y
              // translate, so switching categories doesn't read as a
              // spatial move (the grid position underneath doesn't change).
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: EASE_OUT, delay: 0.05 } }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, transition: { duration: 0.1, ease: EASE_IN } }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {activeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export { AllProductsSection }
