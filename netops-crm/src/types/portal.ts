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
