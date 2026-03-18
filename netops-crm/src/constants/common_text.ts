/**
 * Constantes de texto comunes centralizadas
 * Reutilizables en toda la aplicación
 */

// ============================================================================
// BOTONES COMUNES
// ============================================================================

export const COMMON_BUTTONS = {
  guardar: 'Guardar',
  cancelar: 'Cancelar',
  editar: 'Editar',
  eliminar: 'Eliminar',
  crear: 'Crear',
  buscar: 'Buscar',
  filtrar: 'Filtrar',
  ver: 'Ver',
  cerrar: 'Cerrar',
  confirmar: 'Confirmar',
  actualizar: 'Actualizar',
  exportar: 'Exportar',
  importar: 'Importar',
  seleccionar: 'Seleccionar...',
  nuevo: 'Nuevo',
  volver: 'Volver',
  aprobar: 'Aprobar',
  rechazar: 'Rechazar',
  descargar: 'Descargar',
  subir: 'Subir',
  guardarBorrador: 'Guardar Borrador',
} as const

// ============================================================================
// ETIQUETAS DE FORMULARIO COMUNES
// ============================================================================

export const COMMON_FORM_LABELS = {
  nombre: 'Nombre',
  email: 'Email',
  telefono: 'Teléfono',
  descripcion: 'Descripción',
  notas: 'Notas',
  fecha: 'Fecha',
  estado: 'Estado',
  prioridad: 'Prioridad',
  observaciones: 'Observaciones',
  proyecto: 'Proyecto',
  empresa: 'Empresa',
  contacto: 'Contacto',
  responsable: 'Responsable',
  categoria: 'Categoría',
  tipo: 'Tipo',
} as const

// ============================================================================
// ETIQUETAS DE FILTROS COMUNES
// ============================================================================

export const COMMON_FILTER_LABELS = {
  filtrarPorEstado: 'Filtrar por estado',
  filtrarPorProyecto: 'Filtrar por proyecto',
  filtrarPorEmpresa: 'Filtrar por empresa',
  filtrarPorFecha: 'Filtrar por fecha',
  filtrarPorTipo: 'Filtrar por tipo',
  filtrarPorPrioridad: 'Filtrar por prioridad',
  filtrarPorCategoria: 'Filtrar por categoría',
  filtrarPorAsignado: 'Filtrar por asignado',
  todosLosEstados: 'Todos los estados',
  todasLasEmpresas: 'Todas las empresas',
  todosLosProyectos: 'Todos los proyectos',
  todosLosTipos: 'Todos los tipos',
  buscar: 'Buscar...',
} as const

// ============================================================================
// MENSAJES COMUNES
// ============================================================================

export const COMMON_MESSAGES = {
  guardando: 'Guardando...',
  guardadoExito: 'Guardado correctamente',
  errorGuardar: 'Error al guardar',
  errorCargar: 'Error al cargar los datos',
  confirmEliminar: '¿Estás seguro de que deseas eliminar?',
  confirmEliminarTitulo: 'Confirmar eliminación',
  accionNoReversible: 'Esta acción no se puede deshacer.',
  sinResultados: 'No hay resultados',
  cargando: 'Cargando...',
  noTienesPermiso: 'No tienes permiso para acceder a este módulo.',
  errorInesperado: 'Ha ocurrido un error inesperado.',
  tienesQueSeleccionar: 'Tienes que seleccionar un elemento primero.',
} as const

// ============================================================================
// ESTADOS COMUNES
// ============================================================================

export const COMMON_STATUS = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
  completado: 'Completado',
  cancelado: 'Cancelado',
  habilitado: 'Habilitado',
  deshabilitado: 'Deshabilitado',
  abierto: 'Abierto',
  cerrado: 'Cerrado',
  enabled: 'Habilitado',
  disabled: 'Deshabilitado',
  success: 'Éxito',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
} as const

// ============================================================================
// PRIORIDADES COMUNES
// ============================================================================

export const COMMON_PRIORITIES = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
} as const

// ============================================================================
// FECHAS COMUNES
// ============================================================================

export const COMMON_DATE_LABELS = {
  hoy: 'Hoy',
  ayer: 'Ayer',
  manana: 'Mañana',
  estaSemana: 'Esta semana',
  proximaSemana: 'Próxima semana',
  mesActual: 'Mes actual',
  sinFecha: 'Sin fecha',
  overdue: 'Vencida',
  venceHoy: 'Vence hoy',
} as const
