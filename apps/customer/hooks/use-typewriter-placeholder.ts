"use client"

import * as React from "react"

type UseTypewriterPlaceholderOptions = {
  typingSpeedMs?: number
  deletingSpeedMs?: number
  pauseMs?: number
  /** Freezes the loop at its current text (e.g. input is focused/has a value). */
  paused?: boolean
}

/**
 * Small state machine that types out each word in `words`, pauses, deletes
 * it, then moves to the next word, looping forever. Driven by chained
 * setTimeouts rather than setInterval so it can cleanly pause mid-word
 * (a running interval can't "freeze" partway through a tick).
 */
function useTypewriterPlaceholder(
  words: string[],
  {
    typingSpeedMs = 70,
    deletingSpeedMs = 35,
    pauseMs = 1400,
    paused = false,
  }: UseTypewriterPlaceholderOptions = {}
) {
  const [wordIndex, setWordIndex] = React.useState(0)
  const [text, setText] = React.useState("")
  const [phase, setPhase] = React.useState<"typing" | "deleting">("typing")

  React.useEffect(() => {
    if (paused || words.length === 0) {
      return
    }

    const word = words[wordIndex % words.length] ?? ""

    if (phase === "typing") {
      if (text.length < word.length) {
        const timeout = setTimeout(() => {
          setText(word.slice(0, text.length + 1))
        }, typingSpeedMs)
        return () => clearTimeout(timeout)
      }

      const timeout = setTimeout(() => setPhase("deleting"), pauseMs)
      return () => clearTimeout(timeout)
    }

    // phase === "deleting"
    if (text.length > 0) {
      const timeout = setTimeout(() => {
        setText(word.slice(0, text.length - 1))
      }, deletingSpeedMs)
      return () => clearTimeout(timeout)
    }

    setPhase("typing")
    setWordIndex((index) => (index + 1) % words.length)
  }, [phase, text, wordIndex, paused, words, typingSpeedMs, deletingSpeedMs, pauseMs])

  return text
}

export { useTypewriterPlaceholder }
