import { StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"

import type { ProductReview } from "@/lib/dummy-product-detail"

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="text-primary flex gap-0.5" aria-label={`${rating} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn("size-3.5", index < rating ? "fill-current" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  )
}

/** Server Component — static dummy reviews, no interactivity. */
function CustomerReviewsSection({
  reviews,
  averageRating,
  reviewCount,
}: {
  reviews: ProductReview[]
  averageRating: number
  reviewCount: number
}) {
  if (reviews.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-foreground text-base font-semibold sm:text-lg">Ulasan Pembeli</h2>
        <div className="flex items-center gap-1.5 text-sm">
          <StarIcon className="text-primary size-4 fill-current" />
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviewCount.toLocaleString("id-ID")} ulasan)</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="border-border bg-card rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback>{review.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{review.name}</p>
                <ReviewStars rating={review.rating} />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export { CustomerReviewsSection }
