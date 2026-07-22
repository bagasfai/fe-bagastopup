"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { useTypewriterPlaceholder } from "@/hooks/use-typewriter-placeholder"

const SEARCH_WORDS = [
  "Cari Mobile Legends...",
  "Cari Free Fire...",
  "Cari PUBG Mobile...",
  "Cari Genshin Impact...",
]

function SearchField({
  value,
  onChange,
  onFocus,
  onBlur,
  animatedPlaceholder,
  autoFocus,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  animatedPlaceholder: string
  autoFocus?: boolean
  className?: string
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  // The real placeholder attribute can't have animated child elements, so
  // once there's real input we hide this overlay and let the (empty) input
  // take over — same behavior a native placeholder would have.
  const showFakePlaceholder = value.length === 0

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        aria-label="Cari game atau produk"
        className="h-11 rounded-full pl-9 sm:h-9"
      />
      {showFakePlaceholder && (
        <div className="pointer-events-none absolute inset-y-0 left-9 flex items-center overflow-hidden pr-9 text-sm text-muted-foreground">
          <span className="truncate">{animatedPlaceholder}</span>
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-4 w-px shrink-0 bg-muted-foreground"
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }
            }
          />
        </div>
      )}
    </div>
  )
}

function SearchBar() {
  const [value, setValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const debouncedValue = useDebouncedValue(value, 400)
  React.useEffect(() => {
    if (!debouncedValue) return
    // No search API yet — this is where a future `searchProducts(query)`
    // call would go, already debounced so it won't fire on every keystroke.
  }, [debouncedValue])

  const animatedPlaceholder = useTypewriterPlaceholder(SEARCH_WORDS, {
    paused: isFocused || value.length > 0,
  })

  const fieldProps = {
    value,
    onChange: setValue,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    animatedPlaceholder,
  }

  return (
    <>
      <SearchField {...fieldProps} className="hidden w-full max-w-sm sm:block" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 sm:hidden"
        aria-label="Buka pencarian"
        onClick={() => setMobileOpen(true)}
      >
        <SearchIcon />
      </Button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-1 border-b border-border bg-background px-3 sm:hidden"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
          >
            <SearchField {...fieldProps} autoFocus className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 shrink-0"
              aria-label="Tutup pencarian"
              onClick={() => setMobileOpen(false)}
            >
              <XIcon />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { SearchBar }
