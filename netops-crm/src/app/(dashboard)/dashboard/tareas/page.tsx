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
import { CheckSquare, X, Plus, Filter, Calendar, User, AlertCircle, MessageSquare, ChevronRight, GripVertical, FileText, Clock, Loader2, CheckCircle, Ban, AlertTriangle } from 'lucide-react'
import { Tarea, Subtarea, Comentario, CATEGORIAS, PRIORIDADES, ESTADOS, EstadoTarea, CategoriaTarea, PrioridadTarea } from '@/types/tareas'
import { StatusBadge, ModuleCard, TaskDetailPanel } from '@/components/module'
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

  return (
    <ModuleCard onClick={onClick} className="cursor-pointer">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{tarea.nombre}</h4>
            <p className="text-xs text-muted-foreground truncate">{tarea.proyecto_nombre}</p>
          </div>
          <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={tarea.categoria} type="categoria" />
          <StatusBadge status={tarea.prioridad} type="prioridad" />
        </div>

        {tarea.fecha_vencimiento && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-muted-foreground'}`}>
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

        {tarea.dependencias && tarea.dependencias.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <AlertCircle className="h-3 w-3" />
            <span>Bloqueada</span>
          </div>
        )}

        {tarea.estado !== 'Completada' && (
          <div className="flex gap-1 pt-2 border-t">
            {ESTADOS.filter(e => e !== tarea.estado).slice(0, 2).map(estado => (
              <Button key={estado} variant="ghost" size="sm" className="h-6 text-xs flex-1" onClick={(e) => { e.stopPropagation(); onStatusChange(tarea.id, estado) }}>
                {estado === 'En progreso' ? '▶' : estado === 'Completada' ? '✓' : '⏸'}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </ModuleCard>
  )
}



function CreateTaskModal({ proyectos, usuarios, onClose, onCreate }: {
  proyectos: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  onClose: () => void
  onCreate: (tarea: Omit<Tarea, 'id' | 'fecha_creacion' | 'orden' | 'creado_por'>) => void
}) {
  const [tarea, setTarea] = useState({
    proyecto_id: '',
    categoria: 'General' as CategoriaTarea,
    nombre: '',
    descripcion: '',
    responsable_id: '',
    asignado_a_cliente: false,
    contacto_cliente_nombre: '',
    fecha_vencimiento: '',
    prioridad: 'Media' as PrioridadTarea,
    estado: 'Pendiente' as EstadoTarea,
  })

  const selectedProyecto = proyectos.find(p => p.id === tarea.proyecto_id)

  const handleCreate = () => {
    if (!tarea.nombre || !tarea.proyecto_id) return
    onCreate({
      ...tarea,
      proyecto_nombre: selectedProyecto?.nombre || '',
      fase_origen: selectedProyecto?.fase_actual || 1,
      fase_nombre: selectedProyecto ? ['Prospecto', 'Diagnóstico', 'Propuesta', 'Implementación', 'Cierre'][selectedProyecto.fase_actual - 1] : 'Prospecto',
      responsable_nombre: usuarios.find(u => u.id === tarea.responsable_id)?.nombre,
    })
    onClose()
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Nueva Tarea</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Proyecto *</Label>
            <Select value={tarea.proyecto_id} onValueChange={(v) => setTarea({ ...tarea, proyecto_id: v })}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar proyecto..." /></SelectTrigger>
              <SelectContent>
                {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nombre *</Label>
            <Input value={tarea.nombre} onChange={(e) => setTarea({ ...tarea, nombre: e.target.value })} placeholder="Nombre de la tarea" />
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea value={tarea.descripcion} onChange={(e) => setTarea({ ...tarea, descripcion: e.target.value })} placeholder="Descripción opcional" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoría</Label>
              <Select value={tarea.categoria} onValueChange={(v) => setTarea({ ...tarea, categoria: v as CategoriaTarea })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridad</Label>
              <Select value={tarea.prioridad} onValueChange={(v) => setTarea({ ...tarea, prioridad: v as PrioridadTarea })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORIDADES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Responsable</Label>
              <Select value={tarea.responsable_id} onValueChange={(v) => setTarea({ ...tarea, responsable_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha Vencimiento</Label>
              <Input type="date" value={tarea.fecha_vencimiento} onChange={(e) => setTarea({ ...tarea, fecha_vencimiento: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="asignado_cliente" checked={tarea.asignado_a_cliente} onChange={(e) => setTarea({ ...tarea, asignado_a_cliente: e.target.checked })} className="rounded" />
            <Label htmlFor="asignado_cliente" className="text-sm">Asignar a cliente</Label>
          </div>

          {tarea.asignado_a_cliente && (
            <div>
              <Label>Nombre del contacto cliente</Label>
              <Input value={tarea.contacto_cliente_nombre} onChange={(e) => setTarea({ ...tarea, contacto_cliente_nombre: e.target.value })} placeholder="Nombre del contacto" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={!tarea.nombre || !tarea.proyecto_id}>Crear Tarea</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TareasPage() {
  const { user } = useAuth()
  const [tareas, setTareas] = useState<Tarea[]>(DEMO_TAREAS)
  const [subtareas, setSubtareas] = useState<Record<string, Subtarea[]>>(DEMO_SUBTAREAS)
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>(DEMO_COMENTARIOS)
  const [view, setView] = useState<'kanban' | 'lista'>('kanban')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas')
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isTecnico = user?.roles.includes('tecnico')
  const isCompras = user?.roles.includes('compras')
  const canCreate = isAdmin || isComercial || isTecnico || isCompras

  const filteredTareas = useMemo(() => {
    return tareas.filter(t => {
      if (filtroCategoria !== 'todas' && t.categoria !== filtroCategoria) return false
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false
      return true
    })
  }, [tareas, filtroCategoria, filtroPrioridad])

  const tareasPorEstado = useMemo(() => {
    const r: Record<EstadoTarea, Tarea[]> = { 'Pendiente': [], 'En progreso': [], 'Completada': [], 'Bloqueada': [] }
    filteredTareas.forEach(t => { if (r[t.estado]) r[t.estado].push(t) })
    return r
  }, [filteredTareas])

  const stats = useMemo(() => ({
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'Pendiente').length,
    enProgreso: tareas.filter(t => t.estado === 'En progreso').length,
    completadas: tareas.filter(t => t.estado === 'Completada').length,
    bloqueadas: tareas.filter(t => t.estado === 'Bloqueada').length,
    overdue: tareas.filter(t => t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date() && t.estado !== 'Completada').length,
  }), [tareas])

  const handleStatusChange = (id: string, estado: EstadoTarea) => {
    setTareas(prev => prev.map(t => t.id === id ? {
      ...t,
      estado,
      fecha_completado: estado === 'Completada' ? new Date().toISOString() : undefined
    } : t))
  }

  const handleCreateTarea = (tarea: Omit<Tarea, 'id' | 'fecha_creacion' | 'orden' | 'creado_por'>) => {
    const newTarea: Tarea = {
      ...tarea,
      id: Date.now().toString(),
      fecha_creacion: new Date().toISOString(),
      orden: tareas.length + 1,
      creado_por: user?.id || '1',
    }
    setTareas(prev => [...prev, newTarea])
    setSubtareas(prev => ({ ...prev, [newTarea.id]: [] }))
    setComentarios(prev => ({ ...prev, [newTarea.id]: [] }))
  }

  const handleUpdateTarea = (updated: Tarea) => {
    setTareas(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedTarea(updated)
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

  if (!isAdmin && !isComercial && !isTecnico && !isCompras) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Card className="max-w-md"><CardContent className="p-8 text-center"><CheckSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" /><h2 className="text-xl font-semibold">Acceso Restringido</h2></CardContent></Card></div>
  }

  return (
    <div className="flex relative w-full h-full min-h-screen overflow-hidden">
      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="space-y-6 w-full px-6">
          <div className="flex items-center justify-between">
            <div><h1 className="text-3xl font-bold">Tareas</h1><p className="text-muted-foreground">Gestión de tareas por proyecto</p></div>
            <div className="flex gap-2">
              <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'lista')}>
                <TabsList><TabsTrigger value="kanban">Kanban</TabsTrigger><TabsTrigger value="lista">Lista</TabsTrigger></TabsList>
              </Tabs>
              {canCreate && <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-2" /> Nueva Tarea</Button>}
            </div>
          </div>

          <StatGrid cols={6}>
            <MiniStat value={stats.total} label="Total" variant="primary" showBorder accentColor="#06b6d4" icon={<FileText className="h-5 w-5" />} />
            <MiniStat value={stats.pendientes} label="Pendientes" variant="warning" showBorder accentColor="#f59e0b" icon={<Clock className="h-5 w-5" />} />
            <MiniStat value={stats.enProgreso} label="En Progreso" variant="info" showBorder accentColor="#3b82f6" icon={<Loader2 className="h-5 w-5" />} />
            <MiniStat value={stats.completadas} label="Completadas" variant="success" showBorder accentColor="#10b981" icon={<CheckCircle className="h-5 w-5" />} />
            <MiniStat value={stats.bloqueadas} label="Bloqueadas" variant="danger" showBorder accentColor="#ef4444" icon={<Ban className="h-5 w-5" />} />
            <MiniStat value={stats.overdue} label="Vencidas" variant="danger" showBorder accentColor="#dc2626" icon={<AlertTriangle className="h-5 w-5" />} />
          </StatGrid>

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
              <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Prioridad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las prioridades</SelectItem>
                {PRIORIDADES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
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
                        <TaskCard key={tarea.id} tarea={tarea} onClick={() => setSelectedTarea(tarea)} onStatusChange={handleStatusChange} />
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
              {filteredTareas.map(tarea => (
                <Card key={tarea.id} className="cursor-pointer hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5" onClick={() => setSelectedTarea(tarea)}>
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

          {showCreate && (
            <CreateTaskModal
              proyectos={DEMO_PROYECTOS}
              usuarios={DEMO_USUARIOS}
              onClose={() => setShowCreate(false)}
              onCreate={handleCreateTarea}
            />
          )}
        </div>
      </div>

      {/* Panel lateral integrado */}
      <div
        className={`transition-all duration-500 ease-out overflow-hidden border-l border-border/50 h-full rounded-l-xl ${selectedTarea ? 'w-[400px]' : 'w-0'}`}
      >
        {selectedTarea && (
          <TaskDetailPanel
            isOpen={!!selectedTarea}
            onClose={() => setSelectedTarea(null)}
            tarea={selectedTarea}
            proyectos={DEMO_PROYECTOS}
            usuarios={DEMO_USUARIOS}
            subtareas={subtareas[selectedTarea.id] || []}
            comentarios={comentarios[selectedTarea.id] || []}
            onUpdate={handleUpdateTarea}
            onAddSubtarea={(nombre) => handleAddSubtarea(selectedTarea.id, nombre)}
            onToggleSubtarea={(id) => handleToggleSubtarea(selectedTarea.id, id)}
            onAddComentario={(texto) => handleAddComentario(selectedTarea.id, texto)}
          />
        )}
      </div>
    </div>
  )
}
