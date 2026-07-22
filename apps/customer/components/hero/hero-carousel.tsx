"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@workspace/ui/components/carousel"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { EASE_OUT } from "@/lib/motion"
import type { HeroSlide } from "@/lib/dummy-data"

function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [api, setApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  // Lazy useState initializer (not a plain value) so the plugin instance is
  // only constructed once — re-renders won't recreate it and restart its
  // internal timer. Using state instead of a ref keeps it safe to read
  // during render (reading ref.current during render breaks React's rules).
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  React.useEffect(() => {
    if (!api) return
    setSelectedIndex(api.selectedScrollSnap())
    api.on("select", () => setSelectedIndex(api.selectedScrollSnap()))
  }, [api])

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6"
      aria-label="Promo dan pengumuman"
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        // Disable autoplay entirely under reduced-motion instead of just
        // slowing it down — a user who opted out of motion shouldn't have
        // content changing under them on its own.
        plugins={prefersReducedMotion ? [] : [autoplay]}
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="basis-full pl-0">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl ring-1 ring-foreground/10 sm:aspect-[21/9]">
                <Image
                  src={slide.imageSrc}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 1152px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <motion.div
                  className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-8"
                  initial={false}
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0 }
                      : selectedIndex === index
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 16 }
                  }
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <h2 className="max-w-md text-xl font-semibold text-white sm:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="max-w-md text-sm text-white/85 sm:text-base">
                    {slide.description}
                  </p>
                  {slide.ctaLabel && (
                    <Button asChild size="lg" className="mt-2 w-fit whitespace-nowrap">
                      <a href={slide.ctaHref}>{slide.ctaLabel}</a>
                    </Button>
                  )}
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 hidden sm:flex" />
        <CarouselNext className="right-2 hidden sm:flex" />
      </Carousel>

      <div className="mt-3 flex justify-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ke slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-[width,background-color] duration-200 ease-out",
              index === selectedIndex
                ? "w-6 bg-primary"
                : "w-2 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </section>
  )
}

export { HeroCarousel }
