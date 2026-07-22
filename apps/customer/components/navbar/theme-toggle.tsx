"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()
  // next-themes can't know the real theme until after hydration, so we
  // render a neutral placeholder first to avoid a server/client mismatch.
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11 shrink-0 overflow-hidden sm:size-9"
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            className="inline-flex"
            initial={prefersReducedMotion ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </motion.span>
        </AnimatePresence>
      )}
    </Button>
  )
}

export { ThemeToggle }
