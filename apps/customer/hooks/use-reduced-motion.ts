"use client"

import * as React from "react"

/**
 * Tracks the OS-level `prefers-reduced-motion` setting so components can
 * swap Framer Motion animations for instant/no-op transitions. Every
 * animated section in this app should check this before animating.
 */
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    function onChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return prefersReducedMotion
}

export { usePrefersReducedMotion }
