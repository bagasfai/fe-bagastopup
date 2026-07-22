const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

/** Formats a whole-rupiah amount, e.g. formatIDR(15000) -> "Rp15.000". */
function formatIDR(amount: number) {
  return idrFormatter.format(amount)
}

export { formatIDR }
