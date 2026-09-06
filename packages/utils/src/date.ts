import { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from './constants'

export function toThaiBuddhistYear(date: Date = new Date()): number {
  return date.getFullYear() + 543
}

export function formatThaiDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    timeZone: DEFAULT_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
