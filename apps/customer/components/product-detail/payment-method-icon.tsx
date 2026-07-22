import { LandmarkIcon, QrCodeIcon, StoreIcon, WalletIcon, type LucideIcon } from "lucide-react"

import type { PaymentMethodIconKey } from "@/lib/dummy-product-detail"

const PAYMENT_METHOD_ICONS: Record<PaymentMethodIconKey, LucideIcon> = {
  wallet: WalletIcon,
  landmark: LandmarkIcon,
  store: StoreIcon,
  "qr-code": QrCodeIcon,
}

function PaymentMethodIcon({ iconKey, className }: { iconKey: PaymentMethodIconKey; className?: string }) {
  const Icon = PAYMENT_METHOD_ICONS[iconKey]
  return <Icon className={className} />
}

export { PaymentMethodIcon }
