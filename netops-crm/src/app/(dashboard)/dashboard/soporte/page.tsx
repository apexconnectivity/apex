"use client"

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { useEmpresas, useProyectos, useContactos } from '@/hooks'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

import { Ticket, ContratoSoporte, ComentarioTicket, EstadoTicket, ESTADOS_TICKET, CATEGORIAS_TICKET, PRIORIDADES_TICKET } from '@/types/soporte'
import type { CreateTicketData } from '@/components/module/CreateTicketModal'
import type { CreateContractData } from '@/components/module/CreateContractModal'

// Lazy loading para modales grandes
const CreateTicketModal = dynamic(
  () => import('@/components/module/CreateTicketModal').then(mod => mod.CreateTicketModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const CreateContractModal = dynamic(
  () => import('@/components/module/CreateContractModal').then(mod => mod.CreateContractModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const CreateProjectModal = dynamic(
  () => import('@/components/module/CreateProjectModal').then(mod => mod.CreateProjectModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const CreateEmpresaModal = dynamic(
  () => import('@/components/module/CreateEmpresaModal').then(mod => mod.CreateEmpresaModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
import { SOPORTE_TITULOS, SOPORTE_BOTONES, SOPORTE_STATS, SOPORTE_TABS, SOPORTE_EMPTY, SOPORTE_CONTRATOS } from '@/constants/soporte'
import { getStatusColor, SOPORTE_STATS_COLORS } from '@/lib/colors'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModuleCard } from '@/components/module/ModuleCard'
import { ModuleContainerWithPanel } from '@/components/module/ModuleContainerWithPanel'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { TicketDetailPanel } from '@/components/module/TicketDetailPanel'
import { StatusBadge } from '@/components/module/StatusBadge'
import { StatGrid, MiniStat } from '@/components/ui/mini-stat'
import { GripVertical, AlertCircle, User, Clock, Headphones, FileText, CircleDot, CheckCircle, Archive, Siren, Plus } from 'lucide-react'
import { FilterBar } from '@/components/ui/filter-bar'
import { DateRange } from '@/components/ui/date-range-picker'
import { DndContext, closestCorners, DragOverlay, useSensors, useSensor, PointerSensor, KeyboardSensor, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'

// USUARIOS_INTERNOS removidos para usar datos reales del módulo de usuarios

function SortableTicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id })

  const isSlaWarning = ticket.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && !ticket.fecha_primera_respuesta
  const isSlaBreached = ticket.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && ticket.estado !== 'Resuelto' && ticket.estado !== 'Cerrado'

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined

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

export default function SoportePage() {
  const { user } = useAuth()
  const [empresas, setEmpresas] = useEmpresas()
  const [proyectos, setProyectos] = useProyectos()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contactos] = useContactos()
  const [usuarios] = useLocalStorage<import('@/types/auth').User[]>(STORAGE_KEYS.usuarios, [])
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
  const [filtroFechaRange, setFiltroFechaRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, []) // No deps - setters are stable

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Find the ticket at the time of drag end
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
  }, [tickets, setTickets]) // Only tickets and setTickets needed

  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('tecnico')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const isCliente = user?.roles.includes('cliente')
  const canCreate = isAdmin || isTecnico || isComercial || isCompras || isFacturacion || isCliente

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Filtro por empresa para clientes (aislamiento de datos)
      if (user?.roles.includes('cliente')) {
        if (t.empresa_id !== user.empresa_id) return false
      }

      // Filtro por búsqueda
      if (searchQuery && !t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) && !t.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) return false
      // Filtro por estado
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      // Filtro por categoría
      if (filtroCategoria !== 'todas' && t.categoria !== filtroCategoria) return false
      // Filtro por prioridad
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false
      // Filtro por cliente/empresa (en el dropdown de filtros)
      if (filtroCliente !== 'todos' && t.empresa_id !== filtroCliente && t.contrato_id !== filtroCliente) return false
      // Filtro por responsable
      if (filtroResponsable !== 'todos' && t.responsable_id !== filtroResponsable) return false
      // Filtro por rango de fecha
      if (filtroFechaRange.from && t.fecha_apertura) {
        const fechaApertura = new Date(t.fecha_apertura)
        if (fechaApertura < filtroFechaRange.from) return false
      }
      if (filtroFechaRange.to && t.fecha_apertura) {
        const fechaApertura = new Date(t.fecha_apertura)
        if (fechaApertura > filtroFechaRange.to) return false
      }
      return true
    })
  }, [tickets, searchQuery, filtroEstado, filtroCategoria, filtroPrioridad, filtroCliente, filtroResponsable, filtroFechaRange, user])

  const visibleContratos = useMemo(() => {
    return contratos.filter(c => {
      if (user?.roles.includes('cliente')) {
        return c.empresa_id === user.empresa_id
      }
      return true
    })
  }, [contratos, user])

  const getTicketsByEstado = useCallback((estado: EstadoTicket) => {
    return filteredTickets.filter(t => t.estado === estado)
  }, [filteredTickets])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      id: crypto.randomUUID(),
      creado_en: now,
    } as import('@/types/proyectos').Proyecto

    setProyectos(prev => [...prev, nuevoProyecto])

    // Guardar en localStorage usando constantes estándar
    const stored = localStorage.getItem(STORAGE_KEYS.proyectos)
    const existingProyectos: import('@/types/proyectos').Proyecto[] = stored ? JSON.parse(stored) : []
    localStorage.setItem(STORAGE_KEYS.proyectos, JSON.stringify([...existingProyectos, nuevoProyecto]))
  }

  // Handler para crear empresa desde soporte
  const handleSaveEmpresa = async (empresa: Partial<import('@/types/crm').Empresa>, isNew: boolean) => {
    if (!isNew || !empresa.nombre) return

    const now = new Date().toISOString()
    const nuevaEmpresa: import('@/types/crm').Empresa = {
      ...empresa,
      id: crypto.randomUUID(),
      creado_en: now,
    } as import('@/types/crm').Empresa

    // Actualizar estado local
    setEmpresas(prev => [...prev, nuevaEmpresa])

    // Guardar en localStorage usando constantes estándar
    const stored = localStorage.getItem(STORAGE_KEYS.empresas)
    const existingEmpresas: import('@/types/crm').Empresa[] = stored ? JSON.parse(stored) : []
    localStorage.setItem(STORAGE_KEYS.empresas, JSON.stringify([...existingEmpresas, nuevaEmpresa]))
  }

  if (!isAdmin && !isTecnico && !isComercial && !isCompras && !isFacturacion && !user?.roles.includes('cliente')) {
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
          actions={
            canCreate && (
              <Button onClick={() => setShowCreateTicket(true)}>
                <Plus className="h-4 w-4 mr-2" /> {SOPORTE_BOTONES.nuevoTicket}
              </Button>
            )
          }
        />

        {view === 'tickets' && (
          <>
            {/* Filtros */}
            <FilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar tickets..."
              filters={[
                {
                  key: 'cliente',
                  label: 'Cliente',
                  placeholder: 'Cliente',
                  options: [
                    { value: 'todos', label: 'Todos' },
                    ...empresas.filter(e => e.tipo_entidad === 'cliente').map(e => ({ value: e.id, label: e.nombre })),
                  ],
                  width: 'w-40',
                },
                ...(isAdmin ? [{
                  key: 'responsable',
                  label: 'Responsable',
                  placeholder: 'Responsable',
                  options: [
                    { value: 'todos', label: 'Todos' },
                    ...usuarios.map(u => ({ value: u.id, label: u.nombre })),
                  ],
                  width: 'w-36',
                }] : []),
                {
                  key: 'estado',
                  label: 'Estado',
                  placeholder: 'Estado',
                  options: [
                    { value: 'todos', label: 'Todos' },
                    ...ESTADOS_TICKET.map(e => ({ value: e, label: e })),
                  ],
                  width: 'w-36',
                },
                {
                  key: 'categoria',
                  label: 'Categoría',
                  placeholder: 'Categoría',
                  options: [
                    { value: 'todas', label: 'Todas' },
                    ...CATEGORIAS_TICKET.map(c => ({ value: c, label: c })),
                  ],
                  width: 'w-36',
                },
                {
                  key: 'prioridad',
                  label: 'Prioridad',
                  placeholder: 'Prioridad',
                  options: [
                    { value: 'todas', label: 'Todas' },
                    ...PRIORIDADES_TICKET.map(p => ({ value: p, label: p })),
                  ],
                  width: 'w-32',
                },
                {
                  key: 'fecha',
                  type: 'date',
                  label: 'Fecha',
                  placeholder: 'Rango de fechas',
                  width: 'w-64',
                },
              ]}
              values={{
                cliente: filtroCliente,
                responsable: filtroResponsable,
                estado: filtroEstado,
                categoria: filtroCategoria,
                prioridad: filtroPrioridad,
              }}
              dateValue={filtroFechaRange}
              onDateChange={setFiltroFechaRange}
              onFilterChange={(key, value) => {
                if (key === 'cliente') setFiltroCliente(value)
                else if (key === 'responsable') setFiltroResponsable(value)
                else if (key === 'estado') setFiltroEstado(value)
                else if (key === 'categoria') setFiltroCategoria(value)
                else if (key === 'prioridad') setFiltroPrioridad(value)
              }}
              hasActiveFilters={filtroCliente !== 'todos' || filtroResponsable !== 'todos' || filtroEstado !== 'todos' || filtroCategoria !== 'todas' || filtroPrioridad !== 'todas' || !!searchQuery || !!filtroFechaRange.from}
              onClearFilters={() => {
                setSearchQuery('')
                setFiltroCliente('todos')
                setFiltroResponsable('todos')
                setFiltroEstado('todos')
                setFiltroCategoria('todas')
                setFiltroPrioridad('todas')
                setFiltroFechaRange({ from: undefined, to: undefined })
              }}
            />

            {/* Stats */}
            <StatGrid cols={6}>
              <MiniStat value={stats.total} label={SOPORTE_STATS.total} variant="primary" showBorder accentColor={SOPORTE_STATS_COLORS.total} icon={<FileText className="h-5 w-5" />} />
              <MiniStat value={stats.abiertos} label={SOPORTE_STATS.abiertos} variant="danger" showBorder accentColor={SOPORTE_STATS_COLORS.abiertos} icon={<CircleDot className="h-5 w-5" />} />
              <MiniStat value={stats.enProgreso} label={SOPORTE_STATS.enProgreso} variant="info" showBorder accentColor={SOPORTE_STATS_COLORS.enProgreso} icon={<Clock className="h-5 w-5" />} />
              <MiniStat value={stats.resueltos} label={SOPORTE_STATS.resueltos} variant="success" showBorder accentColor={SOPORTE_STATS_COLORS.resueltos} icon={<CheckCircle className="h-5 w-5" />} />
              <MiniStat value={stats.cerrados} label={SOPORTE_STATS.cerrados} variant="default" showBorder accentColor={SOPORTE_STATS_COLORS.cerrados} icon={<Archive className="h-5 w-5" />} />
              <MiniStat value={stats.urgentes} label={SOPORTE_STATS.urgentes} variant="danger" showBorder accentColor={SOPORTE_STATS_COLORS.urgentes} icon={<Siren className="h-5 w-5" />} />
            </StatGrid>

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
              {visibleContratos.map(contrato => (
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
            usuarios={usuarios}
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
            usuarios={usuarios}
            onSave={handleCreateContract}
          />
        )}

        {/* Modal para crear nuevo proyecto */}
        <CreateProjectModal
          open={showNewProject}
          onOpenChange={setShowNewProject}
          onSave={handleSaveProyecto}
          empresas={empresas}
          usuarios={usuarios}
        />

        {/* Modal para crear nueva empresa */}
        <CreateEmpresaModal
          open={showNewEmpresa}
          onOpenChange={setShowNewEmpresa}
          onSave={handleSaveEmpresa}
          empresa={null}
        />
      </ModuleContainerWithPanel>
    </>
  )
}
