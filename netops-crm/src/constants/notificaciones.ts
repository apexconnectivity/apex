/**
 * Constantes centralizadas para el módulo de Notificaciones
 * Todos los textos hardcodeados deben estar aquí para facilitar mantenimiento e internacionalización
 */

import type { ConfiguracionGlobal, PreferenciaNotificacion } from '@/types/notificaciones'

// ============================================
// TÍTULOS Y DESCRIPCIONES
// ============================================

export const NOTIFICACIONES_TITULOS = {
  titulo: 'Notificaciones',
  descripcion: 'Configuración de notificaciones y automatizaciones',
} as const

// ============================================
// TABS
// ============================================

export const NOTIFICACIONES_TABS = {
  configuracion: 'Configuración',
  eventos: 'Eventos',
  logs: 'Logs',
  misPreferencias: 'Mis Preferencias',
} as const

// ============================================
// ESTADÍSTICAS
// ============================================

export const NOTIFICACIONES_STATS = {
  total: 'Total',
  enviados: 'Enviados',
  fallidos: 'Fallidos',
  pendientes: 'Pendientes',
} as const

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

export const CONFIG_GLOBAL_TITULOS = {
  canalesActivos: 'Canales Activos',
  umbralesSLA: 'Umbrales de SLA',
  umbralSLADesc: 'Tiempo antes del vencimiento para enviar alertas',
  resumenDiario: 'Resumen Diario',
  integracionN8N: 'Integración n8n',
} as const

export const CONFIG_GLOBAL_CANALES = {
  slack: {
    titulo: 'Slack',
    descripcion: 'Notificaciones a canales y DMs',
  },
  emailClientes: {
    titulo: 'Email a Clientes',
    descripcion: 'Notificaciones hacia clientes',
  },
  emailInternos: {
    titulo: 'Email a Internos',
    descripcion: 'Notificaciones hacia el equipo',
  },
} as const

export const CONFIG_GLOBAL_SLA = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
  horas: 'horas',
} as const

export const CONFIG_GLOBAL_RESUMEN = {
  activar: 'Activar resumen diario',
  activarDesc: 'Enviar resumen matutino de actividades',
  horaEnvio: 'Hora de envío',
} as const

export const CONFIG_GLOBAL_WEBHOOK = {
  label: 'Webhook URL',
  placeholder: 'https://n8n.example.com/webhook',
  help: 'URL del webhook de n8n para recibir eventos',
} as const

export const CONFIG_GLOBAL_BOTONES = {
  guardar: 'Guardar Configuración',
  test: 'Probar',
} as const

// ============================================
// BOTONES DE ESTADO
// ============================================

export const BOTONES_ESTADO = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  activado: 'Activado',
  desactivado: 'Desactivado',
} as const

// ============================================
// TIPOS DE CANAL (para Preferencias)
// ============================================

export const CANALES_PREFERENCIA = [
  { value: 'email', label: 'Solo Email' },
  { value: 'slack', label: 'Solo Slack' },
  { value: 'ambos', label: 'Ambos' },
  { value: 'ninguno', label: 'Solo urgentes' },
] as const

// ============================================
// EVENTOS DE NOTIFICACIÓN (Preferencias del usuario)
// ============================================

export const EVENTOS_NOTIFICAR = [
  { key: 'notificaciones_tareas', label: 'Tareas asignadas' },
  { key: 'notificaciones_tickets', label: 'Tickets nuevos y comentarios' },
  { key: 'notificaciones_proyectos', label: 'Cambios en proyectos' },
  { key: 'notificaciones_reuniones', label: 'Reuniones y recordatorios' },
  { key: 'notificaciones_sla', label: 'Alertas de SLA' },
  { key: 'notificaciones_resumen_diario', label: 'Resumen diario' },
] as const

// ============================================
// PREFERENCIAS
// ============================================

export const PREFERENCIAS_TITULOS = {
  canalesPreferidos: 'Canales Preferidos',
  eventosNotificar: 'Eventos a Notificar',
} as const

export const PREFERENCIAS_BOTONES = {
  guardar: 'Guardar Preferencias',
} as const

// ============================================
// LOGS
// ============================================

export const LOGS_TITULO = 'Historial de Notificaciones'

// ============================================
// EVENTOS
// ============================================

export const EVENTOS_GRUPOS = {
  proyecto: 'proyectos',
  tarea: 'tareas',
  ticket: 'tickets',
  reunion: 'reuniones',
  archivo: 'archivos',
  contrato: 'contratos',
  sistema: 'sistemas',
} as const

// ============================================
// MENSAJES DE ESTADO
// ============================================

export const MENSAJES_ESTADO = {
  enviado: 'enviado',
  fallido: 'fallido',
  pendiente: 'pendiente',
} as const

// ============================================
// ACCESO DENEGADO
// ============================================

export const ACCESO_DENEGADO = {
  titulo: 'Acceso Restringido',
  descripcion: 'Solo los administradores pueden configurar las notificaciones globales.',
} as const

// ============================================
// VALORES INICIALES
// ============================================

export const CONFIG_INICIAL: ConfiguracionGlobal = {
  slack_activo: false,
  email_clientes_activo: false,
  email_internos_activo: false,
  umbral_sla_urgente: 1,
  umbral_sla_alta: 2,
  umbral_sla_media: 4,
  umbral_sla_baja: 8,
  resumen_diario_activo: false,
  resumen_diario_hora: '09:00',
  n8n_webhook_url: '',
}

export const PREFERENCIA_INICIAL: PreferenciaNotificacion = {
  id: '',
  usuario_id: '',
  canal_preferido: 'ambos',
  notificaciones_tareas: true,
  notificaciones_tickets: true,
  notificaciones_proyectos: true,
  notificaciones_reuniones: true,
  notificaciones_sla: true,
  notificaciones_resumen_diario: true,
  resumen_diario_hora: '09:00',
}

// ============================================
// STORAGE KEYS
// ============================================

export const NOTIFICACIONES_STORAGE_KEYS = {
  config: 'apex_notificaciones_config',
  preferencia: 'apex_notificaciones_preferencia',
  eventos: 'apex_notificaciones_eventos',
  vista: 'apex_notificaciones_vista',
} as const

// ============================================
// EXPORT AGRUPADO
// ============================================

export const NOTIFICACIONES_TEXTS = {
  titulos: NOTIFICACIONES_TITULOS,
  tabs: NOTIFICACIONES_TABS,
  stats: NOTIFICACIONES_STATS,
  configGlobal: {
    titulos: CONFIG_GLOBAL_TITULOS,
    canales: CONFIG_GLOBAL_CANALES,
    sla: CONFIG_GLOBAL_SLA,
    resumen: CONFIG_GLOBAL_RESUMEN,
    webhook: CONFIG_GLOBAL_WEBHOOK,
    botones: CONFIG_GLOBAL_BOTONES,
  },
  botonesEstado: BOTONES_ESTADO,
  canalesPreferencia: CANALES_PREFERENCIA,
  eventosNotificar: EVENTOS_NOTIFICAR,
  preferencias: {
    titulos: PREFERENCIAS_TITULOS,
    botones: PREFERENCIAS_BOTONES,
  },
  logs: LOGS_TITULO,
  eventosGrupos: EVENTOS_GRUPOS,
  mensajesEstado: MENSAJES_ESTADO,
  accesoDenegado: ACCESO_DENEGADO,
} as const
