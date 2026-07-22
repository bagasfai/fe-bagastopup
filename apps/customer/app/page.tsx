import type { Metadata } from "next"
import dynamic from "next/dynamic"

import { AllProductsSection } from "@/components/all-products/all-products-section"
import { FloatingCsButton } from "@/components/cs-button/floating-cs-button"
import { Footer } from "@/components/footer/footer"
import { HeroCarousel } from "@/components/hero/hero-carousel"
import { HowItWorksSection } from "@/components/how-it-works/how-it-works-section"
import { Navbar } from "@/components/navbar/navbar"
import { PopularGamesSection } from "@/components/popular-games/popular-games-section"
import { TrustRowSection } from "@/components/trust-row/trust-row-section"
import { heroSlides, popularGames } from "@/lib/dummy-data"

export const metadata: Metadata = {
  title: "BagasTopup — Top Up Game, Voucher, Pulsa & Tagihan Termurah",
  description:
    "Top up Mobile Legends, Free Fire, PUBG Mobile, voucher game, pulsa, dan tagihan dengan proses instan, harga terbaik, dan pembayaran aman.",
}

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

// Server Component: the page shell itself renders no interactive markup,
// it only composes sections (some server, some client) and passes down
// dummy data as props.
export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel slides={heroSlides} />
        <PopularGamesSection games={popularGames} />
        <AllProductsSection />
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
