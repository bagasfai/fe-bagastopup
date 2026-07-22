"use client"

import { motion } from "framer-motion"
import { MessageCircleIcon } from "lucide-react"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

// Placeholder business number — swap for the real one before launch.
const WHATSAPP_NUMBER = "62XXXXXXXXXX"

// Client Component: the pulse animation and hover/tap feedback both need
// the client. Fixed at bottom-right; the mobile search overlay is
// top-anchored so the two never occupy the same screen region.
function FloatingCsButton() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6">
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary"
          animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Customer Service via WhatsApp"
        className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      >
        <MessageCircleIcon className="size-6" />
      </motion.a>
    </div>
  )
}

export { FloatingCsButton }
