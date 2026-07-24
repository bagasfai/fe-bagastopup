import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

import { ProductBreadcrumb } from "@/components/product-detail/breadcrumb"
import { ProductDescription } from "@/components/product-detail/product-description"
import { ProductHeader } from "@/components/product-detail/product-header"
import { ProductInfoCard } from "@/components/product-detail/product-info-card"
import { PurchaseForm } from "@/components/product-detail/purchase-form/purchase-form"
import { SupportCard } from "@/components/product-detail/support-card"
import { Footer } from "@/components/footer/footer"
import { Navbar } from "@/components/navbar/navbar"
import { productCategories } from "@/lib/dummy-data"
import { getProductWithDetail } from "@/lib/get-product-detail"

type ProductPageProps = {
  params: Promise<{ id: string }>
}

// Below-the-fold sections that aren't critical for first paint get
// code-split, same convention as the homepage (app/page.tsx). SSR stays
// on so the content is still in the server-rendered HTML for crawlers.
const HowToTopUpSection = dynamic(() =>
  import("@/components/product-detail/how-to-topup-section").then((mod) => mod.HowToTopUpSection),
)
const QAAccordionSection = dynamic(() =>
  import("@/components/product-detail/qa-accordion-section").then((mod) => mod.QAAccordionSection),
)
const RecommendedProductsSection = dynamic(() =>
  import("@/components/product-detail/recommended-products-section").then((mod) => mod.RecommendedProductsSection),
)
const CustomerReviewsSection = dynamic(() =>
  import("@/components/product-detail/customer-reviews-section").then((mod) => mod.CustomerReviewsSection),
)

async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductWithDetail(id)
  if (!product) return { title: "Produk Tidak Ditemukan" }

  return {
    title: `${product.name} — Top Up Instan | BagasTopup`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.heroImageSrc ? [{ url: product.heroImageSrc }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductWithDetail(id)

  if (!product) notFound()

  const category = productCategories.find((c) => c.id === product.categoryId)
  const categoryLabel = category?.label ?? "Produk"

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <ProductBreadcrumb categoryLabel={categoryLabel} productName={product.name} />
      <main className="flex-1">
        <ProductHeader categoryLabel={categoryLabel} product={product} />
        <ProductInfoCard highlights={product.infoHighlights} />

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <PurchaseForm product={product} />
        </div>

        <ProductDescription sections={product.descriptionSections} />
        <HowToTopUpSection steps={product.howToSteps} />
        <QAAccordionSection title="Catatan Penting" items={product.importantNotes} />
        <RecommendedProductsSection productIds={product.recommendedProductIds} />
        <CustomerReviewsSection reviews={product.reviews} averageRating={product.rating} reviewCount={product.reviewCount} />
        <QAAccordionSection title="Pertanyaan Umum" items={product.faq} />
        <SupportCard />
      </main>
      <Footer />
    </div>
  )
}

export { generateMetadata }
