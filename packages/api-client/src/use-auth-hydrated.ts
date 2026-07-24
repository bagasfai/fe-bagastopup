"use client"

import { useEffect, useState } from "react"

// Next.js server-renders the auth store in its logged-out default state (no
// access to localStorage on the server), then the client re-renders with
// whatever persist() rehydrated from localStorage — if a component's
// output depends on `user`/`token` on the very first client render, that
// mismatch trips React's hydration check. Every such component should
// treat `!hasHydrated` the same as "still loading" and defer any
// authed-vs-anonymous branching until after this flips to true.
function useAuthHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}

export { useAuthHydrated }
