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
      <h2 className="mb-5 text-lg font-bold sm:text-2xl">Semua Produk</h2>

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
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
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
