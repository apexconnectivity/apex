/**
 * ============================================
 * @deprecated Usa storage-config.ts en su lugar
 * ============================================
 * Este archivo se mantiene solo por compatibilidad.
 * Por favor migrar a '@/constants/storage-config'
 */

// Keys simples para compatibilidad (valores string)
export const STORAGE_KEYS = {
  empresas: 'netops_crm_empresas',
  contactos: 'netops_crm_contactos',
  documentos: 'netops_crm_documentos',
  usuarios: 'netops_usuarios',
  proyectos: 'netops_proyectos',
  tareas: 'netops_tareas',
  tickets: 'netops_soporte_tickets',
  contratos: 'netops_soporte_contratos',
  comentarios: 'netops_soporte_comentarios',
  soporteVista: 'netops_ui_soporte_vista',
  compras: 'netops_compras_ordenes',
  proveedores: 'netops_compras_proveedores',
  cotizaciones: 'netops_compras_cotizaciones',
  comprasVista: 'netops_ui_compras_vista',
  notificacionesConfig: 'netops_notificaciones_config',
  notificacionesPreferencia: 'netops_notificaciones_preferencia',
  notificacionesEventos: 'netops_notificaciones_eventos',
  notificacionesVista: 'netops_ui_notificaciones_vista',
  empresasArchivadas: 'netops_proyectos_archivados',
  proyectosArchivados: 'netops_proyectos_archivados',
  tareasArchivadas: 'netops_tareas_archivadas',
  ticketsArchivados: 'netops_soporte_archivados',
  contratosArchivados: 'netops_contratos_archivados',
  comprasArchivadas: 'netops_compras_archivadas',
  proveedoresArchivados: 'netops_proveedores_archivados',
  cotizacionesArchivadas: 'netops_cotizaciones_archivadas',
  // Keys adicionales para módulos
  historialProyectos: 'netops_proyectos_historial',
  reuniones: 'netops_calendario_reuniones',
  subtareas: 'netops_tareas_subtareas',
  archivos: 'netops_archivos',
} as const

// Valores iniciales simples
export const INITIAL_DATA = {
  empresas: [],
  proyectos: [],
  tareas: [],
  tickets: [],
  contratos: [],
  comentarios: {},
  compras: [],
  proveedores: [],
  cotizaciones: [],
  empresasArchivadas: [],
  proyectosArchivados: [],
  tareasArchivadas: [],
  ticketsArchivados: [],
  contratosArchivados: [],
  comprasArchivadas: [],
  proveedoresArchivados: [],
  cotizacionesArchivadas: [],
} as const
