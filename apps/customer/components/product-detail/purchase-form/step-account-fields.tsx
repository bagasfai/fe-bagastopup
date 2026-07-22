"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldContent, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

import type { InputFieldConfig } from "@/lib/dummy-product-detail"
import type { PurchaseFormValues } from "./schema"
import { NumberedStepCard } from "./numbered-step-card"

/**
 * Renders whatever `fields` the product config provides — one text input
 * (Free Fire), two (Mobile Legends), or a text + select mix (PUBG
 * Mobile's server picker). No component here assumes a fixed field count.
 */
function StepAccountFields({ fields }: { fields: InputFieldConfig[] }) {
  const form = useFormContext<PurchaseFormValues>()
  const errors = form.formState.errors.accountFields

  return (
    <NumberedStepCard step={1} title="Masukkan Akun Game" description="Isi data akun sesuai kolom di bawah ini.">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const fieldError = errors?.[field.key]
          const fieldId = `account-${field.key}`

          return (
            <Field key={field.key} data-invalid={!!fieldError}>
              <FieldLabel htmlFor={fieldId}>
                {field.label}
                {!field.required && <span className="text-muted-foreground font-normal"> (opsional)</span>}
              </FieldLabel>
              <FieldContent>
                {field.type === "select" ? (
                  <Controller
                    control={form.control}
                    name={`accountFields.${field.key}`}
                    render={({ field: controllerField }) => (
                      <Select value={controllerField.value} onValueChange={controllerField.onChange}>
                        <SelectTrigger id={fieldId} className="w-full">
                          <SelectValue placeholder={field.placeholder ?? "Pilih"} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    id={fieldId}
                    placeholder={field.placeholder}
                    className="h-11"
                    {...form.register(`accountFields.${field.key}`)}
                  />
                )}
                {field.helperText && !fieldError && (
                  <p className="text-muted-foreground text-xs">{field.helperText}</p>
                )}
                <FieldError errors={[fieldError]} />
              </FieldContent>
            </Field>
          )
        })}
      </div>
    </NumberedStepCard>
  )
}

export { StepAccountFields }
