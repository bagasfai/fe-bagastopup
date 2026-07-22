"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"

const feedbackSchema = z.object({
  name: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter"),
})

type FeedbackValues = z.infer<typeof feedbackSchema>

// Client Component: form state, validation, and the submit handler are all
// interactive. No backend yet, so submitting just logs + shows a toast.
function FeedbackFormSection() {
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  function onSubmit(values: FeedbackValues) {
    // Real submission call goes here once there's an API to hit.
    console.log("feedback submitted:", values)
    toast.success("Terima kasih atas masukanmu!")
    form.reset()
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-2 text-lg font-semibold sm:text-2xl">Kasih Masukan</h2>
      <p className="mb-6 border-b border-border pb-6 text-sm text-muted-foreground">
        Ada saran atau kendala? Kami senang mendengarnya.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="feedback-name">Nama (opsional)</FieldLabel>
            <Input
              id="feedback-name"
              placeholder="Nama kamu"
              {...form.register("name")}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="feedback-email">Email</FieldLabel>
            <Input
              id="feedback-email"
              type="email"
              placeholder="nama@email.com"
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.message}>
            <FieldLabel htmlFor="feedback-message">Pesan</FieldLabel>
            <Textarea
              id="feedback-message"
              rows={4}
              placeholder="Tulis masukanmu di sini..."
              {...form.register("message")}
            />
            <FieldError errors={[form.formState.errors.message]} />
          </Field>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-fit"
          >
            Kirim Masukan
          </Button>
        </FieldGroup>
      </form>
    </section>
  )
}

export { FeedbackFormSection }
