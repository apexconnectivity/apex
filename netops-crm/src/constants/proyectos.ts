/**
 * Constantes centralizadas para el módulo de Proyectos
 * Contains all labels, statuses, phases, and configuration for the proyectos module
 */

import { COMMON_BUTTONS, COMMON_FORM_LABELS, COMMON_FILTER_LABELS } from './common_text'

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE = 'Proyectos'
export const PAGE_DESCRIPTION = 'Gestión de proyectos y pipeline'

// ==========================================
// TABS LABELS
// ==========================================

export const TABS_LABELS = {
  activos: 'Activos',
  archivados: 'Archivados',
} as const

// ==========================================
// BUTTON LABELS
// ==========================================

export const BUTTON_LABELS = {
  ...COMMON_BUTTONS,
  nuevoProyecto: 'Nuevo Proyecto',
  archivar: 'Archivar',
  cerrar: 'Cerrar Proyecto',
  verDetalles: 'Ver Detalles',
} as const

// ==========================================
// PROJECT STATUS - Estados de proyecto
// ==========================================

export const PROJECT_STATUS = {
  activo: {
    label: 'Activo',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15'
  },
  completado: {
    label: 'Completado',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15'
  },
  cancelado: {
    label: 'Cancelado',
    color: 'text-red-400',
    bg: 'bg-red-500/15'
  },
  en_pausa: {
    label: 'En Pausa',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15'
  },
} as const

export type ProjectStatusKey = keyof typeof PROJECT_STATUS

// ==========================================
// PROJECT PHASES - Fases del proyecto
// ==========================================

export const PROJECT_PHASES = {
  descubrimiento: {
    label: 'Descubrimiento',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    order: 1,
    descripcion: 'Fase de análisis inicial y gather de requisitos'
  },
  diseno: {
    label: 'Diseño',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    order: 2,
    descripcion: 'Diseño de arquitectura y planificación técnica'
  },
  desarrollo: {
    label: 'Desarrollo',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    order: 3,
    descripcion: 'Implementación y construcción del proyecto'
  },
  pruebas: {
    label: 'Pruebas',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    order: 4,
    descripcion: 'Testing, QA y control de calidad'
  },
  despliegue: {
    label: 'Despliegue',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    order: 5,
    descripcion: 'Deploy a producción y entrega final'
  },
} as const

export type ProjectPhaseKey = keyof typeof PROJECT_PHASES

// ==========================================
// PROJECT TYPES - Tipos de proyecto
// ==========================================

export const PROJECT_TYPES = {
  implementacion: { label: 'Implementación' },
  migracion: { label: 'Migración' },
  consultoria: { label: 'Consultoría' },
  auditoria: { label: 'Auditoría' },
  soporte: { label: 'Soporte' },
  desarrollo: { label: 'Desarrollo' },
  mantenimiento: { label: 'Mantenimiento' },
  otro: { label: 'Otro' },
} as const

// ==========================================
// PRIORIDADES
// ==========================================

export const PROJECT_PRIORITIES = {
  urgente: { label: 'Urgente', color: 'text-red-400', bg: 'bg-red-500/15' },
  alta: { label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/15' },
  media: { label: 'Media', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  baja: { label: 'Baja', color: 'text-slate-400', bg: 'bg-slate-500/15' },
} as const

// ==========================================
// EMPTY MESSAGES
// ==========================================

export const EMPTY_MESSAGES = {
  noProyectos: 'No hay proyectos registrados',
  noProyectosActivos: 'No hay proyectos activos',
  noProyectosFiltrados: 'No hay proyectos que coincidan con los filtros',
} as const

// ==========================================
// FORM LABELS
// ==========================================

export const FORM_LABELS = {
  ...COMMON_FORM_LABELS,
  nombre: 'Nombre del Proyecto',
  empresa: COMMON_FORM_LABELS.empresa,
  descripcion: COMMON_FORM_LABELS.descripcion,
  fechaInicio: 'Fecha de Inicio',
  fechaFin: 'Fecha de Fin',
  presupuesto: 'Presupuesto',
  moneda: 'Moneda',
  responsable: COMMON_FORM_LABELS.responsable,
  contactoTecnico: 'Contacto Técnico',
  tipo: 'Tipo de Proyecto',
  prioridad: COMMON_FORM_LABELS.prioridad,
  fase: 'Fase Actual',
  estado: COMMON_FORM_LABELS.estado,
  requiereCompras: 'Requiere Compras',
} as const

// ==========================================
// FILTER LABELS
// ==========================================

export const FILTER_LABELS = {
  ...COMMON_FILTER_LABELS,
  filtrarPorFase: 'Filtrar por fase',
  filtrarPorResponsable: 'Filtrar por responsable',
  todasLasFases: 'Todas las fases',
  todosLosResponsables: 'Todos los responsables',
} as const

// ==========================================
// STATS LABELS
// ==========================================

export const STATS_LABELS = {
  totalProyectos: 'Total Proyectos',
  activos: 'Activos',
  completados: 'Completados',
  valorTotal: 'Valor Total',
  tasaExito: 'Tasa de Éxito',
} as const

// ==========================================
// ARCHIVE CLASSIFICATION - Clasificación al archivar
// ==========================================

export const ARCHIVE_CLASSIFICATION = {
  completado: { label: 'Completado', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  inconsciente: { label: 'Inconcluso', color: 'text-amber-400', bg: 'bg-amber-500/15' },
} as const

// ==========================================
// PHASE TRANSITIONS - Transiciones de fase
// ==========================================

export const PHASE_TRANSITIONS: Record<ProjectPhaseKey, ProjectPhaseKey[]> = {
  descubrimiento: ['diseno'],
  diseno: ['descubrimiento', 'desarrollo'],
  desarrollo: ['diseno', 'pruebas'],
  pruebas: ['desarrollo', 'despliegue'],
  despliegue: ['pruebas'],
}

// ==========================================
// VALIDATION ERRORS
// ==========================================

export const VALIDATION_ERRORS = {
  nombreProyecto: 'El nombre es obligatorio (mínimo 3 caracteres)',
  empresaRequerida: 'Selecciona una empresa cliente',
  responsableRequerido: 'Selecciona un responsable técnico',
  contactoTecnicoRequerido: 'Selecciona un contacto técnico del cliente',
  monedaRequerida: 'Selecciona una moneda',
  montoNegativo: 'El monto no puede ser negativo',
  probabilidadInvalida: 'La probabilidad debe estar entre 0 y 100',
  motivoCierre: 'El motivo debe tener al menos 5 caracteres',
  nombreEmpresa: 'El nombre es obligatorio',
} as const

// ==========================================
// ALERT MESSAGES
// ==========================================

export const ALERT_MESSAGES = {
  faseComercial: 'Como comercial solo puedes mover proyectos hasta la fase 3 (Propuesta)',
  faseTecnico: 'Como técnico solo puedes mover proyectos a partir de la fase 4 (Implementación)',
  configGuardada: 'Configuración guardada (solo en memoria)',
} as const

// ==========================================
// VIEW LABELS
// ==========================================

export const VIEW_LABELS = {
  pipeline: 'Pipeline',
  cerrados: 'Cerrados',
} as const

// ==========================================
// MODAL LABELS
// ==========================================

export const MODAL_LABELS = {
  crearProyecto: 'Crear Proyecto',
  editarProyecto: 'Editar Proyecto',
  cerrarProyecto: 'Cerrar Proyecto',
  archivarProyecto: 'Archivar Proyecto',
  crearEmpresa: 'Crear Empresa',
  guardarConfiguracion: 'Guardar Configuración',
  proyectoCompletado: 'El proyecto se cerró desde fase 5 con todas las tareas completadas.',
  proyectoIncompleto: 'El proyecto no cumple los criterios de completado.',
} as const
