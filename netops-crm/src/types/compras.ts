export type EstadoOrden = 'Borrador' | 'Pendiente aprobación' | 'Aprobada' | 'Enviada' | 'Recibida parcial' | 'Recibida completa' | 'Cancelada'

export type Moneda = 'USD' | 'MXN' | 'EUR'

export type CategoriaProducto = 'Equipos' | 'Licencias' | 'Servicios' | 'Insumos'

export interface Proveedor {
  id: string
  empresa_id: string
  nombre: string
  email: string
  telefono: string
  condiciones_pago?: string
  plazo_entrega_dias?: number
  moneda_preferida?: Moneda
  minimo_compra?: number
  certificaciones?: string[]
  evaluacion?: number
  notas_compras?: string
}

export interface Producto {
  id: string
  proveedor_id?: string
  nombre: string
  descripcion?: string
  categoria: CategoriaProducto
  unidad_medida: string
  precio_referencia?: number
  moneda?: Moneda
  activo: boolean
}

export interface ItemOrden {
  id: string
  producto: string
  cantidad: number
  unidad: string
  precio_unitario: number
  total: number
}

export interface OrdenCompra {
  id: string
  numero_oc: string
  proyecto_id: string
  proyecto_nombre: string
  proveedor_id: string
  proveedor_nombre: string
  fecha_emision: string
  fecha_entrega_estimada?: string
  items: ItemOrden[]
  subtotal: number
  impuestos: number
  total: number
  moneda: Moneda
  condiciones_pago?: string
  estado: EstadoOrden
  aprobada_por?: string
  fecha_aprobacion?: string
  enviada_por?: string
  fecha_envio?: string
  notas?: string
  creado_por: string
}

export interface Cotizacion {
  id: string
  proveedor_id: string
  proveedor_nombre: string
  fecha_cotizacion: string
  valida_hasta: string
  items: { producto: string; cantidad: number; precio_unitario: number; total: number }[]
  total: number
  moneda: Moneda
  condiciones?: string
  estado: 'Recibida' | 'Aceptada' | 'Rechazada'
}

export const ESTADOS_ORDEN: EstadoOrden[] = ['Borrador', 'Pendiente aprobación', 'Aprobada', 'Enviada', 'Recibida parcial', 'Recibida completa', 'Cancelada']

export const MONEDAS: Moneda[] = ['USD', 'MXN', 'EUR']

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'Borrador': return 'bg-slate-500/20 text-slate-400'
    case 'Pendiente aprobación': return 'bg-amber-500/20 text-amber-400'
    case 'Aprobada': return 'bg-blue-500/20 text-blue-400'
    case 'Enviada': return 'bg-purple-500/20 text-purple-400'
    case 'Recibida parcial': return 'bg-orange-500/20 text-orange-400'
    case 'Recibida completa': return 'bg-green-500/20 text-green-400'
    case 'Cancelada': return 'bg-red-500/20 text-red-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}
