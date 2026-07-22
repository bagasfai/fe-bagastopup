import {
  BadgePercentIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { trustPoints, type TrustPointIconKey } from "@/lib/dummy-data"

const TRUST_ICONS: Record<TrustPointIconKey, LucideIcon> = {
  zap: ZapIcon,
  "shield-check": ShieldCheckIcon,
  headset: HeadsetIcon,
  "badge-percent": BadgePercentIcon,
}

// Server Component: no card boxes, no scroll reveal — a hairline-divided
// strip with the icon inline beside the heading, not stacked above it (the
// icon-tile card grid is the single most recognised AI feature-block tell).
function TrustRowSection() {
  return (
    <section className="mx-auto max-w-6xl border-y border-border px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {trustPoints.map((point) => {
          const Icon = TRUST_ICONS[point.iconKey]
          return (
            <div key={point.id} className="flex gap-3 px-0 py-4 sm:px-5 sm:first:pl-0">
              <Icon className="size-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h3 className="font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { TrustRowSection }
