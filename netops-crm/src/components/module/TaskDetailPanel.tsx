"use client"

import { useState } from 'react'
import { CheckSquare, Calendar, User, AlertCircle, CheckCircle2, Circle, Clock, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ActivityFeed } from '@/components/ui/activity-feed'
import { SubtaskList } from '@/components/ui/subtask-list'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  proyectos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  usuarios,
  subtareas,
  comentarios,
  onUpdate,
  onAddSubtarea,
  onToggleSubtarea,
  onAddComentario,
  onEdit,
}: TaskDetailPanelProps) {
  const [_editMode, setEditMode] = useState(false)
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

  const handleAddComentario = (comment: string) => {
    onAddComentario(comment)
  }

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getEstadoClase = (estado: EstadoTarea) => {
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
      variant="task"
    >
      {/* Header */}
      <SidePanelHeader
        variant="task"
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
        <SidePanelSection>
          <SubtaskList
            subtareas={subtareas}
            onAdd={onAddSubtarea}
            onToggle={(id) => onToggleSubtarea(String(id))}
            placeholder="Nueva subtarea..."
            title="Subtareas"
            showProgress={true}
          />
        </SidePanelSection>

        {/* Comentarios */}
        <SidePanelSection>
          <ActivityFeed
            comments={comentarios}
            onAddComment={handleAddComentario}
            placeholder="Nuevo comentario..."
            submitLabel="Agregar"
            showDate={false}
          />
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
