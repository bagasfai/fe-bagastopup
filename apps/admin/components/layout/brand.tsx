import { ZapIcon } from "lucide-react"

function Brand() {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ZapIcon className="size-4" />
      </div>
      <span className="font-heading text-sm font-semibold tracking-tight">
        BagasTopup
      </span>
    </div>
  )
}

export { Brand }
