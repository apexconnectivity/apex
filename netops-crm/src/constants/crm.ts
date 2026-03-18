/**
 * Constantes centralizadas para el módulo de CRM
 * Contains all labels, statuses, and configuration for the CRM module
 */

import { COMMON_BUTTONS, COMMON_FORM_LABELS, COMMON_FILTER_LABELS } from './common_text'

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE = 'CRM'
export const PAGE_DESCRIPTION = 'Gestión de clientes y oportunidades'

// ==========================================
// TABS LABELS
// ==========================================

export const TABS_LABELS = {
  empresas: 'Empresas',
  contactos: 'Contactos',
  pipeline: 'Pipeline',
} as const

// ==========================================
// BUTTON LABELS
// ==========================================

export const BUTTON_LABELS = {
  ...COMMON_BUTTONS,
  nuevaEmpresa: 'Nueva Empresa',
  nuevoContacto: 'Nuevo Contacto',
} as const

// ==========================================
// ENTITY TYPES - Tipos de entidad/empresa
// ==========================================

export const ENTITY_TYPES = {
  cliente: { label: 'Cliente', color: 'text-green-400', bg: 'bg-green-500/15' },
  proveedor: { label: 'Proveedor', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  prospecto: { label: 'Prospecto', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  socio: { label: 'Socio', color: 'text-purple-400', bg: 'bg-purple-500/15' },
} as const

export type EntityTypeKey = keyof typeof ENTITY_TYPES

// ==========================================
// CRM ETAPAS - Pipeline stages
// ==========================================

export const CRM_ETAPAS = {
  prospecto: {
    label: 'Prospecto',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    order: 1
  },
  contacto: {
    label: 'Contactado',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    order: 2
  },
  calificado: {
    label: 'Calificado',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    order: 3
  },
  propuesta: {
    label: 'Propuesta',
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    order: 4
  },
  negociacion: {
    label: 'Negociación',
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    order: 5
  },
  ganado: {
    label: 'Ganado',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    order: 6
  },
  perdido: {
    label: 'Perdido',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    order: 7
  },
} as const

export type CrmEtapaKey = keyof typeof CRM_ETAPAS

// ==========================================
// INDUSTRY TYPES - Industrias
// ==========================================

export const INDUSTRY_TYPES = [
  'Tecnología',
  'Salud',
  'Finanzas',
  'Educación',
  'Retail',
  'Manufactura',
  'Construcción',
  'Transporte',
  'Energía',
  'Telecomunicaciones',
  'Gobierno',
  'Otro',
] as const

// ==========================================
// RELATIONSHIP TYPES - Tipo de relación
// ==========================================

export const RELATIONSHIP_TYPES = {
  cliente: { label: 'Cliente' },
  proveedor: { label: 'Proveedor' },
  prospecto: { label: 'Prospecto' },
  socio: { label: 'Socio estratégico' },
  otro: { label: 'Otro' },
} as const

// ==========================================
// EMPTY MESSAGES
// ==========================================

export const EMPTY_MESSAGES = {
  noEmpresas: 'No hay empresas registradas',
  noContactos: 'No hay contactos registrados',
  noEmpresasFiltradas: 'No hay empresas que coincidan con los filtros',
  noContactosFiltrados: 'No hay contactos que coincidan con los filtros',
} as const

// ==========================================
// FORM LABELS
// ==========================================

export const FORM_LABELS = {
  ...COMMON_FORM_LABELS,
  razonSocial: 'Razón Social',
  nit: 'NIT',
  direccion: 'Dirección',
  ciudad: 'Ciudad',
  pais: 'País',
  sitioWeb: 'Sitio Web',
  industria: 'Industria',
  tamano: 'Tamaño',
  tipoEntidad: 'Tipo de Entidad',
  relacion: 'Relación',
  cargo: 'Cargo',
} as const

// ==========================================
// COMPANY SIZE
// ==========================================

export const COMPANY_SIZES = {
  pequeno: { label: 'Pequeño (1-50 empleados)' },
  mediano: { label: 'Mediano (51-200 empleados)' },
  grande: { label: 'Grande (201-1000 empleados)' },
  enterprise: { label: 'Enterprise (1000+ empleados)' },
} as const

// ==========================================
// FILTER LABELS
// ==========================================

export const FILTER_LABELS = {
  ...COMMON_FILTER_LABELS,
  filtrarPorIndustria: 'Filtrar por industria',
  todasLasIndustrias: 'Todas las industrias',
} as const

// ==========================================
// ALERTAS
// ==========================================

export const ALERT_LABELS = {
  sinContactoPrincipal: 'Sin contacto principal',
  sinContactoPrincipalMsg: 'no tiene un contacto principal designado.',
  prospectoInactivo: 'Prospecto inactivo',
  prospectoInactivoMsg: 'no ha tenido actividad en',
  proveedorSinContactos: 'Proveedor sin contactos',
  proveedorSinContactosMsg: 'no tiene contactos asociados.',
  dias: 'días',
} as const

// ==========================================
// VALIDATION ERRORS
// ==========================================

export const VALIDATION_ERRORS = {
  nombreObligatorio: 'El nombre es obligatorio (mínimo 2 caracteres)',
  emailObligatorio: 'El email es obligatorio',
  emailInvalido: 'Ingresa un email válido',
  emailYaRegistrado: 'Este email ya está registrado para otro contacto',
  tipoContactoRequerido: 'Selecciona un tipo de contacto',
  telefonoInvalido: 'Teléfono inválido',
} as const

// ==========================================
// ACCESS MESSAGES
// ==========================================

export const ACCESS_MESSAGES = {
  noTieneEmpresas: 'No tienes empresas asignadas en tus proyectos.',
  noTienePermisos: 'No tienes permisos para acceder al CRM.',
} as const

// ==========================================
// EMPTY STATES
// ==========================================

export const CRM_EMPTY = {
  crearPrimeraEmpresa: 'Crea tu primera empresa haciendo clic en el botón de arriba.',
  noEmpresasFiltro: 'No hay empresas que coincidan con los filtros aplicados.',
  nuevoContacto: 'Nuevo Contacto',
  editarContacto: 'Editar',
} as const

// ==========================================
// STATS LABELS
// ==========================================

export const STATS_LABELS = {
  totalEmpresas: 'Total Empresas',
} as const
