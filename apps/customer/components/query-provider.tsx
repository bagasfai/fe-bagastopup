"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function QueryProvider({ children }: { children: React.ReactNode }) {
  // New QueryClient per component instance (not module scope) so each
  // request gets its own cache during SSR instead of leaking across users.
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* buttonPosition avoids the dev-only toggle overlapping the
          bottom-right floating WhatsApp CS button. */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}

export { QueryProvider }
