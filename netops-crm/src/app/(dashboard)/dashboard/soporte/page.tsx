"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '@/components/ui/dialog'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Headphones, X, Plus, Filter, Calendar, User, AlertCircle, MessageSquare, ChevronRight, Clock, CheckCircle, GripVertical, FileText, CircleDot, Archive, Siren } from 'lucide-react'
import { ContratoSoporte, Ticket, ComentarioTicket, CATEGORIAS_TICKET, ESTADOS_TICKET, PRIORIDADES_TICKET, CONTRATOS_TIPOS, CONTRATOS_ESTADOS, CategoriaTicket, EstadoTicket, PrioridadTicket, TipoOrigen, DEFAULT_SLA } from '@/types/soporte'
import { SOPORTE_TEXTS, SOPORTE_TITULOS, SOPORTE_TABS, SOPORTE_STATS, SOPORTE_FILTROS, SOPORTE_BOTONES, SOPORTE_EMPTY, SOPORTE_CONTRATOS } from '@/constants/soporte'
import { getStatusColor } from '@/lib/colors'
import { StatusBadge, ModuleCard, TicketDetailPanel, ModuleContainerWithPanel, ModuleHeader, CreateTicketModal, CreateContractModal, type CreateTicketData, type CreateContractData } from '@/components/module'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { Empresa } from '@/types/crm'
import { Proyecto } from '@/types/proyectos'

const DEMO_EMPRESAS: Empresa[] = [
  { id: '1', nombre: 'Soluciones Tecnológicas SA', tipo_entidad: 'cliente', email_principal: 'contacto@soltec.com', telefono_principal: '+54 11 1234-5678', direccion: 'Av. Libertador 1000', ciudad: 'Buenos Aires', pais: 'Argentina', creado_en: '2024-01-15', tipo_relacion: 'Cliente' },
  { id: '2', nombre: 'Hospital Regional Norte', tipo_entidad: 'cliente', email_principal: 'info@hrn.com', telefono_principal: '+54 11 2345-6789', ciudad: 'Buenos Aires', pais: 'Argentina', creado_en: '2024-02-01', tipo_relacion: 'Cliente' },
  { id: '3', nombre: 'TechCorp International', tipo_entidad: 'cliente', ciudad: 'Miami', pais: 'EEUU', creado_en: '2024-03-01', tipo_relacion: 'Cliente' },
]

const DEMO_PROYECTOS: Proyecto[] = [
  { id: 'p1', empresa_id: '1', nombre: 'Implementación CRM', fase_actual: 4, estado: 'activo', moneda: 'USD', probabilidad_cierre: 90, responsable_id: '3', contacto_tecnico_id: '1', requiere_compras: true, creado_en: '2025-06-01' },
  { id: 'p2', empresa_id: '2', nombre: 'Migración Cloud', fase_actual: 2, estado: 'activo', moneda: 'USD', probabilidad_cierre: 40, responsable_id: '3', contacto_tecnico_id: '2', requiere_compras: false, creado_en: '2025-11-01' },
]

const DEMO_USUARIOS = [
  { id: '1', nombre: 'Carlos Admin', rol: 'admin' },
  { id: '2', nombre: 'Laura Pérez', rol: 'comercial' },
  { id: '3', nombre: 'Juan Técnico', rol: 'tecnico' },
  { id: '4', nombre: 'María Compras', rol: 'compras' },
  { id: '5', nombre: 'Ana Facturación', rol: 'facturacion' },
]

const DEMO_CONTRATOS: ContratoSoporte[] = [
  { id: '1', empresa_id: '1', empresa_nombre: 'Soluciones Tecnológicas SA', nombre: 'Soporte Premium 2026', tipo: 'Premium', fecha_inicio: '2026-01-01', fecha_fin: '2027-01-01', renovacion_automatica: true, estado: 'Activo', moneda: 'USD', monto_mensual: 1500, horas_incluidas_mes: 10, horas_consumidas_mes: 3.5, contacto_principal_nombre: 'Juan Pérez', contacto_tecnico_nombre: 'María García', tecnico_asignado_id: '3', tecnico_asignado_nombre: 'Juan Técnico', notas: 'Cliente con horario crítico: 8-20 hs', creado_en: '2026-01-01' },
  { id: '2', empresa_id: '2', empresa_nombre: 'Hospital Regional Norte', nombre: 'Soporte Básico', tipo: 'Básico', fecha_inicio: '2026-02-01', fecha_fin: '2026-08-01', renovacion_automatica: false, estado: 'Activo', moneda: 'USD', monto_mensual: 500, horas_incluidas_mes: 4, horas_consumidas_mes: 1, tecnico_asignado_id: '3', tecnico_asignado_nombre: 'Juan Técnico', creado_en: '2026-02-01' },
  { id: '3', empresa_id: '3', empresa_nombre: 'TechCorp International', nombre: 'Monitoreo 24x7', tipo: '24x7', fecha_inicio: '2025-12-01', fecha_fin: '2026-03-01', renovacion_automatica: true, estado: 'Vencido', moneda: 'USD', monto_mensual: 3000, horas_incluidas_mes: 20, horas_consumidas_mes: 18, tecnico_asignado_id: '3', tecnico_asignado_nombre: 'Juan Técnico', creado_en: '2025-12-01' },
]

const DEMO_TICKETS: Ticket[] = [
  { id: '1', numero_ticket: 'TK-2026-001', contrato_id: '1', contrato_nombre: 'Soporte Premium 2026', tipo_origen: 'soporte', categoria: 'Soporte técnico', titulo: 'No hay conexión desde sede norte', descripcion: 'Desde esta mañana, la sede norte no tiene conexión a internet. Necesitamos asistencia urgente.', creado_por: '1', creado_por_nombre: 'María García', creado_por_cliente: true, fecha_apertura: '2026-03-10T10:30:00', estado: 'Abierto', prioridad: 'Urgente', fecha_limite_respuesta: '2026-03-10T12:30:00', fecha_limite_resolucion: '2026-03-10T18:30:00', responsable_id: '3', responsable_nombre: 'Juan Técnico', tiempo_invertido_minutos: 0 },
  { id: '2', numero_ticket: 'TK-2026-002', contrato_id: '1', contrato_nombre: 'Soporte Premium 2026', tipo_origen: 'soporte', categoria: 'Soporte técnico', titulo: 'Firewall caído', descripcion: 'El firewall principal no responde. Los usuarios no pueden acceder a los recursos.', creado_por: '1', creado_por_nombre: 'María García', creado_por_cliente: true, fecha_apertura: '2026-03-09T14:00:00', estado: 'En progreso', prioridad: 'Alta', fecha_limite_respuesta: '2026-03-09T22:00:00', fecha_limite_resolucion: '2026-03-10T14:00:00', responsable_id: '3', responsable_nombre: 'Juan Técnico', tiempo_invertido_minutos: 45 },
  { id: '3', numero_ticket: 'TK-2026-003', contrato_id: '1', contrato_nombre: 'Soporte Premium 2026', tipo_origen: 'soporte', categoria: 'Facturación', titulo: 'Consulta sobre factura de febrero', descripcion: 'Necesitamos verificar los cargos adicionales del mes pasado.', creado_por: '1', creado_por_nombre: 'Juan Pérez', creado_por_cliente: true, fecha_apertura: '2026-03-08T09:00:00', estado: 'Esperando cliente', prioridad: 'Baja', responsable_id: '5', responsable_nombre: 'Ana Facturación', tiempo_invertido_minutos: 15 },
  { id: '4', numero_ticket: 'TK-2026-004', contrato_id: '2', contrato_nombre: 'Soporte Básico', tipo_origen: 'soporte', categoria: 'Consulta comercial', titulo: 'Interested in upgrading plan', descripcion: 'We would like to know the options for upgrading to Premium support.', creado_por: '2', creado_por_nombre: 'Laura Pérez', creado_por_cliente: false, fecha_apertura: '2026-03-07T11:00:00', estado: 'Resuelto', prioridad: 'Media', responsable_id: '2', responsable_nombre: 'Laura Pérez', tiempo_invertido_minutos: 30, fecha_cierre: '2026-03-08T16:00:00' },
  { id: '5', numero_ticket: 'TK-2026-005', contrato_id: '1', contrato_nombre: 'Soporte Premium 2026', tipo_origen: 'soporte', categoria: 'Compras', titulo: 'Solicitud de cotizaciones para servidores', descripcion: 'Necesitamos cotizar 3 servidores Dell para expansión.', creado_por: '1', creado_por_nombre: 'María García', creado_por_cliente: true, fecha_apertura: '2026-03-05T08:00:00', estado: 'En progreso', prioridad: 'Media', responsable_id: '4', responsable_nombre: 'María Compras', tiempo_invertido_minutos: 60 },
]

const DEMO_COMENTARIOS: Record<string, ComentarioTicket[]> = {
  '1': [
    { id: 'c1', ticket_id: '1', usuario_id: '0', usuario_nombre: 'Sistema', es_interno: false, comentario: 'Ticket asignado a Juan Técnico automáticamente según categoría.', fecha: '2026-03-10T10:31:00' },
  ],
  '2': [
    { id: 'c2', ticket_id: '2', usuario_id: '3', usuario_nombre: 'Juan Técnico', es_interno: false, comentario: 'Estoy revisando el dispositivo. Parece ser un problema de hardware.', fecha: '2026-03-09T14:30:00' },
  ],
}

function SortableTicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id })

  const isSlaWarning = ticket.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && !ticket.fecha_primera_respuesta
  const isSlaBreached = ticket.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && ticket.estado !== 'Resuelto' && ticket.estado !== 'Cerrado'

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
      <ModuleCard onClick={onClick} noPadding>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                <GripVertical className="h-3 w-3 text-muted-foreground" />
              </button>
              <span className="text-xs font-mono text-muted-foreground">{ticket.numero_ticket}</span>
            </div>
            <div className="flex items-center gap-1">
              {isSlaBreached && <AlertCircle className={`h-4 w-4 ${getStatusColor('error').text}`} />}
              {isSlaWarning && !isSlaBreached && <AlertCircle className={`h-4 w-4 ${getStatusColor('warning').text}`} />}
            </div>
          </div>
          <h4 className="font-semibold text-sm line-clamp-2">{ticket.titulo}</h4>
          <p className="text-xs text-muted-foreground truncate">{ticket.contrato_nombre}</p>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge status={ticket.categoria} type="categoria" />
            <StatusBadge status={ticket.prioridad} type="prioridad" />
          </div>
          {ticket.responsable_nombre && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{ticket.responsable_nombre}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(ticket.fecha_apertura).toLocaleDateString('es-ES')}</span>
          </div>
        </CardContent>
      </ModuleCard>
    </div>
  )
}

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const isSlaWarning = ticket.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && !ticket.fecha_primera_respuesta
  const isSlaBreached = ticket.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && ticket.estado !== 'Resuelto' && ticket.estado !== 'Cerrado'

  return (
    <ModuleCard onClick={onClick} noPadding>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">{ticket.numero_ticket}</span>
          {isSlaBreached && <AlertCircle className={`h-4 w-4 ${getStatusColor('error').text}`} />}
          {isSlaWarning && <AlertCircle className={`h-4 w-4 ${getStatusColor('warning').text}`} />}
        </div>
        <h4 className="font-semibold text-sm line-clamp-2">{ticket.titulo}</h4>
        <p className="text-xs text-muted-foreground truncate">{ticket.contrato_nombre}</p>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={ticket.categoria} type="categoria" />
          <StatusBadge status={ticket.prioridad} type="prioridad" />
        </div>
        {ticket.responsable_nombre && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{ticket.responsable_nombre}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{new Date(ticket.fecha_apertura).toLocaleDateString('es-ES')}</span>
        </div>
      </CardContent>
    </ModuleCard>
  )
}

export default function SoportePage() {
  const { user } = useAuth()
  const [view, setView] = useState<'contratos' | 'tickets'>('tickets')
  const [contratos, setContratos] = useState<ContratoSoporte[]>(DEMO_CONTRATOS)
  const [tickets, setTickets] = useState<Ticket[]>(DEMO_TICKETS)
  const [comentarios, setComentarios] = useState<Record<string, ComentarioTicket[]>>(DEMO_COMENTARIOS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tickets.find(t => t.id === selectedId) || null
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [showCreateContract, setShowCreateContract] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas')
  const [filtroCliente, setFiltroCliente] = useState<string>('todos')
  const [filtroResponsable, setFiltroResponsable] = useState<string>('todos')
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>('')
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeTicket = tickets.find(t => t.id === active.id)
    if (!activeTicket) return

    const overId = over.id as string

    let newEstado: EstadoTicket | null = null

    if (ESTADOS_TICKET.includes(overId as EstadoTicket)) {
      newEstado = overId as EstadoTicket
    } else {
      const overTicket = tickets.find(t => t.id === overId)
      if (overTicket) {
        newEstado = overTicket.estado
      }
    }

    if (newEstado && newEstado !== activeTicket.estado) {
      setTickets(prev => prev.map(t => t.id === activeTicket.id ? {
        ...t,
        estado: newEstado!,
        fecha_cierre: newEstado === 'Cerrado' ? new Date().toISOString() : undefined,
        fecha_primera_respuesta: t.fecha_primera_respuesta || new Date().toISOString(),
      } : t))
    }
  }

  const getTicketsByEstado = (estado: EstadoTicket) => {
    return filteredTickets.filter(t => t.estado === estado)
  }

  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('tecnico')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const canCreate = isAdmin || isTecnico || isComercial || isCompras || isFacturacion

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Filtro por estado
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      // Filtro por categoría
      if (filtroCategoria !== 'todas' && t.categoria !== filtroCategoria) return false
      // Filtro por prioridad
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false
      // Filtro por cliente/empresa
      if (filtroCliente !== 'todos' && t.empresa_id !== filtroCliente && t.contrato_id !== filtroCliente) return false
      // Filtro por responsable
      if (filtroResponsable !== 'todos' && t.responsable_id !== filtroResponsable) return false
      // Filtro por fecha desde
      if (filtroFechaDesde && t.fecha_apertura < filtroFechaDesde) return false
      // Filtro por fecha hasta
      if (filtroFechaHasta && t.fecha_apertura > filtroFechaHasta) return false
      return true
    })
  }, [tickets, filtroEstado, filtroCategoria, filtroPrioridad, filtroCliente, filtroResponsable, filtroFechaDesde, filtroFechaHasta])

  const ticketsPorEstado = useMemo(() => {
    const r: Record<EstadoTicket, Ticket[]> = { 'Abierto': [], 'En progreso': [], 'Esperando cliente': [], 'Resuelto': [], 'Cerrado': [] }
    filteredTickets.forEach(t => { if (r[t.estado]) r[t.estado].push(t) })
    return r
  }, [filteredTickets])

  const stats = useMemo(() => ({
    total: tickets.length,
    abiertos: tickets.filter(t => t.estado === 'Abierto').length,
    enProgreso: tickets.filter(t => t.estado === 'En progreso').length,
    resueltos: tickets.filter(t => t.estado === 'Resuelto').length,
    cerrados: tickets.filter(t => t.estado === 'Cerrado').length,
    urgentes: tickets.filter(t => t.prioridad === 'Urgente' && t.estado !== 'Cerrado').length,
  }), [tickets])

  const handleCreateTicket = (data: CreateTicketData) => {
    const year = new Date().getFullYear()
    const num = tickets.length + 1
    const newTicket: Ticket = {
      ...data.ticket,
      id: Date.now().toString(),
      numero_ticket: `TK-${year}-${String(num).padStart(3, '0')}`,
      fecha_apertura: new Date().toISOString(),
      tiempo_invertido_minutos: 0,
      creado_por: user?.id || '1',
      creado_por_nombre: user?.nombre || 'Carlos Admin',
      creado_por_cliente: false,
    }
    setTickets(prev => [...prev, newTicket])
    setComentarios(prev => ({ ...prev, [newTicket.id]: [] }))
  }

  const handleUpdateTicket = (updated: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedId(updated.id)
  }

  const handleChangeState = (ticketId: string, estado: EstadoTicket) => {
    // Buscar el ticket antes de cambiar
    const ticket = tickets.find(t => t.id === ticketId)

    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      estado,
      fecha_cierre: estado === 'Cerrado' ? new Date().toISOString() : undefined,
      fecha_primera_respuesta: t.fecha_primera_respuesta || new Date().toISOString(),
    } : t))

    // Si se cierra el ticket y tiene horas invertidas, sumarlas al contrato
    if (estado === 'Cerrado' && ticket && ticket.tiempo_invertido_minutos > 0 && ticket.contrato_id) {
      setContratos(prev => prev.map(c => {
        if (c.id === ticket.contrato_id) {
          const nuevasHoras = c.horas_consumidas_mes + (ticket.tiempo_invertido_minutos / 60)
          // Verificar si se excedió el límite
          if (nuevasHoras > c.horas_incluidas_mes) {
            console.warn(`⚠️ ALERTA: Ticket ${ticket.numero_ticket} excedió las horas del contrato ${c.nombre}`)
            // Aquí se podría mostrar una notificación
          }
          return {
            ...c,
            horas_consumidas_mes: nuevasHoras
          }
        }
        return c
      }))
    }

    setSelectedId(null)
  }

  const handleAddComentario = (ticketId: string, comentario: string, es_interno: boolean) => {
    const newComentario: ComentarioTicket = {
      id: Date.now().toString(),
      ticket_id: ticketId,
      usuario_id: user?.id || '1',
      usuario_nombre: user?.nombre || 'Usuario',
      es_interno,
      comentario,
      fecha: new Date().toISOString(),
    }
    setComentarios(prev => ({ ...prev, [ticketId]: [...(prev[ticketId] || []), newComentario] }))
  }

  const handleCreateContract = (data: CreateContractData) => {
    const newContract: ContratoSoporte = {
      ...data.contrato,
      id: Date.now().toString(),
      creado_en: new Date().toISOString(),
    }
    setContratos(prev => [...prev, newContract])
  }

  if (!isAdmin && !isTecnico && !isComercial && !isCompras && !isFacturacion) {
    return <AccessDeniedCard icon={Headphones} title={SOPORTE_TITULOS.accesoRestringido} />
  }

  return (
    <>
      <ModuleContainerWithPanel
        panel={
          selected ? (
            <TicketDetailPanel
              isOpen={!!selected}
              onClose={() => setSelectedId(null)}
              ticket={selected}
              comentarios={comentarios[selected.id] || []}
              onUpdate={handleUpdateTicket}
              onAddComentario={(c, i) => handleAddComentario(selected.id, c, i)}
              onChangeState={(e) => handleChangeState(selected.id, e)}
            />
          ) : null
        }
        panelOpen={!!selectedId}
      >
        <ModuleHeader
          title={SOPORTE_TITULOS.titulo}
          description={SOPORTE_TITULOS.descripcion}
          tabs={[
            { value: 'tickets', label: SOPORTE_TABS.tickets },
            { value: 'contratos', label: SOPORTE_TABS.contratos }
          ]}
          activeTab={view}
          onTabChange={(v) => setView(v as 'contratos' | 'tickets')}
        />

        {view === 'tickets' && (
          <>
            <StatGrid cols={6}>
              <MiniStat value={stats.total} label={SOPORTE_STATS.total} variant="primary" showBorder accentColor="#06b6d4" icon={<FileText className="h-5 w-5" />} />
              <MiniStat value={stats.abiertos} label={SOPORTE_STATS.abiertos} variant="danger" showBorder accentColor="#ef4444" icon={<CircleDot className="h-5 w-5" />} />
              <MiniStat value={stats.enProgreso} label={SOPORTE_STATS.enProgreso} variant="info" showBorder accentColor="#3b82f6" icon={<Clock className="h-5 w-5" />} />
              <MiniStat value={stats.resueltos} label={SOPORTE_STATS.resueltos} variant="success" showBorder accentColor="#10b981" icon={<CheckCircle className="h-5 w-5" />} />
              <MiniStat value={stats.cerrados} label={SOPORTE_STATS.cerrados} variant="default" showBorder accentColor="#64748b" icon={<Archive className="h-5 w-5" />} />
              <MiniStat value={stats.urgentes} label={SOPORTE_STATS.urgentes} variant="danger" showBorder accentColor="#dc2626" icon={<Siren className="h-5 w-5" />} />
            </StatGrid>

            <div className="flex gap-4 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.cliente}</Label>
                <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                  <SelectTrigger className="w-40 h-8 bg-background"><SelectValue placeholder={SOPORTE_FILTROS.todos} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {DEMO_EMPRESAS.filter(e => e.tipo_entidad === 'cliente').map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.responsable}</Label>
                  <Select value={filtroResponsable} onValueChange={setFiltroResponsable}>
                    <SelectTrigger className="w-36 h-8 bg-background"><SelectValue placeholder={SOPORTE_FILTROS.todos} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {DEMO_USUARIOS.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.estado}</Label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-36 h-8 bg-background"><SelectValue placeholder={SOPORTE_FILTROS.todos} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {ESTADOS_TICKET.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.categoria}</Label>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-36 h-8 bg-background"><SelectValue placeholder={SOPORTE_FILTROS.todas} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {CATEGORIAS_TICKET.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.prioridad}</Label>
                <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                  <SelectTrigger className="w-32 h-8 bg-background"><SelectValue placeholder={SOPORTE_FILTROS.todas} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {PRIORIDADES_TICKET.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground">{SOPORTE_FILTROS.desde}</Label>
                <Input
                  type="date"
                  value={filtroFechaDesde}
                  onChange={(e) => setFiltroFechaDesde(e.target.value)}
                  className="w-32 h-8 bg-background"
                />
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground">{SOPORTE_FILTROS.hasta}</Label>
                <Input
                  type="date"
                  value={filtroFechaHasta}
                  onChange={(e) => setFiltroFechaHasta(e.target.value)}
                  className="w-32 h-8 bg-background"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFiltroCliente('todos')
                  setFiltroResponsable('todos')
                  setFiltroEstado('todos')
                  setFiltroCategoria('todas')
                  setFiltroPrioridad('todas')
                  setFiltroFechaDesde('')
                  setFiltroFechaHasta('')
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" /> {SOPORTE_FILTROS.limpiar}
              </Button>

              {canCreate && <Button className="ml-auto" onClick={() => setShowCreateTicket(true)}><Plus className="h-4 w-4 mr-2" /> {SOPORTE_BOTONES.nuevoTicket}</Button>}
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="-mx-6 px-6 overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 min-w-[1120px] pb-2">
                  {ESTADOS_TICKET.slice(0, 4).map(estado => (
                    <div key={estado} className="min-w-[280px]" data-estado={estado}>
                      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/30">
                        <h3 className="font-semibold">{estado}</h3>
                        <Badge variant="secondary" className="ml-auto">{getTicketsByEstado(estado).length}</Badge>
                      </div>
                      <SortableContext items={getTicketsByEstado(estado).map(t => t.id)} strategy={horizontalListSortingStrategy}>
                        <div className="space-y-3 min-h-[200px] p-2 rounded-lg border border-dashed border-border/50">
                          {getTicketsByEstado(estado).map(ticket => (
                            <SortableTicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedId(ticket.id)} />
                          ))}
                          {getTicketsByEstado(estado).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">{SOPORTE_EMPTY.noHayTickets}</div>
                          )}
                        </div>
                      </SortableContext>
                    </div>
                  ))}
                </div>
                <DragOverlay>
                  {activeId ? (
                    <Card className="shadow-xl rotate-3 cursor-grabbing">
                      <CardContent className="p-4 space-y-2">
                        <span className="text-xs font-mono text-muted-foreground">{tickets.find(t => t.id === activeId)?.numero_ticket}</span>
                        <h4 className="font-semibold text-sm">{tickets.find(t => t.id === activeId)?.titulo}</h4>
                      </CardContent>
                    </Card>
                  ) : null}
                </DragOverlay>
              </div>
            </DndContext>
          </>
        )}

        {view === 'contratos' && (
          <>
            <div className="flex justify-end">
              {canCreate && <Button onClick={() => setShowCreateContract(true)}><Plus className="h-4 w-4 mr-2" /> {SOPORTE_BOTONES.nuevoContrato}</Button>}
            </div>

            <div className="grid gap-4">
              {contratos.map(contrato => (
                <Card key={contrato.id} className="hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{contrato.nombre}</h3>
                          <Badge variant={contrato.estado === 'Activo' ? 'default' : 'secondary'}>{contrato.estado}</Badge>
                        </div>
                        <p className="text-muted-foreground">{contrato.empresa_nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{contrato.moneda} {contrato.monto_mensual}/mes</p>
                        <p className="text-sm text-muted-foreground">{contrato.tipo}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                      <div><p className="text-muted-foreground">{SOPORTE_CONTRATOS.inicio}</p><p>{new Date(contrato.fecha_inicio).toLocaleDateString('es-ES')}</p></div>
                      <div><p className="text-muted-foreground">{SOPORTE_CONTRATOS.fin}</p><p>{new Date(contrato.fecha_fin).toLocaleDateString('es-ES')}</p></div>
                      <div><p className="text-muted-foreground">{SOPORTE_CONTRATOS.tecnico}</p><p>{contrato.tecnico_asignado_nombre || SOPORTE_CONTRATOS.sinAsignar}</p></div>
                      <div><p className="text-muted-foreground">{SOPORTE_CONTRATOS.horas}</p><p>{contrato.horas_consumidas_mes}/{contrato.horas_incluidas_mes}h</p></div>
                    </div>
                    <div className="mt-4 bg-card/50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{SOPORTE_CONTRATOS.horasConsumidasMes}</span>
                        <span className="font-medium">{Math.round(contrato.horas_consumidas_mes)}/{contrato.horas_incluidas_mes}h</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-2">
                        <div
                          className={`h-2 rounded-full ${contrato.horas_consumidas_mes > contrato.horas_incluidas_mes ? getStatusColor('error').bg : getStatusColor('primary').bg}`}
                          style={{ width: `${Math.min((contrato.horas_consumidas_mes / contrato.horas_incluidas_mes) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {showCreateTicket && (
          <CreateTicketModal
            open={showCreateTicket}
            onOpenChange={setShowCreateTicket}
            contratos={contratos}
            empresas={DEMO_EMPRESAS}
            proyectos={DEMO_PROYECTOS}
            usuarios={DEMO_USUARIOS}
            onSave={handleCreateTicket}
          />
        )}

        {showCreateContract && (
          <CreateContractModal
            open={showCreateContract}
            onOpenChange={setShowCreateContract}
            empresas={DEMO_EMPRESAS}
            usuarios={DEMO_USUARIOS}
            onSave={handleCreateContract}
          />
        )}
      </ModuleContainerWithPanel>
    </>
  )
}
