/**
 * Product detail data, kept separate from dummy-data.ts on purpose: the
 * homepage only ever needs the flat `Product` list-card shape, while a
 * detail page needs a much heavier per-product config (input fields,
 * packages, payment methods, FAQ...). Splitting them mirrors how a real
 * API would likely split a list endpoint from a detail endpoint, so this
 * file is the one to swap for a `fetch` call later.
 *
 * `inputFields`/`packages`/`paymentMethodGroups` are arrays of config, not
 * fixed named fields — a product can require 1 field (Free Fire) or 2
 * (Mobile Legends) or a mix of text + select (PUBG Mobile's server
 * picker), and the purchase form renders whatever the array contains.
 */

import { products, type Product } from "./dummy-data"

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

/**
 * Payment providers/fees are a merchant-level concern, not really a
 * per-product one — every product in this shop is settled through the
 * same gateway. Kept as one shared config and referenced by each dummy
 * product instead of duplicated, but still hangs off `ProductDetail` so
 * the shape matches what the future per-product API field would look
 * like if that ever needs to change (e.g. a product with a payment
 * method restriction).
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

const defaultInfoHighlights: ProductInfoHighlight[] = [
  { id: "instant", label: "Pengiriman", value: "Instan otomatis", iconKey: "zap" },
  { id: "official", label: "Status", value: "Official Partner", iconKey: "shield-check" },
  { id: "processing", label: "Estimasi Proses", value: "< 1 menit", iconKey: "clock" },
  { id: "region", label: "Wilayah", value: "Seluruh Indonesia", iconKey: "globe" },
  { id: "updated", label: "Terakhir Diperbarui", value: "20 Jul 2026", iconKey: "calendar" },
]

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

const defaultReviews: ProductReview[] = [
  { id: "r1", name: "Fajar Nugroho", initials: "FN", rating: 5, date: "2026-07-15", comment: "Cepat banget prosesnya, langsung masuk ke akun." },
  { id: "r2", name: "Melati Putri", initials: "MP", rating: 5, date: "2026-07-10", comment: "Harga bersaing dan ada promo terus, jadi langganan di sini." },
  { id: "r3", name: "Yoga Pratama", initials: "YP", rating: 4, date: "2026-07-02", comment: "Semua lancar, cuma nunggu sekitar 2 menit waktu itu." },
]

export const productDetails: Record<string, ProductDetail> = {
  "mlbb-diamonds": {
    productId: "mlbb-diamonds",
    heroImageSrc: "/games/mobile-legends.svg",
    shortDescription: "Top up Diamonds Mobile Legends: Bang Bang, proses instan dan aman lewat official partner.",
    soldCount: 128430,
    rating: 4.9,
    reviewCount: 3214,
    isFavorite: true,
    infoHighlights: defaultInfoHighlights,
    inputFields: [
      { key: "userId", label: "User ID", type: "text", placeholder: "contoh: 123456789", helperText: "Lihat di bawah nama karakter pada profil game.", required: true, minLength: 6, maxLength: 12 },
      { key: "zoneId", label: "Zone ID", type: "text", placeholder: "contoh: 1234", helperText: "Angka setelah tanda kurung di samping User ID.", required: true, minLength: 3, maxLength: 5 },
    ],
    packages: [
      { id: "ml-86", name: "86 Diamonds", amountLabel: "86 Diamonds", priceIDR: 22000 },
      { id: "ml-172", name: "172 Diamonds", amountLabel: "172 Diamonds", priceIDR: 44000, bonusLabel: "+17 Bonus" },
      { id: "ml-257", name: "257 Diamonds", amountLabel: "257 Diamonds", priceIDR: 66000, isPopular: true },
      { id: "ml-344", name: "344 Diamonds", amountLabel: "344 Diamonds", priceIDR: 88000, bonusLabel: "+34 Bonus" },
      { id: "ml-429", name: "429 Diamonds", amountLabel: "429 Diamonds", priceIDR: 110000, originalPriceIDR: 120000 },
      { id: "ml-weekly", name: "Weekly Diamond Pass", amountLabel: "Weekly Pass", priceIDR: 30000, bonusLabel: "Bonus harian" },
    ],
    paymentMethodGroups,
    promoCodes,
    descriptionSections: [
      { heading: "Deskripsi", body: "Diamonds adalah mata uang utama di Mobile Legends: Bang Bang, digunakan untuk membeli skin, hero, dan Battle Pass. Top up di BagasTopup diproses otomatis lewat sistem resmi Moonton." },
      { heading: "Info Pengiriman", body: "Pesanan diproses instan setelah pembayaran dikonfirmasi. Pastikan User ID dan Zone ID sudah benar sebelum checkout." },
      { heading: "Syarat & Ketentuan", body: "Harga sudah termasuk pajak. Pesanan yang sudah diproses tidak dapat dibatalkan. Kesalahan input data akun menjadi tanggung jawab pembeli." },
    ],
    howToSteps: defaultHowToSteps,
    importantNotes: defaultImportantNotes,
    faq: defaultFaq,
    reviews: defaultReviews,
    recommendedProductIds: ["ff-diamonds", "pubgm-uc", "valorant-points", "hsr-oneiric"],
  },
  "ff-diamonds": {
    productId: "ff-diamonds",
    heroImageSrc: "/games/free-fire.svg",
    shortDescription: "Top up Diamonds Free Fire, langsung masuk ke akun tanpa perlu login.",
    soldCount: 98210,
    rating: 4.8,
    reviewCount: 2540,
    infoHighlights: defaultInfoHighlights,
    inputFields: [
      { key: "playerId", label: "Player ID", type: "text", placeholder: "contoh: 123456789", helperText: "Cek di halaman profil dalam game Free Fire.", required: true, minLength: 6, maxLength: 12 },
    ],
    packages: [
      { id: "ff-50", name: "50 Diamonds", amountLabel: "50 Diamonds", priceIDR: 8000 },
      { id: "ff-115", name: "115 Diamonds", amountLabel: "115 Diamonds", priceIDR: 16000, bonusLabel: "+5 Bonus" },
      { id: "ff-240", name: "240 Diamonds", amountLabel: "240 Diamonds", priceIDR: 32000, isPopular: true },
      { id: "ff-355", name: "355 Diamonds", amountLabel: "355 Diamonds", priceIDR: 48000, originalPriceIDR: 52000 },
      { id: "ff-720", name: "720 Diamonds", amountLabel: "720 Diamonds", priceIDR: 96000, bonusLabel: "+40 Bonus" },
    ],
    paymentMethodGroups,
    promoCodes,
    descriptionSections: [
      { heading: "Deskripsi", body: "Diamonds Free Fire dipakai untuk membeli bundle, karakter, dan item eksklusif di dalam game." },
      { heading: "Info Pengiriman", body: "Item masuk otomatis ke akun berdasarkan Player ID, proses instan tanpa perlu login akun." },
      { heading: "Syarat & Ketentuan", body: "Pastikan Player ID benar. Pesanan yang salah input ID di luar tanggung jawab kami." },
    ],
    howToSteps: [
      { order: 1, title: "Masukkan Player ID", description: "Isi Player ID akun Free Fire kamu." },
      { order: 2, title: "Pilih Paket", description: "Pilih nominal Diamonds yang diinginkan." },
      { order: 3, title: "Pilih Pembayaran", description: "Bayar pakai e-wallet, VA, minimarket, atau QRIS." },
      { order: 4, title: "Selesaikan Pembayaran", description: "Ikuti instruksi pembayaran sampai selesai." },
      { order: 5, title: "Diamonds Langsung Masuk", description: "Diamonds otomatis masuk ke akun dalam hitungan detik." },
    ],
    importantNotes: defaultImportantNotes,
    faq: defaultFaq,
    reviews: defaultReviews,
    recommendedProductIds: ["mlbb-diamonds", "pubgm-uc", "garena-shells", "codm"].filter((id) => products.some((p) => p.id === id)),
  },
  "pubgm-uc": {
    productId: "pubgm-uc",
    heroImageSrc: "/games/pubg-mobile.svg",
    shortDescription: "Top up UC PUBG Mobile resmi, pilih server sesuai akun kamu.",
    soldCount: 54120,
    rating: 4.7,
    reviewCount: 1876,
    infoHighlights: defaultInfoHighlights,
    inputFields: [
      { key: "userId", label: "Character ID", type: "text", placeholder: "contoh: 5123456789", helperText: "Lihat di halaman profil dalam game PUBG Mobile.", required: true, minLength: 8, maxLength: 12 },
      {
        key: "server",
        label: "Server",
        type: "select",
        placeholder: "Pilih server",
        helperText: "Sesuaikan dengan region akun kamu.",
        required: true,
        options: [
          { value: "asia", label: "Asia" },
          { value: "krjp", label: "Korea/Japan" },
          { value: "na-eu", label: "North America/Europe" },
          { value: "sea", label: "Southeast Asia" },
        ],
      },
    ],
    packages: [
      { id: "uc-60", name: "60 UC", amountLabel: "60 UC", priceIDR: 15000 },
      { id: "uc-325", name: "325 UC", amountLabel: "325 UC", priceIDR: 75000, bonusLabel: "+25 Bonus" },
      { id: "uc-660", name: "660 UC", amountLabel: "660 UC", priceIDR: 150000, isPopular: true },
      { id: "uc-1800", name: "1800 UC", amountLabel: "1800 UC", priceIDR: 375000, originalPriceIDR: 400000 },
    ],
    paymentMethodGroups,
    promoCodes,
    descriptionSections: [
      { heading: "Deskripsi", body: "UC (Unknown Cash) adalah mata uang premium PUBG Mobile untuk membeli Royale Pass, skin, dan crate." },
      { heading: "Info Pengiriman", body: "Pastikan Character ID dan Server sesuai akun aktif kamu, pesanan diproses otomatis setelah pembayaran." },
      { heading: "Syarat & Ketentuan", body: "Salah pilih server dapat menyebabkan UC tidak masuk ke akun yang dimaksud, dan tidak dapat direfund." },
    ],
    howToSteps: defaultHowToSteps,
    importantNotes: defaultImportantNotes,
    faq: defaultFaq,
    reviews: defaultReviews,
    recommendedProductIds: ["mlbb-diamonds", "ff-diamonds", "valorant-points", "codm"].filter((id) => products.some((p) => p.id === id)),
  },
}

/** Combines the list-card `Product` with its heavier detail config; undefined if either half is missing (dummy data doesn't cover every product yet). */
function getProductWithDetail(id: string): ProductWithDetail | undefined {
  const product = products.find((p) => p.id === id)
  const detail = productDetails[id]
  if (!product || !detail) return undefined
  return { ...product, ...detail }
}

export { getProductWithDetail }
