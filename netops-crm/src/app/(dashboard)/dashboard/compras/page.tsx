"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base/BaseModal'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { FilterBar } from '@/components/ui/filter-bar'
import { DatePicker } from '@/components/ui/date-picker'
import { Proveedor, OrdenCompra, ItemOrden, EstadoOrden, Moneda, MONEDAS, ESTADOS_ORDEN } from '@/types/compras'
import {
  IMPUESTO_TASA, IMPUESTO_LABEL,
  COMPRAS_TITLE, COMPRAS_DESCRIPTION,
  BOTON_NUEVA_ORDEN, BOTON_GUARDAR_BORRADOR, BOTON_SOLICITAR_APROBACION, BOTON_CANCELAR,
  BOTON_APROBAR, BOTON_ENVIAR, BOTON_REGISTRAR_RECEPCION, BOTON_DESCARGAR_PDF,
  LABEL_PROYECTO_REQUERIDO, LABEL_PROVEEDOR_REQUERIDO, LABEL_FECHA_EMISION_REQUERIDA,
  LABEL_ENTREGA_ESTIMADA, LABEL_MONEDA, LABEL_ITEMS, LABEL_CONDICIONES_PAGO, LABEL_NOTAS,
  LABEL_SUBTOTAL, LABEL_IMPUESTOS, LABEL_TOTAL,
  TABLE_PRODUCTO, TABLE_CANTIDAD, TABLE_PRECIO, TABLE_TOTAL,
  PLACEHOLDER_SELECCIONAR, PLACEHOLDER_PRODUCTO,
  PLACEHOLDER_CANTIDAD, PLACEHOLDER_PRECIO, PLACEHOLDER_CONDICIONES_PAGO, PLACEHOLDER_NOTAS,
  STAT_PENDIENTES, STAT_ENVIADAS, STAT_RECIBIDAS, STAT_TOTAL_ORDENES,
  COMPRAS_STATS_COLORS,
  TITULO_NUEVA_ORDEN, TITULO_VER_DETALLES, TITULO_PENDIENTES_APROBACION, TITULO_PENDIENTES_RECEPCION,
  TAB_DASHBOARD, TAB_ORDENES, TAB_PROVEEDORES,
  FILTRO_TODOS_ESTADOS, FILTRO_ESTADO,
  MENSAJE_SIN_PERMISO
} from '@/constants/compras'
import { getOrdenCompraColor } from '@/lib/colors'
import { useProyectos } from '@/hooks'
import {
  Plus, Package, Truck, CheckCircle, XCircle,
  AlertTriangle, DollarSign,
  Star, Save, Send, Download,
  ChevronRight, ClipboardList, SendHorizontal, PackageCheck, X,
  Mail, Phone
} from 'lucide-react'
import { PageAnimation, StaggeredList } from '@/components/ui/page-animation'

// ============================================
// MAGIC NUMBERS - Constantes de negocio
// ============================================
const ORDEN_COMPRA_PREFIX = 'OC-2026-'
const ORDEN_COMPRA_PADDING = 3

function ProveedoresTab({ proveedores }: { proveedores: Proveedor[] }) {
  const [search, setSearch] = useState('')

  const filtered = proveedores.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[]}
        values={{}}
        onFilterChange={() => { }}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StaggeredList stagger={30}>
          {filtered.map(proveedor => (
          <Card key={proveedor.id} className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{proveedor.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {proveedor.evaluacion && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < proveedor.evaluacion! ? 'text-[hsl(var(--warning))] fill-[hsl(var(--warning))]' : 'text-muted'}`} />
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
        </StaggeredList>
      </div>
    </div>
  )
}

function NuevaOrdenModal({ open, onClose, onCreate, proyectos, proveedores, userName }: {
  open: boolean
  onClose: () => void
  onCreate: (orden: Omit<OrdenCompra, 'id' | 'numero_oc' | 'creada_por'>) => void
  proyectos: { id: string; nombre: string }[]
  proveedores: { id: string; nombre: string }[]
  userName: string
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
  const impuestos = subtotal * IMPUESTO_TASA
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
      creado_por: userName,
    })
    onClose()
    setOrden({ proyecto_id: '', proveedor_id: '', fecha_emision: new Date().toISOString().split('T')[0], fecha_entrega_estimada: '', moneda: 'USD', condiciones_pago: '', items: [], notas: '' })
  }

  return (
    <BaseModal open={open} onOpenChange={onClose} size="lg" className="max-h-[90vh] overflow-hidden flex flex-col">
      <ModalHeader title={TITULO_NUEVA_ORDEN} />
      <ModalBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{LABEL_PROYECTO_REQUERIDO}</Label>
            <Select value={orden.proyecto_id} onValueChange={(v) => setOrden({ ...orden, proyecto_id: v })}>
              <SelectTrigger className="bg-background"><SelectValue placeholder={PLACEHOLDER_SELECCIONAR} /></SelectTrigger>
              <SelectContent>
                {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{LABEL_PROVEEDOR_REQUERIDO}</Label>
            <Select value={orden.proveedor_id} onValueChange={(v) => setOrden({ ...orden, proveedor_id: v })}>
              <SelectTrigger className="bg-background"><SelectValue placeholder={PLACEHOLDER_SELECCIONAR} /></SelectTrigger>
              <SelectContent>
                {proveedores.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>{LABEL_FECHA_EMISION_REQUERIDA}</Label>
            <DatePicker
              value={orden.fecha_emision ? new Date(orden.fecha_emision) : undefined}
              onChange={(date) => setOrden({ ...orden, fecha_emision: date ? date.toISOString().split('T')[0] : '' })}
              placeholder="Fecha emisión"
              className="bg-background"
            />
          </div>
          <div>
            <Label>{LABEL_ENTREGA_ESTIMADA}</Label>
            <DatePicker
              value={orden.fecha_entrega_estimada ? new Date(orden.fecha_entrega_estimada) : undefined}
              onChange={(date) => setOrden({ ...orden, fecha_entrega_estimada: date ? date.toISOString().split('T')[0] : '' })}
              placeholder="Entrega estimada"
              className="bg-background"
            />
          </div>
          <div>
            <Label>{LABEL_MONEDA}</Label>
            <Select value={orden.moneda} onValueChange={(v) => setOrden({ ...orden, moneda: v as Moneda })}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONEDAS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>{LABEL_ITEMS}</Label>
          <div className="border rounded-lg mt-1">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">{TABLE_PRODUCTO}</th>
                  <th className="p-2 text-right w-20">{TABLE_CANTIDAD}</th>
                  <th className="p-2 text-right w-24">{TABLE_PRECIO}</th>
                  <th className="p-2 text-right w-24">{TABLE_TOTAL}</th>
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
              <Input placeholder={PLACEHOLDER_PRODUCTO} value={nuevoItem.producto} onChange={(e) => setNuevoItem({ ...nuevoItem, producto: e.target.value })} className="bg-background flex-1" />
              <Input type="number" placeholder={PLACEHOLDER_CANTIDAD} value={nuevoItem.cantidad} onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: parseInt(e.target.value) })} className="bg-background w-20" />
              <Input type="number" placeholder={PLACEHOLDER_PRECIO} value={nuevoItem.precio_unitario} onChange={(e) => setNuevoItem({ ...nuevoItem, precio_unitario: parseFloat(e.target.value) })} className="bg-background w-24" />
              <Button onClick={addItem}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">{LABEL_SUBTOTAL}: {orden.moneda} {subtotal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{LABEL_IMPUESTOS} ({IMPUESTO_LABEL}): {orden.moneda} {impuestos.toFixed(2)}</p>
            <p className="font-bold text-lg">{LABEL_TOTAL}: {orden.moneda} {total.toFixed(2)}</p>
          </div>
        </div>

        <div>
          <Label>{LABEL_CONDICIONES_PAGO}</Label>
          <Input value={orden.condiciones_pago} onChange={(e) => setOrden({ ...orden, condiciones_pago: e.target.value })} placeholder={PLACEHOLDER_CONDICIONES_PAGO} className="bg-background" />
        </div>

        <div>
          <Label>{LABEL_NOTAS}</Label>
          <Textarea value={orden.notas} onChange={(e) => setOrden({ ...orden, notas: e.target.value })} placeholder={PLACEHOLDER_NOTAS} rows={2} className="bg-background" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>{BOTON_CANCELAR}</Button>
        <Button variant="outline" onClick={() => handleCreate('Borrador')} disabled={!orden.proyecto_id || !orden.proveedor_id || orden.items.length === 0}><Save className="h-4 w-4 mr-2" />{BOTON_GUARDAR_BORRADOR}</Button>
        <Button onClick={() => handleCreate('Pendiente aprobación')} disabled={!orden.proyecto_id || !orden.proveedor_id || orden.items.length === 0}><Send className="h-4 w-4 mr-2" />{BOTON_SOLICITAR_APROBACION}</Button>
      </ModalFooter>
    </BaseModal>
  )
}

function DetalleOrdenModal({ open, orden, onClose, onCambiarEstado }: {
  open: boolean
  orden: OrdenCompra
  onClose: () => void
  onCambiarEstado: (id: string, estado: EstadoOrden) => void
}) {
  return (
    <BaseModal open={open} onOpenChange={onClose} size="lg" className="max-h-[90vh] overflow-hidden flex flex-col">
      <ModalHeader title={TITULO_VER_DETALLES} />
      <ModalBody className="space-y-6">
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
          <h4 className="font-medium mb-2">{LABEL_ITEMS}</h4>
          <div className="border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr><th className="p-2 text-left">{TABLE_PRODUCTO}</th><th className="p-2 text-right">{TABLE_CANTIDAD}</th><th className="p-2 text-right">{TABLE_PRECIO}</th><th className="p-2 text-right">{TABLE_TOTAL}</th></tr>
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
              <p>{LABEL_SUBTOTAL}: {orden.moneda} {orden.subtotal.toFixed(2)}</p>
              <p>{LABEL_IMPUESTOS}: {orden.moneda} {orden.impuestos.toFixed(2)}</p>
              <p className="font-bold">{LABEL_TOTAL}: {orden.moneda} {orden.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {orden.condiciones_pago && <div><p className="text-sm text-muted-foreground">{LABEL_CONDICIONES_PAGO}</p><p className="text-sm">{orden.condiciones_pago}</p></div>}
      </ModalBody>

      <ModalFooter>
        {orden.estado === 'Borrador' && <Button onClick={() => onCambiarEstado(orden.id, 'Pendiente aprobación')}><Send className="h-4 w-4 mr-2" />{BOTON_SOLICITAR_APROBACION}</Button>}
        {orden.estado === 'Pendiente aprobación' && <Button onClick={() => onCambiarEstado(orden.id, 'Aprobada')}><CheckCircle className="h-4 w-4 mr-2" />{BOTON_APROBAR}</Button>}
        {orden.estado === 'Aprobada' && <Button onClick={() => onCambiarEstado(orden.id, 'Enviada')}><Send className="h-4 w-4 mr-2" />{BOTON_ENVIAR}</Button>}
        {orden.estado === 'Enviada' && <Button onClick={() => onCambiarEstado(orden.id, 'Recibida completa')}><Package className="h-4 w-4 mr-2" />{BOTON_REGISTRAR_RECEPCION}</Button>}
        {orden.estado !== 'Cancelada' && orden.estado !== 'Recibida completa' && <Button variant="outline" onClick={() => onCambiarEstado(orden.id, 'Cancelada')}><XCircle className="h-4 w-4 mr-2" />{BOTON_CANCELAR}</Button>}
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />{BOTON_DESCARGAR_PDF}</Button>
      </ModalFooter>
    </BaseModal>
  )
}

export default function ComprasPage() {
  const { user } = useAuth()
  const [ordenes, setOrdenes] = useLocalStorage<OrdenCompra[]>(STORAGE_KEYS.compras, [])
  const [proveedores, _setProveedores] = useLocalStorage<Proveedor[]>(STORAGE_KEYS.proveedores, [])
  const [proyectos] = useProyectos()
  const [vista, setVista] = useLocalStorage<'dashboard' | 'ordenes' | 'proveedores'>(STORAGE_KEYS.comprasVista, 'dashboard')
  const [showNuevaOrden, setShowNuevaOrden] = useState(false)
  const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null)
  const [filtroEstado, setFiltroEstado] = useLocalStorage<string>('compras_filtro_estado', 'todos')
  const [searchQuery, setSearchQuery] = useState('')

  const isAdmin = user?.roles.includes('admin')
  const isCompras = user?.roles.includes('compras')
  const canCreate = isAdmin || isCompras

  const ordenesFiltradas = useMemo(() => {
    let result = ordenes
    if (filtroEstado !== 'todos') {
      result = result.filter(o => o.estado === filtroEstado)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(o =>
        o.numero_oc.toLowerCase().includes(query) ||
        o.proveedor_nombre.toLowerCase().includes(query)
      )
    }
    return result
  }, [ordenes, filtroEstado, searchQuery])

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
      numero_oc: `${ORDEN_COMPRA_PREFIX}${String(ordenes.length + 1).padStart(ORDEN_COMPRA_PADDING, '0')}`,
      creado_por: user?.nombre ?? 'Usuario',
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
        icon={ClipboardList}
        description={MENSAJE_SIN_PERMISO}
      />
    )
  }

  return (
    <ModuleContainer>
      <ModuleHeader
        title={COMPRAS_TITLE}
        description={COMPRAS_DESCRIPTION}
        actions={
          canCreate && (
            <Button onClick={() => setShowNuevaOrden(true)}>
              <Plus className="h-4 w-4 mr-2" />{BOTON_NUEVA_ORDEN}
            </Button>
          )
        }
      />

      <StatGrid cols={4}>
        <MiniStat value={stats.pendientes} label={STAT_PENDIENTES} variant="warning" showBorder accentColor={COMPRAS_STATS_COLORS.pendientes} icon={<ClipboardList className="h-5 w-5" />} />
        <MiniStat value={stats.enviadas} label={STAT_ENVIADAS} variant="info" showBorder accentColor={COMPRAS_STATS_COLORS.enviadas} icon={<SendHorizontal className="h-5 w-5" />} />
        <MiniStat value={stats.recibidas} label={STAT_RECIBIDAS} variant="success" showBorder accentColor={COMPRAS_STATS_COLORS.recibidas} icon={<PackageCheck className="h-5 w-5" />} />
        <MiniStat value={`USD ${stats.total.toLocaleString()}`} label={STAT_TOTAL_ORDENES} variant="primary" showBorder accentColor={COMPRAS_STATS_COLORS.total} icon={<DollarSign className="h-5 w-5" />} />
      </StatGrid>

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="dashboard">{TAB_DASHBOARD}</TabsTrigger>
          <TabsTrigger value="ordenes">{TAB_ORDENES}</TabsTrigger>
          <TabsTrigger value="proveedores">{TAB_PROVEEDORES}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />{TITULO_PENDIENTES_APROBACION} ({stats.pendientes})</CardTitle>
              </CardHeader>
              <CardContent>
                <StaggeredList stagger={30}>
                  {ordenes.filter(o => o.estado === 'Pendiente aprobación').map(orden => (
                  <div key={orden.id} className="p-3 border rounded-lg mb-2 hover-lift cursor-pointer" onClick={() => setSelectedOrden(orden)}>
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
                </StaggeredList>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-[hsl(var(--info))]" />{TITULO_PENDIENTES_RECEPCION} ({stats.enviadas})</CardTitle>
              </CardHeader>
              <CardContent>
                <StaggeredList stagger={30}>
                  {ordenes.filter(o => o.estado === 'Enviada').map(orden => (
                  <div key={orden.id} className="p-3 border rounded-lg mb-2 hover-lift cursor-pointer" onClick={() => setSelectedOrden(orden)}>
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
                </StaggeredList>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ordenes">
          <div className="space-y-4">
            <FilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              filters={[
                {
                  key: 'estado',
                  label: FILTRO_ESTADO,
                  options: [
                    { value: 'todos', label: FILTRO_TODOS_ESTADOS },
                    ...ESTADOS_ORDEN.map(e => ({ value: e, label: e }))
                  ]
                }
              ]}
              values={{ estado: filtroEstado }}
              onFilterChange={(key, value) => {
                if (key === 'estado') setFiltroEstado(value)
              }}
              hasActiveFilters={filtroEstado !== 'todos' || searchQuery !== ''}
              onClearFilters={() => {
                setFiltroEstado('todos')
                setSearchQuery('')
              }}
            />

            <div className="space-y-2">
              <StaggeredList stagger={30}>
                {ordenesFiltradas.map(orden => (
                <Card key={orden.id} className="hover-lift cursor-pointer" onClick={() => setSelectedOrden(orden)}>
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
              </StaggeredList>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proveedores">
          <ProveedoresTab proveedores={proveedores} />
        </TabsContent>
      </Tabs>

      <NuevaOrdenModal
        open={showNuevaOrden}
        onClose={() => setShowNuevaOrden(false)}
        onCreate={handleCreateOrden}
        proyectos={proyectos.map(p => ({ id: p.id, nombre: p.nombre }))}
        proveedores={proveedores.map(p => ({ id: p.id, nombre: p.nombre }))}
        userName={user?.nombre ?? 'Usuario'}
      />

      {selectedOrden && <DetalleOrdenModal open={!!selectedOrden} orden={selectedOrden} onClose={() => setSelectedOrden(null)} onCambiarEstado={handleCambiarEstado} />}
    </ModuleContainer>
  )
}
