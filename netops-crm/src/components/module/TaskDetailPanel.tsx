"use client"

import { useState } from 'react'
import { X, Plus, CheckSquare, Calendar, User, AlertCircle, MessageSquare, Target, CheckCircle2, Circle, Clock, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/module/StatusBadge'
import { Tarea, Subtarea, Comentario, CategoriaTarea, PrioridadTarea, EstadoTarea, CATEGORIAS, PRIORIDADES, ESTADOS } from '@/types/tareas'
import { Proyecto } from '@/types/proyectos'

interface TaskDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  tarea: Tarea | null
  proyectos: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  subtareas: Subtarea[]
  comentarios: Comentario[]
  onUpdate: (tarea: Tarea) => void
  onAddSubtarea: (nombre: string) => void
  onToggleSubtarea: (id: string) => void
  onAddComentario: (comentario: string) => void
  onEdit?: () => void
}

export function TaskDetailPanel({
  isOpen,
  onClose,
  tarea,
  proyectos,
  usuarios,
  subtareas,
  comentarios,
  onUpdate,
  onAddSubtarea,
  onToggleSubtarea,
  onAddComentario,
  onEdit,
}: TaskDetailPanelProps) {
  const [newSubtarea, setNewSubtarea] = useState('')
  const [newComentario, setNewComentario] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editedTarea, setEditedTarea] = useState<Tarea | null>(tarea)

  // Update editedTarea when tarea changes
  if (tarea && (!editedTarea || editedTarea.id !== tarea.id)) {
    setEditedTarea(tarea)
    setEditMode(false)
  }

  const handleSave = () => {
    if (editedTarea) {
      onUpdate(editedTarea)
      setEditMode(false)
    }
  }

  const completedSubtareas = subtareas.filter(s => s.completada).length

  // Format fecha
  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Get estado icon
  const getEstadoIcon = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Completada':
        return <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0" />
      case 'En progreso':
        return <Clock className="h-5 w-5 text-[hsl(var(--info))] flex-shrink-0 animate-pulse" />
      case 'Bloqueada':
        return <AlertCircle className="h-5 w-5 text-[hsl(var(--error))] flex-shrink-0" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    }
  }

  // Get estado text class
  const getEstadoClase = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Completada':
        return 'line-through text-muted-foreground'
      case 'En progreso':
        return 'text-[hsl(var(--info))]'
      case 'Bloqueada':
        return 'text-[hsl(var(--error))]'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <>
      {/* Panel lateral */}
      <div className="h-full flex flex-col">
        {/* Header del panel */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {tarea && getEstadoIcon(tarea.estado)}
            <h2 className="font-semibold text-foreground truncate max-w-[200px]">
              {tarea?.nombre || 'Detalles de la Tarea'}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                title="Editar tarea"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          {tarea ? (
            <>
              {/* Tags de estado, categoría y prioridad */}
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={tarea.categoria} type="categoria" />
                <StatusBadge status={tarea.prioridad} type="prioridad" />
                <StatusBadge status={tarea.estado} type="estado" />
              </div>

              {/* Descripción */}
              {tarea.descripcion && (
                <p className="text-sm bg-muted/30 p-3 rounded-lg text-foreground">
                  {tarea.descripcion}
                </p>
              )}

              {/* Modo edición */}
              {editMode && editedTarea ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Nombre</Label>
                    <Input
                      className="bg-input border-border text-foreground"
                      value={editedTarea.nombre}
                      onChange={(e) => setEditedTarea({ ...editedTarea, nombre: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Descripción</Label>
                    <Textarea
                      className="bg-input border-border text-foreground"
                      value={editedTarea.descripcion || ''}
                      onChange={(e) => setEditedTarea({ ...editedTarea, descripcion: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Categoría</Label>
                      <Select value={editedTarea.categoria} onValueChange={(v) => setEditedTarea({ ...editedTarea, categoria: v as CategoriaTarea })}>
                        <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Prioridad</Label>
                      <Select value={editedTarea.prioridad} onValueChange={(v) => setEditedTarea({ ...editedTarea, prioridad: v as PrioridadTarea })}>
                        <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PRIORIDADES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Estado</Label>
                      <Select value={editedTarea.estado} onValueChange={(v) => setEditedTarea({ ...editedTarea, estado: v as EstadoTarea })}>
                        <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Responsable</Label>
                      <Select value={editedTarea.responsable_id || ''} onValueChange={(v) => setEditedTarea({ ...editedTarea, responsable_id: v, responsable_nombre: usuarios.find(u => u.id === v)?.nombre })}>
                        <SelectTrigger className="bg-input border-border text-foreground"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                        <SelectContent>
                          {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Fecha Vencimiento</Label>
                      <Input
                        type="date"
                        className="bg-input border-border text-foreground"
                        value={editedTarea.fecha_vencimiento || ''}
                        onChange={(e) => setEditedTarea({ ...editedTarea, fecha_vencimiento: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Proyecto</Label>
                      <Select value={editedTarea.proyecto_id} onValueChange={(v) => {
                        const p = proyectos.find(pr => pr.id === v)
                        setEditedTarea({ ...editedTarea, proyecto_id: v, proyecto_nombre: p?.nombre || '' })
                      }}>
                        <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">Guardar</Button>
                    <Button variant="outline" onClick={() => setEditMode(false)} className="border-border text-foreground hover:bg-muted">Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Grid de información */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Proyecto */}
                    <div className="bg-muted/40 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Target className="h-3.5 w-3.5" />
                        <span className="text-xs">Proyecto</span>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate block">
                        {tarea.proyecto_nombre}
                      </span>
                    </div>

                    {/* Fase */}
                    <div className="bg-muted/40 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <CheckSquare className="h-3.5 w-3.5" />
                        <span className="text-xs">Fase</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {tarea.fase_nombre}
                      </span>
                    </div>

                    {/* Responsable */}
                    <div className="bg-muted/40 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <User className="h-3.5 w-3.5" />
                        <span className="text-xs">Responsable</span>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate block">
                        {tarea.responsable_nombre || 'Sin asignar'}
                      </span>
                    </div>

                    {/* Fecha Vencimiento */}
                    <div className="bg-muted/40 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs">Vencimiento</span>
                      </div>
                      <span className={`text-sm font-medium ${tarea.fecha_vencimiento && new Date(tarea.fecha_vencimiento) < new Date() && tarea.estado !== 'Completada' ? 'text-[hsl(var(--error))]' : 'text-foreground'}`}>
                        {formatFecha(tarea.fecha_vencimiento)}
                      </span>
                    </div>

                    {/* Fecha Creación */}
                    <div className="bg-muted/40 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">Creado</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {formatFecha(tarea.fecha_creacion)}
                      </span>
                    </div>

                    {/* Prioridad */}
                    <div className="bg-muted/40 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span className="text-xs">Prioridad</span>
                      </div>
                      <StatusBadge status={tarea.prioridad} type="prioridad" />
                    </div>
                  </div>

                  {/* Botón editar */}
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(true)}
                    className="w-full border-border text-foreground hover:bg-muted"
                  >
                    Editar Tarea
                  </Button>
                </>
              )}

              {/* Subtareas */}
              <div className="space-y-3 border-t border-border/50 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    Subtareas
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {completedSubtareas}/{subtareas.length}
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${subtareas.length > 0 ? (completedSubtareas / subtareas.length) * 100 : 0}%` }}
                  />
                </div>

                {/* Lista de subtareas */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {subtareas.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No hay subtareas
                    </div>
                  ) : (
                    subtareas.map(st => (
                      <div
                        key={st.id}
                        className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                        onClick={() => onToggleSubtarea(st.id)}
                      >
                        <Checkbox
                          checked={st.completada}
                          onCheckedChange={() => onToggleSubtarea(st.id)}
                        />
                        <span className={st.completada ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          {st.nombre}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Agregar subtarea */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Nueva subtarea..."
                    value={newSubtarea}
                    onChange={(e) => setNewSubtarea(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSubtarea) {
                        onAddSubtarea(newSubtarea)
                        setNewSubtarea('')
                      }
                    }}
                    className="bg-input border-border text-foreground text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (newSubtarea) {
                        onAddSubtarea(newSubtarea)
                        setNewSubtarea('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comentarios */}
              <div className="space-y-3 border-t border-border/50 pt-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Comentarios
                </h3>

                {/* Lista de comentarios */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {comentarios.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No hay comentarios
                    </div>
                  ) : (
                    comentarios.map(c => (
                      <div key={c.id} className="bg-muted/40 border border-border/30 rounded-lg p-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-foreground">{c.usuario_nombre}</span>
                          <span className="text-muted-foreground">{new Date(c.fecha).toLocaleString('es-ES')}</span>
                        </div>
                        <p className="text-sm text-foreground">{c.comentario}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Agregar comentario */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Nuevo comentario..."
                    value={newComentario}
                    onChange={(e) => setNewComentario(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newComentario) {
                        onAddComentario(newComentario)
                        setNewComentario('')
                      }
                    }}
                    className="bg-input border-border text-foreground text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (newComentario) {
                        onAddComentario(newComentario)
                        setNewComentario('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Target className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">Selecciona una tarea para ver detalles</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
