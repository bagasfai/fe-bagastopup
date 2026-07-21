import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  PackageIcon,
  StoreIcon,
  ReceiptTextIcon,
  TagIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

// Single source of truth for nav links so the desktop sidebar and the
// mobile drawer (Sheet) can't drift out of sync.
export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { title: "Products", href: "/products", icon: PackageIcon },
  { title: "Categories", href: "/categories", icon: TagIcon },
  { title: "Sellers", href: "/sellers", icon: StoreIcon },
  { title: "Transactions", href: "/transactions", icon: ReceiptTextIcon },
]
