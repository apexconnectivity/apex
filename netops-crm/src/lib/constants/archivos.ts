// Constantes centralizadas para el módulo de archivos
// Universidad: Todas las textos y configuraciones del módulo de archivos

// ============================================
// Colores para stats (para consistencia visual)
// ============================================

export const STAT_COLORS = {
  total: '#06b6d4',    // cyan-500
  empresas: '#3b82f6', // blue-500
  proyectos: '#f59e0b', // amber-500
  tickets: '#10b981',  // emerald-500
  espacio: '#64748b',   // slate-500
} as const

// ============================================
// Textos de la página principal
// ============================================

export const PAGE_TITLE = 'Archivos'
export const PAGE_DESCRIPTION = 'Gestión de archivos en Google Drive'

export const TABS_LABELS = {
  todos: 'Todos',
  empresas: 'Empresas',
  proyectos: 'Proyectos',
} as const

export const STATS_LABELS = {
  totalArchivos: 'Total archivos',
  empresas: 'Empresas',
  proyectos: 'Proyectos',
  tickets: 'Tickets',
  espacioUsado: 'Espacio usado',
} as const

export const BUTTON_LABELS = {
  subir: 'Subir',
  cancelar: 'Cancelar',
  eliminar: 'Eliminar',
} as const

export const FILTER_LABELS = {
  filtrarPorEmpresa: 'Filtrar por empresa',
  todasLasEmpresas: 'Todas las empresas',
} as const

export const EMPTY_MESSAGES = {
  noDocumentosEmpresas: 'No hay documentos de empresas',
  noArchivosProyectos: 'No hay archivos de proyectos',
  noArchivosCarpeta: 'No hay archivos en esta carpeta',
} as const

export const SECTION_TITLES = {
  documentosEmpresas: 'Documentos de Empresas',
  archivosProyectos: 'Archivos de Proyectos',
} as const

// ============================================
// Textos del modal de subida
// ============================================

export const UPLOAD_MODAL = {
  titulo: 'Subir Archivo',
  destino: 'Destino',
  archivo: 'Archivo',
  empresa: 'Empresa',
  proyecto: 'Proyecto',
  visibilidad: 'Visibilidad',
  tipo: 'Tipo de documento',
  descripcion: 'Descripción',
  nombre: 'Nombre del archivo',
} as const

export const FILE_TYPES = {
  contrato: 'Contrato',
  factura: 'Factura',
  presupuesto: 'Presupuesto',
  documentoTecnico: 'Documento técnico',
  entregable: 'Entregable',
  manual: 'Manual',
  otro: 'Otro',
} as const

export const VISIBILITY_OPTIONS = {
  interno: 'Interno (solo equipo)',
  publico: 'Público (visible para cliente)',
} as const

export const FILE_PLACEHOLDER = 'Click para seleccionar archivo'

// ============================================
// Textos de badges
// ============================================

export const BADGE_LABELS = {
  publico: 'Público',
  interno: 'Interno',
} as const

// ============================================
// Rutas de Drive
// ============================================

export const DRIVE_PATH_PREFIXES = {
  clientesActivos: 'Clientes Activos',
  proveedores: 'Proveedores',
} as const

export const DRIVE_FOLDERS = {
  corporativo: 'Corporativo',
  entregablesCliente: 'Entregables Cliente',
  internos: 'Internos',
  facturas: 'Facturas',
} as const

// ============================================
// Mensajes de error
// ============================================

export const ERROR_MESSAGES = {
  tamanoMaximo: (tamanoMaximo: number) => `El archivo excede el tamaño máximo de ${tamanoMaximo} MB`,
  confirmEliminacion: '¿Estás seguro de eliminar este archivo?',
  accesoDenegado: 'No tienes permiso para acceder a este módulo',
} as const

// ============================================
// Otros textos
// ============================================

export const ACCESS_DENIED = 'No tienes permiso para acceder a este módulo'
