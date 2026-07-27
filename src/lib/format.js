const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(value) {
  return currency.format(Number.isFinite(value) ? value : 0)
}

/** Signed money for the balance card: an explicit +/− so color is never the only cue. */
export function formatSignedMoney(value) {
  const safe = Number.isFinite(value) ? value : 0
  if (safe === 0) return currency.format(0)
  return `${safe > 0 ? '+' : '−'}${currency.format(Math.abs(safe))}`
}

export function formatPercent(value) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`
}

/** 'YYYY-MM-DD' -> 'YYYY-MM'. Sliced, not Date-parsed, to dodge timezone shifts. */
export function monthKeyOf(isoDate) {
  return typeof isoDate === 'string' ? isoDate.slice(0, 7) : ''
}

/** 'YYYY-MM' -> 'March 2026' */
export function formatMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  if (!year || !month) return monthKey
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

/** 'YYYY-MM-DD' -> 'Mar 4' */
export function formatShortDate(isoDate) {
  const [year, month, day] = String(isoDate).split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function todayIso() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Parse a form amount into a rounded positive number, or null if unusable. */
export function parseAmount(raw) {
  const value = Number.parseFloat(String(raw).replace(/,/g, ''))
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value * 100) / 100
}
