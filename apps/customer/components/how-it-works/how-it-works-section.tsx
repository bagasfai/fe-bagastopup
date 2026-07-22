import {
  CreditCardIcon,
  MousePointerClickIcon,
  PartyPopperIcon,
  UserRoundPenIcon,
  type LucideIcon,
} from "lucide-react"

import { howItWorksSteps, type HowItWorksIconKey } from "@/lib/dummy-data"

const STEP_ICONS: Record<HowItWorksIconKey, LucideIcon> = {
  "mouse-pointer-click": MousePointerClickIcon,
  "user-round-pen": UserRoundPenIcon,
  "credit-card": CreditCardIcon,
  "party-popper": PartyPopperIcon,
}

// Server Component: no scroll-triggered reveal — the numbered sequence
// already communicates order without an animation reinforcing it, and a
// second scroll-fade section (after Trust Row) would read as templated.
function HowItWorksSection() {
  return (
    <section
      id="cara-kerja"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <h2 className="mb-10 border-b border-border pb-3 text-lg font-semibold sm:text-2xl">
        Cara Kerja
      </h2>

      <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-4 sm:gap-4">
        <div
          aria-hidden
          className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-border sm:block"
        />

        {howItWorksSteps.map((step) => {
          const Icon = STEP_ICONS[step.iconKey]
          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center gap-3 text-center"
            >
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(step.order).padStart(2, "0")}
              </p>
              <h3 className="-mt-2 font-semibold">{step.title}</h3>
              <p className="max-w-48 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { HowItWorksSection }
