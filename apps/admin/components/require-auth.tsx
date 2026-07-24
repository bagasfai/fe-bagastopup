"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"

import { useAuthStore } from "@workspace/api-client/auth-store"
import { useAuthHydrated } from "@workspace/api-client/use-auth-hydrated"
import { useMe } from "@workspace/api-client/hooks/use-auth"

// Client-side gate: there's no server session (JWT lives in localStorage,
// not a cookie middleware.ts can read), so the definitive check can only
// run after mount. Two things have to happen before children render:
// 1. wait for the persisted token to rehydrate (`hasHydrated`), so a real
//    session doesn't get bounced to /login on every hard refresh
// 2. call useMe() to confirm the backend still accepts that token — a
//    token can look present but be expired/revoked, and middleware.ts
//    can only check "does a session cookie exist", not "is it still valid"
function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hasHydrated = useAuthHydrated()
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.setSession)
  const { data: me, isError } = useMe()

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login")
    }
  }, [hasHydrated, token, router])

  // Keep the store's `user` in sync with the backend's current record —
  // role or is_active may have changed since the token was issued.
  useEffect(() => {
    if (me && token) {
      setSession(token, me)
    }
  }, [me, token, setSession])

  // On a rejected token, apiFetch's global 401 handler already clears the
  // session and redirects to /login — render nothing while that's in
  // flight rather than flashing the dashboard shell.
  if (!hasHydrated || !token || isError) {
    return null
  }

  if (!me) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}

export { RequireAuth }
