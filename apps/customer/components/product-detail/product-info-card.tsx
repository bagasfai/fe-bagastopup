import type { ProductInfoHighlight } from "@/lib/dummy-product-detail"
import { InfoHighlightIcon } from "@/components/product-detail/info-highlight-icon"

/** Server Component — renders whatever `infoHighlights` the product config has, no fixed count assumed. */
function ProductInfoCard({ highlights }: { highlights: ProductInfoHighlight[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="border-border bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-3 lg:grid-cols-5">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="bg-card flex flex-col gap-1.5 p-4">
            <InfoHighlightIcon iconKey={highlight.iconKey} className="text-primary size-5" />
            <span className="text-muted-foreground text-xs">{highlight.label}</span>
            <span className="text-foreground text-sm font-medium">{highlight.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export { ProductInfoCard }
