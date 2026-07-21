// BagasTopup sells game top-ups to Indonesian customers, so every price in
// the admin UI is formatted as Rupiah rather than a locale-generic currency.
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate))
}
