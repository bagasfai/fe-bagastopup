import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  LayersIcon,
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
  // CategoryGroup — the storefront grouping above Category ("Mobile
  // Game" / "Voucher" / "Entertainment"). See ADR-0002 in
  // be-bagastopup.
  { title: "Category Groups", href: "/category-groups", icon: LayersIcon },
  { title: "Sellers", href: "/sellers", icon: StoreIcon },
  { title: "Transactions", href: "/transactions", icon: ReceiptTextIcon },
]
