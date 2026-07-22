import {
  ClapperboardIcon,
  CoinsIcon,
  DropletIcon,
  FlameIcon,
  GamepadIcon,
  GemIcon,
  GiftIcon,
  HeartPulseIcon,
  MonitorPlayIcon,
  MusicIcon,
  PlayIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  SparklesIcon,
  StarIcon,
  SwordsIcon,
  TvIcon,
  WalletIcon,
  WifiIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import type { ProductIconKey } from "@/lib/dummy-data"

// Dummy data stores icons as a plain string key (ProductIconKey) instead of
// a component reference, so this is the one place that maps it to an
// actual lucide-react icon.
const PRODUCT_ICONS: Record<ProductIconKey, LucideIcon> = {
  gem: GemIcon,
  flame: FlameIcon,
  swords: SwordsIcon,
  sparkles: SparklesIcon,
  gamepad: GamepadIcon,
  star: StarIcon,
  "shopping-bag": ShoppingBagIcon,
  wallet: WalletIcon,
  gift: GiftIcon,
  coins: CoinsIcon,
  smartphone: SmartphoneIcon,
  wifi: WifiIcon,
  zap: ZapIcon,
  droplet: DropletIcon,
  "heart-pulse": HeartPulseIcon,
  tv: TvIcon,
  music: MusicIcon,
  clapperboard: ClapperboardIcon,
  "monitor-play": MonitorPlayIcon,
  play: PlayIcon,
}

function ProductIcon({
  iconKey,
  className,
}: {
  iconKey: ProductIconKey
  className?: string
}) {
  const Icon = PRODUCT_ICONS[iconKey]
  return <Icon className={className} />
}

export { ProductIcon }
