"use client"

import { useState, useEffect, useRef } from 'react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SubtaskList } from '@/components/ui/subtask-list'
import { CommentInput } from '@/components/ui/comment-input'
import { DependenciesSelector } from '@/components/ui/dependencies-selector'
import { Trash2, PlusCircle, User, Users } from 'lucide-react'
import { Tarea, Subtarea, Comentario, CategoriaTarea, PrioridadTarea, EstadoTarea, CATEGORIAS, PRIORIDADES, ESTADOS, Dependencia } from '@/types/tareas'
import { Proyecto } from '@/types/proyectos'
import { Contacto } from '@/types/crm'
import { useContactos } from '@/hooks/useContactos'
import { ModalVariant } from '@/constants/modales'
import { cn } from '@/lib/utils'

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyectos: Proyecto[]
  setProyectos?: React.Dispatch<React.SetStateAction<Proyecto[]>>
  usuarios: { id: string; nombre: string; rol: string }[]
  currentUser: { id: string; nombre: string }
  tarea?: Tarea | null
  subtareas?: Subtarea[]
  comentarios?: Comentario[]
  onSave: (data: CreateTaskData) => void
  onDelete?: () => void
  onCreateProject?: () => void
}

export interface CreateTaskData {
  mode: 'create' | 'edit'
  tarea: Omit<Tarea, 'id' | 'fecha_creacion'>
  subtareas?: { id?: string; nombre: string; completada?: boolean }[]
  comentarios?: { id?: string; comentario: string; usuario_id: string; usuario_nombre: string; es_cliente: boolean }[]
  dependencias?: Dependencia[]
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

function TaskFormFields({
  tarea,
  setTarea,
  proyectos,
  usuarios,
  contactos,
  disabled
}: {
  tarea: Omit<Tarea, 'id' | 'fecha_creacion'>
  setTarea: React.Dispatch<React.SetStateAction<Omit<Tarea, 'id' | 'fecha_creacion'>>>
  proyectos: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  contactos: Contacto[]
  disabled?: boolean
}) {
  const currentProyecto = proyectos.find(p => p.id === tarea.proyecto_id)
  const proyectoContactos = contactos.filter(c => c.empresa_id === currentProyecto?.empresa_id)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proyecto *</Label>
          <Select value={tarea.proyecto_id} onValueChange={(v) => {
            const proyecto = proyectos.find(p => p.id === v)
            setTarea({
              ...tarea,
              proyecto_id: v,
              proyecto_nombre: proyecto?.nombre || '',
              fase_origen: proyecto?.fase_actual || 1,
              fase_nombre: proyecto ? ['Prospecto', 'Diagnóstico', 'Propuesta', 'Implementación', 'Cierre'][proyecto.fase_actual - 1] : 'Prospecto',
              contacto_cliente_id: '',
              contacto_cliente_nombre: ''
            })
          }} disabled={disabled}>
            <SelectTrigger className="bg-input/50 border-border/50 focus:ring-primary/20 transition-all">
              <SelectValue placeholder="Seleccionar proyecto..." />
            </SelectTrigger>
            <SelectContent>
              {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría *</Label>
          <Select value={tarea.categoria} onValueChange={(v) => setTarea({ ...tarea, categoria: v as CategoriaTarea })} disabled={disabled}>
            <SelectTrigger className="bg-input/50 border-border/50 focus:ring-primary/20 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map(c => (
                <SelectItem key={c} value={c}>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      c === 'Técnica' && "bg-blue-500",
                      c === 'Comercial' && "bg-green-500",
                      c === 'Compras' && "bg-amber-500",
                      c === 'Administrativa' && "bg-purple-500",
                      c === 'General' && "bg-slate-400"
                    )} />
                    {c}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre de la Tarea *</Label>
        <Input
          value={tarea.nombre}
          onChange={(e) => setTarea({ ...tarea, nombre: e.target.value })}
          placeholder="Ej: Configurar Firewall Fortinet"
          className="bg-input/50 border-border/50 focus:ring-primary/20 transition-all"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</Label>
        <Textarea
          value={tarea.descripcion || ''}
          onChange={(e) => setTarea({ ...tarea, descripcion: e.target.value })}
          placeholder="Detalla los pasos o requerimientos de la tarea..."
          rows={3}
          className="bg-input/50 border-border/50 focus:ring-primary/20 transition-all resize-none"
          disabled={disabled}
        />
      </div>

      <div className="bg-muted/30 p-4 rounded-xl space-y-4 border border-border/50">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Asignación
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="assign-internal" 
                name="assign-type" 
                checked={!tarea.asignado_a_cliente}
                onChange={() => setTarea({ ...tarea, asignado_a_cliente: false, contacto_cliente_id: '', contacto_cliente_nombre: '' })}
                className="w-4 h-4 accent-primary"
              />
              <Label htmlFor="assign-internal" className="text-xs font-medium cursor-pointer">Interno</Label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="assign-client" 
                name="assign-type" 
                checked={tarea.asignado_a_cliente}
                onChange={() => setTarea({ ...tarea, asignado_a_cliente: true, responsable_id: '', responsable_nombre: '' })}
                className="w-4 h-4 accent-primary"
              />
              <Label htmlFor="assign-client" className="text-xs font-medium cursor-pointer">Cliente</Label>
            </div>
          </div>
        </div>

        {!tarea.asignado_a_cliente ? (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Responsable Interno</Label>
            <Select value={tarea.responsable_id || ''} onValueChange={(v) => setTarea({ ...tarea, responsable_id: v, responsable_nombre: usuarios.find(u => u.id === v)?.nombre })} disabled={disabled}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder="Seleccionar responsable..." />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map(u => (
                  <SelectItem key={u.id} value={u.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {u.nombre} <span className="text-[10px] opacity-60 uppercase">({u.rol})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Contacto Cliente</Label>
            <Select 
              value={tarea.contacto_cliente_id || ''} 
              onValueChange={(v) => setTarea({ ...tarea, contacto_cliente_id: v, contacto_cliente_nombre: contactos.find(c => c.id === v)?.nombre })} 
              disabled={disabled || !tarea.proyecto_id}
            >
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder={tarea.proyecto_id ? "Seleccionar contacto..." : "Selecciona un proyecto primero"} />
              </SelectTrigger>
              <SelectContent>
                {proyectoContactos.length > 0 ? (
                  proyectoContactos.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        {c.nombre} <span className="text-[10px] opacity-60 uppercase">({c.tipo_contacto})</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-xs text-center text-muted-foreground">No hay contactos para este proyecto</div>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prioridad</Label>
          <Select value={tarea.prioridad} onValueChange={(v) => setTarea({ ...tarea, prioridad: v as PrioridadTarea })} disabled={disabled}>
            <SelectTrigger className="bg-input/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORIDADES.map(p => (
                <SelectItem key={p} value={p}>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      p === 'Baja' && "bg-slate-400",
                      p === 'Media' && "bg-blue-400",
                      p === 'Alta' && "bg-orange-500",
                      p === 'Urgente' && "bg-red-600 animate-pulse"
                    )} />
                    {p}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencimiento</Label>
          <Input
            type="date"
            className="bg-input/50 border-border/50"
            value={tarea.fecha_vencimiento || ''}
            onChange={(e) => setTarea({ ...tarea, fecha_vencimiento: e.target.value })}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

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
  onDelete,
  onCreateProject
}: CreateTaskModalProps) {
  const isEditMode = !!tarea
  const [allContactos] = useContactos()

  const [tareaData, setTareaData] = useState<Omit<Tarea, 'id' | 'fecha_creacion'>>({
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
    contacto_cliente_id: '',
    contacto_cliente_nombre: '',
    fecha_vencimiento: '',
    prioridad: 'Media',
    estado: 'Pendiente',
    orden: 0,
    creado_por: '',
  })

  const [subtareas, setSubtareas] = useState<{ id?: string; nombre: string; completada?: boolean }[]>([])
  const [comentarios, setComentarios] = useState<{ id?: string; comentario: string; usuario_nombre?: string }[]>([])
  const [dependencias, setDependencias] = useState<Dependencia[]>([])
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!open) {
      initializedRef.current = false
      return
    }

    if (initializedRef.current) return
    initializedRef.current = true

    if (tarea && tarea.id) {
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
        contacto_cliente_id: tarea.contacto_cliente_id || '',
        contacto_cliente_nombre: tarea.contacto_cliente_nombre || '',
        fecha_vencimiento: tarea.fecha_vencimiento || '',
        prioridad: tarea.prioridad,
        estado: tarea.estado,
        orden: tarea.orden,
        creado_por: tarea.creado_por,
      })
      setSubtareas(existingSubtareas.map(s => ({ id: s.id, nombre: s.nombre, completada: s.completada })))
      setComentarios(existingComentarios.map(c => ({ id: c.id, comentario: c.comentario, usuario_nombre: c.usuario_nombre })))
      setDependencias(tarea.dependencias || [])
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
        contacto_cliente_id: '',
        contacto_cliente_nombre: '',
        fecha_vencimiento: '',
        prioridad: 'Media',
        estado: 'Pendiente',
        orden: 0,
        creado_por: '',
      })
      setSubtareas([])
      setComentarios([])
      setDependencias([])
    }
  }, [open, tarea, existingSubtareas, existingComentarios])

  const handleSave = () => {
    if (!tareaData.nombre || !tareaData.proyecto_id) return

    const data: CreateTaskData = {
      mode: isEditMode ? 'edit' : 'create',
      tarea: {
        ...tareaData,
        dependencias: dependencias.length > 0 ? dependencias : undefined,
      },
      subtareas: subtareas.length > 0 ? subtareas : undefined,
      comentarios: comentarios.length > 0 ? comentarios.map(c => ({
        comentario: c.comentario,
        usuario_id: currentUser.id,
        usuario_nombre: c.usuario_nombre || currentUser.nombre,
        es_cliente: false
      })) : undefined,
    }

    onSave(data)
    onOpenChange(false)
  }

  const handleAddSubtask = (nombre: string) => {
    setSubtareas([...subtareas, { nombre, completada: false }])
  }

  const handleRemoveSubtask = (id: string | number) => {
    const index = typeof id === 'string' ? parseInt(id, 10) : id
    setSubtareas(subtareas.filter((_, i) => i !== index))
  }

  const handleToggleSubtask = (id: string | number) => {
    const index = typeof id === 'string' ? parseInt(id, 10) : id
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

  const variant: ModalVariant = isEditMode ? 'edit' : 'create'

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      variant={variant}
      showAccentBar
    >
      <ModalHeader
        title={isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
        variant={variant}
        showIcon
      />

      <ModalBody>
        {!hasProyectos ? (
          <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
            <PlusCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No hay proyectos disponibles.</p>
            <p className="text-sm text-muted-foreground mb-6">Debes crear al menos un proyecto antes de asignar tareas.</p>
            {onCreateProject && (
              <Button
                onClick={() => {
                  onOpenChange(false)
                  onCreateProject()
                }}
                className="shadow-lg shadow-primary/20"
              >
                Crear Primer Proyecto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <TaskFormFields
                tarea={tareaData}
                setTarea={setTareaData}
                proyectos={proyectos}
                usuarios={usuarios}
                contactos={allContactos || []}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-8 lg:border-l lg:pl-8 border-border/50">
              <div className="space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> Seguimiento & Subtareas
                </Label>
                <SubtaskList
                  subtareas={subtareas}
                  onAdd={handleAddSubtask}
                  onToggle={handleToggleSubtask}
                  onDelete={handleRemoveSubtask}
                  placeholder="Ej: Revisar backup inicial..."
                  title="Checklist"
                  showProgress={true}
                  maxHeight="max-h-[250px]"
                />
              </div>

              {/* Sección de Dependencias - visible solo si hay proyecto seleccionado */}
              {tareaData.proyecto_id && (
                <div className="space-y-4">
                  <DependenciesSelector
                    proyectoId={tareaData.proyecto_id}
                    tareaActualId={tarea?.id}
                    dependencies={dependencias}
                    onChange={setDependencias}
                  />
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> Comentarios
                </Label>
                <CommentInput
                  comments={comentarios}
                  onAdd={handleAddComment}
                  onRemove={handleRemoveComment}
                  currentUserName={currentUser.nombre}
                />
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter variant={variant} layout="inline-between">
        <div className="flex-1">
          {isEditMode && onDelete && (
            <Button variant="ghost" onClick={onDelete} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Eliminar Tarea
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!canSave} className="min-w-[120px]">
            {isEditMode ? 'Guardar Cambios' : 'Crear Tarea'}
          </Button>
        </div>
      </ModalFooter>
    </BaseModal>
  )
}
