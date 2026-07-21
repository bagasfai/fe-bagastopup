"use client"

import { useState } from "react"
import { MenuIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Brand } from "@/components/layout/brand"
import { NavLinks } from "@/components/layout/nav-links"

// Below `md` the fixed sidebar (sidebar.tsx) is hidden entirely, and this
// Sheet-based drawer takes over instead — triggered by a hamburger button
// that lives in the topbar.
function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 sm:max-w-64">
        <SheetHeader className="h-14 justify-center border-b p-0 px-4">
          {/* SheetTitle wraps Brand so the drawer stays labeled for screen readers */}
          <SheetTitle asChild>
            <Brand />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileSidebar }
