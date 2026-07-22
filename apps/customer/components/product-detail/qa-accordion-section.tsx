import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion"

import type { QAItem } from "@/lib/dummy-product-detail"

/**
 * Server Component — shared shell for "Important Notes" and "FAQ", which
 * are structurally identical (a list of question/answer pairs). Accordion
 * itself is a Client Component (Radix state), but that doesn't force this
 * wrapper to be one too — a Server Component can render a Client
 * Component child directly.
 */
function QAAccordionSection({ title, items }: { title: string; items: QAItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h2 className="text-foreground mb-4 text-base font-semibold sm:text-lg">{title}</h2>
      <div className="border-border bg-card rounded-xl border px-5 sm:px-6">
        <Accordion type="single" collapsible>
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export { QAAccordionSection }
