export type TipoEntidad = 'cliente' | 'proveedor' | 'ambos'
export type Industria =
  | 'Tecnología'
  | 'Salud'
  | 'Educación'
  | 'Finanzas'
  | 'Comercio'
  | 'Industria'
  | 'Gobierno'
  | 'Otro'

export type Tamaño = 'Micro' | 'PYME' | 'Gran empresa'

export type Origen = 'Web' | 'Referencia' | 'Llamada en frío' | 'Evento' | 'LinkedIn' | 'Otro'

export type TipoRelacion = 'Cliente' | 'Prospecto' | 'Ex-cliente'

export type TipoContacto =
  | 'Técnico'
  | 'Administrativo'
  | 'Financiero'
  | 'Compras'
  | 'Comercial'
  | 'Soporte'
  | 'Otro'

export type RolContacto = 'especializacion' | 'facturacion' | 'compras'

export type MetodoPago = 'Transferencia' | 'Tarjeta' | 'Efectivo' | 'Cheque' | 'Otro'

import type { Moneda } from './compartidos'
export { MONEDAS } from './compartidos'
export type { Moneda }

export type VisibilidadDocumento = 'interno' | 'publico'

export type TipoContrato = 'Proyecto' | 'Soporte' | 'Ambos' | 'Ninguno'

export interface Empresa {
  id: string
  tipo_entidad: TipoEntidad
  nombre: string
  industria?: Industria
  tamaño?: Tamaño
  origen?: Origen
  tipo_relacion?: TipoRelacion
  tipo_contrato?: TipoContrato
  telefono_principal?: string
  sitio_web?: string
  direccion?: string
  ciudad?: string
  pais?: string
  notas_internas?: string
  // Datos de facturación
  razon_social?: string
  rfc?: string
  direccion_fiscal?: string
  regimen_fiscal?: string
  email_facturacion?: string
  metodo_pago?: MetodoPago
  plazo_pago?: number
  moneda_preferida?: Moneda
  // Metadatos
  creado_en: string
  creado_por?: string
  ultima_actividad?: string
}

export interface Contacto {
  id: string
  empresa_id: string
  nombre: string
  cargo?: string
  tipo_contacto: TipoContacto
  email: string
  telefono?: string
  es_principal: boolean
  recibe_facturas: boolean
  rol?: RolContacto
  notas?: string
  activo: boolean
  usuario_id?: string
  creado_en: string
}

export interface Documento {
  id: string
  empresa_id: string
  archivo_id: string
  visibilidad: VisibilidadDocumento
  descripcion?: string
  subido_por?: string
  fecha_subida: string
  nombre_archivo?: string
}

// Opciones para selects
export const INDUSTRIAS: Industria[] = [
  'Tecnología', 'Salud', 'Educación', 'Finanzas', 'Comercio', 'Industria', 'Gobierno', 'Otro'
]

export const TAMAÑOS: Tamaño[] = ['Micro', 'PYME', 'Gran empresa']

export const ORIGENES: Origen[] = ['Web', 'Referencia', 'Llamada en frío', 'Evento', 'LinkedIn', 'Otro']

export const TIPOS_RELACION: TipoRelacion[] = ['Cliente', 'Prospecto', 'Ex-cliente']

export const TIPOS_CONTACTO: TipoContacto[] = [
  'Técnico', 'Administrativo', 'Financiero', 'Compras', 'Comercial', 'Soporte', 'Otro'
]

export const METODOS_PAGO: MetodoPago[] = ['Transferencia', 'Tarjeta', 'Efectivo', 'Cheque', 'Otro']

export const TIPOS_ENTIDAD: TipoEntidad[] = ['cliente', 'proveedor', 'ambos']

export const TIPOS_CONTRATO: TipoContrato[] = ['Proyecto', 'Soporte', 'Ambos', 'Ninguno']
