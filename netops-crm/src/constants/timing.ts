// Timing constants
export const AUTO_ADVANCE_DELAY_MS = 1000

// Time constants
export const MS_PER_SECOND = 1000
export const MS_PER_MINUTE = 60000
export const MS_PER_HOUR = 3600000
export const MS_PER_DAY = 86400000

// Common delays
export const MESSAGE_TIMEOUT_MS = 3000
export const DEBOUNCE_DELAY_MS = 300

// Helper functions
export function daysBetween(date1: Date, date2: Date): number {
  return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / MS_PER_DAY)
}

export function daysFromNow(date: Date): number {
  return daysBetween(date, new Date())
}

// Common time spans in milliseconds
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
