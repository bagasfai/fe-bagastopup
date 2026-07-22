import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

/** Shared shell for the six numbered purchase-flow cards — pure presentation, holds no state. */
function NumberedStepCard({
  step,
  title,
  description,
  children,
}: {
  step: number
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-base">
          <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            {step}
          </span>
          {title}
        </CardTitle>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export { NumberedStepCard }
