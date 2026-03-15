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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckSquare, X, Plus, Filter, Calendar, User, AlertCircle, MessageSquare, ChevronRight, GripVertical, FileText, Clock, Loader2, CheckCircle, Ban, AlertTriangle } from 'lucide-react'
import { Tarea, Subtarea, Comentario, CATEGORIAS, PRIORIDADES, ESTADOS, EstadoTarea, CategoriaTarea, PrioridadTarea } from '@/types/tareas'
import { StatusBadge, ModuleCard, TaskDetailPanel, ModuleContainerWithPanel, ModuleHeader, CreateTaskModal } from '@/components/module'
import type { CreateTaskData } from '@/components/module/CreateTaskModal'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { Proyecto } from '@/types/proyectos'

const DEMO_PROYECTOS: Proyecto[] = [
  { id: '1', empresa_id: '1', nombre: 'Implementación Firewall Corp', fase_actual: 4, estado: 'activo', fecha_inicio: '2026-01-15', fecha_estimada_fin: '2026-04-15', moneda: 'USD', monto_estimado: 25000, probabilidad_cierre: 90, responsable_id: '1', responsable_nombre: 'Carlos Admin', contacto_tecnico_id: '1', contacto_tecnico_nombre: 'Juan Pérez', tags: ['seguridad'], requiere_compras: true, creado_en: '2026-01-15', cliente_nombre: 'Soluciones Tecnológicas SA' },
  { id: '2', empresa_id: '2', nombre: 'Migración Cloud Tech', fase_actual: 2, estado: 'activo', fecha_inicio: '2026-02-01', fecha_estimada_fin: '2026-06-01', moneda: 'USD', monto_estimado: 45000, probabilidad_cierre: 40, responsable_id: '2', responsable_nombre: 'Laura Pérez', contacto_tecnico_id: '4', tags: ['cloud'], requiere_compras: false, creado_en: '2026-02-01', cliente_nombre: 'Hospital Regional Norte' },
  { id: '3', empresa_id: '3', nombre: 'Auditoría Seguridad Tech', fase_actual: 5, estado: 'activo', fecha_inicio: '2026-01-01', fecha_estimada_fin: '2026-03-01', moneda: 'USD', monto_estimado: 12000, probabilidad_cierre: 100, responsable_id: '1', responsable_nombre: 'Carlos Admin', contacto_tecnico_id: '5', tags: ['auditoría'], requiere_compras: false, creado_en: '2026-01-01', cliente_nombre: 'TechCorp International' },
  { id: '4', empresa_id: '4', nombre: 'Upgrade Switches Retail', fase_actual: 4, estado: 'activo', fecha_inicio: '2026-03-01', fecha_estimada_fin: '2026-05-15', moneda: 'USD', monto_estimado: 35000, probabilidad_cierre: 90, responsable_id: '3', responsable_nombre: 'Juan Técnico', contacto_tecnico_id: '1', tags: ['infra'], requiere_compras: true, creado_en: '2026-03-01', cliente_nombre: 'RetailMax' },
]

const DEMO_TAREAS: Tarea[] = [
  { id: '1', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Técnica', nombre: 'Configurar reglas de firewall', descripcion: 'Crear reglas de firewall para permitir tráfico HTTPS y SSH', responsable_id: '3', responsable_nombre: 'Juan Técnico', asignado_a_cliente: false, fecha_creacion: '2026-03-01', fecha_vencimiento: '2026-03-10', prioridad: 'Alta', estado: 'En progreso', orden: 1, creado_por: '1' },
  { id: '2', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Comercial', nombre: 'Revisar propuesta económica', descripcion: 'Verificar que los costos合匹配 el alcance', responsable_id: '2', responsable_nombre: 'Laura Pérez', asignado_a_cliente: false, fecha_creacion: '2026-03-02', fecha_vencimiento: '2026-03-08', prioridad: 'Media', estado: 'Pendiente', orden: 2, creado_por: '1' },
  { id: '3', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', fase_origen: 2, fase_nombre: 'Diagnóstico', categoria: 'Técnica', nombre: 'Documentar infraestructura actual', responsable_id: '3', responsable_nombre: 'Juan Técnico', asignado_a_cliente: false, fecha_creacion: '2026-03-01', prioridad: 'Baja', estado: 'Completada', orden: 3, creado_por: '2' },
  { id: '4', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', fase_origen: 2, fase_nombre: 'Diagnóstico', categoria: 'Compras', nombre: 'Solicitar cotización de servidores', responsable_id: '4', responsable_nombre: 'María Compras', asignado_a_cliente: false, fecha_creacion: '2026-03-03', fecha_vencimiento: '2026-03-15', prioridad: 'Alta', estado: 'Bloqueada', orden: 4, dependencias: [{ tarea_id: '3', tipo: 'bloqueante' }], creado_por: '2' },
  { id: '5', proyecto_id: '4', proyecto_nombre: 'Upgrade Switches Retail', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Administrativa', nombre: 'Programar ventana de mantenimiento', descripcion: 'Coordinar con el cliente el horario de mantenimiento', responsable_id: '1', responsable_nombre: 'Carlos Admin', asignado_a_cliente: true, contacto_cliente_id: '1', contacto_cliente_nombre: 'Roberto Manager', fecha_creacion: '2026-03-05', fecha_vencimiento: '2026-03-12', prioridad: 'Urgente', estado: 'Pendiente', orden: 5, creado_por: '3' },
  { id: '6', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'General', nombre: 'Capacitación al cliente', descripcion: 'Sesión de capacitación sobre el panel de administración', responsable_id: '3', responsable_nombre: 'Juan Técnico', asignado_a_cliente: false, fecha_creacion: '2026-03-06', prioridad: 'Baja', estado: 'Pendiente', orden: 6, creado_por: '1' },
]

const DEMO_USUARIOS = [
  { id: '1', nombre: 'Carlos Admin', rol: 'admin' },
  { id: '2', nombre: 'Laura Pérez', rol: 'comercial' },
  { id: '3', nombre: 'Juan Técnico', rol: 'tecnico' },
  { id: '4', nombre: 'María Compras', rol: 'compras' },
  { id: '5', nombre: 'Ana Admin', rol: 'admin' },
]

const USUARIOS: { id: string; nombre: string; rol: string }[] = DEMO_USUARIOS

const DEMO_SUBTAREAS: Record<string, Subtarea[]> = {
  '1': [
    { id: 's1', tarea_id: '1', nombre: 'Crear regla para puerto 443', completada: true, orden: 1 },
    { id: 's2', tarea_id: '1', nombre: 'Crear regla para puerto 22', completada: true, orden: 2 },
    { id: 's3', tarea_id: '1', nombre: 'Configurar NAT', completada: false, orden: 3 },
    { id: 's4', tarea_id: '1', nombre: 'Verificar conectividad', completada: false, orden: 4 },
  ],
}

const DEMO_COMENTARIOS: Record<string, Comentario[]> = {
  '1': [
    { id: 'c1', tarea_id: '1', usuario_id: '3', usuario_nombre: 'Juan Técnico', es_cliente: false, comentario: 'Rules created and tested. Ready for next step.', fecha: '2026-03-07T10:30:00' },
    { id: 'c2', tarea_id: '1', usuario_id: '1', usuario_nombre: 'Carlos Admin', es_cliente: false, comentario: 'Excelente progreso. Continúa con el NAT.', fecha: '2026-03-07T14:15:00' },
  ],
  '4': [
    { id: 'c3', tarea_id: '4', usuario_id: '2', usuario_nombre: 'Laura Pérez', es_cliente: false, comentario: 'Esperando documentación para proceder con cotización.', fecha: '2026-03-08T09:00:00' },
  ],
}

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
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
      case 'En progreso':
        return <Clock className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 animate-pulse" />
      case 'Bloqueada':
        return <AlertCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
      default:
        return <Clock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
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
          <div className="flex items-center gap-1 text-xs text-amber-400">
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
  const [tareas, setTareas] = useState<Tarea[]>(DEMO_TAREAS)
  const [subtareas, setSubtareas] = useState<Record<string, Subtarea[]>>(DEMO_SUBTAREAS)
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>(DEMO_COMENTARIOS)
  const [view, setView] = useState<'kanban' | 'lista'>('kanban')
  const [filtroProyecto, setFiltroProyecto] = useState<string>('todos')
  const [filtroPersona, setFiltroPersona] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas')
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>('')
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>('')
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
      if (filtroProyecto !== 'todos' && t.proyecto_id !== filtroProyecto) return false
      if (filtroPersona !== 'todos' && t.responsable_id !== filtroPersona) return false
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      if (filtroCategoria !== 'todas' && t.categoria !== filtroCategoria) return false
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false
      
      if (filtroFechaDesde && t.fecha_vencimiento && t.fecha_vencimiento < filtroFechaDesde) return false
      if (filtroFechaHasta && t.fecha_vencimiento && t.fecha_vencimiento > filtroFechaHasta) return false
      
      const isOverdue = t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date() && t.estado !== 'Completada'
      if (filtroVencidas && !isOverdue) return false
      
      return true
    })
  }, [tareas, filtroProyecto, filtroPersona, filtroEstado, filtroCategoria, filtroPrioridad, filtroFechaDesde, filtroFechaHasta, filtroVencidas])

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
    visibleTareas.forEach(t => { if (r[t.estado]) r[t.estado].push(t) })
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

  const handleStatusChange = (id: string, estado: EstadoTarea) => {
    setTareas(prev => prev.map(t => t.id === id ? {
      ...t,
      estado,
      fecha_completado: estado === 'Completada' ? new Date().toISOString() : undefined
    } : t))
  }

  const handleSaveTarea = (data: CreateTaskData) => {
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
  }

  const handleDeleteTarea = () => {
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
  }

  const handleUpdateTarea = (updated: Tarea) => {
    setTareas(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedId(updated.id)
  }

  const handleAddSubtarea = (tareaId: string, nombre: string) => {
    const newSubtarea: Subtarea = {
      id: Date.now().toString(),
      tarea_id: tareaId,
      nombre,
      completada: false,
      orden: (subtareas[tareaId]?.length || 0) + 1,
    }
    setSubtareas(prev => ({ ...prev, [tareaId]: [...(prev[tareaId] || []), newSubtarea] }))
  }

  const handleToggleSubtarea = (tareaId: string, subtareaId: string) => {
    setSubtareas(prev => ({
      ...prev,
      [tareaId]: prev[tareaId].map(s => s.id === subtareaId ? { ...s, completada: !s.completada, fecha_completado: !s.completada ? new Date().toISOString() : undefined } : s)
    }))
  }

  const handleAddComentario = (tareaId: string, texto: string) => {
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
  }

  const clearFilters = () => {
    setFiltroProyecto('todos')
    setFiltroPersona('todos')
    setFiltroEstado('todos')
    setFiltroCategoria('todas')
    setFiltroPrioridad('todas')
    setFiltroFechaDesde('')
    setFiltroFechaHasta('')
    setFiltroVencidas(false)
  }

  if (!isAdmin && !isComercial && !isTecnico && !isCompras) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Card className="max-w-md"><CardContent className="p-8 text-center"><CheckSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" /><h2 className="text-xl font-semibold">Acceso Restringido</h2></CardContent></Card></div>
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
              proyectos={DEMO_PROYECTOS}
              usuarios={DEMO_USUARIOS}
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

        <StatGrid cols={6}>
            <MiniStat value={stats.total} label="Total" variant="primary" showBorder accentColor="#06b6d4" icon={<FileText className="h-5 w-5" />} />
            <MiniStat value={stats.pendientes} label="Pendientes" variant="warning" showBorder accentColor="#f59e0b" icon={<Clock className="h-5 w-5" />} />
            <MiniStat value={stats.enProgreso} label="En Progreso" variant="info" showBorder accentColor="#3b82f6" icon={<Loader2 className="h-5 w-5" />} />
            <MiniStat value={stats.completadas} label="Completadas" variant="success" showBorder accentColor="#10b981" icon={<CheckCircle className="h-5 w-5" />} />
            <MiniStat value={stats.bloqueadas} label="Bloqueadas" variant="danger" showBorder accentColor="#ef4444" icon={<Ban className="h-5 w-5" />} />
            <MiniStat value={stats.overdue} label="Vencidas" variant="danger" showBorder accentColor="#dc2626" icon={<AlertTriangle className="h-5 w-5" />} />
          </StatGrid>

          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground mr-1">Filtros:</span>
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground mr-1">Proyecto:</Label>
              <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
                <SelectTrigger className="w-32 h-8 bg-input border-border"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {DEMO_PROYECTOS.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground mr-1">Persona:</Label>
                <Select value={filtroPersona} onValueChange={setFiltroPersona}>
                <SelectTrigger className="w-28 h-8 bg-input border-border"><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    {USUARIOS.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground mr-1">Estado:</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-28 h-8 bg-input border-border"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground mr-1">Categoría:</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-28 h-8 bg-input border-border"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground mr-1">Prioridad:</Label>
              <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                <SelectTrigger className="w-24 h-8 bg-input border-border"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {PRIORIDADES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Desde:</Label>
              <Input 
                type="date" 
                value={filtroFechaDesde} 
                onChange={(e) => setFiltroFechaDesde(e.target.value)} 
                className="w-28 h-8 bg-input border-border"
              />
            </div>
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Hasta:</Label>
              <Input 
                type="date" 
                value={filtroFechaHasta} 
                onChange={(e) => setFiltroFechaHasta(e.target.value)} 
                className="w-28 h-8 bg-input border-border"
              />
            </div>
            
            <label className="flex items-center gap-1.5 cursor-pointer h-8">
              <Checkbox 
                checked={filtroVencidas} 
                onCheckedChange={(checked) => setFiltroVencidas(checked as boolean)}
              />
              <span className="text-xs text-muted-foreground">Vencidas</span>
            </label>
            
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3 mr-1" /> Limpiar
            </Button>
          </div>

          {view === 'kanban' && (
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
                        <div className="text-center py-8 text-muted-foreground text-sm">No hay tareas</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'lista' && (
            <div className="space-y-2">
              {visibleTareas.map(tarea => (
                <Card key={tarea.id} className="cursor-pointer bg-card border-border/50 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30" onClick={() => setSelectedId(tarea.id)}>
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
        proyectos={DEMO_PROYECTOS}
        usuarios={DEMO_USUARIOS}
        currentUser={{ id: user?.id || '1', nombre: user?.nombre || 'Usuario' }}
        onSave={handleSaveTarea}
      />

      <CreateTaskModal
        open={showEdit}
        onOpenChange={setShowEdit}
        proyectos={DEMO_PROYECTOS}
        usuarios={DEMO_USUARIOS}
        currentUser={{ id: user?.id || '1', nombre: user?.nombre || 'Usuario' }}
        tarea={editingTarea}
        subtareas={editingTarea ? subtareas[editingTarea.id] || [] : []}
        comentarios={editingTarea ? comentarios[editingTarea.id] || [] : []}
        onSave={handleSaveTarea}
        onDelete={handleDeleteTarea}
      />
    </>
  )
}
