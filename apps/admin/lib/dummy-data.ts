// All data on this page is hardcoded placeholder data for laying out the
// admin UI. Nothing here is fetched from an API yet — that's a later step.
//
// Products, Sellers, and Transactions now come from the real backend via
// @workspace/api-client, so there's no dummy data for those here anymore.
// The dashboard overview stats below are still placeholders — wiring the
// dashboard summary/chart to real data wasn't part of this pass.

export const dashboardStats = {
  totalTransactionsToday: 128,
  revenueToday: 4820500,
  pendingTransactions: 6,
  activeProducts: 6,
}

export interface DailyRevenue {
  date: string
  revenue: number
}

export const weeklyRevenue: DailyRevenue[] = [
  { date: "Jul 10", revenue: 3120000 },
  { date: "Jul 11", revenue: 3980000 },
  { date: "Jul 12", revenue: 2870000 },
  { date: "Jul 13", revenue: 4410000 },
  { date: "Jul 14", revenue: 3650000 },
  { date: "Jul 15", revenue: 5230000 },
  { date: "Jul 16", revenue: 4820500 },
]
