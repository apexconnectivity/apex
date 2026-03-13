export interface ClienteUsuario {
  id: string
  email: string
  nombre: string
  rol: string
  empresa_id: string
  empresa_nombre: string
  cargo?: string
  telefono?: string
}

export interface ProyectoCliente {
  id: string
  nombre: string
  fase_actual: number
  fase_nombre: string
  progreso: number
  fecha_inicio: string
  fecha_estimada_fin: string
  responsable_id: string
  responsable_nombre: string
  contacto_tecnico_id: string
  proximo_hito?: string
  proximo_hito_fecha?: string
}

export interface TareaCliente {
  id: string
  proyecto_id: string
  proyecto_nombre: string
  nombre: string
  descripcion?: string
  estado: string
  prioridad: string
  fecha_vencimiento?: string
  fecha_creacion: string
  categoria: string
}

export interface TicketCliente {
  id: string
  numero_ticket: string
  titulo: string
  descripcion: string
  estado: string
  prioridad: string
  categoria: string
  creado_por_nombre: string
  fecha_apertura: string
  fecha_cierre?: string
}

export interface DocumentoCliente {
  id: string
  nombre_original: string
  mime_type: string
  tamaño_bytes: number
  visibilidad: 'publico' | 'interno'
  fecha_subida: string
  subido_por_nombre: string
}

export interface ArchivoProyectoCliente {
  id: string
  nombre_original: string
  mime_type: string
  tamaño_bytes: number
  ruta_completa: string
  proyecto_id: string
  proyecto_nombre: string
  visibilidad: string
  fecha_subida: string
  subido_por_nombre: string
}

export const getPrioridadIcon = (prioridad: string): string => {
  switch (prioridad) {
    case 'Urgente': return '🔴'
    case 'Alta': return '🟡'
    case 'Media': return '🟢'
    case 'Baja': return '⚪'
    default: return '⚪'
  }
}

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'Abierto': return 'bg-red-500/20 text-red-400'
    case 'En progreso': return 'bg-blue-500/20 text-blue-400'
    case 'Esperando cliente': return 'bg-amber-500/20 text-amber-400'
    case 'Resuelto': return 'bg-green-500/20 text-green-400'
    case 'Cerrado': return 'bg-slate-500/20 text-slate-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}
