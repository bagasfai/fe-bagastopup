/**
 * Real replacement for the old dummy-product-detail.ts (see ADR-0001 in
 * be-bagastopup). Fetches be-bagastopup's public
 * GET /storefront/categories/:slug endpoint and maps the response into
 * the same ProductWithDetail shape every components/product-detail/*
 * component already expects, so this is the only file that needed to
 * change to go from dummy to real data.
 */

import { cache } from "react"

import { ApiError } from "@workspace/api-client/client"
import { fetchStorefrontCategoryBySlug } from "@workspace/api-client/hooks/use-storefront"
import type { StorefrontCategory } from "@workspace/api-client/types/storefront-category"

import type {
  HowToStep,
  InputFieldConfig,
  PackageOption,
  PaymentMethodGroup,
  ProductInfoHighlight,
  ProductReview,
  ProductWithDetail,
  PromoCode,
  QAItem,
} from "@/lib/product-detail-types"

/**
 * Payment methods and promo codes are storewide config in
 * be-bagastopup (PaymentMethodGroup/PromoCode — see ADR-0001), not
 * per-category, and are modeled as real admin-managed resources
 * there — but only behind admin auth so far. There's no public read
 * endpoint yet because there's no checkout flow to consume it yet
 * either (be-bagastopup's "no transaction creation endpoint" gap).
 * Kept as a static fallback here, same content the dummy data used,
 * until that endpoint exists.
 */
const paymentMethodGroups: PaymentMethodGroup[] = [
  {
    id: "e-wallet",
    label: "E-Wallet",
    methods: [
      { id: "gopay", name: "GoPay", iconKey: "wallet", feeIDR: 0 },
      { id: "ovo", name: "OVO", iconKey: "wallet", feeIDR: 0 },
      { id: "dana", name: "DANA", iconKey: "wallet", feeIDR: 0 },
      { id: "shopeepay", name: "ShopeePay", iconKey: "wallet", feeIDR: 1000 },
    ],
  },
  {
    id: "virtual-account",
    label: "Virtual Account",
    methods: [
      { id: "va-bca", name: "BCA Virtual Account", iconKey: "landmark", feeIDR: 4000 },
      { id: "va-bni", name: "BNI Virtual Account", iconKey: "landmark", feeIDR: 4000 },
      { id: "va-bri", name: "BRI Virtual Account", iconKey: "landmark", feeIDR: 4000 },
      { id: "va-mandiri", name: "Mandiri Virtual Account", iconKey: "landmark", feeIDR: 4000 },
    ],
  },
  {
    id: "convenience-store",
    label: "Convenience Store",
    methods: [
      { id: "alfamart", name: "Alfamart", iconKey: "store", feeIDR: 2500 },
      { id: "indomaret", name: "Indomaret", iconKey: "store", feeIDR: 2500 },
    ],
  },
  {
    id: "qris",
    label: "QRIS",
    methods: [{ id: "qris", name: "QRIS", iconKey: "qr-code", feeIDR: 750 }],
  },
]

const promoCodes: PromoCode[] = [
  { code: "HEMAT10", description: "Diskon 10% untuk semua transaksi", discountPercent: 10 },
  { code: "BAGAS5000", description: "Potongan langsung Rp5.000", discountIDR: 5000 },
]

/**
 * Fallback content for when a CategoryDetail row exists but an admin
 * hasn't filled in this particular jsonb field yet (it defaults to an
 * empty array — see be-bagastopup's domain.JSON), so the page doesn't
 * render a blank section for content that's true of nearly every game
 * anyway. Same copy the old dummy data used as its default.
 */
const defaultHowToSteps: HowToStep[] = [
  { order: 1, title: "Masukkan ID Akun", description: "Isi data akun game sesuai kolom yang diminta." },
  { order: 2, title: "Pilih Paket", description: "Pilih nominal top up yang kamu inginkan." },
  { order: 3, title: "Pilih Pembayaran", description: "Bayar pakai e-wallet, VA, minimarket, atau QRIS." },
  { order: 4, title: "Selesaikan Pembayaran", description: "Ikuti instruksi pembayaran sampai selesai." },
  { order: 5, title: "Item Langsung Masuk", description: "Pesanan diproses otomatis begitu pembayaran diterima." },
]

const defaultImportantNotes: QAItem[] = [
  { id: "find-id", question: "Bagaimana cara menemukan User ID saya?", answer: "Buka profil akun di dalam game, User ID biasanya tertera di bawah nama karakter atau di menu pengaturan akun." },
  { id: "refund", question: "Apa kebijakan refund?", answer: "Refund berlaku jika pesanan gagal diproses karena kesalahan sistem kami. Kesalahan input ID dari pembeli tidak bisa direfund." },
  { id: "delivery-time", question: "Berapa lama waktu pengiriman?", answer: "Untuk produk instan, item masuk otomatis dalam hitungan detik hingga 1 menit setelah pembayaran dikonfirmasi." },
  { id: "wrong-id", question: "Apa kesalahan yang sering terjadi?", answer: "Kesalahan paling umum adalah salah memasukkan Zone ID atau Server, pastikan data akun sudah benar sebelum membayar." },
]

const defaultFaq: QAItem[] = [
  { id: "faq-delivery", question: "Berapa lama proses pengirimannya?", answer: "Rata-rata kurang dari 1 menit setelah pembayaran berhasil, untuk kasus tertentu bisa memakan waktu hingga 15 menit." },
  { id: "faq-safety", question: "Apakah transaksi di sini aman?", answer: "Aman, kami official partner dan seluruh pembayaran diproses lewat payment gateway berlisensi." },
  { id: "faq-refund", question: "Bisakah saya refund pesanan?", answer: "Bisa, selama pesanan belum diproses atau terjadi kegagalan sistem di pihak kami." },
  { id: "faq-wrong-id", question: "Bagaimana jika saya salah memasukkan ID?", answer: "Segera hubungi CS lewat WhatsApp sebelum pesanan diproses, kami akan bantu cek statusnya." },
]

function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function averageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
}

function mapStorefrontCategory(category: StorefrontCategory): ProductWithDetail {
  const detail = category.detail
  const activeProducts = category.products ?? []
  const activeReviews = category.reviews ?? []

  const packages: PackageOption[] = activeProducts.map((product) => ({
    id: String(product.id),
    name: product.name,
    amountLabel: product.name,
    priceIDR: product.sell_price,
  }))

  const startingPriceIDR = packages.length > 0 ? Math.min(...packages.map((pkg) => pkg.priceIDR)) : 0

  const reviews: ProductReview[] = activeReviews.map((review) => ({
    id: String(review.id),
    name: review.name,
    initials: initialsFor(review.name),
    rating: review.rating,
    date: review.created_at,
    comment: review.comment,
  }))

  const howToSteps = (detail?.how_to_steps as HowToStep[] | undefined) ?? []
  const importantNotes = (detail?.important_notes as QAItem[] | undefined) ?? []
  const faq = (detail?.faq as QAItem[] | undefined) ?? []

  return {
    // Product half (see product-detail-types.ts's `Product & ProductDetail`).
    // apps/customer's homepage catalog (lib/dummy-data.ts) is still
    // dummy data — ADR-0001's action item 6 only covers this detail
    // page — so there's no real "top-level product category" (Top Up
    // Game / Voucher / …) to map to yet: be-bagastopup's Category
    // models a single game, not that grouping. Defaulting both fields
    // below until the homepage catalog is wired up too.
    id: category.slug,
    categoryId: "top-up-game",
    name: category.name,
    iconKey: "gamepad",
    startingPriceIDR,

    // ProductDetail half.
    productId: category.slug,
    heroImageSrc: detail?.hero_image_url || category.logo_url || undefined,
    shortDescription: detail?.short_description ?? "",
    // No be-bagastopup aggregate for these yet — would need a
    // Transactions count per category (soldCount) once checkout
    // exists; rating/reviewCount are derived from real Reviews below.
    soldCount: 0,
    rating: averageRating(reviews.map((review) => review.rating)),
    reviewCount: reviews.length,
    isFavorite: false,
    infoHighlights: (detail?.info_highlights as ProductInfoHighlight[] | undefined) ?? [],
    inputFields: (detail?.input_fields as InputFieldConfig[] | undefined) ?? [],
    packages,
    paymentMethodGroups,
    promoCodes,
    descriptionSections: (detail?.description_sections as { heading: string; body: string }[] | undefined) ?? [],
    howToSteps: howToSteps.length > 0 ? howToSteps : defaultHowToSteps,
    importantNotes: importantNotes.length > 0 ? importantNotes : defaultImportantNotes,
    faq: faq.length > 0 ? faq : defaultFaq,
    reviews,
    // No real cross-category catalog to recommend from yet (see the
    // categoryId comment above) — CustomerReviewsSection/
    // RecommendedProductsSection both render an empty/"none yet" state
    // for an empty array, so this is a safe default rather than a bug.
    recommendedProductIds: [],
  }
}

/**
 * Replaces the old dummy-product-detail.ts's synchronous lookup — this
 * is async now since it's a real network call. Returns undefined for
 * "not found" (mirroring the old function's contract) so the page
 * component's existing `if (!product) notFound()` check keeps working
 * unchanged. Any other failure (network/server error) is rethrown so
 * it surfaces as a real error page instead of silently rendering a 404.
 *
 * Wrapped in React's `cache()` because the product detail page calls
 * this twice per request (once in generateMetadata, once in the page
 * body itself) — this de-dupes it into a single fetch per request
 * instead of relying only on Next's own fetch memoization, which is
 * less obvious to a reader of this file.
 */
const getProductWithDetail = cache(async function getProductWithDetail(
  slug: string
): Promise<ProductWithDetail | undefined> {
  try {
    const category = await fetchStorefrontCategoryBySlug(slug)
    return mapStorefrontCategory(category)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined
    }
    throw error
  }
})

export { getProductWithDetail }
