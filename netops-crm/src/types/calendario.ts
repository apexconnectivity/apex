export type TipoReunion = 'Diagnóstico' | 'Seguimiento' | 'Propuesta' | 'Cierre' | 'Soporte' | 'Otro'

export type EstadoReunion = 'Programada' | 'Confirmada' | 'Cancelada' | 'Completada'

export type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Reprogramada'

export type TipoCalendario = 'mensual' | 'semanal' | 'lista'

export interface Reunion {
  id: string
  proyecto_id: string
  proyecto_nombre: string
  solicitado_por_contacto_id?: string
  titulo: string
  descripcion?: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
  duracion_minutos: number
  tipo: TipoReunion
  organizador_id: string
  organizador_nombre: string
  asistentes_internos: { id: string; nombre: string }[]
  asistente_cliente_id?: string
  asistente_cliente_nombre?: string
  ubicacion?: string
  google_event_id?: string
  meet_link?: string
  estado: EstadoReunion
  solicitada_por_cliente: boolean
  confirmada_por?: string
  observaciones?: string
  creado_en: string
}

export interface SolicitudReunion {
  id: string
  proyecto_id: string
  proyecto_nombre: string
  contacto_solicitante_id: string
  contacto_solicitante_nombre: string
  empresa_nombre: string
  fecha_solicitada: string
  hora_solicitada: string
  duracion: number
  motivo: string
  comentarios?: string
  estado: EstadoSolicitud
  fecha_solicitud: string
  respondida_por?: string
  respuesta_fecha?: string
  reunion_generada_id?: string
}

export const TIPOS_REUNION: TipoReunion[] = ['Diagnóstico', 'Seguimiento', 'Propuesta', 'Cierre', 'Soporte', 'Otro']

export const ESTADOS_REUNION: EstadoReunion[] = ['Programada', 'Confirmada', 'Cancelada', 'Completada']

export const TIPOS_SOLICITUD: EstadoSolicitud[] = ['Pendiente', 'Aprobada', 'Rechazada', 'Reprogramada']

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'Programada': return 'bg-blue-500/20 text-blue-400'
    case 'Confirmada': return 'bg-green-500/20 text-green-400'
    case 'Cancelada': return 'bg-red-500/20 text-red-400'
    case 'Completada': return 'bg-slate-500/20 text-slate-400'
    case 'Pendiente': return 'bg-amber-500/20 text-amber-400'
    case 'Aprobada': return 'bg-green-500/20 text-green-400'
    case 'Rechazada': return 'bg-red-500/20 text-red-400'
    case 'Reprogramada': return 'bg-purple-500/20 text-purple-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

export const getTipoIcon = (tipo: TipoReunion): string => {
  switch (tipo) {
    case 'Diagnóstico': return '🔍'
    case 'Seguimiento': return '📋'
    case 'Propuesta': return '📝'
    case 'Cierre': return '🎯'
    case 'Soporte': return '🛠️'
    default: return '📅'
  }
}
