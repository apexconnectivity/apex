/**
 * Constantes centralizadas para el módulo de Calendario
 * Contains all labels, statuses, types, and configuration for the calendario module
 */

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE = 'Calendario'
export const PAGE_DESCRIPTION = 'Gestión de reuniones y eventos'

// ==========================================
// TABS LABELS
// ==========================================

export const TABS_LABELS = {
  reuniones: 'Reuniones',
  solicitudes: 'Solicitudes',
} as const

// ==========================================
// BUTTON LABELS
// ==========================================

export const BUTTON_LABELS = {
  nuevaReunion: 'Nueva Reunión',
  nuevaSolicitud: 'Nueva Solicitud',
  guardar: 'Guardar',
  cancelar: 'Cancelar',
  editar: 'Editar',
  eliminar: 'Eliminar',
  aprobar: 'Aprobar',
  rechazar: 'Rechazar',
  confirmar: 'Confirmar',
  reagendar: 'Reagendar',
} as const

// ==========================================
// MEETING STATUS - Estados de reunión
// ==========================================

export const MEETING_STATUS = {
  programada: { 
    label: 'Programada', 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/15' 
  },
  confirmada: { 
    label: 'Confirmada', 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/15' 
  },
  cancelada: { 
    label: 'Cancelada', 
    color: 'text-red-400', 
    bg: 'bg-red-500/15' 
  },
  completada: { 
    label: 'Completada', 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/15' 
  },
  reprogramada: { 
    label: 'Reprogramada', 
    color: 'text-violet-400', 
    bg: 'bg-violet-500/15' 
  },
} as const

export type MeetingStatusKey = keyof typeof MEETING_STATUS

// ==========================================
// REQUEST STATUS - Estados de solicitud
// ==========================================

export const REQUEST_STATUS = {
  pendiente: { 
    label: 'Pendiente', 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/15' 
  },
  aprobada: { 
    label: 'Aprobada', 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/15' 
  },
  rechazada: { 
    label: 'Rechazada', 
    color: 'text-red-400', 
    bg: 'bg-red-500/15' 
  },
  cancelada: { 
    label: 'Cancelada', 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/15' 
  },
} as const

export type RequestStatusKey = keyof typeof REQUEST_STATUS

// ==========================================
// MEETING TYPES - Tipos de reunión
// ==========================================

export const MEETING_TYPES = {
  diagnostico: { 
    label: 'Diagnóstico', 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/15',
    icon: '🔍'
  },
  seguimiento: { 
    label: 'Seguimiento', 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/15',
    icon: '📋'
  },
  propuesta: { 
    label: 'Propuesta', 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-500/15',
    icon: '📝'
  },
  cierre: { 
    label: 'Cierre', 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/15',
    icon: '🎯'
  },
  soporte: { 
    label: 'Soporte', 
    color: 'text-orange-400', 
    bg: 'bg-orange-500/15',
    icon: '🛠️'
  },
  training: { 
    label: 'Capacitación', 
    color: 'text-violet-400', 
    bg: 'bg-violet-500/15',
    icon: '📚'
  },
  otra: { 
    label: 'Otra', 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/15',
    icon: '📅'
  },
} as const

export type MeetingTypeKey = keyof typeof MEETING_TYPES

// ==========================================
// EMPTY MESSAGES
// ==========================================

export const EMPTY_MESSAGES = {
  noReuniones: 'No hay reuniones programadas',
  noSolicitudes: 'No hay solicitudes de reunión',
  noReunionesHoy: 'No hay reuniones para hoy',
  noReunionesProximas: 'No hay reuniones próximas',
} as const

// ==========================================
// FORM LABELS - Reuniones
// ==========================================

export const FORM_LABELS_REUNION = {
  titulo: 'Título',
  descripcion: 'Descripción',
  fechaHoraInicio: 'Fecha y Hora de Inicio',
  fechaHoraFin: 'Fecha y Hora de Fin',
  duracion: 'Duración (minutos)',
  tipo: 'Tipo de Reunión',
  organizador: 'Organizador',
  asistentesInternos: 'Asistentes Internos',
  asistentesCliente: 'Asistentes del Cliente',
  ubicacion: 'Ubicación',
  proyecto: 'Proyecto',
  empresa: 'Empresa',
  solicitadaPorCliente: 'Solicitada por Cliente',
  estado: 'Estado',
  notas: 'Notas',
} as const

// ==========================================
// FORM LABELS - Solicitudes
// ==========================================

export const FORM_LABELS_SOLICITUD = {
  proyecto: 'Proyecto',
  empresa: 'Empresa',
  contacto: 'Contacto',
  fechaSolicitada: 'Fecha Solicitada',
  horaSolicitada: 'Hora Solicitada',
  duracion: 'Duración (minutos)',
  motivo: 'Motivo',
  comentarios: 'Comentarios',
  estado: 'Estado',
} as const

// ==========================================
// FILTER LABELS
// ==========================================

export const FILTER_LABELS = {
  filtrarPorTipo: 'Filtrar por tipo',
  filtrarPorEstado: 'Filtrar por estado',
  filtrarPorProyecto: 'Filtrar por proyecto',
  filtrarPorEmpresa: 'Filtrar por empresa',
  filtrarPorFecha: 'Filtrar por fecha',
  todosLosTipos: 'Todos los tipos',
  todosLosEstados: 'Todos los estados',
  todosLosProyectos: 'Todos los proyectos',
  todasLasEmpresas: 'Todas las empresas',
  hoy: 'Hoy',
  estaSemana: 'Esta semana',
  proximaSemana: 'Próxima semana',
  esteMes: 'Este mes',
} as const

// ==========================================
// STATS LABELS
// ==========================================

export const STATS_LABELS = {
  totalReuniones: 'Total Reuniones',
  reunionesHoy: 'Reuniones Hoy',
  reunionesProximas: 'Próximas Reuniones',
  solicitudesPendientes: 'Solicitudes Pendientes',
} as const

// ==========================================
// DURATION OPTIONS
// ==========================================

export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1.5 horas' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
] as const
