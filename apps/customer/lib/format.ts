const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

/** Formats a whole-rupiah amount, e.g. formatIDR(15000) -> "Rp15.000". */
function formatIDR(amount: number) {
  return idrFormatter.format(amount)
}

/** Formats a payment method's admin fee, e.g. formatFee(0) -> "Gratis", formatFee(2500) -> "+Rp2.500". */
function formatFee(feeIDR: number) {
  return feeIDR === 0 ? "Gratis" : `+${formatIDR(feeIDR)}`
}

export { formatIDR, formatFee }
