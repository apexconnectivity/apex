export interface PreferenciaNotificacion {
  id: string
  usuario_id: string
  canal_preferido: 'email' | 'slack' | 'ambos' | 'ninguno'
  notificaciones_tareas: boolean
  notificaciones_tickets: boolean
  notificaciones_proyectos: boolean
  notificaciones_reuniones: boolean
  notificaciones_sla: boolean
  notificaciones_resumen_diario: boolean
  resumen_diario_hora: string
}

export interface EventoNotificacion {
  id: string
  tipo: 'proyecto' | 'tarea' | 'ticket' | 'reunion' | 'archivo' | 'contrato' | 'sistema'
  nombre: string
  descripcion: string
  canal_default: 'slack' | 'email' | 'ambos'
  activo: boolean
  plantilla_slack?: string
  plantilla_email?: string
}

export interface LogNotificacion {
  id: string
  evento_id: string
  evento_tipo: string
  destinatario: string
  canal: 'slack' | 'email'
  estado: 'enviado' | 'fallido' | 'pendiente'
  fecha_envio?: string
  intentos: number
  error?: string
}

export interface ConfiguracionGlobal {
  slack_activo: boolean
  email_clientes_activo: boolean
  email_internos_activo: boolean
  umbral_sla_urgente: number
  umbral_sla_alta: number
  umbral_sla_media: number
  umbral_sla_baja: number
  resumen_diario_activo: boolean
  resumen_diario_hora: string
  n8n_webhook_url: string
}

export const EVENTOS_NOTIFICACION: EventoNotificacion[] = [
  { id: 'proyecto_creado', tipo: 'proyecto', nombre: 'Proyecto creado', descripcion: 'Notificación cuando se crea un nuevo proyecto', canal_default: 'slack', activo: true },
  { id: 'proyecto_fase', tipo: 'proyecto', nombre: 'Cambio de fase', descripcion: 'Notificación cuando un proyecto cambia de fase', canal_default: 'slack', activo: true },
  { id: 'proyecto_proximo', tipo: 'proyecto', nombre: 'Proyecto próximo a vencer', descripcion: 'Recordatorio de proyecto próximo a vencer', canal_default: 'slack', activo: true },
  { id: 'proyecto_vencido', tipo: 'proyecto', nombre: 'Proyecto vencido', descripcion: 'Alerta de proyecto vencido', canal_default: 'slack', activo: true },
  { id: 'tarea_asignada', tipo: 'tarea', nombre: 'Tarea asignada', descripcion: 'Notificación cuando se asigna una tarea', canal_default: 'ambos', activo: true },
  { id: 'tarea_vencida', tipo: 'tarea', nombre: 'Tarea vencida', descripcion: 'Alerta de tarea vencida', canal_default: 'slack', activo: true },
  { id: 'tarea_completada', tipo: 'tarea', nombre: 'Tarea completada', descripcion: 'Notificación cuando se completa una tarea', canal_default: 'slack', activo: true },
  { id: 'ticket_nuevo', tipo: 'ticket', nombre: 'Ticket nuevo', descripcion: 'Notificación de nuevo ticket', canal_default: 'slack', activo: true },
  { id: 'ticket_asignado', tipo: 'ticket', nombre: 'Ticket asignado', descripcion: 'Notificación cuando se asigna un ticket', canal_default: 'ambos', activo: true },
  { id: 'ticket_sla', tipo: 'ticket', nombre: 'Alerta SLA', descripcion: 'Alerta de SLA próximo a vencer', canal_default: 'ambos', activo: true },
  { id: 'ticket_comentario', tipo: 'ticket', nombre: 'Comentario en ticket', descripcion: 'Notificación de nuevo comentario', canal_default: 'email', activo: true },
  { id: 'reunion_creada', tipo: 'reunion', nombre: 'Reunión creada', descripcion: 'Notificación de nueva reunión', canal_default: 'email', activo: true },
  { id: 'reunion_recordatorio', tipo: 'reunion', nombre: 'Recordatorio de reunión', descripcion: 'Recordatorio 2 horas antes', canal_default: 'email', activo: true },
  { id: 'solicitud_reunion', tipo: 'reunion', nombre: 'Solicitud de reunión', descripcion: 'Nueva solicitud de reunión de cliente', canal_default: 'slack', activo: true },
  { id: 'archivo_subido', tipo: 'archivo', nombre: 'Archivo subido', descripcion: 'Notificación cuando se sube un archivo', canal_default: 'slack', activo: true },
  { id: 'contrato_proximo', tipo: 'contrato', nombre: 'Contrato próximo a vencer', descripcion: 'Recordatorio de contrato próximo a vencer', canal_default: 'ambos', activo: true },
]

export const getCanalIcon = (canal: string): string => {
  switch (canal) {
    case 'slack': return '💬'
    case 'email': return '📧'
    case 'ambos': return '📨'
    default: return '📬'
  }
}

export const getEstadoNotificacionColor = (estado: string): string => {
  switch (estado) {
    case 'enviado': return 'bg-green-500/20 text-green-400'
    case 'fallido': return 'bg-red-500/20 text-red-400'
    case 'pendiente': return 'bg-amber-500/20 text-amber-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}
