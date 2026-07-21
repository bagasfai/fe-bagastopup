"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { TooltipContentProps } from "recharts"

import { weeklyRevenue } from "@/lib/dummy-data"
import { formatCurrency } from "@/lib/format"

function compactCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
}

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">
        {formatCurrency(Number(payload[0]?.value ?? 0))}
      </p>
    </div>
  )
}

// Single-series chart, so one hue (the brand primary) is all identity
// requires — no legend needed per the dataviz color rules.
function RevenueChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={weeklyRevenue} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--muted-foreground)"
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--muted-foreground)"
            width={48}
            tickFormatter={(value: number) => compactCurrency(value)}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} />}
            cursor={{ stroke: "var(--border)" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#revenue-fill)"
            activeDot={{ r: 4, strokeWidth: 0, fill: "var(--primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Screen-reader accessible fallback for the visual chart above */}
      <table className="sr-only">
        <caption>Revenue for the last 7 days</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {weeklyRevenue.map((day) => (
            <tr key={day.date}>
              <td>{day.date}</td>
              <td>{formatCurrency(day.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { RevenueChart }
