"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { Proveedor, OrdenCompra, Cotizacion, Producto, ItemOrden, EstadoOrden, Moneda, MONEDAS, ESTADOS_ORDEN } from '@/types/compras'
import { getOrdenCompraColor } from '@/lib/colors'
import {
  ShoppingCart, Plus, Package, FileText, Truck, CheckCircle, XCircle,
  Clock, AlertTriangle, Search, Filter, DollarSign, Calendar,
  Building2, Mail, Phone, Star, Save, Send, Download, Trash2,
  ChevronRight, Eye, Edit, X, ClipboardList, SendHorizontal, PackageCheck
} from 'lucide-react'

const DEMO_PROVEEDORES: Proveedor[] = [
  { id: '1', empresa_id: 'p1', nombre: 'Distribuidor Mayorista SA', email: 'ventas@distmayorista.com', telefono: '+52 55 1234-5678', condiciones_pago: '30 días', plazo_entrega_dias: 7, moneda_preferida: 'USD', minimo_compra: 500, evaluacion: 4, certificaciones: ['ISO 9001'] },
  { id: '2', empresa_id: 'p2', nombre: 'TecnoImport México', email: 'contacto@tecnoimport.mx', telefono: '+52 55 9876-5432', condiciones_pago: '50% anticipo, 50% contra entrega', plazo_entrega_dias: 5, moneda_preferida: 'USD', minimo_compra: 1000, evaluacion: 5 },
  { id: '3', empresa_id: 'p3', nombre: 'Cloud Solutions Inc', email: 'sales@cloudsolutions.com', telefono: '+1 305 123-4567', condiciones_pago: 'Neto 30', plazo_entrega_dias: 3, moneda_preferida: 'USD', evaluacion: 5 },
]

const DEMO_PROYECTOS = [
  { id: '1', nombre: 'Implementación Firewall Corp' },
  { id: '2', nombre: 'Migración Cloud Tech' },
  { id: '3', nombre: 'Auditoría Seguridad Tech' },
]

const DEMO_ORDENES: OrdenCompra[] = [
  { id: '1', numero_oc: 'OC-2026-0042', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', proveedor_id: '1', proveedor_nombre: 'Distribuidor Mayorista SA', fecha_emision: '2026-03-10', fecha_entrega_estimada: '2026-03-17', items: [{ id: 'i1', producto: 'Switch Cisco 2960', cantidad: 2, unidad: 'unidad', precio_unitario: 450, total: 900 }, { id: 'i2', producto: 'Cable Fibra Óptica', cantidad: 100, unidad: 'metro', precio_unitario: 2.5, total: 250 }], subtotal: 1150, impuestos: 184, total: 1334, moneda: 'USD', condiciones_pago: '50% anticipo, 50% contra entrega', estado: 'Pendiente aprobación', creado_por: 'María Compras' },
  { id: '2', numero_oc: 'OC-2026-0038', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', proveedor_id: '2', proveedor_nombre: 'TecnoImport México', fecha_emision: '2026-03-05', fecha_entrega_estimada: '2026-03-12', items: [{ id: 'i3', producto: 'Servidor Dell PowerEdge', cantidad: 1, unidad: 'unidad', precio_unitario: 3500, total: 3500 }], subtotal: 3500, impuestos: 560, total: 4060, moneda: 'USD', condiciones_pago: '30 días', estado: 'Enviada', creado_por: 'María Compras', aprobada_por: 'Carlos Admin', fecha_aprobacion: '2026-03-06', enviada_por: 'María Compras', fecha_envio: '2026-03-06' },
  { id: '3', numero_oc: 'OC-2026-0035', proyecto_id: '3', proyecto_nombre: 'Auditoría Seguridad Tech', proveedor_id: '3', proveedor_nombre: 'Cloud Solutions Inc', fecha_emision: '2026-02-28', items: [{ id: 'i4', producto: 'Licencia AWS', cantidad: 1, unidad: 'año', precio_unitario: 1200, total: 1200 }], subtotal: 1200, impuestos: 0, total: 1200, moneda: 'USD', condiciones_pago: 'Neto 30', estado: 'Recibida completa', creado_por: 'María Compras', aprobada_por: 'Carlos Admin', enviada_por: 'María Compras', fecha_envio: '2026-02-28' },
]

const DEMO_COTIZACIONES: Cotizacion[] = [
  { id: 'c1', proveedor_id: '1', proveedor_nombre: 'Distribuidor Mayorista SA', fecha_cotizacion: '2026-03-08', valida_hasta: '2026-04-08', items: [{ producto: 'Router Fortinet 100F', cantidad: 1, precio_unitario: 2800, total: 2800 }], total: 2800, moneda: 'USD', condiciones: '30 días', estado: 'Recibida' },
]

function ProveedoresTab({ proveedores }: { proveedores: Proveedor[] }) {
  const [search, setSearch] = useState('')

  const filtered = proveedores.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <Input placeholder="Buscar proveedores..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-8 bg-background/80 border-border/50" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(proveedor => (
          <Card key={proveedor.id} className="hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{proveedor.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {proveedor.evaluacion && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < proveedor.evaluacion! ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                        ))}
                      </div>
                    )}
                    {proveedor.plazo_entrega_dias && (
                      <Badge variant="outline" className="text-xs">{proveedor.plazo_entrega_dias} días</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Mail className="h-3 w-3" />{proveedor.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-3 w-3" />{proveedor.telefono}</p>
                {proveedor.condiciones_pago && <p className="flex items-center gap-2"><DollarSign className="h-3 w-3" />{proveedor.condiciones_pago}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function NuevaOrdenModal({ isOpen, onClose, onCreate, proyectos, proveedores }: {
  isOpen: boolean
  onClose: () => void
  onCreate: (orden: Omit<OrdenCompra, 'id' | 'numero_oc' | 'creada_por'>) => void
  proyectos: { id: string; nombre: string }[]
  proveedores: { id: string; nombre: string }[]
}) {
  const [orden, setOrden] = useState({
    proyecto_id: '',
    proveedor_id: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_entrega_estimada: '',
    moneda: 'USD' as Moneda,
    condiciones_pago: '',
    items: [] as ItemOrden[],
    notas: '',
  })
  const [nuevoItem, setNuevoItem] = useState({ producto: '', cantidad: 1, unidad: 'unidad', precio_unitario: 0 })

  const addItem = () => {
    if (!nuevoItem.producto || !nuevoItem.cantidad) return
    setOrden({
      ...orden,
      items: [...orden.items, { ...nuevoItem, id: Date.now().toString(), total: nuevoItem.cantidad * nuevoItem.precio_unitario }]
    })
    setNuevoItem({ producto: '', cantidad: 1, unidad: 'unidad', precio_unitario: 0 })
  }

  const removeItem = (id: string) => {
    setOrden({ ...orden, items: orden.items.filter(i => i.id !== id) })
  }

  const subtotal = orden.items.reduce((acc, i) => acc + i.total, 0)
  const impuestos = subtotal * 0.16
  const total = subtotal + impuestos

  const handleCreate = (estado: EstadoOrden) => {
    if (!orden.proyecto_id || !orden.proveedor_id || orden.items.length === 0) return
    const proyecto = proyectos.find(p => p.id === orden.proyecto_id)
    const proveedor = proveedores.find(p => p.id === orden.proveedor_id)
    onCreate({
      proyecto_id: orden.proyecto_id,
      proyecto_nombre: proyecto?.nombre || '',
      proveedor_id: orden.proveedor_id,
      proveedor_nombre: proveedor?.nombre || '',
      fecha_emision: orden.fecha_emision,
      fecha_entrega_estimada: orden.fecha_entrega_estimada || undefined,
      items: orden.items,
      subtotal,
      impuestos,
      total,
      moneda: orden.moneda,
      condiciones_pago: orden.condiciones_pago || undefined,
      estado,
      notas: orden.notas || undefined,
      creado_por: 'Usuario',
    })
    onClose()
    setOrden({ proyecto_id: '', proveedor_id: '', fecha_emision: new Date().toISOString().split('T')[0], fecha_entrega_estimada: '', moneda: 'USD', condiciones_pago: '', items: [], notas: '' })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Compra</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Proyecto *</Label>
              <Select value={orden.proyecto_id} onValueChange={(v) => setOrden({ ...orden, proyecto_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Proveedor *</Label>
              <Select value={orden.proveedor_id} onValueChange={(v) => setOrden({ ...orden, proveedor_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {proveedores.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Fecha emisión *</Label>
              <Input type="date" value={orden.fecha_emision} onChange={(e) => setOrden({ ...orden, fecha_emision: e.target.value })} className="bg-background" />
            </div>
            <div>
              <Label>Entrega estimada</Label>
              <Input type="date" value={orden.fecha_entrega_estimada} onChange={(e) => setOrden({ ...orden, fecha_entrega_estimada: e.target.value })} className="bg-background" />
            </div>
            <div>
              <Label>Moneda</Label>
              <Select value={orden.moneda} onValueChange={(v) => setOrden({ ...orden, moneda: v as Moneda })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONEDAS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Items</Label>
            <div className="border rounded-lg mt-1">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right w-20">Cant.</th>
                    <th className="p-2 text-right w-24">Precio</th>
                    <th className="p-2 text-right w-24">Total</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {orden.items.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.producto}</td>
                      <td className="p-2 text-right">{item.cantidad} {item.unidad}</td>
                      <td className="p-2 text-right">{orden.moneda} {item.precio_unitario.toFixed(2)}</td>
                      <td className="p-2 text-right">{orden.moneda} {item.total.toFixed(2)}</td>
                      <td className="p-2"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><X className="h-3 w-3" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 border-t bg-muted/30 flex gap-2">
                <Input placeholder="Producto" value={nuevoItem.producto} onChange={(e) => setNuevoItem({ ...nuevoItem, producto: e.target.value })} className="bg-background flex-1" />
                <Input type="number" placeholder="Cant." value={nuevoItem.cantidad} onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: parseInt(e.target.value) })} className="bg-background w-20" />
                <Input type="number" placeholder="Precio" value={nuevoItem.precio_unitario} onChange={(e) => setNuevoItem({ ...nuevoItem, precio_unitario: parseFloat(e.target.value) })} className="bg-background w-24" />
                <Button onClick={addItem}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Subtotal: {orden.moneda} {subtotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Impuestos (16%): {orden.moneda} {impuestos.toFixed(2)}</p>
              <p className="font-bold text-lg">Total: {orden.moneda} {total.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <Label>Condiciones de pago</Label>
            <Input value={orden.condiciones_pago} onChange={(e) => setOrden({ ...orden, condiciones_pago: e.target.value })} placeholder="Ej: 30 días, 50% anticipo..." className="bg-background" />
          </div>

          <div>
            <Label>Notas</Label>
            <Textarea value={orden.notas} onChange={(e) => setOrden({ ...orden, notas: e.target.value })} placeholder="Notas adicionales..." rows={2} className="bg-background" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="outline" onClick={() => handleCreate('Borrador')} disabled={!orden.proyecto_id || !orden.proveedor_id || orden.items.length === 0}><Save className="h-4 w-4 mr-2" />Guardar Borrador</Button>
          <Button onClick={() => handleCreate('Pendiente aprobación')} disabled={!orden.proyecto_id || !orden.proveedor_id || orden.items.length === 0}><Send className="h-4 w-4 mr-2" />Guardar y Solicitar Aprobación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetalleOrdenModal({ orden, onClose, onCambiarEstado }: {
  orden: OrdenCompra
  onClose: () => void
  onCambiarEstado: (id: string, estado: EstadoOrden) => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Ver Detalles</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getOrdenCompraColor(orden.estado)}>{orden.estado}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">Proyecto</p><p className="font-medium">{orden.proyecto_nombre}</p></div>
            <div><p className="text-muted-foreground">Proveedor</p><p className="font-medium">{orden.proveedor_nombre}</p></div>
            <div><p className="text-muted-foreground">Fecha emisión</p><p className="font-medium">{new Date(orden.fecha_emision).toLocaleDateString('es-ES')}</p></div>
            {orden.fecha_entrega_estimada && <div><p className="text-muted-foreground">Entrega estimada</p><p className="font-medium">{new Date(orden.fecha_entrega_estimada).toLocaleDateString('es-ES')}</p></div>}
          </div>

          <div>
            <h4 className="font-medium mb-2">Items</h4>
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr><th className="p-2 text-left">Producto</th><th className="p-2 text-right">Cant.</th><th className="p-2 text-right">Precio</th><th className="p-2 text-right">Total</th></tr>
                </thead>
                <tbody>
                  {orden.items.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.producto}</td>
                      <td className="p-2 text-right">{item.cantidad} {item.unidad}</td>
                      <td className="p-2 text-right">{orden.moneda} {item.precio_unitario.toFixed(2)}</td>
                      <td className="p-2 text-right">{orden.moneda} {item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 border-t bg-muted/30 text-right space-y-1 text-sm">
                <p>Subtotal: {orden.moneda} {orden.subtotal.toFixed(2)}</p>
                <p>Impuestos: {orden.moneda} {orden.impuestos.toFixed(2)}</p>
                <p className="font-bold">Total: {orden.moneda} {orden.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {orden.condiciones_pago && <div><p className="text-sm text-muted-foreground">Condiciones de pago</p><p className="text-sm">{orden.condiciones_pago}</p></div>}

          <div className="border-t pt-4 flex gap-2 flex-wrap">
            {orden.estado === 'Borrador' && <Button onClick={() => onCambiarEstado(orden.id, 'Pendiente aprobación')}><Send className="h-4 w-4 mr-2" />Solicitar Aprobación</Button>}
            {orden.estado === 'Pendiente aprobación' && <Button onClick={() => onCambiarEstado(orden.id, 'Aprobada')}><CheckCircle className="h-4 w-4 mr-2" />Aprobar</Button>}
            {orden.estado === 'Aprobada' && <Button onClick={() => onCambiarEstado(orden.id, 'Enviada')}><Send className="h-4 w-4 mr-2" />Marcar Enviada</Button>}
            {orden.estado === 'Enviada' && <Button onClick={() => onCambiarEstado(orden.id, 'Recibida completa')}><Package className="h-4 w-4 mr-2" />Registrar Recepción</Button>}
            {orden.estado !== 'Cancelada' && orden.estado !== 'Recibida completa' && <Button variant="outline" onClick={() => onCambiarEstado(orden.id, 'Cancelada')}><XCircle className="h-4 w-4 mr-2" />Cancelar</Button>}
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Descargar PDF</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ComprasPage() {
  const { user } = useAuth()
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>(DEMO_ORDENES)
  const [proveedores] = useState<Proveedor[]>(DEMO_PROVEEDORES)
  const [vista, setVista] = useState<'dashboard' | 'ordenes' | 'proveedores'>('dashboard')
  const [showNuevaOrden, setShowNuevaOrden] = useState(false)
  const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  const isAdmin = user?.roles.includes('admin')
  const isCompras = user?.roles.includes('compras')
  const canCreate = isAdmin || isCompras

  const ordenesFiltradas = useMemo(() => {
    if (filtroEstado === 'todos') return ordenes
    return ordenes.filter(o => o.estado === filtroEstado)
  }, [ordenes, filtroEstado])

  const stats = useMemo(() => ({
    pendientes: ordenes.filter(o => o.estado === 'Pendiente aprobación').length,
    enviadas: ordenes.filter(o => o.estado === 'Enviada').length,
    recibidas: ordenes.filter(o => o.estado === 'Recibida parcial' || o.estado === 'Recibida completa').length,
    total: ordenes.reduce((acc, o) => acc + o.total, 0),
  }), [ordenes])

  const handleCreateOrden = (orden: Omit<OrdenCompra, 'id' | 'numero_oc' | 'creada_por'>) => {
    const nueva: OrdenCompra = {
      ...orden,
      id: Date.now().toString(),
      numero_oc: `OC-2026-${String(ordenes.length + 1).padStart(3, '0')}`,
      creado_por: 'Usuario',
    }
    setOrdenes(prev => [nueva, ...prev])
  }

  const handleCambiarEstado = (id: string, estado: EstadoOrden) => {
    setOrdenes(prev => prev.map(o => o.id === id ? { ...o, estado } : o))
    setSelectedOrden(null)
  }

  if (!canCreate && !isAdmin) {
    return (
      <AccessDeniedCard
        icon={ShoppingCart}
        description="No tienes permiso para acceder a este módulo."
      />
    )
  }

  return (
    <ModuleContainer>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Compras
          </h1>
          <p className="text-muted-foreground">Gestión de proveedores y órdenes de compra</p>
        </div>
        {canCreate && <Button onClick={() => setShowNuevaOrden(true)}><Plus className="h-4 w-4 mr-2" />Nueva Orden</Button>}
      </div>

      <StatGrid cols={4}>
        <MiniStat value={stats.pendientes} label="Pendientes de aprobación" variant="warning" showBorder accentColor="#f59e0b" icon={<ClipboardList className="h-5 w-5" />} />
        <MiniStat value={stats.enviadas} label="Enviadas" variant="info" showBorder accentColor="#3b82f6" icon={<SendHorizontal className="h-5 w-5" />} />
        <MiniStat value={stats.recibidas} label="Recibidas" variant="success" showBorder accentColor="#10b981" icon={<PackageCheck className="h-5 w-5" />} />
        <MiniStat value={`USD ${stats.total.toLocaleString()}`} label="Total en órdenes" variant="primary" showBorder accentColor="#06b6d4" icon={<DollarSign className="h-5 w-5" />} />
      </StatGrid>

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ordenes">Órdenes de Compra</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />Pendientes de Aprobación ({stats.pendientes})</CardTitle>
              </CardHeader>
              <CardContent>
                {ordenes.filter(o => o.estado === 'Pendiente aprobación').map(orden => (
                  <div key={orden.id} className="p-3 border rounded-lg mb-2 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" onClick={() => setSelectedOrden(orden)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{orden.numero_oc}</p>
                        <p className="text-sm text-muted-foreground">{orden.proveedor_nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{orden.moneda} {orden.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{orden.proyecto_nombre}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-blue-500" />Enviadas - Pendientes de Recepción ({stats.enviadas})</CardTitle>
              </CardHeader>
              <CardContent>
                {ordenes.filter(o => o.estado === 'Enviada').map(orden => (
                  <div key={orden.id} className="p-3 border rounded-lg mb-2 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" onClick={() => setSelectedOrden(orden)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{orden.numero_oc}</p>
                        <p className="text-sm text-muted-foreground">{orden.proveedor_nombre}</p>
                      </div>
                      <div className="text-right">
                        {orden.fecha_entrega_estimada && <p className="text-xs">Entrega: {new Date(orden.fecha_entrega_estimada).toLocaleDateString('es-ES')}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ordenes">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-48 bg-background"><SelectValue placeholder="Filtrar estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  {ESTADOS_ORDEN.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {ordenesFiltradas.map(orden => (
                <Card key={orden.id} className="hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" onClick={() => setSelectedOrden(orden)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{orden.numero_oc}</p>
                          <p className="text-sm text-muted-foreground">{orden.proveedor_nombre}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{orden.moneda} {orden.total.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{orden.proyecto_nombre}</p>
                        </div>
                        <Badge className={getOrdenCompraColor(orden.estado)}>{orden.estado}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proveedores">
          <ProveedoresTab proveedores={proveedores} />
        </TabsContent>
      </Tabs>

      <NuevaOrdenModal isOpen={showNuevaOrden} onClose={() => setShowNuevaOrden(false)} onCreate={handleCreateOrden} proyectos={DEMO_PROYECTOS} proveedores={proveedores.map(p => ({ id: p.id, nombre: p.nombre }))} />

      {selectedOrden && <DetalleOrdenModal orden={selectedOrden} onClose={() => setSelectedOrden(null)} onCambiarEstado={handleCambiarEstado} />}
    </ModuleContainer>
  )
}
