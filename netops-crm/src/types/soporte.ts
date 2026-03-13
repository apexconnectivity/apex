export type TipoContrato = 'Básico' | 'Premium' | '24x7' | 'Monitoreo'

export type EstadoContrato = 'Activo' | 'En renovación' | 'Vencido' | 'Cancelado'

export type CategoriaTicket = 'Soporte técnico' | 'Consulta comercial' | 'Facturación' | 'Compras' | 'Otro'

export type EstadoTicket = 'Abierto' | 'En progreso' | 'Esperando cliente' | 'Resuelto' | 'Cerrado'

export type PrioridadTicket = 'Baja' | 'Media' | 'Alta' | 'Urgente'

export type TipoOrigen = 'soporte' | 'proyecto'

export interface ContratoSoporte {
  id: string
  empresa_id: string
  empresa_nombre: string
  proyecto_origen_id?: string
  proyecto_origen_nombre?: string
  nombre: string
  tipo: TipoContrato
  fecha_inicio: string
  fecha_fin: string
  renovacion_automatica: boolean
  estado: EstadoContrato
  moneda: 'USD' | 'MXN'
  monto_mensual: number
  horas_incluidas_mes: number
  horas_consumidas_mes: number
  contacto_principal_id?: string
  contacto_principal_nombre?: string
  contacto_tecnico_id?: string
  contacto_tecnico_nombre?: string
  tecnico_asignado_id?: string
  tecnico_asignado_nombre?: string
  notas?: string
  creado_en: string
}

export interface Ticket {
  id: string
  numero_ticket: string
  contrato_id?: string
  contrato_nombre?: string
  proyecto_id?: string
  proyecto_nombre?: string
  tipo_origen: TipoOrigen
  categoria: CategoriaTicket
  titulo: string
  descripcion: string
  creado_por: string
  creado_por_nombre: string
  creado_por_cliente: boolean
  fecha_apertura: string
  fecha_cierre?: string
  estado: EstadoTicket
  prioridad: PrioridadTicket
  fecha_limite_respuesta?: string
  fecha_limite_resolucion?: string
  fecha_primera_respuesta?: string
  tiempo_respuesta_minutos?: number
  tiempo_resolucion_minutos?: number
  responsable_id?: string
  responsable_nombre?: string
  tiempo_invertido_minutos: number
  satisfaccion_cliente?: number
}

export interface ComentarioTicket {
  id: string
  ticket_id: string
  usuario_id: string
  usuario_nombre: string
  es_interno: boolean
  comentario: string
  fecha: string
}

export interface ReglaSLA {
  id: string
  prioridad: PrioridadTicket
  tiempo_respuesta_horas: number
  tiempo_resolucion_horas: number
  activo: boolean
}

export const CONTRATOS_TIPOS: TipoContrato[] = ['Básico', 'Premium', '24x7', 'Monitoreo']

export const CONTRATOS_ESTADOS: EstadoContrato[] = ['Activo', 'En renovación', 'Vencido', 'Cancelado']

export const CATEGORIAS_TICKET: CategoriaTicket[] = ['Soporte técnico', 'Consulta comercial', 'Facturación', 'Compras', 'Otro']

export const ESTADOS_TICKET: EstadoTicket[] = ['Abierto', 'En progreso', 'Esperando cliente', 'Resuelto', 'Cerrado']

export const PRIORIDADES_TICKET: PrioridadTicket[] = ['Baja', 'Media', 'Alta', 'Urgente']

export const getPrioridadColor = (prioridad: PrioridadTicket) => {
  const colors: Record<PrioridadTicket, string> = {
    Baja: 'bg-slate-500/20 text-slate-400',
    Media: 'bg-blue-500/20 text-blue-400',
    Alta: 'bg-amber-500/20 text-amber-400',
    Urgente: 'bg-red-500/20 text-red-400',
  }
  return colors[prioridad]
}

export const getCategoriaColor = (categoria: CategoriaTicket) => {
  const colors: Record<CategoriaTicket, string> = {
    'Soporte técnico': 'bg-green-500/20 text-green-400',
    'Consulta comercial': 'bg-purple-500/20 text-purple-400',
    'Facturación': 'bg-cyan-500/20 text-cyan-400',
    'Compras': 'bg-amber-500/20 text-amber-400',
    'Otro': 'bg-slate-500/20 text-slate-400',
  }
  return colors[categoria]
}

export const getEstadoColor = (estado: EstadoTicket) => {
  const colors: Record<EstadoTicket, string> = {
    'Abierto': 'bg-red-500/20 text-red-400',
    'En progreso': 'bg-blue-500/20 text-blue-400',
    'Esperando cliente': 'bg-amber-500/20 text-amber-400',
    'Resuelto': 'bg-green-500/20 text-green-400',
    'Cerrado': 'bg-slate-500/20 text-slate-400',
  }
  return colors[estado]
}

export const DEFAULT_SLA: ReglaSLA[] = [
  { id: '1', prioridad: 'Baja', tiempo_respuesta_horas: 48, tiempo_resolucion_horas: 120, activo: true },
  { id: '2', prioridad: 'Media', tiempo_respuesta_horas: 24, tiempo_resolucion_horas: 72, activo: true },
  { id: '3', prioridad: 'Alta', tiempo_respuesta_horas: 8, tiempo_resolucion_horas: 24, activo: true },
  { id: '4', prioridad: 'Urgente', tiempo_respuesta_horas: 2, tiempo_resolucion_horas: 8, activo: true },
]
