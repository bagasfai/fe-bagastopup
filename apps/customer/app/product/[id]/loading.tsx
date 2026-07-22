import { Skeleton } from "@workspace/ui/components/skeleton"

/**
 * Automatic Suspense fallback for this route segment (Next's `loading.tsx`
 * convention) — with today's synchronous dummy data this resolves almost
 * instantly, but it's what will actually show once product/package/
 * payment data comes from a real fetch, so the shapes here mirror
 * ProductHeader, ProductInfoCard, and the purchase form's first two steps.
 */
export default function ProductDetailLoading() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="h-4 w-56" />
      </div>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Skeleton className="size-28 shrink-0 rounded-2xl sm:size-36" />
            <div className="flex w-full flex-col items-center gap-3 sm:items-start">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-64 max-w-full" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-none" />
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-6">
            <div className="flex flex-col gap-4 lg:gap-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  )
}
