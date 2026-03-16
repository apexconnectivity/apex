/**
 * Constantes centralizadas para el módulo de Archivados
 * Todos los textos hardcodeados deben estar aquí para facilitar mantenimiento e internacionalización
 */

// ============================================
// TÍTULOS Y DESCRIPCIONES
// ============================================

export const ARCHIVADO_TITULOS = {
  titulo: 'Archivado de Proyectos',
  descripcion: 'Gestión del ciclo de vida de proyectos',
  proyectoArchivado: 'Proyecto Archivado',
  eliminacionDefinitiva: 'Eliminación Definitiva',
  archivarProyecto: 'Archivar Proyecto',
} as const

// ============================================
// TABS
// ============================================

export const ARCHIVADO_TABS = {
  proyectosCerrados: 'Proyectos Cerrados',
  archivados: 'Archivados',
  configuracion: 'Configuración',
} as const

// ============================================
// ESTADÍSTICAS
// ============================================

export const ARCHIVADO_STATS = {
  totalArchivados: 'Total archivados',
  completados: 'Completados',
  inconclusos: 'Inconclusos',
  espacioUsado: 'Espacio usado',
} as const

// ============================================
// FILTROS
// ============================================

export const ARCHIVADO_FILTROS = {
  buscarProyectos: 'Buscar proyectos...',
  buscarProyectosArchivados: 'Buscar proyectos archivados...',
  todos: 'Todos',
  completados: 'Completados',
  inconcluso: 'Inconcluso',
} as const

// ============================================
// BOTONES
// ============================================

export const ARCHIVADO_BOTONES = {
  archivar: 'Archivar',
  ver: 'Ver',
  restaurar: 'Restaurar Proyecto',
  eliminar: 'Eliminar Definitivamente',
  guardarConfiguracion: 'Guardar Configuración',
  descargar: 'Descargar',
  abrirDrive: 'Abrir en Drive',
  cancelar: 'Cancelar',
  eliminarDefinitivamente: 'Eliminar Definitivamente',
} as const

// ============================================
// ESTADOS VACÍOS
// ============================================

export const ARCHIVADO_EMPTY = {
  noHayProyectosCerrados: 'No hay proyectos cerrados',
  noHayProyectosArchivados: 'No hay proyectos archivados',
} as const

// ============================================
// CLASIFICACIONES
// ============================================

export const ARCHIVADO_CLASIFICACION = {
  completado: 'Completado',
  inconcluso: 'Inconcluso',
  clasificacion: 'Clasificación',
  duracion: 'Duración',
  dias: 'días',
} as const

// ============================================
// PROYECTOS CERRADOS - LABELS
// ============================================

export const PROYECTO_CERRADO_LABELS = {
  diasCerrado: 'días cerrado',
  cerrado: 'Cerrado',
  fase: 'Fase',
} as const

// ============================================
// CONFIGURACIÓN
// ============================================

export const ARCHIVADO_CONFIG = {
  titulo: 'Configuración de Archivado',
  archivadoAutomatico: {
    titulo: 'Archivado automático',
    descripcion: 'Notificar al admin cuando proyectos estén cerrados por más de X días',
    activado: 'Activado',
    desactivado: 'Desactivado',
    diasNotificacion: 'Días en estado cerrado antes de notificar',
  },
  queArchivar: {
    titulo: 'Qué archivar',
    incluirTickets: {
      titulo: 'Incluir tickets de soporte',
      descripcion: 'Guardar tickets asociados al proyecto',
    },
    generarPdf: {
      titulo: 'Generar resumen PDF',
      descripcion: 'Crear PDF con resumen ejecutivo',
    },
  },
  queEliminar: {
    titulo: 'Qué eliminar de la BD operativa',
    eliminarTareas: 'Eliminar tareas',
    eliminarReuniones: 'Eliminar reuniones',
    eliminarArchivos: 'Eliminar referencias de archivos',
  },
  ubicacionDrive: {
    titulo: 'Ubicación en Drive',
    carpetaRaiz: 'Carpeta raíz',
  },
  si: 'Sí',
  no: 'No',
} as const

// ============================================
// MODAL DETALLE ARCHIVADO
// ============================================

export const DETALLE_ARCHIVADO_MODAL = {
  titulo: 'Proyecto Archivado',
  motivoCierre: 'Motivo de cierre',
  resumen: 'Resumen',
  archivosGenerados: 'Archivos generados',
  exportacionDatos: 'exportacion_datos.json',
  resumenEjecutivo: 'resumen_ejecutivo.pdf',
  carpetaDrive: 'Carpeta en Drive',
  tareas: 'Tareas',
  tickets: 'Tickets',
  reuniones: 'Reuniones',
  archivos: 'Archivos',
  fechaCierre: 'Fecha de cierre',
  fechaArchivado: 'Fecha de archivado',
} as const

// ============================================
// MODAL ARCHIVAR PROYECTO
// ============================================

export const ARCHIVAR_MODAL = {
  titulo: 'Archivar Proyecto',
  clasificacionAutomatica: 'Clasificación automática sugerida:',
  clasificacionEditable: 'Clasificación (editable)',
  basadoEn: 'Basado en:',
  fase: 'fase',
  tareasCierre: 'tareas de cierre',
  completadas: 'completadas',
} as const

// ============================================
// MODAL ELIMINAR PROYECTO
// ============================================

export const ELIMINAR_MODAL = {
  titulo: 'Eliminación Definitiva',
  advertenciaPermanente: 'Esto eliminará PERMANENTEMENTE:',
  carpetaDrive: 'La carpeta completa en Google Drive',
  registroBd: 'El registro en proyectos archivados',
  accionNoReversible: 'Esta acción NO se puede deshacer.',
  confirmarEliminacion: 'Escribe "ELIMINAR" para confirmar',
  placeholderConfirmar: 'ELIMINAR',
} as const

// ============================================
// ACCESSO DENEGADO
// ============================================

export const ARCHIVADO_ACCESS = {
  accesoRestringido: 'Acceso Restringido',
  soloAdmins: 'Solo los administradores pueden acceder a este módulo.',
} as const

// ============================================
// STORAGE KEYS
// ============================================

export const ARCHIVADO_STORAGE_KEYS = {
  config: 'apex_archivado_config',
  proyectos: 'apex_archivado_proyectos',
} as const

// ============================================
// EXPORT AGRUPADO
// ============================================

export const ARCHIVADO_TEXTS = {
  titulos: ARCHIVADO_TITULOS,
  tabs: ARCHIVADO_TABS,
  stats: ARCHIVADO_STATS,
  filtros: ARCHIVADO_FILTROS,
  botones: ARCHIVADO_BOTONES,
  empty: ARCHIVADO_EMPTY,
  clasificacion: ARCHIVADO_CLASIFICACION,
  proyectoCerradoLabels: PROYECTO_CERRADO_LABELS,
  config: ARCHIVADO_CONFIG,
  detalleModal: DETALLE_ARCHIVADO_MODAL,
  archivarModal: ARCHIVAR_MODAL,
  eliminarModal: ELIMINAR_MODAL,
  access: ARCHIVADO_ACCESS,
} as const
