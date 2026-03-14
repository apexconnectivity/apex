export type FaseProyecto = 1 | 2 | 3 | 4 | 5

export type EstadoProyecto = 'activo' | 'cerrado'

import type { Moneda } from './compartidos'
export { MONEDAS } from './compartidos'
export type { Moneda }

export interface Fase {
  id: FaseProyecto
  nombre: string
  color: string
  probabilidad_default: number
}

// Tipos para el historial del proyecto
export type TipoEventoHistorial =
  | 'creacion'
  | 'cambio_fase'
  | 'cierre'
  | 'reapertura'
  | 'archivado'
  | 'edicion'
  | 'asignacion_responsable'
  | 'asignacion_contacto'

export interface HistorialProyecto {
  id: string
  proyecto_id: string
  tipo_evento: TipoEventoHistorial
  descripcion: string
  fecha: string
  usuario_id?: string
  usuario_nombre?: string
  datos_anteriores?: Record<string, unknown>
  datos_nuevos?: Record<string, unknown>
}

export const FASES: Fase[] = [
  { id: 1, nombre: 'Prospecto', color: '#6b7280', probabilidad_default: 20 },
  { id: 2, nombre: 'Diagnóstico', color: '#3b82f6', probabilidad_default: 40 },
  { id: 3, nombre: 'Propuesta', color: '#eab308', probabilidad_default: 70 },
  { id: 4, nombre: 'Implementación', color: '#10b981', probabilidad_default: 90 },
  { id: 5, nombre: 'Cierre', color: '#8b5cf6', probabilidad_default: 100 },
]

export interface Proyecto {
  id: string
  empresa_id: string
  nombre: string
  descripcion?: string
  fase_actual: FaseProyecto
  estado: EstadoProyecto
  fecha_inicio?: string
  fecha_estimada_fin?: string
  fecha_real_fin?: string
  fecha_cierre?: string
  motivo_cierre?: string
  fecha_inicio_negociacion?: string
  fecha_aceptacion_propuesta?: string
  fecha_inicio_implementacion?: string
  moneda: Moneda
  monto_estimado?: number
  monto_real?: number
  probabilidad_cierre: number
  responsable_id: string
  responsable_nombre?: string
  equipo?: string[]
  contacto_tecnico_id: string
  contacto_tecnico_nombre?: string
  tags?: string[]
  requiere_compras: boolean
  creado_en: string
  creado_por?: string
  cliente_nombre?: string
}
