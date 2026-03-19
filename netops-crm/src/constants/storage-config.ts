/**
 * ============================================
 * Configuración Centralizada de Storage
 * ============================================
 * Este archivo define todas las keys de localStorage
 * de forma unificada para el proyecto.
 * 
 * Prefijo recomendado: netops_
 * 
 * Para migración futura a Supabase:
 * - Las keys se mapearán a tablas de Supabase
 * - La estructura de datos se mantiene consistente
 */

import type { Empresa } from '@/types/crm'
import type { Proyecto, HistorialProyecto } from '@/types/proyectos'
import type { Tarea, Subtarea, Comentario } from '@/types/tareas'
import type { Ticket, ContratoSoporte, ComentarioTicket } from '@/types/soporte'
import type { Archivo } from '@/types/archivos'
import type { Reunion } from '@/types/calendario'
import type { OrdenCompra, Proveedor, Cotizacion } from '@/types/compras'
import type { User } from '@/types/auth'
import type { ProyectoArchivado, ProyectoCerrado, ConfigArchivado } from '@/types/archivado'

// ============================================================================
// ENUM: Keys de localStorage
// ============================================================================

export enum StorageKeys {
  // ============ AUTH ============
  AUTH_USER = 'netops_auth_user',
  PORTAL_USER = 'netops_portal_user',

  // ============ CRM ============
  EMPRESAS = 'netops_crm_empresas',
  CONTACTOS = 'netops_crm_contactos',
  DOCUMENTOS = 'netops_crm_documentos',

  // ============ PROYECTOS ============
  PROYECTOS = 'netops_proyectos',
  HISTORIAL_PROYECTOS = 'netops_proyectos_historial',

  // ============ TAREAS ============
  TAREAS = 'netops_tareas',
  SUBTAREAS = 'netops_subtareas',
  COMENTARIOS = 'netops_comentarios',

  // ============ SOPORTE ============
  CONTRATOS = 'netops_soporte_contratos',
  TICKETS = 'netops_soporte_tickets',
  COMENTARIOS_TICKETS = 'netops_soporte_comentarios',

  // ============ COMPRAS ============
  ORDENES_COMPRA = 'netops_compras_ordenes',
  PROVEEDORES = 'netops_compras_proveedores',
  COTIZACIONES = 'netops_compras_cotizaciones',

  // ============ CALENDARIO ============
  REUNIONES = 'netops_calendario_reuniones',

  // ============ ARCHIVOS ============
  ARCHIVOS = 'netops_archivos',

  // ============ ARCHIVADOS ============
  PROYECTOS_CERRADOS = 'netops_proyectos_cerrados',
  PROYECTOS_ARCHIVADOS = 'netops_proyectos_archivados',
  CONFIG_ARCHIVADO = 'netops_config_archivado',

  // ============ NOTIFICACIONES ============
  NOTIFICACIONES_CONFIG = 'netops_notificaciones_config',
  NOTIFICACIONES_PREFERENCIA = 'netops_notificaciones_preferencia',
  NOTIFICACIONES_EVENTOS = 'netops_notificaciones_eventos',

  // ============ USUARIOS ============
  USUARIOS = 'netops_usuarios',

  // ============ UI STATE ============
  COMPRAS_VISTA = 'netops_ui_compras_vista',
  SOPORTE_VISTA = 'netops_ui_soporte_vista',
  NOTIFICACIONES_VISTA = 'netops_ui_notificaciones_vista',
  FILTRO_ESTADO_COMPRAS = 'netops_ui_compras_filtro_estado',
}

// ============================================================================
// TIPOS: Definiciones de datos por key
// ============================================================================

export interface StorageDataMap {
  // Auth
  [StorageKeys.AUTH_USER]: User | null
  [StorageKeys.PORTAL_USER]: User | null

  // CRM
  [StorageKeys.EMPRESAS]: Empresa[]
  [StorageKeys.CONTACTOS]: import('@/types/crm').Contacto[]
  [StorageKeys.DOCUMENTOS]: Archivo[]

  // Proyectos
  [StorageKeys.PROYECTOS]: Proyecto[]
  [StorageKeys.HISTORIAL_PROYECTOS]: Record<string, HistorialProyecto[]>

  // Tareas
  [StorageKeys.TAREAS]: Tarea[]
  [StorageKeys.SUBTAREAS]: Record<string, Subtarea[]>
  [StorageKeys.COMENTARIOS]: Record<string, Comentario[]>

  // Soporte
  [StorageKeys.CONTRATOS]: ContratoSoporte[]
  [StorageKeys.TICKETS]: Ticket[]
  [StorageKeys.COMENTARIOS_TICKETS]: Record<string, ComentarioTicket[]>

  // Compras
  [StorageKeys.ORDENES_COMPRA]: OrdenCompra[]
  [StorageKeys.PROVEEDORES]: Proveedor[]
  [StorageKeys.COTIZACIONES]: Cotizacion[]

  // Calendario
  [StorageKeys.REUNIONES]: Reunion[]

  // Archivos
  [StorageKeys.ARCHIVOS]: Archivo[]

  // Archivados
  [StorageKeys.PROYECTOS_CERRADOS]: ProyectoCerrado[]
  [StorageKeys.PROYECTOS_ARCHIVADOS]: ProyectoArchivado[]
  [StorageKeys.CONFIG_ARCHIVADO]: ConfigArchivado

  // Notificaciones
  [StorageKeys.NOTIFICACIONES_CONFIG]: unknown
  [StorageKeys.NOTIFICACIONES_PREFERENCIA]: unknown
  [StorageKeys.NOTIFICACIONES_EVENTOS]: unknown[]

  // Usuarios
  [StorageKeys.USUARIOS]: User[]

  // UI State
  [StorageKeys.COMPRAS_VISTA]: 'dashboard' | 'ordenes' | 'proveedores'
  [StorageKeys.SOPORTE_VISTA]: 'contratos' | 'tickets'
  [StorageKeys.NOTIFICACIONES_VISTA]: 'config' | 'eventos' | 'logs' | 'mispreferencias'
  [StorageKeys.FILTRO_ESTADO_COMPRAS]: string
}

// ============================================================================
// VALORES INICIALES
// ============================================================================

export const INITIAL_VALUES: StorageDataMap = {
  // Auth
  [StorageKeys.AUTH_USER]: null,
  [StorageKeys.PORTAL_USER]: null,

  // CRM
  [StorageKeys.EMPRESAS]: [],
  [StorageKeys.CONTACTOS]: [],
  [StorageKeys.DOCUMENTOS]: [],

  // Proyectos
  [StorageKeys.PROYECTOS]: [],
  [StorageKeys.HISTORIAL_PROYECTOS]: {},

  // Tareas
  [StorageKeys.TAREAS]: [],
  [StorageKeys.SUBTAREAS]: {},
  [StorageKeys.COMENTARIOS]: {},

  // Soporte
  [StorageKeys.CONTRATOS]: [],
  [StorageKeys.TICKETS]: [],
  [StorageKeys.COMENTARIOS_TICKETS]: {},

  // Compras
  [StorageKeys.ORDENES_COMPRA]: [],
  [StorageKeys.PROVEEDORES]: [],
  [StorageKeys.COTIZACIONES]: [],

  // Calendario
  [StorageKeys.REUNIONES]: [],

  // Archivos
  [StorageKeys.ARCHIVOS]: [],

  // Archivados
  [StorageKeys.PROYECTOS_CERRADOS]: [],
  [StorageKeys.PROYECTOS_ARCHIVADOS]: [],
  [StorageKeys.CONFIG_ARCHIVADO]: {
    archivado_automatico: false,
    dias_antes_notificacion: 30,
    incluir_tickets: false,
    generar_pdf: true,
    eliminar_tareas: true,
    eliminar_reuniones: true,
    eliminar_archivos: true,
    carpeta_raiz: '/Archivo Histórico',
  },

  // Notificaciones
  [StorageKeys.NOTIFICACIONES_CONFIG]: null,
  [StorageKeys.NOTIFICACIONES_PREFERENCIA]: null,
  [StorageKeys.NOTIFICACIONES_EVENTOS]: [],

  // Usuarios
  [StorageKeys.USUARIOS]: [],

  // UI State
  [StorageKeys.COMPRAS_VISTA]: 'dashboard',
  [StorageKeys.SOPORTE_VISTA]: 'tickets',
  [StorageKeys.NOTIFICACIONES_VISTA]: 'config',
  [StorageKeys.FILTRO_ESTADO_COMPRAS]: 'todos',
}

// ============================================================================
// MAPA: Keys de localStorage a tablas de Supabase (para futura migración)
// ============================================================================

export const STORAGE_TO_SUPABASE_MAP: Record<StorageKeys, string | null> = {
  // Auth - No se migra, gestionado por Supabase Auth
  [StorageKeys.AUTH_USER]: null,
  [StorageKeys.PORTAL_USER]: null,

  // CRM
  [StorageKeys.EMPRESAS]: 'empresas',
  [StorageKeys.CONTACTOS]: 'contactos',
  [StorageKeys.DOCUMENTOS]: 'documentos',

  // Proyectos
  [StorageKeys.PROYECTOS]: 'proyectos',
  [StorageKeys.HISTORIAL_PROYECTOS]: 'historial_proyectos',

  // Tareas
  [StorageKeys.TAREAS]: 'tareas',
  [StorageKeys.SUBTAREAS]: 'subtareas',
  [StorageKeys.COMENTARIOS]: 'comentarios',

  // Soporte
  [StorageKeys.CONTRATOS]: 'contratos_soporte',
  [StorageKeys.TICKETS]: 'tickets',
  [StorageKeys.COMENTARIOS_TICKETS]: 'comentarios_tickets',

  // Compras
  [StorageKeys.ORDENES_COMPRA]: 'ordenes_compra',
  [StorageKeys.PROVEEDORES]: 'proveedores',
  [StorageKeys.COTIZACIONES]: 'cotizaciones',

  // Calendario
  [StorageKeys.REUNIONES]: 'reuniones',

  // Archivos
  [StorageKeys.ARCHIVOS]: 'archivos',

  // Archivados
  [StorageKeys.PROYECTOS_CERRADOS]: 'proyectos_cerrados',
  [StorageKeys.PROYECTOS_ARCHIVADOS]: 'proyectos_archivados',
  [StorageKeys.CONFIG_ARCHIVADO]: 'config_archivado',

  // Notificaciones
  [StorageKeys.NOTIFICACIONES_CONFIG]: 'notificaciones_config',
  [StorageKeys.NOTIFICACIONES_PREFERENCIA]: 'notificaciones_preferencia',
  [StorageKeys.NOTIFICACIONES_EVENTOS]: 'notificaciones_eventos',

  // Usuarios
  [StorageKeys.USUARIOS]: 'usuarios',

  // UI State - No se migra, solo local
  [StorageKeys.COMPRAS_VISTA]: null,
  [StorageKeys.SOPORTE_VISTA]: null,
  [StorageKeys.NOTIFICACIONES_VISTA]: null,
  [StorageKeys.FILTRO_ESTADO_COMPRAS]: null,
}

// ============================================================================
// EXPORT: Tipo para obtener valor inicial por key
// ============================================================================

export function getInitialValue<K extends StorageKeys>(key: K): StorageDataMap[K] {
  return INITIAL_VALUES[key]
}

// ============================================================================
// EXPORT: Obtener tabla de Supabase por key
// ============================================================================

export function getSupabaseTable<K extends StorageKeys>(key: K): string | null {
  return STORAGE_TO_SUPABASE_MAP[key]
}

// ============================================================================
// DEPRECATED: Alias para compatibilidad hacia atrás
// ============================================================================

/**
 * @deprecated Usa StorageKeys en su lugar
 * Este objeto se mantiene para compatibilidad con código existente
 */
export const DEPRECATED_STORAGE_KEYS = {
  empresas: StorageKeys.EMPRESAS,
  usuarios: StorageKeys.USUARIOS,
  proyectos: StorageKeys.PROYECTOS,
  tareas: StorageKeys.TAREAS,
  tickets: StorageKeys.TICKETS,
  contratos: StorageKeys.CONTRATOS,
  comentarios: StorageKeys.COMENTARIOS_TICKETS,
  soporteVista: StorageKeys.SOPORTE_VISTA,
  compras: StorageKeys.ORDENES_COMPRA,
  proveedores: StorageKeys.PROVEEDORES,
  cotizaciones: StorageKeys.COTIZACIONES,
  comprasVista: StorageKeys.COMPRAS_VISTA,
  notificacionesConfig: StorageKeys.NOTIFICACIONES_CONFIG,
  notificacionesPreferencia: StorageKeys.NOTIFICACIONES_PREFERENCIA,
  notificacionesEventos: StorageKeys.NOTIFICACIONES_EVENTOS,
  notificacionesVista: StorageKeys.NOTIFICACIONES_VISTA,
  empresasArchivadas: StorageKeys.PROYECTOS_ARCHIVADOS,
  proyectosArchivados: StorageKeys.PROYECTOS_ARCHIVADOS,
} as const
