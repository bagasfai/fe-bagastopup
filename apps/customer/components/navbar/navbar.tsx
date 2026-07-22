"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"
import { NAV_LINKS } from "@/components/navbar/nav-links"
import { NavLinksSheet } from "@/components/navbar/nav-links-sheet"
import { SearchBar } from "@/components/navbar/search-bar"
import { ThemeToggle } from "@/components/navbar/theme-toggle"
import { UserMenu } from "@/components/navbar/user-menu"

// Client component: it needs a scroll listener to add the elevated/blurred
// look once the page scrolls, which a Server Component can't do.
function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 4)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm transition-shadow",
        isScrolled ? "border-border shadow-sm" : "border-transparent"
      )}
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:gap-4 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="#"
          className="justify-self-start shrink-0 font-mono text-lg font-semibold tracking-tight text-primary"
        >
          BagasTopup
        </Link>

        <nav className="col-start-2 hidden items-center gap-1 justify-self-center md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 col-span-1 flex items-center justify-end gap-1 justify-self-end sm:gap-2 md:col-start-3">
          <SearchBar />
          <ThemeToggle />
          <UserMenu />
          <NavLinksSheet />
        </div>
      </div>
    </header>
  )
}

export { Navbar }
