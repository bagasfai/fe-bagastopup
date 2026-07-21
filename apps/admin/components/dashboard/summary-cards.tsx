"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ActivityIcon,
  ClockIcon,
  PackageCheckIcon,
  WalletIcon,
} from "lucide-react"

import { Card, CardContent } from "@workspace/ui/components/card"
import { dashboardStats } from "@/lib/dummy-data"
import { formatCurrency } from "@/lib/format"

interface SummaryCard {
  label: string
  value: string
  icon: LucideIcon
}

const cards: SummaryCard[] = [
  {
    label: "Total Transactions Today",
    value: dashboardStats.totalTransactionsToday.toLocaleString("id-ID"),
    icon: ActivityIcon,
  },
  {
    label: "Revenue Today",
    value: formatCurrency(dashboardStats.revenueToday),
    icon: WalletIcon,
  },
  {
    label: "Pending Transactions",
    value: dashboardStats.pendingTransactions.toLocaleString("id-ID"),
    icon: ClockIcon,
  },
  {
    label: "Active Products",
    value: dashboardStats.activeProducts.toLocaleString("id-ID"),
    icon: PackageCheckIcon,
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

function SummaryCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <motion.div key={card.label} variants={item}>
          <Card>
            <CardContent className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <card.icon className="size-4.5" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export { SummaryCards }
