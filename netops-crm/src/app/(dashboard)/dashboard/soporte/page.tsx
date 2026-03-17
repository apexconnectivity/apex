"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { useEmpresas, useProyectos, useContactos } from '@/hooks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Ticket, ContratoSoporte, ComentarioTicket, EstadoTicket, ESTADOS_TICKET, CategoriaTicket, CATEGORIAS_TICKET, PrioridadTicket, PRIORIDADES_TICKET } from '@/types/soporte'
import { CreateTicketData } from '@/components/module/CreateTicketModal'
import { CreateContractData } from '@/components/module/CreateContractModal'
import { CreateTicketModal } from '@/components/module/CreateTicketModal'
import { CreateContractModal } from '@/components/module/CreateContractModal'
import { ProjectModal } from '@/components/module/ProjectModal'
import { EmpresaModal } from '@/components/module/EmpresaModal'
import { SOPORTE_TITULOS, SOPORTE_BOTONES, SOPORTE_STATS, SOPORTE_FILTROS, SOPORTE_TABS, SOPORTE_EMPTY, SOPORTE_CONTRATOS, SOPORTE_SELECTORES } from '@/constants/soporte'
import { getStatusColor, SOPORTE_STATS_COLORS } from '@/lib/colors'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ModuleCard } from '@/components/module/ModuleCard'
import { ModuleContainerWithPanel } from '@/components/module/ModuleContainerWithPanel'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { TicketDetailPanel } from '@/components/module/TicketDetailPanel'
import { StatusBadge } from '@/components/module/StatusBadge'
import { StatGrid, MiniStat } from '@/components/ui/mini-stat'
import { GripVertical, AlertCircle, User, Clock, Headphones, FileText, CircleDot, CheckCircle, Archive, Siren, Filter, X, Plus } from 'lucide-react'
import { DndContext, closestCorners, DragOverlay, useSensors, useSensor, PointerSensor, KeyboardSensor, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

// Lista de usuarios internos (se llenará con datos del módulo de usuarios)
const USUARIOS_INTERNOS = [
  { id: '1', nombre: 'Carlos Admin', rol: 'admin' },
  { id: '2', nombre: 'Laura Pérez', rol: 'comercial' },
  { id: '3', nombre: 'Juan Técnico', rol: 'tecnico' },
  { id: '4', nombre: 'María Compras', rol: 'compras' },
  { id: '5', nombre: 'Ana Facturación', rol: 'facturacion' },
]

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
  const [empresas] = useEmpresas()
  const [proyectos, setProyectos] = useProyectos()
  const [contactos] = useContactos()
  const [usuarios, setUsuarios] = useState<import('@/types/auth').User[]>([])
  const [view, setView] = useLocalStorage<'contratos' | 'tickets'>(STORAGE_KEYS.soporteVista, 'tickets')
  const [contratos, setContratos] = useLocalStorage<ContratoSoporte[]>(STORAGE_KEYS.contratos, [])
  const [tickets, setTickets] = useLocalStorage<Ticket[]>(STORAGE_KEYS.tickets, [])
  const [comentarios, setComentarios] = useLocalStorage<Record<string, ComentarioTicket[]>>(STORAGE_KEYS.comentarios, {})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tickets.find(t => t.id === selectedId) || null
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [showCreateContract, setShowCreateContract] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewEmpresa, setShowNewEmpresa] = useState(false)
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

  // Handler para crear proyecto desde soporte
  const handleSaveProyecto = async (proyecto: Partial<import('@/types/proyectos').Proyecto>, isNew: boolean) => {
    if (!isNew || !proyecto.nombre) return

    const now = new Date().toISOString().split('T')[0]
    const nuevoProyecto: import('@/types/proyectos').Proyecto = {
      ...proyecto,
      id: String(Date.now()),
      creado_en: now,
    } as import('@/types/proyectos').Proyecto

    setProyectos(prev => [...prev, nuevoProyecto])
  }

  // Handler para crear empresa desde soporte
  const handleSaveEmpresa = async (empresa: Partial<import('@/types/crm').Empresa>, isNew: boolean) => {
    if (!isNew || !empresa.nombre) return

    const now = new Date().toISOString()
    const nuevaEmpresa: import('@/types/crm').Empresa = {
      ...empresa,
      id: String(Date.now()),
      creado_en: now,
    } as import('@/types/crm').Empresa

    // Guardar en localStorage
    const stored = localStorage.getItem('netops_empresas')
    const existingEmpresas: import('@/types/crm').Empresa[] = stored ? JSON.parse(stored) : []
    localStorage.setItem('netops_empresas', JSON.stringify([...existingEmpresas, nuevaEmpresa]))
  }

  if (!isAdmin && !isTecnico && !isComercial && !isCompras && !isFacturacion) {
    return (
      <Card className="m-4 p-8 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Headphones className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">{SOPORTE_TITULOS.accesoRestringido}</p>
        </CardContent>
      </Card>
    )
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
              <MiniStat value={stats.total} label={SOPORTE_STATS.total} variant="primary" showBorder accentColor={SOPORTE_STATS_COLORS.total} icon={<FileText className="h-5 w-5" />} />
              <MiniStat value={stats.abiertos} label={SOPORTE_STATS.abiertos} variant="danger" showBorder accentColor={SOPORTE_STATS_COLORS.abiertos} icon={<CircleDot className="h-5 w-5" />} />
              <MiniStat value={stats.enProgreso} label={SOPORTE_STATS.enProgreso} variant="info" showBorder accentColor={SOPORTE_STATS_COLORS.enProgreso} icon={<Clock className="h-5 w-5" />} />
              <MiniStat value={stats.resueltos} label={SOPORTE_STATS.resueltos} variant="success" showBorder accentColor={SOPORTE_STATS_COLORS.resueltos} icon={<CheckCircle className="h-5 w-5" />} />
              <MiniStat value={stats.cerrados} label={SOPORTE_STATS.cerrados} variant="default" showBorder accentColor={SOPORTE_STATS_COLORS.cerrados} icon={<Archive className="h-5 w-5" />} />
              <MiniStat value={stats.urgentes} label={SOPORTE_STATS.urgentes} variant="danger" showBorder accentColor={SOPORTE_STATS_COLORS.urgentes} icon={<Siren className="h-5 w-5" />} />
            </StatGrid>

            <div className="flex gap-4 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.cliente}</Label>
                <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                  <SelectTrigger className="w-40 h-8 bg-background"><SelectValue placeholder={SOPORTE_SELECTORES.todos} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{SOPORTE_SELECTORES.todos}</SelectItem>
                    {empresas.filter(e => e.tipo_entidad === 'cliente').map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.responsable}</Label>
                  <Select value={filtroResponsable} onValueChange={setFiltroResponsable}>
                    <SelectTrigger className="w-36 h-8 bg-background"><SelectValue placeholder={SOPORTE_FILTROS.todos} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">{SOPORTE_SELECTORES.todos}</SelectItem>
                      {USUARIOS_INTERNOS.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.estado}</Label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-36 h-8 bg-background"><SelectValue placeholder={SOPORTE_SELECTORES.todos} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{SOPORTE_SELECTORES.todos}</SelectItem>
                    {ESTADOS_TICKET.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.categoria}</Label>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-36 h-8 bg-background"><SelectValue placeholder={SOPORTE_SELECTORES.todas} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">{SOPORTE_SELECTORES.todas}</SelectItem>
                    {CATEGORIAS_TICKET.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">{SOPORTE_FILTROS.prioridad}</Label>
                <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                  <SelectTrigger className="w-32 h-8 bg-background"><SelectValue placeholder={SOPORTE_SELECTORES.todas} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">{SOPORTE_SELECTORES.todas}</SelectItem>
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
            empresas={empresas}
            proyectos={proyectos}
            setProyectos={setProyectos}
            usuarios={USUARIOS_INTERNOS}
            onSave={handleCreateTicket}
            onCreateProject={() => setShowNewProject(true)}
            onCreateEmpresa={() => setShowNewEmpresa(true)}
          />
        )}

        {showCreateContract && (
          <CreateContractModal
            open={showCreateContract}
            onOpenChange={setShowCreateContract}
            empresas={empresas}
            usuarios={USUARIOS_INTERNOS}
            onSave={handleCreateContract}
          />
        )}

        {/* Modal para crear nuevo proyecto */}
        <ProjectModal
          open={showNewProject}
          onOpenChange={setShowNewProject}
          onSave={handleSaveProyecto}
          empresas={empresas}
          usuarios={usuarios}
          contactos={contactos}
        />

        {/* Modal para crear nueva empresa */}
        <EmpresaModal
          open={showNewEmpresa}
          onOpenChange={setShowNewEmpresa}
          onSave={handleSaveEmpresa}
          empresa={null}
        />
      </ModuleContainerWithPanel>
    </>
  )
}
