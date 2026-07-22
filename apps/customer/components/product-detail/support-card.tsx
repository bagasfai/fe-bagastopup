import { MessageCircleIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"

import { WHATSAPP_NUMBER } from "@/components/cs-button/floating-cs-button"

/** Server Component — plain link, no client state needed (reuses the same placeholder WhatsApp number as the floating CS button). */
function SupportCard() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Card className="bg-primary/5 border-primary/20 flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-foreground font-semibold">Butuh bantuan?</p>
          <p className="text-muted-foreground text-sm">Tim CS kami siap bantu kendala transaksi kamu, kapan saja.</p>
        </div>
        <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <MessageCircleIcon className="size-4" />
            Chat WhatsApp
          </a>
        </Button>
      </Card>
    </section>
  )
}

export { SupportCard }
