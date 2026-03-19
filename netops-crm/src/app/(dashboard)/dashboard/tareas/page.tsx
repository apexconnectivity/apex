"use client"

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useEmpresas } from '@/hooks/useEmpresas'
import { useContactos } from '@/hooks/useContactos'
import { useTareas, useProyectos, useSubtareas, useComentarios } from '@/hooks'
import { VARIANT_COLORS, TASK_STATUS_COLORS, PRIORITY_COLORS, TAREAS_STATS_COLORS } from '@/lib/colors'

// Importar constantes
import {
  OTHER_LABELS,
} from '@/constants/tareas'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { FilterBar } from '@/components/ui/filter-bar'
import { DateRange } from '@/components/ui/date-range-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckSquare, Calendar, User, AlertCircle, ChevronRight, GripVertical, FileText, Clock, Loader2, CheckCircle, Ban, AlertTriangle, Plus } from 'lucide-react'
import { Tarea, Subtarea, Comentario, CATEGORIAS, PRIORIDADES, ESTADOS, EstadoTarea } from '@/types/tareas'
import { StatusBadge, ModuleCard, TaskDetailPanel, ModuleContainerWithPanel, ModuleHeader } from '@/components/module'
import type { CreateTaskData } from '@/components/module/CreateTaskModal'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading para modales grandes
const CreateTaskModal = dynamic(
  () => import('@/components/module/CreateTaskModal').then(mod => mod.CreateTaskModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const CreateProjectModal = dynamic(
  () => import('@/components/module/CreateProjectModal').then(mod => mod.CreateProjectModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)

// Lista de usuarios (se填充ará con datos del módulo de usuarios)
const USUARIOS: { id: string; nombre: string; rol: string }[] = []

function TaskCard({ tarea, onClick, onStatusChange }: { tarea: Tarea; onClick: () => void; onStatusChange: (id: string, estado: EstadoTarea) => void }) {
  const isOverdue = tarea.fecha_vencimiento && new Date(tarea.fecha_vencimiento) < new Date() && tarea.estado !== 'Completada'
  const isBlocked = tarea.estado === 'Bloqueada' || (tarea.dependencias && tarea.dependencias.length > 0)

  const getNextStates = (): EstadoTarea[] => {
    if (tarea.estado === 'Pendiente') return ['En progreso']
    if (tarea.estado === 'En progreso') return ['Completada', 'Bloqueada']
    if (tarea.estado === 'Bloqueada') return ['Pendiente', 'En progreso']
    return []
  }

  // Get estado icon
  const getEstadoIcon = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Completada':
        return <CheckCircle className={`h-3.5 w-3.5 ${TASK_STATUS_COLORS.completada.color} flex-shrink-0`} />
      case 'En progreso':
        return <Clock className={`h-3.5 w-3.5 ${TASK_STATUS_COLORS.en_progreso.color} flex-shrink-0 animate-pulse`} />
      case 'Bloqueada':
        return <AlertCircle className={`h-3.5 w-3.5 ${TASK_STATUS_COLORS.bloqueada.color} flex-shrink-0`} />
      default:
        return <Clock className={`h-3.5 w-3.5 ${TASK_STATUS_COLORS.pendiente.color} flex-shrink-0`} />
    }
  }

  return (
    <ModuleCard onClick={onClick} className="cursor-pointer group">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{tarea.nombre}</h4>
            <p className="text-xs text-muted-foreground truncate">{tarea.proyecto_nombre}</p>
          </div>
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={tarea.categoria} type="categoria" />
          <StatusBadge status={tarea.prioridad} type="prioridad" />
        </div>

        {tarea.fecha_vencimiento && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-[hsl(var(--error))]' : 'text-muted-foreground'}`}>
            <Calendar className="h-3 w-3" />
            <span>{new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES')}</span>
          </div>
        )}

        {tarea.responsable_nombre && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{tarea.asignado_a_cliente ? `👤 ${tarea.contacto_cliente_nombre}` : tarea.responsable_nombre}</span>
          </div>
        )}

        {isBlocked && (
          <div className={`flex items-center gap-1 text-xs ${PRIORITY_COLORS.alta.color}`}>
            <AlertCircle className="h-3 w-3" />
            <span>Bloqueada</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            {getEstadoIcon(tarea.estado)}
            <StatusBadge status={tarea.estado} type="estado" />
          </div>

          {isBlocked && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Select value="" onValueChange={(v) => onStatusChange(tarea.id, v as EstadoTarea)}>
                <SelectTrigger className="h-6 w-28 bg-input border-border text-xs">
                  <SelectValue placeholder="Cambiar" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStates().map(estado => (
                    <SelectItem key={estado} value={estado} className="text-xs">
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </ModuleCard>
  )
}



export default function TareasPage() {
  const { user } = useAuth()
  const [tareas, setTareas] = useTareas()
  const [proyectos, setProyectos] = useProyectos()
  const [empresas] = useEmpresas()
  const [contactos] = useContactos()
  const [usuarios, setUsuarios] = useState<import('@/types/auth').User[]>([])

  // Modal nuevo proyecto
  const [showNewProject, setShowNewProject] = useState(false)
  const [subtareas, setSubtareas] = useSubtareas()
  const [comentarios, setComentarios] = useComentarios()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_view, _setView] = useState<'kanban' | 'lista'>('kanban')
  const [filtroProyecto, setFiltroProyecto] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filtroPersona, setFiltroPersona] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas')
  const [filtroFechaRange, setFiltroFechaRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [filtroVencidas, setFiltroVencidas] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tareas.find(t => t.id === selectedId) || null
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null)

  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isTecnico = user?.roles.includes('tecnico')
  const isCompras = user?.roles.includes('compras')
  const canCreate = isAdmin || isComercial || isTecnico || isCompras

  const filteredTareas = useMemo(() => {
    return tareas.filter(t => {
      // Filtro de búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchNombre = t.nombre?.toLowerCase().includes(query)
        const matchDescripcion = t.descripcion?.toLowerCase().includes(query)
        if (!matchNombre && !matchDescripcion) return false
      }

      if (filtroProyecto !== 'todos' && t.proyecto_id !== filtroProyecto) return false
      if (filtroPersona !== 'todos' && t.responsable_id !== filtroPersona) return false
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      if (filtroCategoria !== 'todas' && t.categoria !== filtroCategoria) return false
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false

      // Filtro por rango de fecha
      if (filtroFechaRange.from && t.fecha_vencimiento) {
        const fechaVencimiento = new Date(t.fecha_vencimiento)
        if (fechaVencimiento < filtroFechaRange.from) return false
      }
      if (filtroFechaRange.to && t.fecha_vencimiento) {
        const fechaVencimiento = new Date(t.fecha_vencimiento)
        if (fechaVencimiento > filtroFechaRange.to) return false
      }

      const isOverdue = t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date() && t.estado !== 'Completada'
      if (filtroVencidas && !isOverdue) return false

      return true
    })
  }, [tareas, searchQuery, filtroProyecto, filtroPersona, filtroEstado, filtroCategoria, filtroPrioridad, filtroFechaRange, filtroVencidas])

  const visibleTareas = useMemo(() => {
    if (isAdmin) return filteredTareas

    return filteredTareas.filter(t => {
      const isOwnTask = t.responsable_id === user?.id
      const isClientTask = t.asignado_a_cliente

      return isOwnTask || isClientTask
    })
  }, [filteredTareas, isAdmin, user?.id])

  const tareasPorEstado = useMemo(() => {
    const r: Record<EstadoTarea, Tarea[]> = { 'Pendiente': [], 'En progreso': [], 'Completada': [], 'Bloqueada': [] }
    visibleTareas.forEach((t: Tarea) => { if (t.estado && r[t.estado]) r[t.estado].push(t) })
    return r
  }, [visibleTareas])

  const stats = useMemo(() => ({
    total: visibleTareas.length,
    pendientes: visibleTareas.filter(t => t.estado === 'Pendiente').length,
    enProgreso: visibleTareas.filter(t => t.estado === 'En progreso').length,
    completadas: visibleTareas.filter(t => t.estado === 'Completada').length,
    bloqueadas: visibleTareas.filter(t => t.estado === 'Bloqueada').length,
    overdue: visibleTareas.filter(t => t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date() && t.estado !== 'Completada').length,
  }), [visibleTareas])

  const handleStatusChange = useCallback((id: string, estado: EstadoTarea) => {
    setTareas(prev => prev.map(t => t.id === id ? {
      ...t,
      estado,
      fecha_completado: estado === 'Completada' ? new Date().toISOString() : undefined
    } : t))
  }, [setTareas])

  // Handler para crear proyecto desde tareas
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

  // Handler para crear empresa desde tareas
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleSaveEmpresa = async (empresa: Partial<import('@/types/crm').Empresa>, isNew: boolean) => {
    if (!isNew || !empresa.nombre) return

    const now = new Date().toISOString().split('T')[0]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _nuevaEmpresa: import('@/types/crm').Empresa = {
      ...empresa,
      id: String(Date.now()),
      creado_en: now,
    } as import('@/types/crm').Empresa

    // No tenemos setEmpresas aquí, necesitamos agregarlo
  }

  // Handler para crear usuario desde tareas
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleSaveUsuario = async (user: Partial<import('@/types/auth').User>, isNew: boolean) => {
    if (!isNew || !user.nombre) return

    const now = new Date().toISOString().split('T')[0]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _nuevoUsuario: import('@/types/auth').User = {
      ...user,
      id: String(Date.now()),
      nombre: user.nombre || '',
      email: user.email || '',
      roles: user.roles || ['tecnico'],
      activo: true,
      creado_en: now,
      cambiar_password_proximo_login: true,
    } as import('@/types/auth').User

    setUsuarios(prev => [...prev, _nuevoUsuario])
  }

  const handleSaveTarea = useCallback((data: CreateTaskData) => {
    if (data.mode === 'create') {
      const newTarea: Tarea = {
        ...data.tarea,
        id: Date.now().toString(),
        fecha_creacion: new Date().toISOString(),
        orden: tareas.length + 1,
        creado_por: user?.id || '1',
      }
      setTareas(prev => [...prev, newTarea])

      if (data.subtareas && data.subtareas.length > 0) {
        const newSubtareas: Subtarea[] = data.subtareas.map((s, i) => ({
          id: Date.now().toString() + '-' + i,
          tarea_id: newTarea.id,
          nombre: s.nombre,
          completada: s.completada || false,
          orden: i + 1
        }))
        setSubtareas(prev => ({ ...prev, [newTarea.id]: newSubtareas }))
      } else {
        setSubtareas(prev => ({ ...prev, [newTarea.id]: [] }))
      }

      if (data.comentarios && data.comentarios.length > 0) {
        const newComentarios: Comentario[] = data.comentarios.map((c, i) => ({
          id: Date.now().toString() + '-' + i,
          tarea_id: newTarea.id,
          usuario_id: c.usuario_id,
          usuario_nombre: c.usuario_nombre,
          es_cliente: c.es_cliente,
          comentario: c.comentario,
          fecha: new Date().toISOString()
        }))
        setComentarios(prev => ({ ...prev, [newTarea.id]: newComentarios }))
      } else {
        setComentarios(prev => ({ ...prev, [newTarea.id]: [] }))
      }
    } else {
      const updatedTarea: Tarea = {
        ...data.tarea,
        id: editingTarea?.id || '',
        fecha_creacion: editingTarea?.fecha_creacion || new Date().toISOString(),
        orden: editingTarea?.orden || 1,
        creado_por: editingTarea?.creado_por || user?.id || '1',
      }
      setTareas(prev => prev.map(t => t.id === updatedTarea.id ? updatedTarea : t))

      if (data.subtareas) {
        const taskSubtareas: Subtarea[] = data.subtareas.map((s, i) => ({
          id: s.id || Date.now().toString() + '-' + i,
          tarea_id: updatedTarea.id,
          nombre: s.nombre,
          completada: s.completada || false,
          orden: i + 1
        }))
        setSubtareas(prev => ({ ...prev, [updatedTarea.id]: taskSubtareas }))
      }

      if (data.comentarios) {
        const taskComentarios: Comentario[] = data.comentarios.map((c, i) => ({
          id: c.id || Date.now().toString() + '-' + i,
          tarea_id: updatedTarea.id,
          usuario_id: c.usuario_id,
          usuario_nombre: c.usuario_nombre,
          es_cliente: c.es_cliente,
          comentario: c.comentario,
          fecha: new Date().toISOString()
        }))
        setComentarios(prev => ({ ...prev, [updatedTarea.id]: taskComentarios }))
      }

      setSelectedId(updatedTarea.id)
    }
  }, [tareas.length, user?.id, editingTarea, setTareas, setSubtareas, setComentarios, setSelectedId])

  const handleDeleteTarea = useCallback(() => {
    if (editingTarea) {
      setTareas(prev => prev.filter(t => t.id !== editingTarea.id))
      setSubtareas(prev => {
        const newSubtareas = { ...prev }
        delete newSubtareas[editingTarea.id]
        return newSubtareas
      })
      setComentarios(prev => {
        const newComentarios = { ...prev }
        delete newComentarios[editingTarea.id]
        return newComentarios
      })
      setShowEdit(false)
      setEditingTarea(null)
      setSelectedId(null)
    }
  }, [editingTarea, setTareas, setSubtareas, setComentarios, setShowEdit, setEditingTarea, setSelectedId])

  const handleUpdateTarea = useCallback((updated: Tarea) => {
    setTareas(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedId(updated.id)
  }, [setTareas, setSelectedId])

  const handleAddSubtarea = useCallback((tareaId: string, nombre: string) => {
    const newSubtarea: Subtarea = {
      id: Date.now().toString(),
      tarea_id: tareaId,
      nombre,
      completada: false,
      orden: (subtareas[tareaId]?.length || 0) + 1,
    }
    setSubtareas(prev => ({ ...prev, [tareaId]: [...(prev[tareaId] || []), newSubtarea] }))
  }, [subtareas, setSubtareas])

  const handleToggleSubtarea = useCallback((tareaId: string, subtareaId: string) => {
    setSubtareas(prev => ({
      ...prev,
      [tareaId]: prev[tareaId].map(s => s.id === subtareaId ? { ...s, completada: !s.completada, fecha_completado: !s.completada ? new Date().toISOString() : undefined } : s)
    }))
  }, [setSubtareas])

  const handleAddComentario = useCallback((tareaId: string, texto: string) => {
    const newComentario: Comentario = {
      id: Date.now().toString(),
      tarea_id: tareaId,
      usuario_id: user?.id || '1',
      usuario_nombre: user?.nombre || 'Usuario',
      es_cliente: false,
      comentario: texto,
      fecha: new Date().toISOString(),
    }
    setComentarios(prev => ({ ...prev, [tareaId]: [...(prev[tareaId] || []), newComentario] }))
  }, [user?.id, user?.nombre, setComentarios])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _clearFilters = () => {
    setFiltroProyecto('todos')
    setFiltroPersona('todos')
    setFiltroEstado('todos')
    setFiltroCategoria('todas')
    setFiltroPrioridad('todas')
    setFiltroFechaRange({ from: undefined, to: undefined })
    setFiltroVencidas(false)
  }

  if (!isAdmin && !isComercial && !isTecnico && !isCompras) {
    return (
      <Card className="m-4 p-8 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <CheckSquare className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Acceso restringido</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <ModuleContainerWithPanel
        panel={
          selected ? (
            <TaskDetailPanel
              isOpen={!!selected}
              onClose={() => setSelectedId(null)}
              tarea={selected}
              proyectos={proyectos}
              usuarios={USUARIOS}
              subtareas={subtareas[selected.id] || []}
              comentarios={comentarios[selected.id] || []}
              onUpdate={handleUpdateTarea}
              onAddSubtarea={(nombre) => handleAddSubtarea(selected.id, nombre)}
              onToggleSubtarea={(id) => handleToggleSubtarea(selected.id, id)}
              onAddComentario={(texto) => handleAddComentario(selected.id, texto)}
              onEdit={() => { setEditingTarea(selected); setShowEdit(true) }}
            />
          ) : null
        }
        panelOpen={!!selectedId}
      >
        <ModuleHeader
          title="Tareas"
          description="Gestión de tareas por proyecto"
          actions={
            canCreate && (
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" /> Nueva Tarea
              </Button>
            )
          }
        />

        {/* Filtros */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar tareas..."
          filters={[
            {
              key: 'proyecto',
              label: 'Proyecto',
              placeholder: 'Proyecto',
              options: [
                { value: 'todos', label: 'Todos' },
                ...proyectos.map(p => ({ value: p.id, label: p.nombre })),
              ],
              width: 'w-40',
            },
            {
              key: 'estado',
              label: 'Estado',
              placeholder: 'Estado',
              options: [
                { value: 'todos', label: 'Todos' },
                ...ESTADOS.map(e => ({ value: e, label: e })),
              ],
              width: 'w-36',
            },
            {
              key: 'categoria',
              label: 'Categoría',
              placeholder: 'Categoría',
              options: [
                { value: 'todas', label: 'Todas' },
                ...CATEGORIAS.map(c => ({ value: c, label: c })),
              ],
              width: 'w-36',
            },
            {
              key: 'prioridad',
              label: 'Prioridad',
              placeholder: 'Prioridad',
              options: [
                { value: 'todas', label: 'Todas' },
                ...PRIORIDADES.map(p => ({ value: p, label: p })),
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
            proyecto: filtroProyecto,
            estado: filtroEstado,
            categoria: filtroCategoria,
            prioridad: filtroPrioridad,
          }}
          dateValue={filtroFechaRange}
          onDateChange={setFiltroFechaRange}
          onFilterChange={(key, value) => {
            if (key === 'proyecto') setFiltroProyecto(value)
            else if (key === 'estado') setFiltroEstado(value)
            else if (key === 'categoria') setFiltroCategoria(value)
            else if (key === 'prioridad') setFiltroPrioridad(value)
          }}
          hasActiveFilters={filtroProyecto !== 'todos' || filtroEstado !== 'todos' || filtroCategoria !== 'todas' || filtroPrioridad !== 'todas' || !!searchQuery || !!filtroFechaRange.from || !!filtroVencidas}
          onClearFilters={() => {
            setSearchQuery('')
            setFiltroProyecto('todos')
            setFiltroEstado('todos')
            setFiltroCategoria('todas')
            setFiltroPrioridad('todas')
            setFiltroFechaRange({ from: undefined, to: undefined })
            setFiltroVencidas(false)
          }}
        />

        {/* Filtros adicionales: Persona (admin) y Vencidas */}
        <div className="flex flex-wrap gap-2 items-center text-sm">
          {isAdmin && (
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground mr-1">Persona:</Label>
              <Select value={filtroPersona} onValueChange={setFiltroPersona}>
                <SelectTrigger className="w-36 h-8 bg-input border-border"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {USUARIOS.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer h-8">
            <Checkbox
              checked={filtroVencidas}
              onCheckedChange={(checked) => setFiltroVencidas(checked as boolean)}
            />
            <span className="text-xs text-muted-foreground">Vencidas</span>
          </label>
        </div>

        {/* Stats */}
        <StatGrid cols={6}>
          <MiniStat value={stats.total} label="Total" variant="primary" showBorder accentColor={TAREAS_STATS_COLORS.total} icon={<FileText className="h-5 w-5" />} />
          <MiniStat value={stats.pendientes} label="Pendientes" variant="warning" showBorder accentColor={TAREAS_STATS_COLORS.pendientes} icon={<Clock className="h-5 w-5" />} />
          <MiniStat value={stats.enProgreso} label="En Progreso" variant="info" showBorder accentColor={TAREAS_STATS_COLORS.enProgreso} icon={<Loader2 className="h-5 w-5" />} />
          <MiniStat value={stats.completadas} label="Completadas" variant="success" showBorder accentColor={TAREAS_STATS_COLORS.completadas} icon={<CheckCircle className="h-5 w-5" />} />
          <MiniStat value={stats.bloqueadas} label="Bloqueadas" variant="danger" showBorder accentColor={TAREAS_STATS_COLORS.bloqueadas} icon={<Ban className="h-5 w-5" />} />
          <MiniStat value={stats.overdue} label="Vencidas" variant="danger" showBorder accentColor={TAREAS_STATS_COLORS.overdue} icon={<AlertTriangle className="h-5 w-5" />} />
        </StatGrid>

        {_view === 'kanban' && (
          <div className="-mx-6 px-6 overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 min-w-[1120px] pb-2">
              {ESTADOS.map(estado => (
                <div key={estado} className="min-w-[280px]">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold">{estado}</h3>
                    <Badge variant="secondary" className="ml-auto">{tareasPorEstado[estado]?.length || 0}</Badge>
                  </div>
                  <div className="space-y-3">
                    {tareasPorEstado[estado]?.map(tarea => (
                      <TaskCard key={tarea.id} tarea={tarea} onClick={() => setSelectedId(tarea.id)} onStatusChange={handleStatusChange} />
                    ))}
                    {tareasPorEstado[estado]?.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">{OTHER_LABELS.noHayTareas}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {_view === 'lista' && (
          <div className="space-y-2">
            {visibleTareas.map(tarea => (
              <Card key={tarea.id} className={`cursor-pointer bg-card border-border/50 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:${VARIANT_COLORS.primary.gradient} hover:${VARIANT_COLORS.primary.borderColor}`} onClick={() => setSelectedId(tarea.id)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{tarea.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{tarea.proyecto_nombre} • {tarea.fase_nombre}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={tarea.categoria} type="categoria" />
                    <StatusBadge status={tarea.prioridad} type="prioridad" />
                    <StatusBadge status={tarea.estado} type="estado" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </ModuleContainerWithPanel>

      <CreateTaskModal
        open={showCreate}
        onOpenChange={setShowCreate}
        proyectos={proyectos}
        setProyectos={setProyectos}
        usuarios={USUARIOS}
        currentUser={{ id: user?.id || '1', nombre: user?.nombre || 'Usuario' }}
        onSave={handleSaveTarea}
        onCreateProject={() => setShowNewProject(true)}
      />

      <CreateTaskModal
        open={showEdit}
        onOpenChange={setShowEdit}
        proyectos={proyectos}
        setProyectos={setProyectos}
        usuarios={USUARIOS}
        currentUser={{ id: user?.id || '1', nombre: user?.nombre || 'Usuario' }}
        tarea={editingTarea}
        subtareas={editingTarea ? subtareas[editingTarea.id] || [] : []}
        comentarios={editingTarea ? comentarios[editingTarea.id] || [] : []}
        onSave={handleSaveTarea}
        onDelete={handleDeleteTarea}
      />

      {/* Modal para crear nuevo proyecto */}
      <CreateProjectModal
        open={showNewProject}
        onOpenChange={setShowNewProject}
        onSave={handleSaveProyecto}
        empresas={empresas}
        usuarios={usuarios}
        contactos={contactos}
      />
    </>
  )
}
