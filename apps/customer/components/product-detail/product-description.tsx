/** Server Component — static rich-text content, config-driven so a product can have any number of sections (description, delivery info, terms...). */
function ProductDescription({ sections }: { sections: { heading: string; body: string }[] }) {
  if (sections.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="border-border bg-card divide-border divide-y rounded-xl border">
        {sections.map((section) => (
          <div key={section.heading} className="p-5 sm:p-6">
            <h2 className="text-foreground mb-2 text-base font-semibold sm:text-lg">{section.heading}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{section.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export { ProductDescription }
