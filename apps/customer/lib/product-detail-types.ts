/**
 * View-model types for the product detail page. Split out from the
 * data that fills them (see get-product-detail.ts, which replaced the
 * old dummy-product-detail.ts — ADR-0001 in be-bagastopup covers why)
 * so every component under components/product-detail/* keeps a single,
 * stable import path for its prop types regardless of where the data
 * comes from.
 *
 * `inputFields`/`packages`/`paymentMethodGroups` are arrays of config,
 * not fixed named fields — a product can require 1 field (Free Fire)
 * or 2 (Mobile Legends) or a mix of text + select (PUBG Mobile's server
 * picker), and the purchase form renders whatever the array contains.
 */

import type { Product } from "@/lib/dummy-data"

export type InputFieldConfig = {
  key: string
  label: string
  type: "text" | "select"
  placeholder?: string
  helperText?: string
  required: boolean
  options?: { value: string; label: string }[]
  minLength?: number
  maxLength?: number
}

export type PackageOption = {
  id: string
  name: string
  amountLabel: string
  priceIDR: number
  originalPriceIDR?: number
  bonusLabel?: string
  isPopular?: boolean
}

/** Maps to a lucide-react icon in payment-method-icon.tsx. */
export type PaymentMethodIconKey = "wallet" | "landmark" | "store" | "qr-code"

export type PaymentMethod = {
  id: string
  name: string
  iconKey: PaymentMethodIconKey
  /** Flat admin fee in rupiah, 0 for free methods — kept numeric (not a display string) so OrderSummary can add it into the total. */
  feeIDR: number
}

export type PaymentMethodGroup = {
  id: string
  label: string
  methods: PaymentMethod[]
}

export type PromoCode = {
  code: string
  description: string
  discountIDR?: number
  discountPercent?: number
}

export type QAItem = {
  id: string
  question: string
  answer: string
}

export type ProductReview = {
  id: string
  name: string
  initials: string
  rating: number
  date: string
  comment: string
}

export type HowToStep = {
  order: number
  title: string
  description: string
}

/** Maps to a lucide-react icon in info-highlight-icon.tsx. */
export type InfoHighlightIconKey = "zap" | "shield-check" | "clock" | "globe" | "calendar"

export type ProductInfoHighlight = {
  id: string
  label: string
  value: string
  iconKey: InfoHighlightIconKey
}

export type ProductDetail = {
  productId: string
  heroImageSrc?: string
  shortDescription: string
  soldCount: number
  rating: number
  reviewCount: number
  isFavorite?: boolean
  infoHighlights: ProductInfoHighlight[]
  inputFields: InputFieldConfig[]
  packages: PackageOption[]
  paymentMethodGroups: PaymentMethodGroup[]
  promoCodes: PromoCode[]
  descriptionSections: { heading: string; body: string }[]
  howToSteps: HowToStep[]
  importantNotes: QAItem[]
  faq: QAItem[]
  reviews: ProductReview[]
  recommendedProductIds: string[]
}

export type ProductWithDetail = Product & ProductDetail
