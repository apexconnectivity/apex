"use client"

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X, Trash2, CheckSquare, MessageSquare } from 'lucide-react'
import { Tarea, Subtarea, Comentario, CategoriaTarea, PrioridadTarea, EstadoTarea, CATEGORIAS, PRIORIDADES, ESTADOS } from '@/types/tareas'
import { Proyecto } from '@/types/proyectos'

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyectos: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  currentUser: { id: string; nombre: string }
  tarea?: Tarea | null
  subtareas?: Subtarea[]
  comentarios?: Comentario[]
  onSave: (data: CreateTaskData) => void
  onDelete?: () => void
}

export interface CreateTaskData {
  mode: 'create' | 'edit'
  tarea: Omit<Tarea, 'id' | 'fecha_creacion' | 'orden' | 'creado_por'>
  subtareas?: { id?: string; nombre: string; completada?: boolean }[]
  comentarios?: { id?: string; comentario: string; usuario_id: string; usuario_nombre: string; es_cliente: boolean }[]
}

function TaskFormFields({
  tarea,
  setTarea,
  proyectos,
  usuarios,
  disabled
}: {
  tarea: Omit<Tarea, 'id' | 'fecha_creacion' | 'orden' | 'creado_por'>
  setTarea: React.Dispatch<React.SetStateAction<Omit<Tarea, 'id' | 'fecha_creacion' | 'orden' | 'creado_por'>>>
  proyectos: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  disabled?: boolean
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Proyecto *</Label>
        <Select value={tarea.proyecto_id} onValueChange={(v) => {
          const proyecto = proyectos.find(p => p.id === v)
          setTarea({ 
            ...tarea, 
            proyecto_id: v, 
            proyecto_nombre: proyecto?.nombre || '', 
            fase_origen: proyecto?.fase_actual || 1, 
            fase_nombre: proyecto ? ['Prospecto', 'Diagnóstico', 'Propuesta', 'Implementación', 'Cierre'][proyecto.fase_actual - 1] : 'Prospecto' 
          })
        }} disabled={disabled}>
          <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Seleccionar proyecto..." /></SelectTrigger>
          <SelectContent>
            {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Nombre *</Label>
        <Input 
          value={tarea.nombre} 
          onChange={(e) => setTarea({ ...tarea, nombre: e.target.value })} 
          placeholder="Nombre de la tarea"
          disabled={disabled}
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea 
          value={tarea.descripcion || ''} 
          onChange={(e) => setTarea({ ...tarea, descripcion: e.target.value })} 
          placeholder="Descripción opcional"
          rows={3}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Categoría</Label>
          <Select value={tarea.categoria} onValueChange={(v) => setTarea({ ...tarea, categoria: v as CategoriaTarea })} disabled={disabled}>
            <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Prioridad</Label>
          <Select value={tarea.prioridad} onValueChange={(v) => setTarea({ ...tarea, prioridad: v as PrioridadTarea })} disabled={disabled}>
            <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORIDADES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Estado</Label>
          <Select value={tarea.estado} onValueChange={(v) => setTarea({ ...tarea, estado: v as EstadoTarea })} disabled={disabled}>
            <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Responsable</Label>
          <Select value={tarea.responsable_id || ''} onValueChange={(v) => setTarea({ ...tarea, responsable_id: v, responsable_nombre: usuarios.find(u => u.id === v)?.nombre })} disabled={disabled}>
            <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Fecha Vencimiento</Label>
        <Input 
          type="date" 
          value={tarea.fecha_vencimiento || ''} 
          onChange={(e) => setTarea({ ...tarea, fecha_vencimiento: e.target.value })} 
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="asignado_cliente" 
          checked={tarea.asignado_a_cliente} 
          onChange={(e) => setTarea({ ...tarea, asignado_a_cliente: e.target.checked })} 
          className="rounded border-border"
          disabled={disabled}
        />
        <Label htmlFor="asignado_cliente" className="text-sm">Asignar a cliente</Label>
      </div>

      {tarea.asignado_a_cliente && (
        <div>
          <Label>Nombre del contacto cliente</Label>
          <Input 
            value={tarea.contacto_cliente_nombre || ''} 
            onChange={(e) => setTarea({ ...tarea, contacto_cliente_nombre: e.target.value })} 
            placeholder="Nombre del contacto"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}

function SubtasksSection({
  subtareas,
  onAdd,
  onRemove,
  onToggle,
  disabled
}: {
  subtareas: { id?: string; nombre: string; completada?: boolean }[]
  onAdd: (nombre: string) => void
  onRemove: (index: number) => void
  onToggle?: (index: number) => void
  disabled?: boolean
}) {
  const [newSubtask, setNewSubtask] = useState('')

  const handleAdd = () => {
    if (newSubtask.trim()) {
      onAdd(newSubtask.trim())
      setNewSubtask('')
    }
  }

  const completed = subtareas.filter(s => s.completada).length

  return (
    <div className="space-y-3 border-t border-border/50 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          Subtareas
        </h3>
        {subtareas.length > 0 && (
          <span className="text-xs text-muted-foreground">{completed}/{subtareas.length}</span>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nueva subtarea..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          disabled={disabled}
        />
        <Button size="icon" variant="outline" onClick={handleAdd} disabled={disabled || !newSubtask.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {subtareas.length > 0 && (
        <div className="space-y-1 max-h-[150px] overflow-y-auto">
          {subtareas.map((st, index) => (
            <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
              {onToggle && (
                <input
                  type="checkbox"
                  checked={st.completada || false}
                  onChange={() => onToggle(index)}
                  className="rounded border-border"
                />
              )}
              <span className={`flex-1 ${st.completada ? 'line-through text-muted-foreground' : ''}`}>
                {st.nombre}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(index)} disabled={disabled}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CommentsSection({
  comentarios,
  onAdd,
  onRemove,
  currentUserName,
  disabled
}: {
  comentarios: { id?: string; nombre?: string; comentario: string; usuario_nombre?: string }[]
  onAdd: (comentario: string) => void
  onRemove: (index: number) => void
  currentUserName: string
  disabled?: boolean
}) {
  const [newComment, setNewComment] = useState('')

  const handleAdd = () => {
    if (newComment.trim()) {
      onAdd(newComment.trim())
      setNewComment('')
    }
  }

  return (
    <div className="space-y-3 border-t border-border/50 pt-4">
      <h3 className="font-medium text-sm flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        Comentarios
      </h3>

      {comentarios.length > 0 && (
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {comentarios.map((c, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{c.usuario_nombre || currentUserName}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onRemove(index)} disabled={disabled}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm">{c.comentario}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Nuevo comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          disabled={disabled}
        />
        <Button size="icon" variant="outline" onClick={handleAdd} disabled={disabled || !newComment.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function CreateTaskModal({
  open,
  onOpenChange,
  proyectos,
  usuarios,
  currentUser,
  tarea,
  subtareas: existingSubtareas = [],
  comentarios: existingComentarios = [],
  onSave,
  onDelete
}: CreateTaskModalProps) {
  const isEditMode = !!tarea

  const [tareaData, setTareaData] = useState<Omit<Tarea, 'id' | 'fecha_creacion' | 'orden' | 'creado_por'>>({
    proyecto_id: '',
    proyecto_nombre: '',
    fase_origen: 1,
    fase_nombre: 'Prospecto',
    categoria: 'General',
    nombre: '',
    descripcion: '',
    responsable_id: '',
    responsable_nombre: '',
    asignado_a_cliente: false,
    contacto_cliente_nombre: '',
    fecha_vencimiento: '',
    prioridad: 'Media',
    estado: 'Pendiente',
  })

  const [subtareas, setSubtareas] = useState<{ id?: string; nombre: string; completada?: boolean }[]>([])
  const [comentarios, setComentarios] = useState<{ id?: string; comentario: string; usuario_nombre?: string }[]>([])
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!open) {
      initializedRef.current = false
      return
    }

    if (initializedRef.current && tarea?.id) {
      return
    }

    initializedRef.current = true

    if (tarea && isEditMode) {
      setTareaData({
        proyecto_id: tarea.proyecto_id,
        proyecto_nombre: tarea.proyecto_nombre,
        fase_origen: tarea.fase_origen,
        fase_nombre: tarea.fase_nombre,
        categoria: tarea.categoria,
        nombre: tarea.nombre,
        descripcion: tarea.descripcion || '',
        responsable_id: tarea.responsable_id || '',
        responsable_nombre: tarea.responsable_nombre || '',
        asignado_a_cliente: tarea.asignado_a_cliente,
        contacto_cliente_nombre: tarea.contacto_cliente_nombre || '',
        fecha_vencimiento: tarea.fecha_vencimiento || '',
        prioridad: tarea.prioridad,
        estado: tarea.estado,
      })
      setSubtareas(existingSubtareas.map(s => ({ id: s.id, nombre: s.nombre, completada: s.completada })))
      setComentarios(existingComentarios.map(c => ({ id: c.id, comentario: c.comentario, usuario_nombre: c.usuario_nombre })))
    } else {
      setTareaData({
        proyecto_id: '',
        proyecto_nombre: '',
        fase_origen: 1,
        fase_nombre: 'Prospecto',
        categoria: 'General',
        nombre: '',
        descripcion: '',
        responsable_id: '',
        responsable_nombre: '',
        asignado_a_cliente: false,
        contacto_cliente_nombre: '',
        fecha_vencimiento: '',
        prioridad: 'Media',
        estado: 'Pendiente',
      })
      setSubtareas([])
      setComentarios([])
    }
  }, [open])

  const handleSave = () => {
    if (!tareaData.nombre || !tareaData.proyecto_id) return

    const data: CreateTaskData = {
      mode: isEditMode ? 'edit' : 'create',
      tarea: tareaData,
      subtareas: subtareas.length > 0 ? subtareas : undefined,
      comentarios: comentarios.length > 0 ? comentarios.map(c => ({
        comentario: c.comentario,
        usuario_id: currentUser.id,
        usuario_nombre: c.usuario_nombre || currentUser.nombre,
        es_cliente: false
      })) : undefined
    }

    onSave(data)
    onOpenChange(false)
  }

  const handleAddSubtask = (nombre: string) => {
    setSubtareas([...subtareas, { nombre, completada: false }])
  }

  const handleRemoveSubtask = (index: number) => {
    setSubtareas(subtareas.filter((_, i) => i !== index))
  }

  const handleToggleSubtask = (index: number) => {
    setSubtareas(subtareas.map((s, i) => i === index ? { ...s, completada: !s.completada } : s))
  }

  const handleAddComment = (comentario: string) => {
    setComentarios([...comentarios, { comentario, usuario_nombre: currentUser.nombre }])
  }

  const handleRemoveComment = (index: number) => {
    setComentarios(comentarios.filter((_, i) => i !== index))
  }

  const hasProyectos = proyectos.length > 0
  const canSave = tareaData.nombre && tareaData.proyecto_id && hasProyectos

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
        </DialogHeader>

        <DialogBody className="overflow-y-auto">
          {!hasProyectos ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">⚠️ No hay proyectos disponibles.</p>
              <p className="text-sm text-muted-foreground">Crea un proyecto primero.</p>
            </div>
          ) : (
            <>
              <TaskFormFields
                tarea={tareaData}
                setTarea={setTareaData}
                proyectos={proyectos}
                usuarios={usuarios}
              />

              <SubtasksSection
                subtareas={subtareas}
                onAdd={handleAddSubtask}
                onRemove={handleRemoveSubtask}
                onToggle={isEditMode ? handleToggleSubtask : undefined}
              />

              <CommentsSection
                comentarios={comentarios}
                onAdd={handleAddComment}
                onRemove={handleRemoveComment}
                currentUserName={currentUser.nombre}
              />
            </>
          )}
        </DialogBody>

        <DialogFooter>
          {isEditMode && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Eliminar
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {isEditMode ? 'Guardar' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
