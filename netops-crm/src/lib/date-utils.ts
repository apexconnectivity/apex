/**
 * Utility functions for date formatting
 * Estandariza el formato de fechas en toda la aplicación
 */

/**
 * Formatea una fecha en formato corto (DD/MMM)
 * @param date - Fecha en formato ISO string o YYYY-MM-DD
 * @returns string formateado o '-' si no hay fecha
 */
export function formatDateShort(date?: string): string {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}

/**
 * Formatea una fecha en formato largo (DD MMM YYYY)
 * @param date - Fecha en formato ISO string o YYYY-MM-DD
 * @returns string formateado o 'No especificada' si no hay fecha
 */
export function formatDateLong(date?: string): string {
  if (!date) return 'No especificada'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'No especificada'
  
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Formatea fecha y hora (DD MMM, HH:mm)
 * @param dateTime - Fecha en formato ISO string
 * @returns string formateado
 */
export function formatDateTime(dateTime: string): string {
  return new Date(dateTime).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea un monto con su moneda
 * @param amount - Monto numérico
 * @param currency - Código de moneda (USD, MXN, EUR)
 * @returns string formateado o 'Sin monto' si no hay cantidad
 */
export function formatCurrency(amount?: number, currency: string = 'USD'): string {
  if (!amount || amount === 0) return 'Sin monto'
  return `${currency} ${amount.toLocaleString()}`
}

/**
 * Formatea un monto sin texto, solo número
 * @param amount - Monto numérico
 * @returns string formateado o empty string si no hay cantidad
 */
export function formatAmount(amount?: number): string {
  if (!amount || amount === 0) return ''
  return amount.toLocaleString()
}