"use client"

import { Suspense, useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useEmpresas } from '@/hooks/useEmpresas'
import { useTareas, useProyectos, useSubtareas, useComentarios } from '@/hooks'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { VARIANT_COLORS, TASK_STATUS_COLORS, PRIORITY_COLORS, TAREAS_STATS_COLORS, ESTADO_COLORS } from '@/lib/colors'
import { TAREAS_STATS } from '@/constants/estadisticas'

// Importar constantes
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FilterBar } from '@/components/ui/filter-bar'
import { DateRange } from '@/components/ui/date-range-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, User as UserIcon, AlertCircle, ChevronRight, GripVertical, FileText, Clock, Loader2, CheckCircle, Ban, AlertTriangle, Plus, LayoutGrid, List, GanttChart } from 'lucide-react'
import { Tarea, Subtarea, Comentario, CATEGORIAS, PRIORIDADES, ESTADOS, EstadoTarea } from '@/types/tareas'
import { type User } from '@/types/auth'
import { StatusBadge, ModuleCard, TaskDetailPanel, ModuleContainerWithPanel, ModuleHeader, KanbanCard } from '@/components/module'
import { CreateTaskModal } from '@/components/module/CreateTaskModal'
import { CreateProjectModal } from '@/components/module/CreateProjectModal'
import type { CreateTaskData } from '@/components/module/CreateTaskModal'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { TaskGanttChart } from '@/components/ui/task-gantt-chart'

import { v4 as uuidv4 } from 'uuid'

import { cn } from '@/lib/utils'

// Transformar usuarios del formato User al formato requerido por CreateTaskModal
// Filtra solo usuarios internos (colaboradores) para el selector de responsable
const transformUsuarios = (users: User[]): { id: string; nombre: string; rol: string }[] => {
  const ROLES_INTERNOS = ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing']
  return users
    .filter(u => u.activo && u.roles.some(r => ROLES_INTERNOS.includes(r))) // Solo usuarios internos activos
    .map(u => ({
      id: u.id,
      nombre: u.nombre,
      rol: u.roles[0] || 'cliente' // Primer rol como string
    }))
}

function _TaskCard({ tarea, onClick, onStatusChange }: { tarea: Tarea; onClick: () => void; onStatusChange: (id: string, estado: EstadoTarea) => void }) {
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
            <UserIcon className="h-3 w-3" />
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
  return (
    <Suspense fallback={<TareasLoading />}>
      <TareasPageContent />
    </Suspense>
  )
}

function TareasLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-6 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-6 min-w-[1200px] pb-6">
        {['Pendiente', 'En progreso', 'Completada', 'Bloqueada'].map(estado => (
          <div key={estado} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <Skeleton className="h-4 w-20" />
            </div>
            {[1,2,3].map(j => (
              <Skeleton key={j} className="h-32" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function TareasPageContent() {
  const { user } = useAuth()
  const {
    tasks: tareas,
    isLoading: isTasksLoading,
    createTask,
    updateTask,
    deleteTask,
  } = useTareas()

  const [proyectos, setProyectos] = useProyectos()
  const [empresas] = useEmpresas()
  const [usuarios] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])

  // Modal nuevo proyecto
  const [showNewProject, setShowNewProject] = useState(false)
  const [subtareasRecord, setSubtareasRecord] = useSubtareas()
  const [comentariosRecord, setComentariosRecord] = useComentarios()

  const [_view, setView] = useState<'kanban' | 'lista' | 'gantt'>('kanban')
  const [filtroProyecto, setFiltroProyecto] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filtroPersona, setFiltroPersona] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas')
  const [filtroFechaRange, setFiltroFechaRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [filtroVencidas, setFiltroVencidas] = useState<boolean>(false)
  
  // Filtro de fase (para ver tareas de fases anteriores del proyecto)
  const [filtroFase, setFiltroFase] = useState<number | null>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tareas.find(t => t.id === selectedId) || null

  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null)

  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isTecnico = user?.roles.includes('especialista')
  const isCompras = user?.roles.includes('compras')
  const canCreate = isAdmin || isComercial || isTecnico || isCompras

  const filteredTareas = useMemo(() => {
    return tareas.filter(t => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!t.nombre?.toLowerCase().includes(query) && !t.descripcion?.toLowerCase().includes(query)) return false
      }
      if (filtroProyecto !== 'todos' && t.proyecto_id !== filtroProyecto) return false
      if (filtroPersona !== 'todos' && t.responsable_id !== filtroPersona) return false
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      if (filtroCategoria !== 'todas' && t.categoria !== filtroCategoria) return false
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false
      if (filtroFechaRange.from && t.fecha_vencimiento && new Date(t.fecha_vencimiento) < filtroFechaRange.from) return false
      if (filtroFechaRange.to && t.fecha_vencimiento && new Date(t.fecha_vencimiento) > filtroFechaRange.to) return false
      if (filtroVencidas && !(t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date() && t.estado !== 'Completada')) return false
      // Filtrar por fase: si hay un filtro de fase activo, mostrar solo tareas de esa fase
      // Si no hay filtro de fase, mostrar solo tareas de la fase actual de cada proyecto
      if (filtroFase !== null) {
        // Filtro de fase específico activo (tareas de fase anterior)
        if (t.fase_origen !== filtroFase) return false
      } else {
        // Sin filtro de fase específico, mostrar solo tareas de la fase actual de cada proyecto
        // Se aplica tanto cuando hay un proyecto específico seleccionado como cuando se ven todos
        const proyecto = proyectos.find(p => p.id === t.proyecto_id)
        if (proyecto && t.fase_origen !== proyecto.fase_actual) return false
      }
      return true
    })
  }, [tareas, searchQuery, filtroProyecto, filtroPersona, filtroEstado, filtroCategoria, filtroPrioridad, filtroFechaRange, filtroVencidas, filtroFase, proyectos])

  const visibleTareas = useMemo(() => {
    if (isAdmin) return filteredTareas
    if (user?.roles.includes('cliente')) {
      const myProjectIds = proyectos.filter(p => p.empresa_id === user.empresa_id).map(p => p.id)
      return filteredTareas.filter(t => myProjectIds.includes(t.proyecto_id))
    }
    return filteredTareas.filter(t => t.responsable_id === user?.id || t.asignado_a_cliente)
  }, [filteredTareas, isAdmin, user, proyectos])

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

  // Handler para crear proyecto desde tareas (reservado para uso futuro)
  const _handleSaveProyecto = async (proyecto: Partial<import('@/types/proyectos').Proyecto>, isNew: boolean) => {
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
      roles: user.roles || ['especialista'],
      activo: true,
      creado_en: now,
      cambiar_password_proximo_login: true,
    } as import('@/types/auth').User

    // setUsuarios(prev => [...prev, _nuevoUsuario]) // This was removed as usuarios is now a useState with empty array
  }

  const handleSaveTarea = useCallback(async (data: CreateTaskData) => {
    if (data.mode === 'create') {
      const newTask = await createTask(data.tarea)

      if (data.subtareas && data.subtareas.length > 0) {
        const subs: Subtarea[] = data.subtareas.map((s, i) => ({
          id: uuidv4(),
          tarea_id: newTask.id,
          nombre: s.nombre,
          completada: s.completada || false,
          orden: i + 1
        }))
        setSubtareasRecord(prev => ({ ...prev, [newTask.id]: subs }))
      }

      if (data.comentarios && data.comentarios.length > 0) {
        const comms: Comentario[] = data.comentarios.map((c) => ({
          id: uuidv4(),
          tarea_id: newTask.id,
          usuario_id: c.usuario_id,
          usuario_nombre: c.usuario_nombre,
          es_cliente: c.es_cliente,
          comentario: c.comentario,
          fecha: new Date().toISOString()
        }))
        setComentariosRecord(prev => ({ ...prev, [newTask.id]: comms }))
      }
    } else if (editingTarea) {
      await updateTask(editingTarea.id, data.tarea)

      if (data.subtareas) {
        const subs: Subtarea[] = data.subtareas.map((s, i) => ({
          id: s.id || uuidv4(),
          tarea_id: editingTarea.id,
          nombre: s.nombre,
          completada: s.completada || false,
          orden: i + 1
        }))
        setSubtareasRecord(prev => ({ ...prev, [editingTarea.id]: subs }))
      }

      if (data.comentarios) {
        const comms: Comentario[] = data.comentarios.map((c) => ({
          id: c.id || uuidv4(),
          tarea_id: editingTarea.id,
          usuario_id: c.usuario_id,
          usuario_nombre: c.usuario_nombre,
          es_cliente: c.es_cliente,
          comentario: c.comentario,
          fecha: new Date().toISOString()
        }))
        setComentariosRecord(prev => ({ ...prev, [editingTarea.id]: comms }))
      }
      setSelectedId(editingTarea.id)
    }
  }, [createTask, updateTask, editingTarea, setSubtareasRecord, setComentariosRecord])

  const handleDeleteTarea = useCallback(async () => {
    if (editingTarea) {
      await deleteTask(editingTarea.id)
      setShowEdit(false)
      setEditingTarea(null)
      setSelectedId(null)
    }
  }, [editingTarea, deleteTask])

  const _handleUpdateTarea = useCallback(async (updated: Tarea) => {
    await updateTask(updated.id, updated)
    setSelectedId(updated.id)
  }, [updateTask, setSelectedId])

  const handleAddSubtarea = useCallback((tareaId: string, nombre: string) => {
    const newSub: Subtarea = {
      id: uuidv4(),
      tarea_id: tareaId,
      nombre,
      completada: false,
      orden: (subtareasRecord[tareaId]?.length || 0) + 1
    }
    setSubtareasRecord(prev => ({ ...prev, [tareaId]: [...(prev[tareaId] || []), newSub] }))
  }, [subtareasRecord, setSubtareasRecord])

  const handleToggleSubtarea = useCallback((tareaId: string, subtareaId: string) => {
    setSubtareasRecord(prev => ({
      ...prev,
      [tareaId]: (prev[tareaId] || []).map(s => s.id === subtareaId
        ? { ...s, completada: !s.completada, fecha_completado: !s.completada ? new Date().toISOString() : undefined }
        : s
      )
    }))
  }, [setSubtareasRecord])

  const handleAddComentario = useCallback((tareaId: string, texto: string) => {
    const newComm: Comentario = {
      id: uuidv4(),
      tarea_id: tareaId,
      usuario_id: user?.id || '1',
      usuario_nombre: user?.nombre || 'Usuario',
      es_cliente: false,
      comentario: texto,
      fecha: new Date().toISOString(),
    }
    setComentariosRecord(prev => ({ ...prev, [tareaId]: [...(prev[tareaId] || []), newComm] }))
  }, [user, setComentariosRecord]) // Only user info needed

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _clearFilters = () => {
    setFiltroProyecto('todos')
    setFiltroPersona('todos')
    setFiltroEstado('todos')
    setFiltroCategoria('todas')
    setFiltroPrioridad('todas')
    setFiltroFechaRange({ from: undefined, to: undefined })
    setFiltroVencidas(false)
    setFiltroFase(null)
  }

  if (!isAdmin && !isComercial && !isTecnico && !isCompras && !user?.roles.includes('cliente')) {
    return (
      <Card className="m-4 p-8 text-center bg-muted/20">
        <CardContent className="flex flex-col items-center gap-4">
          <Ban className="h-12 w-12 text-muted-foreground opacity-20" />
          <p className="text-lg font-medium text-muted-foreground">Acceso restringido</p>
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
              usuarios={transformUsuarios(usuarios)}
              subtareas={subtareasRecord[selected.id] || []}
              comentarios={comentariosRecord[selected.id] || []}
              onUpdate={(updated) => updateTask(updated.id, updated)}
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
          description="Gestión operativa de proyectos"
          actions={
            canCreate && (
              <Button onClick={() => setShowCreate(true)} className="shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" /> Nueva Tarea
              </Button>
            )
          }
        />

        {/* Filtros */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar por nombre o descripción..."
          filters={[
            {
              key: 'proyecto',
              label: 'Proyecto',
              options: [{ value: 'todos', label: 'Todos' }, ...proyectos.map(p => ({ value: p.id, label: p.nombre }))],
              width: 'w-44',
            },
            {
              key: 'estado',
              label: 'Estado',
              options: [{ value: 'todos', label: 'Todos' }, ...ESTADOS.map(e => ({ value: e, label: e }))],
              width: 'w-40',
            },
            {
              key: 'categoria',
              label: 'Categoría',
              options: [{ value: 'todas', label: 'Todas' }, ...CATEGORIAS.map(c => ({ value: c, label: c }))],
              width: 'w-40',
            },
            {
              key: 'prioridad',
              label: 'Prioridad',
              options: [{ value: 'todas', label: 'Todas' }, ...PRIORIDADES.map(p => ({ value: p, label: p }))],
              width: 'w-36',
            }
          ]}
          values={{ proyecto: filtroProyecto, estado: filtroEstado, categoria: filtroCategoria, prioridad: filtroPrioridad }}
          dateValue={filtroFechaRange}
          onDateChange={setFiltroFechaRange}
          onFilterChange={(key, value) => {
            if (key === 'proyecto') setFiltroProyecto(value)
            else if (key === 'estado') setFiltroEstado(value)
            else if (key === 'categoria') setFiltroCategoria(value)
            else if (key === 'prioridad') setFiltroPrioridad(value)
          }}
          hasActiveFilters={filtroProyecto !== 'todos' || filtroEstado !== 'todos' || filtroCategoria !== 'todas' || filtroPrioridad !== 'todas' || !!searchQuery || !!filtroFechaRange.from || !!filtroVencidas || filtroFase !== null}
          onClearFilters={() => {
            setSearchQuery('')
            setFiltroProyecto('todos')
            setFiltroEstado('todos')
            setFiltroCategoria('todas')
            setFiltroPrioridad('todas')
            setFiltroFechaRange({ from: undefined, to: undefined })
            setFiltroVencidas(false)
            setFiltroFase(null)
          }}
        />

        {/* Filtros adicionales: Persona (admin), Fase, Vencidas */}
        <div className="flex items-center gap-4 mb-6">
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Responsable:</Label>
              <Select value={filtroPersona} onValueChange={setFiltroPersona}>
                <SelectTrigger className="w-44 h-9 bg-background/50 border-border/50"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {transformUsuarios(usuarios).map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Selector de Fase */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Fase:</Label>
            <Select 
              value={filtroFase?.toString() || 'actual'} 
              onValueChange={(v) => setFiltroFase(v === 'actual' ? null : parseInt(v))}
            >
              <SelectTrigger className="w-48 h-9 bg-background/50 border-border/50">
                <SelectValue placeholder="Fase actual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actual">Fase actual</SelectItem>
                <SelectItem value="1">Fase 1: Prospecto</SelectItem>
                <SelectItem value="2">Fase 2: Diagnóstico</SelectItem>
                <SelectItem value="3">Fase 3: Propuesta</SelectItem>
                <SelectItem value="4">Fase 4: Implementación</SelectItem>
                <SelectItem value="5">Fase 5: Cierre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted/50 transition-colors">
            <Checkbox checked={filtroVencidas} onCheckedChange={(c) => setFiltroVencidas(c as boolean)} />
            <span className="text-xs font-medium text-muted-foreground uppercase">Ver solo vencidas</span>
          </label>
        </div>

        {isTasksLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium animate-pulse">Cargando tareas...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <StatGrid cols={6}>
              <MiniStat value={stats.total} label={TAREAS_STATS.total} variant="primary" showBorder accentColor={TAREAS_STATS_COLORS.total} icon={<FileText className="h-5 w-5" />} />
              <MiniStat value={stats.pendientes} label={TAREAS_STATS.pendientes} variant="warning" showBorder accentColor={TAREAS_STATS_COLORS.pendientes} icon={<Clock className="h-5 w-5" />} />
              <MiniStat value={stats.enProgreso} label={TAREAS_STATS.enProgreso} variant="info" showBorder accentColor={TAREAS_STATS_COLORS.enProgreso} icon={<Loader2 className="h-5 w-5" />} />
              <MiniStat value={stats.completadas} label={TAREAS_STATS.completadas} variant="success" showBorder accentColor={TAREAS_STATS_COLORS.completadas} icon={<CheckCircle className="h-5 w-5" />} />
              <MiniStat value={stats.bloqueadas} label={TAREAS_STATS.bloqueadas} variant="danger" showBorder accentColor={TAREAS_STATS_COLORS.bloqueadas} icon={<Ban className="h-5 w-5" />} />
              <MiniStat value={stats.overdue} label={TAREAS_STATS.overdue} variant="danger" showBorder accentColor={TAREAS_STATS_COLORS.overdue} icon={<AlertTriangle className="h-5 w-5" />} />
            </StatGrid>

            {/* View Selector */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg border border-border/50">
                <button
                  onClick={() => setView('kanban')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    _view === 'kanban'
                      ? 'bg-background shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Kanban
                </button>
                <button
                  onClick={() => setView('lista')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    _view === 'lista'
                      ? 'bg-background shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="h-4 w-4" />
                  Lista
                </button>
                <button
                  onClick={() => setView('gantt')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    _view === 'gantt'
                      ? 'bg-background shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <GanttChart className="h-4 w-4" />
                  Gantt
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {visibleTareas.length} tareas
              </span>
            </div>

            {_view === 'kanban' && (
              <div className="-mx-6 px-6 overflow-x-auto custom-scrollbar">
                <div className="grid grid-cols-4 gap-6 min-w-[1200px] pb-6">
                  {ESTADOS.map(estado => (
                    <div key={estado} className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            estado === 'Pendiente' && "bg-slate-400",
                            estado === 'En progreso' && "bg-blue-500",
                            estado === 'Completada' && "bg-emerald-500",
                            estado === 'Bloqueada' && "bg-rose-500"
                          )} />
                          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">{estado}</h3>
                        </div>
                        <Badge variant="outline" className="bg-background/50 border-border/50 text-[10px] h-5">{tareasPorEstado[estado]?.length || 0}</Badge>
                      </div>
                      <div className="space-y-3 min-h-[500px] bg-muted/10 rounded-2xl p-2 border border-border/5 border-dashed">
                        {tareasPorEstado[estado]?.map(tarea => {
                          return (
                            <KanbanCard
                              key={tarea.id}
                              title={tarea.nombre}
                              subtitle={tarea.proyecto_nombre}
                              indicatorColor={ESTADO_COLORS[tarea.estado] || ESTADO_COLORS['Pendiente']}
                              badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                              dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                              assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                              onClick={() => setSelectedId(tarea.id)}
                            />
                          )
                        })}
                        {tareasPorEstado[estado]?.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-32 opacity-20 italic text-xs text-center border border-dashed border-border/20 rounded-xl">
                            Sin tareas {estado.toLowerCase()}s
                          </div>
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

            {_view === 'gantt' && (
              <div className="h-[600px]">
                <TaskGanttChart tasks={visibleTareas} />
              </div>
            )}
          </>
        )}
      </ModuleContainerWithPanel>

      <CreateTaskModal
        open={showCreate}
        onOpenChange={setShowCreate}
        proyectos={proyectos}
        usuarios={transformUsuarios(usuarios)}
        currentUser={{ id: user?.id || '1', nombre: user?.nombre || 'Usuario' }}
        onSave={handleSaveTarea}
        onCreateProject={() => setShowNewProject(true)}
      />

      <CreateTaskModal
        open={showEdit}
        onOpenChange={setShowEdit}
        proyectos={proyectos}
        usuarios={transformUsuarios(usuarios)}
        currentUser={{ id: user?.id || '1', nombre: user?.nombre || 'Usuario' }}
        tarea={editingTarea}
        subtareas={editingTarea ? subtareasRecord[editingTarea.id] || [] : []}
        comentarios={editingTarea ? comentariosRecord[editingTarea.id] || [] : []}
        onSave={handleSaveTarea}
        onDelete={handleDeleteTarea}
      />

      {/* Modal para crear nuevo proyecto */}
      <CreateProjectModal
        open={showNewProject}
        onOpenChange={setShowNewProject}
        onSave={async (p) => {
          const now = new Date().toISOString()
          const newP = { ...p, id: uuidv4(), creado_en: now } as import('@/types/proyectos').Proyecto
          setProyectos(prev => [...prev, newP])
        }}
        empresas={empresas}
        usuarios={usuarios}
        proyectos={proyectos}
      />
    </>
  )
}
