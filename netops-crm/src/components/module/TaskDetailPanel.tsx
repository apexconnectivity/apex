"use client"

import { useState } from 'react'
import { Plus, CheckSquare, Calendar, User, AlertCircle, MessageSquare, CheckCircle2, Circle, Clock, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/module/StatusBadge'
import { BaseSidePanel, SidePanelHeader, SidePanelContent, SidePanelSection, SidePanelFooter } from '@/components/base'
import { Tarea, Subtarea, Comentario, EstadoTarea } from '@/types/tareas'
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

/**
 * TaskDetailPanel - Panel lateral de detalles de tarea
 * 
 * Usa BaseSidePanel para la estructura y SidePanelHeader/Content/Footer
 * para una arquitectura reutilizable.
 */
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

  const handleAddSubtarea = () => {
    if (newSubtarea.trim()) {
      onAddSubtarea(newSubtarea.trim())
      setNewSubtarea('')
    }
  }

  const handleAddComentario = () => {
    if (newComentario.trim()) {
      onAddComentario(newComentario.trim())
      setNewComentario('')
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
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
      case 'En progreso':
        return <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 animate-pulse" />
      case 'Bloqueada':
        return <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
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
        return 'text-blue-400'
      case 'Bloqueada':
        return 'text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  if (!tarea) return null

  return (
    <BaseSidePanel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      width="w-[400px]"
    >
      {/* Header */}
      <SidePanelHeader
        icon={getEstadoIcon(tarea.estado)}
        title={tarea.nombre}
        subtitle={tarea.proyecto_nombre}
        action={
          onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )
        }
      />

      {/* Contenido */}
      <SidePanelContent>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={tarea.estado} />
          <StatusBadge status={tarea.prioridad} type="prioridad" />
          <StatusBadge status={tarea.categoria} type="categoria" />
        </div>

        {/* Descripción */}
        {tarea.descripcion && (
          <p className="text-sm bg-muted/30 p-3 rounded-lg text-muted-foreground">
            {tarea.descripcion}
          </p>
        )}

        {/* Grid de información */}
        <SidePanelSection>
          <div className="grid grid-cols-2 gap-3">
            {/* Proyecto */}
            <div className="bg-muted/30 rounded-lg p-3 col-span-2">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <CheckSquare className="h-3.5 w-3.5" />
                <span className="text-xs">Proyecto</span>
              </div>
              <span className="text-sm font-medium truncate block">
                {tarea.proyecto_nombre}
              </span>
            </div>

            {/* Estado */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <CheckSquare className="h-3.5 w-3.5" />
                <span className="text-xs">Estado</span>
              </div>
              <select
                value={editedTarea?.estado}
                onChange={(e) => setEditedTarea({ ...editedTarea!, estado: e.target.value as EstadoTarea })}
                className="text-sm font-medium bg-transparent border-none outline-none w-full"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completada">Completada</option>
                <option value="Bloqueada">Bloqueada</option>
              </select>
            </div>

            {/* Prioridad */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs">Prioridad</span>
              </div>
              <span className="text-sm font-medium">{tarea.prioridad}</span>
            </div>

            {/* Responsable */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <User className="h-3.5 w-3.5" />
                <span className="text-xs">Responsable</span>
              </div>
              <span className="text-sm font-medium">{tarea.responsable_nombre || 'Sin asignar'}</span>
            </div>

            {/* Fecha */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Vencimiento</span>
              </div>
              <span className="text-sm font-medium">{formatFecha(tarea.fecha_vencimiento)}</span>
            </div>
          </div>
        </SidePanelSection>

        {/* Subtareas */}
        <SidePanelSection title={`Subtareas (${completedSubtareas}/${subtareas.length})`}>
          <div className="space-y-2">
            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Nueva subtarea..."
                value={newSubtarea}
                onChange={(e) => setNewSubtarea(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubtarea() }}
              />
              <Button size="icon" variant="outline" onClick={handleAddSubtarea} disabled={!newSubtarea.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista */}
            {subtareas.map((st) => (
              <div key={st.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <Checkbox
                  checked={st.completada}
                  onCheckedChange={() => onToggleSubtarea(st.id)}
                />
                <span className={`text-sm flex-1 ${st.completada ? 'line-through text-muted-foreground' : ''}`}>
                  {st.nombre}
                </span>
              </div>
            ))}
          </div>
        </SidePanelSection>

        {/* Comentarios */}
        <SidePanelSection title={`Comentarios (${comentarios.length})`}>
          <div className="space-y-2">
            {comentarios.map((c) => (
              <div key={c.id} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{c.usuario_nombre}</span>
                </div>
                <p className="text-sm">{c.comentario}</p>
              </div>
            ))}
            
            {/* Input */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Nuevo comentario..."
                value={newComentario}
                onChange={(e) => setNewComentario(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComentario() }}
              />
              <Button size="icon" variant="outline" onClick={handleAddComentario} disabled={!newComentario.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SidePanelSection>
      </SidePanelContent>

      {/* Footer */}
      <SidePanelFooter>
        <Button variant="outline" onClick={() => onClose()}>
          Cerrar
        </Button>
        <Button onClick={handleSave}>
          Guardar Cambios
        </Button>
      </SidePanelFooter>
    </BaseSidePanel>
  )
}
