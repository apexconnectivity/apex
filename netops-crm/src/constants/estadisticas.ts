/**
 * Constantes para el módulo de estadísticas
 * Centraliza colores, etiquetas y configuraciones reutilizables
 */

import type { StatVariant } from "@/components/ui/mini-stat"

// ============================================================================
// COLORES PARA GRÁFICOS
// ============================================================================

export const CHART_COLORS = {
  // Colores principales (usados en la app)
  primary: '#06b6d4',    // cyan-500
  success: '#10b981',    // emerald-500
  warning: '#f59e0b',    // amber-500
  danger: '#ef4444',      // red-500
  info: '#3b82f6',        // blue-500
  purple: '#8b5cf6',     // violet-500
  neutral: '#6b7280',    // gray-500
  slate: '#334155',       // slate-700 (para datos vacíos)
} as const

export type ChartColorKey = keyof typeof CHART_COLORS

// Paleta de colores para gráficos rotativos
export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.warning,
  CHART_COLORS.success,
  CHART_COLORS.danger,
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
] as const

// ============================================================================
// ETIQUETAS Y TEXTOS
// ============================================================================

export const STATS_LABELS = {
  // Labels generales
  total: 'Total',
  activos: 'Activos',
  cerrados: 'Cerrados',
  pendientes: 'Pendientes',
  completados: 'Completados',
  vencidos: 'Vencidos',
  sinDatos: 'Sin datos',

  // Módulos
  empresas: 'Empresas',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  contactos: 'Contactos',
  proyectos: 'Proyectos',
  tareas: 'Tareas',
  tickets: 'Tickets',
  archivos: 'Archivos',
  reuniones: 'Reuniones',
  contratos: 'Contratos',

  // Gráficos
  porEstado: 'Por Estado',
  porPrioridad: 'Por Prioridad',
  porIndustria: 'Por Industria',
  porTipo: 'Por Tipo',
  porRelacion: 'Tipo de Relación',
  porCategoria: 'Por Categoría',
  porFase: 'Por Fase',

  // Métricas
  valorTotal: 'Valor Total',
  tasaExito: 'Tasa de Éxito',
  tasaCompletacion: 'Tasa de Completación',
  ingresosMensuales: 'Ingresos Mensuales',
  satisfaccion: 'Satisfacción',
  tiempoPromedio: 'Tiempo Promedio',
  ticketsHoy: 'Tickets Hoy',

  // Estados
  abierto: 'Abierto',
  enProgreso: 'En Progreso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',

  // Prioridades
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',

  // Página
  tituloPagina: 'Estadísticas',
  descripcionPagina: 'Panel de métricas y análisis de tu negocio',
  tabResumen: 'Resumen',
  tabCrm: 'CRM',

  // Empty states
  sinActividadReciente: 'Sin actividad reciente',
  noHayTareasProximas: 'No hay tareas próximas',
  noHayReunionesProximas: 'No hay reuniones próximas',
  sinAcceso: 'Sin acceso',
  noTienesPermisos: 'No tienes permisos para ver las estadísticas.',
  proximas: 'Próximas',

  // Fechas
  porMes: '/mes',
  sinRelacion: 'Sin relación',
  vencido: 'Vencida',
  vencidoPlural: 'Vencidas',
} as const

// ============================================================================
// MAPAS DE COLORES POR TIPO DE ENTIDAD
// ============================================================================

// Colores para tipos de entidad (empresas)
export const ENTITY_TYPE_COLORS: Record<string, { label: string; color: string }> = {
  cliente: { label: STATS_LABELS.clientes, color: CHART_COLORS.primary },
  proveedor: { label: STATS_LABELS.proveedores, color: CHART_COLORS.warning },
  ambos: { label: 'Ambos', color: CHART_COLORS.purple },
}

// Colores para estados de proyectos
export const PROJECT_STATUS_COLORS: Record<string, { label: string; color: string }> = {
  activo: { label: STATS_LABELS.activos, color: CHART_COLORS.success },
  cerrado: { label: STATS_LABELS.cerrados, color: CHART_COLORS.info },
}

// Colores para estados de tareas
export const TASK_STATUS_COLORS_MAP: Record<string, { label: string; color: string }> = {
  'Completada': { label: STATS_LABELS.completados, color: CHART_COLORS.success },
  'En progreso': { label: STATS_LABELS.enProgreso, color: CHART_COLORS.info },
  'Pendiente': { label: STATS_LABELS.pendientes, color: CHART_COLORS.warning },
}

// Colores para prioridades
export const PRIORITY_COLORS_MAP: Record<string, { label: string; color: string }> = {
  Urgente: { label: STATS_LABELS.urgente, color: CHART_COLORS.danger },
  Alta: { label: STATS_LABELS.alta, color: CHART_COLORS.warning },
  Media: { label: STATS_LABELS.media, color: CHART_COLORS.info },
  Baja: { label: STATS_LABELS.baja, color: CHART_COLORS.neutral },
}

// Colores para estados de tickets
export const TICKET_STATUS_COLORS_MAP: Record<string, { label: string; color: string }> = {
  Abierto: { label: STATS_LABELS.abierto, color: CHART_COLORS.danger },
  'En progreso': { label: STATS_LABELS.enProgreso, color: CHART_COLORS.warning },
  Resuelto: { label: STATS_LABELS.resuelto, color: CHART_COLORS.success },
  Cerrado: { label: STATS_LABELS.cerrado, color: CHART_COLORS.neutral },
}

// ============================================================================
// MAPAS DE VARIANTES PARA MINISTAT
// ============================================================================

export const STATUS_TO_VARIANT: Record<string, StatVariant> = {
  // Estados activos
  activo: 'success',
  activos: 'success',
  completado: 'success',
  completada: 'success',
  completados: 'success',
  resuelta: 'success',
  resueltos: 'success',
  exitosa: 'success',

  // Estados de advertencia
  pendiente: 'warning',
  pendientes: 'warning',
  'en progreso': 'warning',
  media: 'warning',

  // Estados de peligro
  abierto: 'danger',
  abiertos: 'danger',
  urgente: 'danger',
  alta: 'danger',
  vencido: 'danger',
  vencidos: 'danger',

  // Estados informativos
  info: 'info',
  cerrado: 'info',
  cerrados: 'info',
  baja: 'info',
}

// ============================================================================
// CONFIGURACIONES DE FORMATO
// ============================================================================

export const FORMAT_CONFIG = {
  currency: {
    locale: 'es-AR',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  percentage: {
    decimals: 0,
  },
  date: {
    locale: 'es-AR',
  },
} as const

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

/**
 * Obtiene el color de la paleta según el índice
 */
export function getChartColorByIndex(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length]
}

/**
 * Convierte un mapa de valores a formato de datos para gráficos
 */
export function mapToChartData<T extends string>(
  data: Record<T, number>,
  colorMap: Record<string, { label: string; color: string }>
): { label: string; value: number; color: string }[] {
  return Object.entries(data)
    .filter(([, value]) => (value as number) > 0)
    .map(([key, value]) => ({
      label: colorMap[key]?.label || key,
      value: value as number,
      color: colorMap[key]?.color || CHART_COLORS.neutral,
    }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Obtiene la variante de MiniStat según el tipo de estado
 */
export function getVariantByStatus(status: string): StatVariant {
  const normalized = status.toLowerCase()
  return STATUS_TO_VARIANT[normalized] || 'default'
}
