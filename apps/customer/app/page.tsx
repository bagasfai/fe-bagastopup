import type { Metadata } from "next"
import dynamic from "next/dynamic"

import {
  fetchStorefrontCategories,
  fetchStorefrontCategoryGroups,
} from "@workspace/api-client/hooks/use-storefront"
import type { StorefrontCategory } from "@workspace/api-client/types/storefront-category"
import type { StorefrontCategoryGroup } from "@workspace/api-client/types/storefront-category-group"

import { AllProductsSection } from "@/components/all-products/all-products-section"
import { FloatingCsButton } from "@/components/cs-button/floating-cs-button"
import { Footer } from "@/components/footer/footer"
import { HeroCarousel } from "@/components/hero/hero-carousel"
import { HowItWorksSection } from "@/components/how-it-works/how-it-works-section"
import { Navbar } from "@/components/navbar/navbar"
import { PopularGamesSection } from "@/components/popular-games/popular-games-section"
import { TrustRowSection } from "@/components/trust-row/trust-row-section"
import { heroSlides } from "@/lib/dummy-data"

export const metadata: Metadata = {
  title: "BagasTopup — Top Up Game, Voucher, Pulsa & Tagihan Termurah",
  description:
    "Top up Mobile Legends, Free Fire, PUBG Mobile, voucher game, pulsa, dan tagihan dengan proses instan, harga terbaik, dan pembayaran aman.",
}

// Re-fetch the catalog every 60s (ISR) rather than caching it
// indefinitely — this route has no dynamic segment to force per-request
// rendering the way app/product/[id]/page.tsx gets for free, but prices
// and active categories change often enough that a build-time-only
// fetch would go stale.
export const revalidate = 60

// Below-the-fold sections that aren't critical for first paint or SEO
// ranking get code-split into separate chunks so the initial JS payload
// stays light. SSR stays on (no `ssr: false`) so their content is still
// present in the server-rendered HTML for crawlers and no-JS users.
const TestimonialsSection = dynamic(() =>
  import("@/components/testimonials/testimonials-section").then(
    (mod) => mod.TestimonialsSection
  )
)
const FeedbackFormSection = dynamic(() =>
  import("@/components/feedback/feedback-form-section").then(
    (mod) => mod.FeedbackFormSection
  )
)

/**
 * Server Component: the page shell composes sections (some server, some
 * client). heroSlides/howItWorksSteps/trustPoints/testimonials stay on
 * dummy data deliberately — they're marketing copy with no backend
 * model (see lib/dummy-data.ts). Categories/CategoryGroups and their
 * products are real, fetched here server-side so PopularGamesSection and
 * AllProductsSection get live data as props instead of owning their own
 * fetch.
 *
 * Two separate storefront calls, not one: PopularGamesSection wants a
 * flat list of every active game (no grouping concept), while
 * AllProductsSection now needs the CategoryGroup-nested shape (ADR-0002).
 * Fetched in parallel since neither depends on the other.
 */
export default async function Page() {
  let categories: StorefrontCategory[] = []
  let categoryGroups: StorefrontCategoryGroup[] = []
  try {
    const results = await Promise.all([
      fetchStorefrontCategories(),
      fetchStorefrontCategoryGroups(),
    ])
    categories = results[0]
    categoryGroups = results[1]
  } catch (error) {
    // Don't 500 the whole homepage if the backend is briefly unreachable
    // — render with an empty catalog instead, sections already handle
    // the empty-array case gracefully.
    console.error("Failed to load storefront catalog", error)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel slides={heroSlides} />
        <PopularGamesSection categories={categories} />
        <AllProductsSection groups={categoryGroups} />
        <HowItWorksSection />
        <TrustRowSection />
        <TestimonialsSection />
        <FeedbackFormSection />
      </main>
      <Footer />
      <FloatingCsButton />
    </div>
  )
}
