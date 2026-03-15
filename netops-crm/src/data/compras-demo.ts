import { Proveedor, OrdenCompra, Cotizacion } from '@/types/compras'

export const DEMO_PROVEEDORES: Proveedor[] = [
  { id: '1', empresa_id: 'p1', nombre: 'Distribuidor Mayorista SA', email: 'ventas@distmayorista.com', telefono: '+52 55 1234-5678', condiciones_pago: '30 días', plazo_entrega_dias: 7, moneda_preferida: 'USD', minimo_compra: 500, evaluacion: 4, certificaciones: ['ISO 9001'] },
  { id: '2', empresa_id: 'p2', nombre: 'TecnoImport México', email: 'contacto@tecnoimport.mx', telefono: '+52 55 9876-5432', condiciones_pago: '50% anticipo, 50% contra entrega', plazo_entrega_dias: 5, moneda_preferida: 'USD', minimo_compra: 1000, evaluacion: 5 },
  { id: '3', empresa_id: 'p3', nombre: 'Cloud Solutions Inc', email: 'sales@cloudsolutions.com', telefono: '+1 305 123-4567', condiciones_pago: 'Neto 30', plazo_entrega_dias: 3, moneda_preferida: 'USD', evaluacion: 5 },
]

export const DEMO_PROYECTOS = [
  { id: '1', nombre: 'Implementación Firewall Corp' },
  { id: '2', nombre: 'Migración Cloud Tech' },
  { id: '3', nombre: 'Auditoría Seguridad Tech' },
]

export const DEMO_ORDENES: OrdenCompra[] = [
  { id: '1', numero_oc: 'OC-2026-0042', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', proveedor_id: '1', proveedor_nombre: 'Distribuidor Mayorista SA', fecha_emision: '2026-03-10', fecha_entrega_estimada: '2026-03-17', items: [{ id: 'i1', producto: 'Switch Cisco 2960', cantidad: 2, unidad: 'unidad', precio_unitario: 450, total: 900 }, { id: 'i2', producto: 'Cable Fibra Óptica', cantidad: 100, unidad: 'metro', precio_unitario: 2.5, total: 250 }], subtotal: 1150, impuestos: 184, total: 1334, moneda: 'USD', condiciones_pago: '50% anticipo, 50% contra entrega', estado: 'Pendiente aprobación', creado_por: 'María Compras' },
  { id: '2', numero_oc: 'OC-2026-0038', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', proveedor_id: '2', proveedor_nombre: 'TecnoImport México', fecha_emision: '2026-03-05', fecha_entrega_estimada: '2026-03-12', items: [{ id: 'i3', producto: 'Servidor Dell PowerEdge', cantidad: 1, unidad: 'unidad', precio_unitario: 3500, total: 3500 }], subtotal: 3500, impuestos: 560, total: 4060, moneda: 'USD', condiciones_pago: '30 días', estado: 'Enviada', creado_por: 'María Compras', aprobada_por: 'Carlos Admin', fecha_aprobacion: '2026-03-06', enviada_por: 'María Compras', fecha_envio: '2026-03-06' },
  { id: '3', numero_oc: 'OC-2026-0035', proyecto_id: '3', proyecto_nombre: 'Auditoría Seguridad Tech', proveedor_id: '3', proveedor_nombre: 'Cloud Solutions Inc', fecha_emision: '2026-02-28', items: [{ id: 'i4', producto: 'Licencia AWS', cantidad: 1, unidad: 'año', precio_unitario: 1200, total: 1200 }], subtotal: 1200, impuestos: 0, total: 1200, moneda: 'USD', condiciones_pago: 'Neto 30', estado: 'Recibida completa', creado_por: 'María Compras', aprobada_por: 'Carlos Admin', enviada_por: 'María Compras', fecha_envio: '2026-02-28' },
]

export const DEMO_COTIZACIONES: Cotizacion[] = [
  { id: 'c1', proveedor_id: '1', proveedor_nombre: 'Distribuidor Mayorista SA', fecha_cotizacion: '2026-03-08', valida_hasta: '2026-04-08', items: [{ producto: 'Router Fortinet 100F', cantidad: 1, precio_unitario: 2800, total: 2800 }], total: 2800, moneda: 'USD', condiciones: '30 días', estado: 'Recibida' },
]
