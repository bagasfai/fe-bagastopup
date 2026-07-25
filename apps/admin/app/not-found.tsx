import { CompassIcon } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"

import { Brand } from "@/components/layout/brand"

// Sits outside the (dashboard) route group's Sidebar/Topbar/RequireAuth shell
// (unmatched routes never get wrapped by a route group's layout), so this
// renders standalone rather than half-mounting an authenticated shell for a
// page that doesn't exist. Mirrors apps/customer/app/not-found.tsx's
// icon-badge + Alert + Button shape for cross-app consistency.
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="mb-8">
        <Brand />
      </div>
      <div className="bg-muted text-muted-foreground mb-6 flex size-16 items-center justify-center rounded-full">
        <CompassIcon className="size-8" />
      </div>
      <Alert className="max-w-md text-left">
        <AlertTitle>Page not found</AlertTitle>
        <AlertDescription>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Head back to the dashboard to
          keep going.
        </AlertDescription>
      </Alert>
      <Button asChild className="mt-6">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </main>
  )
}
