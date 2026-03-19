/**
 * Constantes centralizadas para el módulo de Tareas
 * Contains all labels, statuses, priorities, and configuration for the tareas module
 */

import { COMMON_BUTTONS, COMMON_FORM_LABELS, COMMON_FILTER_LABELS } from './common_text'

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE = 'Tareas'
export const PAGE_DESCRIPTION = 'Gestión de tareas y pendientes'

// ==========================================
// TABS LABELS
// ==========================================

export const TABS_LABELS = {
  todas: 'Todas',
  mias: 'Mis Tareas',
  pendientes: 'Pendientes',
  completadas: 'Completadas',
} as const

// ==========================================
// BUTTON LABELS
// ==========================================

export const BUTTON_LABELS = {
  ...COMMON_BUTTONS,
  nuevaTarea: 'Nueva Tarea',
  completar: 'Completar',
  marcarCompleta: 'Marcar como Completada',
  verDetalles: 'Ver Detalles',
} as const

// ==========================================
// TASK STATUS - Estados de tarea
// ==========================================

export const TASK_STATUS = {
  pendiente: {
    label: 'Pendiente',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    order: 1
  },
  en_progreso: {
    label: 'En Progreso',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    order: 2
  },
  completada: {
    label: 'Completada',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    order: 3
  },
  bloqueada: {
    label: 'Bloqueada',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    order: 0
  },
} as const

export type TaskStatusKey = keyof typeof TASK_STATUS

// ==========================================
// PRIORIDADES
// ==========================================

export const PRIORIDADES = {
  urgente: {
    label: 'Urgente',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    order: 1
  },
  alta: {
    label: 'Alta',
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    order: 2
  },
  media: {
    label: 'Media',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    order: 3
  },
  baja: {
    label: 'Baja',
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
    order: 4
  },
} as const

export type PrioridadKey = keyof typeof PRIORIDADES

// ==========================================
// CATEGORÍAS
// ==========================================

export const CATEGORIAS = {
  comercial: {
    label: 'Comercial',
    color: 'text-violet-400',
    bg: 'bg-violet-500/15'
  },
  tecnica: {
    label: 'Técnica',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15'
  },
  compras: {
    label: 'Compras',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15'
  },
  administrativa: {
    label: 'Administrativa',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15'
  },
  general: {
    label: 'General',
    color: 'text-slate-400',
    bg: 'bg-slate-500/15'
  },
} as const

export type CategoriaKey = keyof typeof CATEGORIAS

// ==========================================
// EMPTY MESSAGES
// ==========================================

export const EMPTY_MESSAGES = {
  noTareas: 'No hay tareas registradas',
  noTareasMias: 'No tienes tareas asignadas',
  noTareasPendientes: 'No hay tareas pendientes',
  noTareasCompletadas: 'No hay tareas completadas',
  noTareasFiltradas: 'No hay tareas que coincidan con los filtros',
} as const

// ==========================================
// FORM LABELS
// ==========================================

export const FORM_LABELS = {
  ...COMMON_FORM_LABELS,
  titulo: 'Título',
  proyecto: COMMON_FORM_LABELS.proyecto,
  empresa: COMMON_FORM_LABELS.empresa,
  prioridad: COMMON_FORM_LABELS.prioridad,
  categoria: COMMON_FORM_LABELS.categoria,
  estado: COMMON_FORM_LABELS.estado,
  fechaVencimiento: 'Fecha de Vencimiento',
  fechaCompletado: 'Fecha de Completado',
  asignadaA: 'Asignada a',
  creadaPor: 'Creada por',
} as const

// ==========================================
// FILTER LABELS
// ==========================================

export const FILTER_LABELS = {
  ...COMMON_FILTER_LABELS,
  todosLosProyectos: 'Todos los proyectos',
  todasLasEmpresas: 'Todas las empresas',
  todasLasPrioridades: 'Todas las prioridades',
  todasLasCategorias: 'Todas las categorías',
  todosLosAsignados: 'Todos los asignados',
} as const

// ==========================================
// STATS LABELS
// ==========================================

export const STATS_LABELS = {
  totalTareas: 'Total Tareas',
  pendientes: 'Pendientes',
  enProgreso: 'En Progreso',
  completadas: 'Completadas',
  vencidas: 'Vencidas',
  tasaCompletacion: 'Tasa de Completación',
} as const

// ==========================================
// DATE LABELS
// ==========================================

export const DATE_LABELS = {
  hoy: 'Hoy',
  ayer: 'Ayer',
  manana: 'Mañana',
  estaSemana: 'Esta Semana',
  proximaSemana: 'Próxima Semana',
  overdue: 'Vencida',
  sinFecha: 'Sin fecha',
} as const

// ==========================================
// KANBAN COLUMNS - Columnas del kanban
// ==========================================

export const KANBAN_COLUMNS = [
  { key: 'pendiente', ...TASK_STATUS.pendiente },
  { key: 'en_progreso', ...TASK_STATUS.en_progreso },
  { key: 'completada', ...TASK_STATUS.completada },
] as const

// ==========================================
// OTHER LABELS
// ==========================================

export const OTHER_LABELS = {
  noHayTareas: 'No hay tareas',
  cambiar: 'Cambiar',
  bloqueada: 'Bloqueada',
} as const
