import { Brand } from "@/components/layout/brand"
import { NavLinks } from "@/components/layout/nav-links"

// Fixed-width, always-visible sidebar for md+ screens. Hidden entirely on
// mobile — the mobile-sidebar Sheet drawer takes over below `md`.
function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavLinks />
      </div>
    </aside>
  )
}

export { Sidebar }
