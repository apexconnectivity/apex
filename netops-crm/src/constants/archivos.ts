/**
 * Constantes centralizadas para el módulo de Archivos
 * Contains all labels, messages, and configuration for the archivos module
 */

import { APP_COLORS } from './colors'

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE = 'Archivos'
export const PAGE_DESCRIPTION = 'Gestión documental y archivos'

// ==========================================
// TABS LABELS
// ==========================================

export const TABS_LABELS = {
  todos: 'Todos',
  empresas: 'Empresas',
  proyectos: 'Proyectos',
} as const

// ==========================================
// STATS LABELS
// ==========================================

export const STATS_LABELS = {
  totalArchivos: 'Total Archivos',
  empresas: 'Empresas',
  proyectos: 'Proyectos',
  tickets: 'Tickets',
  espacioUsado: 'Espacio Usado',
} as const

// ==========================================
// STAT COLORS
// ==========================================

export const STAT_COLORS = {
  total: APP_COLORS.primary,
  empresas: APP_COLORS.info,
  proyectos: APP_COLORS.warning,
  tickets: APP_COLORS.success,
  espacio: APP_COLORS.purple,
} as const

// ==========================================
// BUTTON LABELS
// ==========================================

export const BUTTON_LABELS = {
  subir: 'Subir archivo',
  cancelar: 'Cancelar',
  eliminar: 'Eliminar',
} as const

// ==========================================
// FILTER LABELS
// ==========================================

export const FILTER_LABELS = {
  filtrarPorEmpresa: 'Filtrar por empresa',
  todasLasEmpresas: 'Todas las empresas',
} as const

// ==========================================
// EMPTY MESSAGES
// ==========================================

export const EMPTY_MESSAGES = {
  noDocumentosEmpresas: 'No hay documentos en Empresas',
  noArchivosProyectos: 'No hay archivos en Proyectos',
  noArchivosCarpeta: 'No hay archivos en esta carpeta',
  cargandoArchivos: 'Cargando archivos...',
} as const

// ==========================================
// SECTION TITLES
// ==========================================

export const SECTION_TITLES = {
  documentosEmpresas: 'Documentos de Empresas',
  archivosProyectos: 'Archivos de Proyectos',
} as const

// ==========================================
// UPLOAD MODAL
// ==========================================

export const UPLOAD_MODAL = {
  title: 'Subir archivo',
  titulo: 'Título o descripción',
  descripcion: 'Descripción',
  archivo: 'Archivo',
  entidad: 'Entidad',
  destino: 'Destino',
  tipo: 'Tipo',
  empresa: 'Empresa',
  proyecto: 'Proyecto',
  tipoEntidad: 'Tipo de entidad',
  seleccionarEmpresa: 'Seleccionar empresa',
  seleccionarProyecto: 'Seleccionar proyecto',
  visibilidad: 'Visibilidad',
  seleccionar: 'Seleccionar...',
  placeholderNombre: 'Nombre o descripción del archivo...',
  ayudaNombre: 'Este nombre se usará para guardar el archivo en Drive',
} as const

// ==========================================
// FILE TYPES
// ==========================================

export const FILE_TYPES = {
  documento: { value: 'documento', label: 'Documento', extensions: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt' },
  imagen: { value: 'imagen', label: 'Imagen', extensions: '.jpg,.jpeg,.png,.gif,.svg,.webp' },
  video: { value: 'video', label: 'Video', extensions: '.mp4,.mov,.avi,.mkv' },
  audio: { value: 'audio', label: 'Audio', extensions: '.mp3,.wav,.ogg' },
  comprimido: { value: 'comprimido', label: 'Comprimido', extensions: '.zip,.rar,.7z' },
  contrato: { value: 'contrato', label: 'Contrato', extensions: '.pdf,.doc,.docx' },
  factura: { value: 'factura', label: 'Factura', extensions: '.pdf,.xls,.xlsx' },
  presupuesto: { value: 'presupuesto', label: 'Presupuesto', extensions: '.pdf,.xls,.xlsx' },
  documentoTecnico: { value: 'documentoTecnico', label: 'Documento Técnico', extensions: '.pdf,.doc,.docx,.md' },
  entregable: { value: 'entregable', label: 'Entregable', extensions: '.pdf,.doc,.docx,.xls,.xlsx' },
  manual: { value: 'manual', label: 'Manual', extensions: '.pdf,.doc,.docx' },
  otro: { value: 'otro', label: 'Otro', extensions: '*' },
} as const

export const FILE_TYPES_ARRAY = [
  FILE_TYPES.documento,
  FILE_TYPES.imagen,
  FILE_TYPES.video,
  FILE_TYPES.audio,
  FILE_TYPES.comprimido,
  FILE_TYPES.contrato,
  FILE_TYPES.factura,
  FILE_TYPES.presupuesto,
  FILE_TYPES.documentoTecnico,
  FILE_TYPES.otro,
] as const

// ==========================================
// FILE PLACEHOLDER
// ==========================================

export const FILE_PLACEHOLDER = 'Arrastra un archivo o haz clic para seleccionar'

// ==========================================
// VISIBILITY OPTIONS
// ==========================================

export const VISIBILITY_OPTIONS = {
  interno: { value: 'interno', label: 'Interno' },
  publico: { value: 'publico', label: 'Público' },
} as const

export const VISIBILITY_OPTIONS_ARRAY = [
  VISIBILITY_OPTIONS.interno,
  VISIBILITY_OPTIONS.publico,
] as const

// ==========================================
// BADGE LABELS
// ==========================================

export const BADGE_LABELS = {
  publico: 'Público',
  interno: 'Interno',
} as const

// ==========================================
// ERROR MESSAGES
// ==========================================

export const ERROR_MESSAGES = {
  confirmEliminacion: '¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.',
  confirmEliminacionTitulo: 'Confirmar eliminación',
  tamanoMaximo: (maxSize: number) => `El archivo excede el tamaño máximo de ${maxSize}MB`,
} as const

// ==========================================
// ACCESS DENIED
// ==========================================

export const ACCESS_DENIED = {
  titulo: 'Acceso denegado',
  mensaje: 'No tienes permisos para acceder a este módulo.',
} as const
