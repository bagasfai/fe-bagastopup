import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

export type Status =
  | "active"
  | "inactive"
  | "pending"
  | "processing"
  | "success"
  | "failed"

// Semantic status colors aren't part of the design system's neutral palette,
// so each gets an explicit light/dark pair here rather than hardcoding a
// color that only reads correctly in one theme.
const statusStyles: Record<Status, string> = {
  active:
    "border-emerald-600/20 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400",
  success:
    "border-emerald-600/20 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400",
  inactive: "border-border bg-muted text-muted-foreground",
  pending:
    "border-amber-600/20 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
  processing:
    "border-sky-600/20 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-400",
  failed: "border-destructive/20 bg-destructive/10 text-destructive",
}

function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status
  label?: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", statusStyles[status], className)}
    >
      {label ?? status}
    </Badge>
  )
}

export { StatusBadge }
