import { CalendarIcon, ClockIcon, GlobeIcon, ShieldCheckIcon, ZapIcon, type LucideIcon } from "lucide-react"

import type { InfoHighlightIconKey } from "@/lib/dummy-product-detail"

const INFO_HIGHLIGHT_ICONS: Record<InfoHighlightIconKey, LucideIcon> = {
  zap: ZapIcon,
  "shield-check": ShieldCheckIcon,
  clock: ClockIcon,
  globe: GlobeIcon,
  calendar: CalendarIcon,
}

function InfoHighlightIcon({ iconKey, className }: { iconKey: InfoHighlightIconKey; className?: string }) {
  const Icon = INFO_HIGHLIGHT_ICONS[iconKey]
  return <Icon className={className} />
}

export { InfoHighlightIcon }
