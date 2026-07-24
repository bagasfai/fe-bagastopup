/**
 * All placeholder content for the homepage lives here. Shapes are meant to
 * mirror what a real API response would look like (stable `id`, prices as
 * plain numbers in rupiah, icons referenced by a serializable `iconKey`
 * instead of a React component) so swapping this module for a fetch call
 * later shouldn't require touching the section components' JSX.
 */

export type HeroSlide = {
  id: string
  title: string
  description: string
  imageSrc: string
  ctaLabel?: string
  ctaHref?: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: "promo-double-diamonds",
    title: "Double Diamonds Mobile Legends",
    description: "Top up sekarang dan dapatkan bonus diamonds 2x lipat, berlaku sampai akhir bulan.",
    imageSrc: "/hero/promo-1.svg",
    ctaLabel: "Top Up Sekarang",
    ctaHref: "#produk",
  },
  {
    id: "promo-free-fire-bundle",
    title: "Bundle Spesial Free Fire",
    description: "Dapatkan diamond plus bundle eksklusif dengan harga lebih hemat minggu ini.",
    imageSrc: "/hero/promo-2.svg",
    ctaLabel: "Lihat Promo",
    ctaHref: "#produk",
  },
  {
    id: "promo-cashback-voucher",
    title: "Cashback 10% Semua Voucher",
    description: "Belanja voucher game dan hiburan favoritmu, cashback langsung masuk ke saldo.",
    imageSrc: "/hero/promo-3.svg",
    ctaLabel: "Belanja Voucher",
    ctaHref: "#produk",
  },
  {
    id: "promo-new-user",
    title: "Diskon Rp10.000 Pengguna Baru",
    description: "Baru pertama kali top up di BagasTopup? Nikmati potongan langsung tanpa kode promo.",
    imageSrc: "/hero/promo-4.svg",
    ctaLabel: "Daftar & Klaim",
    ctaHref: "#produk",
  },
]

/**
 * NOTE: PopularGame/popularGames used to live here — the homepage's
 * "Game Populer" section now sources this from be-bagastopup's real
 * Category list (see app/page.tsx + components/popular-games/*), so
 * it's gone. productCategories/products below are still dummy and are
 * still used, but only by app/product/[id]'s recommended-products
 * fallback and breadcrumb — a known gap carried forward from ADR-0001
 * (no real cross-category grouping/recommendation exists on the backend
 * yet), not part of the homepage.
 */
export type ProductCategoryId = "top-up-game" | "voucher" | "pulsa-tagihan" | "entertainment"

export type ProductCategory = {
  id: ProductCategoryId
  label: string
}

export const productCategories: ProductCategory[] = [
  { id: "top-up-game", label: "Top Up Game" },
  { id: "voucher", label: "Voucher" },
  { id: "pulsa-tagihan", label: "Pulsa, Data & Tagihan" },
  { id: "entertainment", label: "Entertainment" },
]

/** Maps to a lucide-react icon in product-card.tsx — keeps this data file framework-agnostic. */
export type ProductIconKey =
  | "gem"
  | "flame"
  | "swords"
  | "sparkles"
  | "gamepad"
  | "star"
  | "shopping-bag"
  | "wallet"
  | "gift"
  | "coins"
  | "smartphone"
  | "wifi"
  | "zap"
  | "droplet"
  | "heart-pulse"
  | "tv"
  | "music"
  | "clapperboard"
  | "monitor-play"
  | "play"

export type Product = {
  id: string
  categoryId: ProductCategoryId
  name: string
  iconKey: ProductIconKey
  startingPriceIDR: number
}

export const products: Product[] = [
  // Top Up Game
  { id: "mlbb-diamonds", categoryId: "top-up-game", name: "Mobile Legends Diamonds", iconKey: "gem", startingPriceIDR: 3000 },
  { id: "ff-diamonds", categoryId: "top-up-game", name: "Free Fire Diamonds", iconKey: "flame", startingPriceIDR: 2500 },
  { id: "pubgm-uc", categoryId: "top-up-game", name: "PUBG Mobile UC", iconKey: "swords", startingPriceIDR: 15000 },
  { id: "genshin-crystal", categoryId: "top-up-game", name: "Genshin Impact Genesis Crystal", iconKey: "sparkles", startingPriceIDR: 16000 },
  { id: "valorant-points", categoryId: "top-up-game", name: "Valorant Points", iconKey: "gamepad", startingPriceIDR: 12000 },
  { id: "hsr-oneiric", categoryId: "top-up-game", name: "Honkai Star Rail Oneiric Shard", iconKey: "star", startingPriceIDR: 16000 },
  // Voucher
  { id: "google-play", categoryId: "voucher", name: "Google Play Voucher", iconKey: "shopping-bag", startingPriceIDR: 10000 },
  { id: "steam-wallet", categoryId: "voucher", name: "Steam Wallet Code", iconKey: "wallet", startingPriceIDR: 12000 },
  { id: "psn-store", categoryId: "voucher", name: "PlayStation Store Voucher", iconKey: "gamepad", startingPriceIDR: 60000 },
  { id: "razer-gold", categoryId: "voucher", name: "Razer Gold", iconKey: "coins", startingPriceIDR: 20000 },
  { id: "garena-shells", categoryId: "voucher", name: "Garena Shells", iconKey: "gift", startingPriceIDR: 10000 },
  { id: "roblox-card", categoryId: "voucher", name: "Roblox Gift Card", iconKey: "gift", startingPriceIDR: 50000 },
  // Pulsa, Data & Tagihan
  { id: "pulsa-telkomsel", categoryId: "pulsa-tagihan", name: "Pulsa Telkomsel", iconKey: "smartphone", startingPriceIDR: 5000 },
  { id: "pulsa-indosat", categoryId: "pulsa-tagihan", name: "Pulsa Indosat", iconKey: "smartphone", startingPriceIDR: 5000 },
  { id: "paket-data-xl", categoryId: "pulsa-tagihan", name: "Paket Data XL", iconKey: "wifi", startingPriceIDR: 15000 },
  { id: "token-pln", categoryId: "pulsa-tagihan", name: "Token Listrik PLN", iconKey: "zap", startingPriceIDR: 20000 },
  { id: "tagihan-pdam", categoryId: "pulsa-tagihan", name: "Tagihan PDAM", iconKey: "droplet", startingPriceIDR: 25000 },
  { id: "bpjs-kesehatan", categoryId: "pulsa-tagihan", name: "BPJS Kesehatan", iconKey: "heart-pulse", startingPriceIDR: 35000 },
  // Entertainment
  { id: "netflix", categoryId: "entertainment", name: "Netflix", iconKey: "tv", startingPriceIDR: 54000 },
  { id: "spotify", categoryId: "entertainment", name: "Spotify Premium", iconKey: "music", startingPriceIDR: 27000 },
  { id: "disney-hotstar", categoryId: "entertainment", name: "Disney+ Hotstar", iconKey: "clapperboard", startingPriceIDR: 39000 },
  { id: "youtube-premium", categoryId: "entertainment", name: "YouTube Premium", iconKey: "monitor-play", startingPriceIDR: 29000 },
  { id: "vidio", categoryId: "entertainment", name: "Vidio Platinum", iconKey: "play", startingPriceIDR: 44000 },
  { id: "wetv", categoryId: "entertainment", name: "WeTV VIP", iconKey: "tv", startingPriceIDR: 25000 },
]

/** Maps to a lucide-react icon in how-it-works-section.tsx. */
export type HowItWorksIconKey = "mouse-pointer-click" | "user-round-pen" | "credit-card" | "party-popper"

export type HowItWorksStep = {
  id: string
  order: number
  title: string
  description: string
  iconKey: HowItWorksIconKey
}

export const howItWorksSteps: HowItWorksStep[] = [
  { id: "pilih-produk", order: 1, title: "Pilih Produk", description: "Cari dan pilih game atau layanan yang ingin kamu top up.", iconKey: "mouse-pointer-click" },
  { id: "masukkan-id", order: 2, title: "Masukkan ID & Server", description: "Isi User ID dan Server/Zone ID akun kamu dengan benar.", iconKey: "user-round-pen" },
  { id: "pilih-pembayaran", order: 3, title: "Pilih Pembayaran", description: "Bayar pakai e-wallet, transfer bank, atau QRIS, sesuka kamu.", iconKey: "credit-card" },
  { id: "selesai", order: 4, title: "Selesai dalam Hitungan Detik", description: "Pesanan diproses otomatis dan langsung masuk ke akun game.", iconKey: "party-popper" },
]

/** Maps to a lucide-react icon in trust-row-section.tsx. */
export type TrustPointIconKey = "zap" | "shield-check" | "headset" | "badge-percent"

export type TrustPoint = {
  id: string
  title: string
  description: string
  iconKey: TrustPointIconKey
}

export const trustPoints: TrustPoint[] = [
  { id: "instan", title: "Pengiriman Instan", description: "Pesanan diproses otomatis dan masuk ke akun dalam hitungan detik.", iconKey: "zap" },
  { id: "aman", title: "Pembayaran Aman", description: "Semua transaksi dienkripsi dan diproses lewat payment gateway terpercaya.", iconKey: "shield-check" },
  { id: "support", title: "Support Manusia Asli", description: "Tim CS siap membantu lewat WhatsApp, bukan robot chat semata.", iconKey: "headset" },
  { id: "harga", title: "Harga Terbaik", description: "Harga bersaing dengan promo dan cashback yang rutin diperbarui.", iconKey: "badge-percent" },
]

export type Testimonial = {
  id: string
  name: string
  initials: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Dimas Ardiansyah", initials: "DA", rating: 5, quote: "Top up Mobile Legends langsung masuk kurang dari semenit. Mantap!" },
  { id: "t2", name: "Sarah Nabila", initials: "SN", rating: 5, quote: "Harga vouchernya paling murah dibanding aplikasi lain yang pernah aku coba." },
  { id: "t3", name: "Rizky Pratama", initials: "RP", rating: 4, quote: "Prosesnya cepat, CS-nya juga responsif waktu aku salah masukin ID." },
  { id: "t4", name: "Putri Wulandari", initials: "PW", rating: 5, quote: "Udah langganan buat bayar token listrik, gampang banget dan gak ribet." },
  { id: "t5", name: "Andi Setiawan", initials: "AS", rating: 5, quote: "Tampilan aplikasinya enak dilihat, gampang dipakai buat yang baru pertama kali." },
]
