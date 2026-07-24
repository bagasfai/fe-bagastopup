import { z } from "zod"

import type { InputFieldConfig } from "@/lib/product-detail-types"

/**
 * Account fields are config-driven (a product can ask for 1 field or 3, a
 * mix of text/select) so this schema can't be a fixed z.object shape.
 * It's built from whatever `inputFields` the product provides, keyed by
 * each field's own `key`. `PurchaseFormValues.accountFields` is typed as a
 * plain string record (rather than trying to statically type a dynamic
 * key set) since every field's value is a string regardless of product.
 */
export type PurchaseFormValues = {
  accountFields: Record<string, string>
  packageId: string
  paymentMethodId: string
}

function buildPurchaseSchema(inputFields: InputFieldConfig[]) {
  const accountFieldsShape: Record<string, z.ZodTypeAny> = {}

  for (const field of inputFields) {
    let fieldSchema = z.string().trim()
    if (field.required) {
      fieldSchema = fieldSchema.min(1, `${field.label} wajib diisi`)
    }
    if (field.minLength) {
      fieldSchema = fieldSchema.refine((value) => value.length === 0 || value.length >= field.minLength!, {
        message: `${field.label} minimal ${field.minLength} karakter`,
      })
    }
    if (field.maxLength) {
      fieldSchema = fieldSchema.max(field.maxLength, `${field.label} maksimal ${field.maxLength} karakter`)
    }
    accountFieldsShape[field.key] = fieldSchema
  }

  return z.object({
    accountFields: z.object(accountFieldsShape),
    packageId: z.string().min(1, "Pilih paket top up terlebih dahulu"),
    paymentMethodId: z.string().min(1, "Pilih metode pembayaran terlebih dahulu"),
  })
}

function defaultPurchaseValues(inputFields: InputFieldConfig[]): PurchaseFormValues {
  return {
    accountFields: Object.fromEntries(inputFields.map((field) => [field.key, ""])),
    packageId: "",
    paymentMethodId: "",
  }
}

export { buildPurchaseSchema, defaultPurchaseValues }
