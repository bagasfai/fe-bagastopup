"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

import { Switch } from "@workspace/ui/components/switch"

const noopSubscribe = () => () => {}

// next-themes reads localStorage/system preference only after mount, so
// resolvedTheme is undefined on the server render. useSyncExternalStore lets
// us report "mounted" without a setState-in-effect render cascade, avoiding
// a hydration mismatch / flash of the wrong state.
function useHasMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useHasMounted()

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <SunIcon className="size-4 text-muted-foreground" />
      <Switch
        checked={isDark}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <MoonIcon className="size-4 text-muted-foreground" />
    </div>
  )
}

export { ThemeToggle }
