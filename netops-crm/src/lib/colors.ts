/**
 * Sistema centralizado de colores para estados, prioridades y categorías
 * Usa exclusivamente variables CSS del theme para mantener consistencia con dark mode
 */

// ==========================================
// COLORES BASE DEL THEME
// ==========================================

// Paleta de colores principal de la aplicación
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

export type AppColorKey = keyof typeof APP_COLORS

// Paleta para gráficos (colores que rotan)
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

export const STATUS_COLORS = {
  success: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
  },
  warning: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
  },
  info: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
  },
  error: {
    text: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
  },
  neutral: {
    text: 'text-slate-400',
    bg: 'bg-slate-500/15',
    border: 'border-slate-500/30',
  },
  primary: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
  },
  purple: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/15',
    border: 'border-orange-500/30',
  },
  green: {
    text: 'text-green-400',
    bg: 'bg-green-500/15',
    border: 'border-green-500/30',
  },
} as const

export type StatusColorKey = keyof typeof STATUS_COLORS

export function getStatusColor(key: string): { text: string; bg: string } {
  return STATUS_COLORS[key as StatusColorKey] || STATUS_COLORS.neutral
}

// ==========================================
// COLORES DE ESTADOS DE TAREA
// Usa variables CSS del theme para dark mode
// ==========================================

export const TASK_STATUS_COLORS = {
  pendiente: {
    color: 'text-[hsl(var(--warning))]',
    bg: 'bg-[hsl(var(--warning))/0.15]',
    label: 'Pendiente',
  },
  en_progreso: {
    color: 'text-[hsl(var(--info))]',
    bg: 'bg-[hsl(var(--info))/0.15]',
    label: 'En progreso',
  },
  completada: {
    color: 'text-[hsl(var(--success))]',
    bg: 'bg-[hsl(var(--success))/0.15]',
    label: 'Completada',
  },
  bloqueada: {
    color: 'text-[hsl(var(--error))]',
    bg: 'bg-[hsl(var(--error))/0.15]',
    label: 'Bloqueada',
  },
} as const

export type TaskStatusKey = keyof typeof TASK_STATUS_COLORS

// ==========================================
// COLORES DE PRIORIDADES DE TAREA
// Usa variables CSS del theme para dark mode
// ==========================================

export const PRIORITY_COLORS = {
  urgente: {
    color: 'text-[hsl(var(--error))]',
    bg: 'bg-[hsl(var(--error))/0.15]',
    label: 'Urgente',
  },
  alta: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    label: 'Alta',
  },
  media: {
    color: 'text-[hsl(var(--warning))]',
    bg: 'bg-[hsl(var(--warning))/0.15]',
    label: 'Media',
  },
  baja: {
    color: 'text-[hsl(var(--info))]',
    bg: 'bg-[hsl(var(--info))/0.15]',
    label: 'Baja',
  },
} as const

export type PriorityKey = keyof typeof PRIORITY_COLORS

// ==========================================
// COLORES DE CATEGORÍAS DE TAREA
// ==========================================

export const CATEGORY_COLORS = {
  comercial: {
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    label: 'Comercial',
  },
  tecnica: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    label: 'Técnica',
  },
  compras: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    label: 'Compras',
  },
  administrativa: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    label: 'Administrativa',
  },
  general: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    label: 'General',
  },
} as const

export type CategoryKey = keyof typeof CATEGORY_COLORS

// ==========================================
// FUNCIONES HELPER
// ==========================================

/**
 * Normaliza una cadena para buscar en los objetos de colores
 * - Convierte a minúsculas
 * - Elimina acentos (NFD)
 * - Reemplaza espacios por guiones bajos
 */
export function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
}

/**
 * Obtiene la configuración de color para un estado de tarea
 */
export function getTaskStatusColor(status: string): { color: string; bg: string; label: string } {
  const normalizedKey = normalizeKey(status) as TaskStatusKey
  const config = TASK_STATUS_COLORS[normalizedKey]

  if (config) {
    return config
  }

  // Fallback para estados no reconocidos
  return {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    label: status,
  }
}

/**
 * Obtiene la configuración de color para una prioridad
 */
export function getPriorityColor(prioridad: string): { color: string; bg: string; label: string } {
  const normalizedKey = normalizeKey(prioridad) as PriorityKey
  const config = PRIORITY_COLORS[normalizedKey]

  if (config) {
    return config
  }

  // Fallback para prioridades no reconocidas
  return {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    label: prioridad,
  }
}

/**
 * Obtiene la configuración de color para una categoría
 */
export function getCategoryColor(categoria: string): { color: string; bg: string; label: string } {
  const normalizedKey = normalizeKey(categoria) as CategoryKey
  const config = CATEGORY_COLORS[normalizedKey]

  if (config) {
    return config
  }

  // Fallback para categorías no reconocidas
  return {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    label: categoria,
  }
}

// ==========================================
// COLORES DE ESTADOS DE ÓRDENES DE COMPRA
// Mapea estados específicos de órdenes de compra a clases de color
// ==========================================

export function getOrdenCompraColor(estado: string): string {
  switch (estado) {
    case 'Borrador': return 'bg-slate-500/20 text-slate-400'
    case 'Pendiente aprobación': return 'bg-amber-500/20 text-amber-400'
    case 'Aprobada': return 'bg-blue-500/20 text-blue-400'
    case 'Enviada': return 'bg-purple-500/20 text-purple-400'
    case 'Recibida parcial': return 'bg-orange-500/20 text-orange-400'
    case 'Recibida completa': return 'bg-green-500/20 text-green-400'
    case 'Cancelada': return 'bg-red-500/20 text-red-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

// ==========================================
// COLORES DE ESTADOS DE REUNIONES
// Mapea estados específicos de reuniones a clases de color
// ==========================================

export function getReunionEstadoColor(estado: string): string {
  switch (estado) {
    case 'Programada': return 'bg-blue-500/20 text-blue-400'
    case 'Confirmada': return 'bg-green-500/20 text-green-400'
    case 'Cancelada': return 'bg-red-500/20 text-red-400'
    case 'Completada': return 'bg-slate-500/20 text-slate-400'
    case 'Pendiente': return 'bg-amber-500/20 text-amber-400'
    case 'Aprobada': return 'bg-green-500/20 text-green-400'
    case 'Rechazada': return 'bg-red-500/20 text-red-400'
    case 'Reprogramada': return 'bg-purple-500/20 text-purple-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

// ==========================================
// COLORES DE ESTADOS DE TICKETS/PORTAL
// Mapea estados específicos de tickets a clases de color
// ==========================================

export function getTicketEstadoColor(estado: string): string {
  switch (estado) {
    case 'Abierto': return 'bg-red-500/20 text-red-400'
    case 'En progreso': return 'bg-blue-500/20 text-blue-400'
    case 'Esperando cliente': return 'bg-amber-500/20 text-amber-400'
    case 'Resuelto': return 'bg-green-500/20 text-green-400'
    case 'Cerrado': return 'bg-slate-500/20 text-slate-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

// ==========================================
// COLORES DE ROLES DE USUARIO
// Sistema de colores para badges de roles
// ==========================================

export const ROLE_COLORS = {
  admin: {
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    label: 'Administrador',
  },
  comercial: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    label: 'Comercial',
  },
  tecnico: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    label: 'Especialista',
  },
  compras: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    label: 'Compras',
  },
  facturacion: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    label: 'Facturación',
  },
  marketing: {
    color: 'text-pink-400',
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    label: 'Marketing',
  },
  cliente: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    label: 'Cliente',
  },
} as const

export type RoleColorKey = keyof typeof ROLE_COLORS

/**
 * Obtiene la configuración de color para un rol de usuario
 */
export function getRoleColor(role: string): { color: string; bg: string; border: string; label: string } {
  const normalizedKey = normalizeKey(role) as RoleColorKey
  const config = ROLE_COLORS[normalizedKey]

  if (config) {
    return config
  }

  // Fallback para roles no reconocidos
  return {
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    border: 'border-slate-500/30',
    label: role,
  }
}

// ==========================================
// ICONOS DE PRIORIDAD
// ==========================================

export function getPrioridadIcon(prioridad: string): string {
  switch (prioridad) {
    case 'Urgente': return '🔴'
    case 'Alta': return '🟡'
    case 'Media': return '🟢'
    case 'Baja': return '⚪'
    default: return '⚪'
  }
}

// ==========================================
// ICONOS DE TIPO DE REUNIÓN
// ==========================================

export function getTipoReunionIcon(tipo: string): string {
  switch (tipo) {
    case 'Diagnóstico': return '🔍'
    case 'Seguimiento': return '📋'
    case 'Propuesta': return '📝'
    case 'Cierre': return '🎯'
    case 'Soporte': return '🛠️'
    default: return '📅'
  }
}

// ==========================================
// COLORES BASE PARA ESTADÍSTICAS (MiniStat accentColor)
// Estos colores base se usan en todas las constantes de stats
// ==========================================

const BASE_STATS_COLORS = {
  total: '#06b6d4',       // cyan-500
  info: '#3b82f6',       // blue-500
  success: '#10b981',    // emerald-500
  warning: '#f59e0b',    // amber-500
  danger: '#ef4444',     // red-500
  slate: '#64748b',      // slate-500
} as const

// ==========================================
// COLORES DE ESTADÍSTICAS DE SOPORTE (MiniStat accentColor)
// ==========================================

export const SOPORTE_STATS_COLORS = {
  total: BASE_STATS_COLORS.total,
  abiertos: BASE_STATS_COLORS.danger,
  enProgreso: BASE_STATS_COLORS.info,
  resueltos: BASE_STATS_COLORS.success,
  cerrados: BASE_STATS_COLORS.slate,
  urgentes: '#dc2626',    // red-600 (especial para urgentes)
} as const

// ==========================================
// COLORES DE ESTADÍSTICAS DE CALENDARIO (MiniStat accentColor)
// ==========================================

export const CALENDAR_STATS_COLORS = {
  total: BASE_STATS_COLORS.total,
  proximas: BASE_STATS_COLORS.info,
  confirmadas: BASE_STATS_COLORS.success,
  pendientes: BASE_STATS_COLORS.warning,
} as const

// ==========================================
// COLORES DE ESTADÍSTICAS DE NOTIFICACIONES (MiniStat accentColor)
// ==========================================

export const NOTIFICACIONES_STATS_COLORS = {
  total: BASE_STATS_COLORS.total,
  enviados: BASE_STATS_COLORS.success,
  fallidos: BASE_STATS_COLORS.danger,
  pendientes: BASE_STATS_COLORS.warning,
} as const

// ==========================================
// COLORES DE ESTADÍSTICAS DE ARCHIVADOS (MiniStat accentColor)
// ==========================================

export const ARCHIVADOS_STATS_COLORS = {
  total: BASE_STATS_COLORS.total,
  completados: BASE_STATS_COLORS.success,
  inconclusos: BASE_STATS_COLORS.warning,
} as const

// ==========================================
// COLORES DE ESTADÍSTICAS DE CRM (MiniStat accentColor)
// ==========================================

export const CRM_STATS_COLORS = {
  empresas: BASE_STATS_COLORS.total,
  contactos: BASE_STATS_COLORS.info,
  oportunidades: BASE_STATS_COLORS.warning,
  ganancias: BASE_STATS_COLORS.success,
} as const

// ==========================================
// COLORES DE ESTADÍSTICAS DE TAREAS (MiniStat accentColor)
// ==========================================

export const TAREAS_STATS_COLORS = {
  total: BASE_STATS_COLORS.total,
  pendientes: BASE_STATS_COLORS.warning,
  enProgreso: BASE_STATS_COLORS.info,
  completadas: BASE_STATS_COLORS.success,
  bloqueadas: BASE_STATS_COLORS.danger,
  overdue: '#dc2626',    // red-600 (especial para overdue)
} as const

// ==========================================
// COLORES DE FASES DE PIPELINE (Proyectos)
// ==========================================

export const PIPELINE_FASE_COLORS = {
  1: '#6b7280',   // gray-500
  2: '#3b82f6',   // blue-500
  3: '#eab308',   // yellow-500
  4: '#10b981',   // emerald-500
  5: '#8b5cf6',   // violet-500
} as const

// ==========================================
// COLORES DE CHART (Gráficos)
// ==========================================

export const CHART_COLORS = {
  empty: '#334155',  // slate-700
  default: '#06b6d4', // cyan-500
} as const

export const HEX_COLORS = {
  primary: '#06b6d4',   // cyan-500
  info: '#3b82f6',      // blue-500
  success: '#10b981',   // emerald-500
  warning: '#f59e0b',   // amber-500
  danger: '#ef4444',    // red-500
  purple: '#8b5cf6',    // violet-500
  pink: '#ec4899',
  orange: '#f97316',
  green: '#22c55e',     // green-500
  slate: '#64748b',
  indigo: '#6366f1',
  urgent: '#dc2626',    // red-600
} as const

// ==========================================
// VARIANTES DE COLORES (para MiniStat, Cards, etc.)
// ==========================================

export const VARIANT_COLORS = {
  primary: {
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    valueColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    gradientBorder: 'border-cyan-500/20',
  },
  success: {
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    valueColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    gradient: 'from-emerald-500/10 to-green-500/10',
    gradientBorder: 'border-emerald-500/20',
  },
  warning: {
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    valueColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    gradient: 'from-amber-500/10 to-orange-500/10',
    gradientBorder: 'border-amber-500/20',
  },
  danger: {
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    valueColor: 'text-red-400',
    borderColor: 'border-red-500/20',
    gradient: 'from-red-500/10 to-orange-500/10',
    gradientBorder: 'border-red-500/20',
  },
  info: {
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    valueColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    gradientBorder: 'border-blue-500/20',
  },
  purple: {
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    valueColor: 'text-violet-400',
    borderColor: 'border-violet-500/20',
    gradient: 'from-violet-500/10 to-purple-500/10',
    gradientBorder: 'border-violet-500/20',
  },
} as const

export type VariantColorKey = keyof typeof VARIANT_COLORS

// ==========================================
// ICONOS DE ACTIVIDAD (Dashboard RecentActivity)
// ==========================================

export const ACTIVITY_COLORS = {
  project: 'bg-blue-500',
  task: 'bg-green-500',
  ticket: 'bg-red-500',
  client: 'bg-purple-500',
  empresa: 'bg-purple-500',
} as const

export type ActivityColorKey = keyof typeof ACTIVITY_COLORS

// ==========================================
// COLORES DE INDICADORES SECTION (Dashboard)
// ==========================================

export const SECTION_INDICATOR_COLORS = {
  actividadReciente: 'bg-cyan-500',
  proximasTareas: 'bg-amber-500',
} as const

// ==========================================
// COLORES DE ESTADOS DE PROYECTO
// ==========================================

export const PROJECT_STATUS_COLORS = {
  activo: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    indicator: 'bg-emerald-500',
    label: 'Activo',
  },
  en_progreso: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    indicator: 'bg-blue-500',
    label: 'En progreso',
  },
  completado: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    indicator: 'bg-emerald-500',
    label: 'Completado',
  },
  pausado: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    indicator: 'bg-amber-500',
    label: 'Pausado',
  },
  cancelado: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    indicator: 'bg-red-500',
    label: 'Cancelado',
  },
  bloqueado: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    indicator: 'bg-red-500',
    label: 'Bloqueado',
  },
} as const

// ==========================================
// COLORES DE TIPOS DE ENTIDAD (CRM)
// ==========================================

export const ENTITY_TYPE_COLORS = {
  cliente: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    label: 'Cliente',
  },
  proveedor: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    label: 'Proveedor',
  },
  prospecto: {
    color: 'text-violet-400',
    bg: 'bg-violet-500/20',
    badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    label: 'Prospecto',
  },
  ambos: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    label: 'Ambos',
  },
} as const

export type EntityTypeKey = keyof typeof ENTITY_TYPE_COLORS

// ==========================================
// COLORES DE PRIORIDADES (通用)
// ==========================================

export const PRIORITY_COLORS_MAP = {
  urgente: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    indicator: 'bg-red-500',
    border: 'border-red-500/30',
    label: 'Urgente',
  },
  alta: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    indicator: 'bg-orange-500',
    border: 'border-orange-500/30',
    label: 'Alta',
  },
  media: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    indicator: 'bg-amber-500',
    border: 'border-amber-500/30',
    label: 'Media',
  },
  baja: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    indicator: 'bg-blue-500',
    border: 'border-blue-500/30',
    label: 'Baja',
  },
} as const

// ==========================================
// FUNCIONES HELPER ADICIONALES
// ==========================================

// ==========================================
// INTERFAZ PARA VARIANT COLORS
// ==========================================

interface VariantColorConfig {
  iconBg: string
  iconColor: string
  valueColor: string
  borderColor: string
  gradient: string
  gradientBorder: string
}

/**
 * Obtiene la configuración de variante de color por key
 */
export function getVariantColor(variant: string): VariantColorConfig {
  const key = variant as VariantColorKey
  return VARIANT_COLORS[key] || VARIANT_COLORS.primary
}

/**
 * Obtiene el color de actividad por tipo
 */
export function getActivityColor(type: string): string {
  const key = type as ActivityColorKey
  return ACTIVITY_COLORS[key] || 'bg-slate-500'
}

/**
 * Obtiene el color de sección por nombre
 */
export function getSectionIndicatorColor(section: string): string {
  return SECTION_INDICATOR_COLORS[section as keyof typeof SECTION_INDICATOR_COLORS] || 'bg-cyan-500'
}

// ==========================================
// COLORES PARA TIPOS DE DEPENDENCIA DE TAREAS
// ==========================================

export const DEPENDENCY_TYPE_COLORS = {
  bloqueante: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    indicator: 'bg-red-500',
    border: 'border-red-500/30',
    label: 'Bloqueante',
    description: 'Debe completarse antes',
  },
  inicio_despues: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    indicator: 'bg-amber-500',
    border: 'border-amber-500/30',
    label: 'Inicio después',
    description: 'Inicia N días después',
  },
  fin_despues: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    indicator: 'bg-emerald-500',
    border: 'border-emerald-500/30',
    label: 'Fin después',
    description: 'Inicia tras fin',
  },
} as const

// ==========================================
// COLORES PARA GRUPOS DEL DASHBOARD DE TAREAS
// ==========================================

export const TASK_DASHBOARD_GROUP_COLORS = {
  vencen_hoy: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    label: 'Vencen Hoy',
    icon: '🔴',
  },
  proximos_7_dias: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    label: 'Próximos 7 días',
    icon: '⚠️',
  },
  en_progreso: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    label: 'En Progreso',
    icon: '🔄',
  },
  sin_vencimiento: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    border: 'border-slate-500/30',
    label: 'Sin Vencimiento',
    icon: '⏳',
  },
  completadas_recientes: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    label: 'Completadas Recientes',
    icon: '✅',
  },
} as const

// ==========================================
// COLORES PARA TIPOS DE CONTACTO DE CLIENTE
// ==========================================

export const CLIENT_CONTACT_TYPE_COLORS = {
  Principal: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    label: 'Principal',
  },
  Especialista: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    label: 'Especialista',
  },
  Administrativo: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    label: 'Administrativo',
  },
  Financiero: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    label: 'Financiero',
  },
  Compras: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    label: 'Compras',
  },
  Comercial: {
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    label: 'Comercial',
  },
  Soporte: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    label: 'Soporte',
  },
  Otro: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    label: 'Otro',
  },
} as const

// ==========================================
// COLORES PARA ARCHIVADO DE PROYECTOS
// ==========================================

export const ARCHIVE_CLASSES = {
  completado: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500',
    badge: 'bg-emerald-500',
    text: 'text-emerald-400',
  },
  inconclusive: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500',
    badge: '',
    text: 'text-amber-300',
  },
  container: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
} as const

// ==========================================
// COLORES PARA TARJETAS DE PROYECTO (ProjectCard)
// ==========================================

// Colores para tarjetas según la fase del pipeline
// Proporciona diferenciación visual clara para cada etapa
export const PROJECT_CARD_FASE_COLORS = {
  // Fase 1: Prospecto (gris - evaluación inicial)
  1: {
    border: '#6b7280',           // gray-500
    borderHover: '#9ca3af',      // gray-400
    accent: '#6b7280',           // gray-500
    gradient: 'from-gray-500/10 to-slate-500/10',
    progress: '#6b7280',         // gray-500
    progressGradient: 'linear-gradient(to right, #6b7280, #9ca3af)',
    badge: {
      bg: 'bg-gray-500/15',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
    },
  },
  // Fase 2: Diagnóstico (azul - análisis y evaluación)
  2: {
    border: '#3b82f6',           // blue-500
    borderHover: '#60a5fa',      // blue-400
    accent: '#3b82f6',           // blue-500
    gradient: 'from-blue-500/10 to-indigo-500/10',
    progress: '#3b82f6',         // blue-500
    progressGradient: 'linear-gradient(to right, #3b82f6, #60a5fa)',
    badge: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
  },
  // Fase 3: Propuesta (amarillo - negociación)
  3: {
    border: '#eab308',           // yellow-500
    borderHover: '#facc15',      // yellow-400
    accent: '#eab308',           // yellow-500
    gradient: 'from-yellow-500/10 to-amber-500/10',
    progress: '#eab308',         // yellow-500
    progressGradient: 'linear-gradient(to right, #eab308, #facc15)',
    badge: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
    },
  },
  // Fase 4: Implementación (emerald - ejecución)
  4: {
    border: '#10b981',           // emerald-500
    borderHover: '#34d399',      // emerald-400
    accent: '#10b981',           // emerald-500
    gradient: 'from-emerald-500/10 to-green-500/10',
    progress: '#10b981',         // emerald-500
    progressGradient: 'linear-gradient(to right, #10b981, #34d399)',
    badge: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
  },
  // Fase 5: Cierre (violeta - завершение)
  5: {
    border: '#8b5cf6',           // violet-500
    borderHover: '#a78bfa',      // violet-400
    accent: '#8b5cf6',           // violet-500
    gradient: 'from-violet-500/10 to-purple-500/10',
    progress: '#8b5cf6',         // violet-500
    progressGradient: 'linear-gradient(to right, #8b5cf6, #a78bfa)',
    badge: {
      bg: 'bg-violet-500/15',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
    },
  },
} as const

// Tipo para las claves de fase
export type FaseProyectoKey = 1 | 2 | 3 | 4 | 5

/**
 * Obtiene la configuración de color para una tarjeta de proyecto según su fase
 */
export function getProjectCardFaseColor(fase: number) {
  const key = fase as FaseProyectoKey
  return PROJECT_CARD_FASE_COLORS[key] || PROJECT_CARD_FASE_COLORS[1]
}

// Colores para barra de progreso según nivel
export const PROJECT_CARD_PROGRESS_COLORS = {
  high: {
    gradient: 'linear-gradient(to right, #10b981, #34d399)', // success -> success-400
    label: 'Alto',
  },
  medium: {
    gradient: 'linear-gradient(to right, #f59e0b, #fbbf24)', // warning -> warning-400
    label: 'Medio',
  },
  low: {
    gradient: 'linear-gradient(to right, #ef4444, #f87171)', // danger -> danger-400
    label: 'Bajo',
  },
} as const

// Colores para indicadores de tareas (dots)
export const PROJECT_CARD_TASK_DOTS = {
  completed: '#10b981',   // emerald-500
  inProgress: '#f59e0b',   // amber-500 (warning)
  pending: '#6b7280',      // gray-500 (neutral)
} as const

// Colores para valor del proyecto (badge)
export const PROJECT_CARD_VALUE_COLORS = {
  bg: 'bg-violet-500/20',
  border: 'border-violet-500/30',
  gradient: 'from-violet-500/20 to-purple-500/20',
  text: 'text-violet-600 dark:text-violet-400',
} as const

// ==========================================
// FUNCIONES HELPER PARA PROJECT CARD
// ==========================================

/**
 * Obtiene el color de progreso según el porcentaje
 */
export function getProjectCardProgressColor(progress: number): string {
  if (progress > 70) return PROJECT_CARD_PROGRESS_COLORS.high.gradient
  if (progress > 30) return PROJECT_CARD_PROGRESS_COLORS.medium.gradient
  return PROJECT_CARD_PROGRESS_COLORS.low.gradient
}

// ==========================================
// COLORES PARA TIPOS DE ENTIDAD DE EMPRESA (CRM)
// ==========================================

import type { TipoEntidad } from '@/types/crm'

/**
 * Colores para cada tipo de entidad de empresa
 */
export const TIPO_COLORS: Record<TipoEntidad, {
  bg: string
  text: string
  badge: string
  label: string
}> = {
  cliente: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    label: 'Cliente',
  },
  proveedor: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    label: 'Proveedor',
  },
  ambos: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    label: 'Ambos',
  },
}

/**
 * Etiquetas para cada tipo de entidad de empresa
 */
export const TIPO_LABELS: Record<TipoEntidad, string> = {
  cliente: 'Cliente',
  proveedor: 'Proveedor',
  ambos: 'Ambos',
}

/**
 * Obtiene el color de un dot de tarea según su estado
 */
export function getProjectCardTaskDotColor(
  index: number,
  completed: number,
  inProgress: number
): string {
  if (index < completed) return PROJECT_CARD_TASK_DOTS.completed
  if (index < completed + inProgress) return PROJECT_CARD_TASK_DOTS.inProgress
  return PROJECT_CARD_TASK_DOTS.pending
}

// ============================================================================
// COLORES PARA BADGES
// Se mapean a APP_COLORS para mantener consistencia
// ============================================================================

export function getBadgeColorByLabel(label: string): string {
  const key = label.toLowerCase().trim()
  
  // ========================================
  // PRIORIDADES
  // ========================================
  if (key.includes('urgente') || key === 'alta' || key === 'high') return APP_COLORS.danger
  if (key === 'media' || key === 'normal' || key === 'medium' || key === 'intermedia') return APP_COLORS.warning
  if (key === 'baja' || key === 'low') return APP_COLORS.success
  
  // ========================================
  // ESTADOS
  // ========================================
  if (key.includes('progreso') || key === 'in progress' || key === 'en curso') return APP_COLORS.info
  if (key.includes('bloque')) return APP_COLORS.danger
  if (key.includes('complet') || key.includes('done') || key.includes('resuelto')) return APP_COLORS.success
  if (key.includes('cerrado') || key === 'closed') return APP_COLORS.neutral
  if (key === 'pendiente' || key === 'pending') return APP_COLORS.neutral
  
  // ========================================
  // CATEGORÍAS DE TAREA
  // ========================================
  if (key.includes('técnica') || key.includes('tecnica') || key.includes('technical')) return '#a855f7' // purple (no hay en APP_COLORS)
  if (key.includes('comercial') || key.includes('commercial')) return APP_COLORS.purple
  if (key.includes('compra') || key.includes('purchase')) return APP_COLORS.success
  if (key.includes('admin')) return APP_COLORS.warning
  if (key.includes('general')) return APP_COLORS.neutral
  
  // ========================================
  // CATEGORÍAS DE SOPORTE
  // ========================================
  if (key.includes('incidente') || key.includes('incident')) return APP_COLORS.danger
  if (key.includes('soporte') || key.includes('support')) return APP_COLORS.info
  if (key.includes('mejora') || key.includes('improvement') || key.includes('feature')) return APP_COLORS.success
  if (key.includes('consulta') || key.includes('question')) return APP_COLORS.purple
  
  // ========================================
  // DEFAULT
  // ========================================
  return APP_COLORS.neutral
}
