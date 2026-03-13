export type CategoriaTarea = 'Comercial' | 'Técnica' | 'Compras' | 'Administrativa' | 'General'

export type PrioridadTarea = 'Baja' | 'Media' | 'Alta' | 'Urgente'

export type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada' | 'Bloqueada'

export type TipoDependencia = 'bloqueante' | 'inicio_despues' | 'fin_despues'

export interface Dependencia {
  tarea_id: string
  tipo: TipoDependencia
  dias_desplazamiento?: number
}

export interface Tarea {
  id: string
  proyecto_id: string
  proyecto_nombre: string
  fase_origen: number
  fase_nombre: string
  categoria: CategoriaTarea
  nombre: string
  descripcion?: string
  responsable_id?: string
  responsable_nombre?: string
  asignado_a_cliente: boolean
  contacto_cliente_id?: string
  contacto_cliente_nombre?: string
  fecha_creacion: string
  fecha_vencimiento?: string
  fecha_completado?: string
  prioridad: PrioridadTarea
  estado: EstadoTarea
  orden: number
  dependencias?: Dependencia[]
  creado_por: string
  es_plantilla?: boolean
}

export interface Subtarea {
  id: string
  tarea_id: string
  nombre: string
  completada: boolean
  orden: number
  fecha_completado?: string
}

export interface Comentario {
  id: string
  tarea_id: string
  usuario_id: string
  usuario_nombre: string
  es_cliente: boolean
  comentario: string
  fecha: string
}

export const CATEGORIAS: CategoriaTarea[] = ['Comercial', 'Técnica', 'Compras', 'Administrativa', 'General']

export const PRIORIDADES: PrioridadTarea[] = ['Baja', 'Media', 'Alta', 'Urgente']

export const ESTADOS: EstadoTarea[] = ['Pendiente', 'En progreso', 'Completada', 'Bloqueada']

export const getPrioridadColor = (prioridad: PrioridadTarea) => {
  const colors = {
    Baja: 'bg-slate-500/20 text-slate-400',
    Media: 'bg-blue-500/20 text-blue-400',
    Alta: 'bg-amber-500/20 text-amber-400',
    Urgente: 'bg-red-500/20 text-red-400',
  }
  return colors[prioridad]
}

export const getCategoriaColor = (categoria: CategoriaTarea) => {
  const colors = {
    Comercial: 'bg-purple-500/20 text-purple-400',
    Técnica: 'bg-green-500/20 text-green-400',
    Compras: 'bg-amber-500/20 text-amber-400',
    Administrativa: 'bg-cyan-500/20 text-cyan-400',
    General: 'bg-slate-500/20 text-slate-400',
  }
  return colors[categoria]
}
