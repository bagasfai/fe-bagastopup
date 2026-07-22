"use client"

import { StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card } from "@workspace/ui/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel"
import { cn } from "@workspace/ui/lib/utils"
import { testimonials } from "@/lib/dummy-data"

// Client Component (Embla-based Carousel needs the client); lazy-loaded
// from the page via next/dynamic since it's below the fold.
function TestimonialsSection() {
  return (
    <section
      id="testimoni"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <h2 className="mb-6 border-b border-border pb-3 text-lg font-semibold sm:text-2xl">
        Kata Mereka
      </h2>

      <Carousel opts={{ align: "start", loop: false }}>
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full gap-3 p-5">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <div className="flex gap-0.5 text-primary">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon
                          key={index}
                          className={cn(
                            "size-3.5",
                            index < testimonial.rating
                              ? "fill-current"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

export { TestimonialsSection }
