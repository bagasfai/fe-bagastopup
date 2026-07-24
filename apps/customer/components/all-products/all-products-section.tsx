"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import type { StorefrontCategory } from "@workspace/api-client/types/storefront-category"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_IN, EASE_OUT } from "@/lib/motion"
import { StorefrontProductCard } from "@/components/all-products/storefront-product-card"

/**
 * be-bagastopup's Category models a single game (e.g. "Mobile Legends"),
 * not the broad grouping (Top Up Game / Voucher / Pulsa & Tagihan /
 * Entertainment) the old dummy data used for these tabs — there's no
 * real backend concept for that broader grouping yet. So each tab here
 * is one game, and its content is that game's own denominations
 * (Products), not a cross-game category slice.
 */
function AllProductsSection({ categories }: { categories: StorefrontCategory[] }) {
  // Lazy initializer, not an effect — categories comes from a server-
  // fetched prop that's stable for the component's lifetime (a real
  // change only happens via a fresh page load/remount), so there's no
  // "sync with a later prop update" case to handle here.
  const [activeCategoryId, setActiveCategoryId] = React.useState<number | undefined>(
    () => categories[0]?.id
  )
  const prefersReducedMotion = usePrefersReducedMotion()

  const activeCategory = categories.find((category) => category.id === activeCategoryId)
  const activeProducts = activeCategory?.products ?? []

  if (categories.length === 0 || activeCategoryId === undefined) {
    return (
      <section id="produk" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="mb-5 border-b border-border pb-3 text-lg font-semibold sm:text-2xl">
          Semua Produk
        </h2>
        <p className="text-sm text-muted-foreground">Belum ada produk tersedia.</p>
      </section>
    )
  }

  return (
    <section id="produk" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-5 border-b border-border pb-3 text-lg font-semibold sm:text-2xl">
        Semua Produk
      </h2>

      <Tabs
        value={String(activeCategoryId)}
        onValueChange={(value) => setActiveCategoryId(Number(value))}
      >
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={String(category.id)}
              className="shrink-0"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={String(activeCategoryId)} className="mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategoryId}
              // Opacity-only crossfade per the tab-change recipe — no y
              // translate, so switching categories doesn't read as a
              // spatial move (the grid position underneath doesn't change).
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: EASE_OUT, delay: 0.05 } }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, transition: { duration: 0.1, ease: EASE_IN } }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {activeProducts.length === 0 ? (
                <p className="col-span-full text-sm text-muted-foreground">
                  Belum ada produk untuk {activeCategory?.name}.
                </p>
              ) : (
                activeProducts.map((product) => (
                  <StorefrontProductCard
                    key={product.id}
                    product={product}
                    categorySlug={activeCategory!.slug}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export { AllProductsSection }
