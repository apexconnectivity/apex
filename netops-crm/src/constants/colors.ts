/**
 * Paleta de colores centralizada para la aplicación
 * Usar estos colores para mantener consistencia en toda la app
 */

export const APP_COLORS = {
  // Colores principales
  primary: '#06b6d4',    // cyan-500
  success: '#10b981',    // emerald-500
  warning: '#f59e0b',    // amber-500
  danger: '#ef4444',     // red-500
  info: '#3b82f6',        // blue-500
  purple: '#8b5cf6',     // violet-500
  neutral: '#6b7280',    // gray-500
  slate: '#334155',      // slate-700 (para datos vacíos)
} as const

export const CHART_PALETTE = [
  APP_COLORS.primary,
  APP_COLORS.info,
  APP_COLORS.purple,
  APP_COLORS.warning,
  APP_COLORS.success,
  APP_COLORS.danger,
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
] as const

export type AppColorKey = keyof typeof APP_COLORS
