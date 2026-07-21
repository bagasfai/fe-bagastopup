"use client"

import { usePathname } from "next/navigation"

import { navItems } from "@/lib/nav"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"

function Topbar() {
  const pathname = usePathname()
  const title =
    navItems.find((item) => item.href === pathname)?.title ?? "Dashboard"

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <MobileSidebar />
      <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>
      <ThemeToggle />
      <UserNav />
    </header>
  )
}

export { Topbar }
