import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

/**
 * Pure Server Component — no state, no client JS needed for a breadcrumb
 * trail. Keeping this out of any client boundary means it doesn't add to
 * the purchase flow's client bundle.
 */
function ProductBreadcrumb({
  categoryLabel,
  productName,
}: {
  categoryLabel: string
  productName: string
}) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="size-3.5" />
        </li>
        <li>
          <Link href="/#produk" className="hover:text-foreground transition-colors">
            {categoryLabel}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="size-3.5" />
        </li>
        <li aria-current="page" className="text-foreground max-w-[50vw] truncate font-medium sm:max-w-none">
          {productName}
        </li>
      </ol>
    </nav>
  )
}

export { ProductBreadcrumb }
