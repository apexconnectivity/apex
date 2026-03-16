/**
 * Sistema centralizado de colores para estados, prioridades y categorías
 * Usa exclusivamente variables CSS del theme para mantener consistencia con dark mode
 */

// ==========================================
// COLORES BASE DEL THEME
// ==========================================

export const STATUS_COLORS = {
  success: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  warning: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
  info: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  error: {
    text: 'text-red-400',
    bg: 'bg-red-500/15',
  },
  neutral: {
    text: 'text-slate-400',
    bg: 'bg-slate-500/15',
  },
  primary: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
  },
  purple: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/15',
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/15',
  },
  green: {
    text: 'text-green-400',
    bg: 'bg-green-500/15',
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
    label: 'Técnico',
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
