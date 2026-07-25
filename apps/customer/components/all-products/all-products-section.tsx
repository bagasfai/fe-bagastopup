"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import type { StorefrontCategoryGroup } from "@workspace/api-client/types/storefront-category-group"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_IN, EASE_OUT } from "@/lib/motion"
import { StorefrontGameCard } from "@/components/all-products/storefront-game-card"

/**
 * Tabs are CategoryGroup (the broad storefront grouping — "Mobile Game" /
 * "Voucher" / "Entertainment") and each tab's content is that group's
 * Category list rendered as game cards, not a single game's denominations
 * — see ADR-0002 in be-bagastopup. This replaces the previous version,
 * which had no real backend concept of a grouping above Category and so
 * used one tab per game with that game's Products (denominations) as the
 * content instead.
 */
function AllProductsSection({ groups }: { groups: StorefrontCategoryGroup[] }) {
  // Lazy initializer, not an effect — groups comes from a server-fetched
  // prop that's stable for the component's lifetime (a real change only
  // happens via a fresh page load/remount), so there's no "sync with a
  // later prop update" case to handle here.
  const [activeGroupId, setActiveGroupId] = React.useState<number | undefined>(
    () => groups[0]?.id
  )
  const prefersReducedMotion = usePrefersReducedMotion()

  const activeGroup = groups.find((group) => group.id === activeGroupId)
  const activeCategories = activeGroup?.categories ?? []

  if (groups.length === 0 || activeGroupId === undefined) {
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
        value={String(activeGroupId)}
        onValueChange={(value) => setActiveGroupId(Number(value))}
      >
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          {groups.map((group) => (
            <TabsTrigger
              key={group.id}
              value={String(group.id)}
              className="shrink-0"
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={String(activeGroupId)} className="mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroupId}
              // Opacity-only crossfade per the tab-change recipe — no y
              // translate, so switching groups doesn't read as a spatial
              // move (the grid position underneath doesn't change).
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: EASE_OUT, delay: 0.05 } }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, transition: { duration: 0.1, ease: EASE_IN } }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {activeCategories.length === 0 ? (
                <p className="col-span-full text-sm text-muted-foreground">
                  Belum ada produk untuk {activeGroup?.name}.
                </p>
              ) : (
                activeCategories.map((category) => (
                  <StorefrontGameCard key={category.id} category={category} />
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
