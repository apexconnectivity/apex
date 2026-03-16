/**
 * Constantes centralizadas para el módulo de Dashboard
 * Contains all labels, greetings, and configuration for the Dashboard
 */

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE = 'Dashboard'
export const PAGE_DESCRIPTION = 'Panel de control y overview'

// ==========================================
// GREETINGS - Saludos según hora del día
// ==========================================

export const GREETINGS = {
  morning: 'Buenos días',
  afternoon: 'Buenas tardes',
  evening: 'Buenas noches',
} as const

// ==========================================
// STATS LABELS - Etiquetas para estadísticas
// ==========================================

export const DASHBOARD_STATS = {
  clientesActivos: 'Clientes Activos',
  proyectosActivos: 'Proyectos Activos',
  tareasPendientes: 'Tareas Pendientes',
  ticketsAbiertos: 'Tickets Abiertos',
  empresasActivas: 'Empresas Activas',
  contactos: 'Contactos',
  documentos: 'Documentos',
  proyectoActivo: 'Proyecto Activo',
} as const

// ==========================================
// SECTION TITLES - Títulos de secciones
// ==========================================

export const SECTION_TITLES = {
  actividadReciente: 'Actividad Reciente',
  proximasTareas: 'Próximas Tareas',
  pipeline: 'Pipeline',
  crm: 'CRM',
  portalCliente: 'Portal del Cliente',
} as const

// ==========================================
// ACTIVITY TITLES - Títulos de actividades
// ==========================================

export const ACTIVITY_TITLES = {
  proyectoActualizado: 'Proyecto actualizado',
  tareaCompletada: 'Tarea completada',
  nuevoTicket: 'Nuevo ticket',
  nuevoCliente: 'Nuevo cliente',
  empresaAgregada: 'Empresa agregada',
} as const

// ==========================================
// PRIORITY LABELS - Etiquetas de prioridad
// ==========================================

export const PRIORITY_LABELS = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
} as const

// ==========================================
// EMPTY MESSAGES - Mensajes vacíos
// ==========================================

export const EMPTY_MESSAGES = {
  noActividadReciente: 'No hay actividad reciente',
  noActividadRecienteDesc: 'Los proyectos, tareas, tickets y empresas aparecerán aquí',
  noTareasProximas: 'No hay tareas próximas',
  noTareasProximasDesc: 'Las tareas pendientes aparecerán aquí',
} as const

// ==========================================
// ACCESS DENIED - Mensajes de acceso
// ==========================================

export const ACCESS_MESSAGES = {
  accesoDenegado: 'No tienes permisos para acceder al dashboard.',
} as const

// ==========================================
// DATE RELATIVE LABELS - Tiempos relativos
// ==========================================

export const DATE_RELATIVE = {
  ahora: 'Hace un momento',
  minutos: (min: number) => `Hace ${min} min`,
  hora: (hours: number) => `Hace ${hours} hora${hours > 1 ? 's' : ''}`,
  ayer: 'Ayer',
  dias: (days: number) => `Hace ${days} días`,
  semanas: (weeks: number) => `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`,
  meses: (months: number) => `Hace ${months} mes${months > 1 ? 'es' : ''}`,
} as const

// ==========================================
// DUE DATE LABELS - Fechas de vencimiento
// ==========================================

export const DUE_DATE = {
  vencida: (days: number) => `Vencida (${days} día${days > 1 ? 's' : ''})`,
  hoy: 'Hoy',
  manana: 'Mañana',
  dias: (days: number) => `${days} días`,
} as const

// ==========================================
// QUICK STATS - Estadísticas rápidas (Header)
// ==========================================

export const QUICK_STATS = {
  proyectos: 'Proyectos',
  tareas: 'Tareas',
  tickets: 'Tickets',
} as const
