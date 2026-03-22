"use client"

import { useState, useEffect } from 'react'
import { Calendar, User, AlertCircle, CheckCircle2, Circle, Clock, Pencil, Link2, Users, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ActivityFeed } from '@/components/ui/activity-feed'
import { SubtaskList } from '@/components/ui/subtask-list'
import { TextDescriptionComments } from '@/components/ui/text-description-comments'
import { StatusBadge } from '@/components/module/StatusBadge'
import { BaseSidePanel, SidePanelHeader, SidePanelContent, SidePanelSection, SidePanelFooter } from '@/components/base'
import { DependencyBadge } from '@/components/ui/dependencies-selector'
import { Tarea, Subtarea, Comentario, EstadoTarea } from '@/types/tareas'
import { Proyecto } from '@/types/proyectos'
import { cn } from '@/lib/utils'

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
 * TaskDetailPanel - Panel lateral de detalles de tarea (Actualizado TAREAS v2)
 * 
 * Usa BaseSidePanel para la estructura y SidePanelHeader/Content/Footer
 * para una arquitectura reutilizable.
 * 
 * Mejoras:
 * - Sección de dependencias visuales
 * - Indicador de asignación a cliente
 * - Badges de categoría mejorados
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editMode, setEditMode] = useState(false)
  const [editedTarea, setEditedTarea] = useState<Tarea | null>(tarea)

  // ✅ CORRECCIÓN: Usar useEffect para sincronizar estado con props
  // Esto evita el bucle infinito de setState durante render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tarea) {
      setEditedTarea(tarea)
      setEditMode(false)
    }
  }, [tarea])

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

  // Check if task is overdue
  const isOverdue = tarea?.fecha_vencimiento &&
    new Date(tarea.fecha_vencimiento) < new Date() &&
    tarea.estado !== 'Completada'

  if (!tarea) return null

  return (
    <BaseSidePanel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      width="w-[500px]"
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
        {/* Tags de estado, prioridad y categoría */}
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={tarea.estado} />
          <StatusBadge status={tarea.prioridad} type="prioridad" />
          <StatusBadge status={tarea.categoria} type="categoria" />
          {tarea.asignado_a_cliente && (
            <StatusBadge status="Cliente" customColor="bg-cyan-500/15 text-cyan-400" />
          )}
        </div>

        {/* Descripción */}
        {tarea.descripcion && (
          <div className="bg-muted/30 p-3 rounded-lg">
            <TextDescriptionComments text={tarea.descripcion} className="text-sm text-muted-foreground" />
          </div>
        )}

        {/* Grid de información mejorada */}
        <SidePanelSection>
          <div className="grid grid-cols-2 gap-3">
            {/* Proyecto + Fase */}
            <div className="bg-muted/30 rounded-lg p-3 col-span-2">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <FolderOpen className="h-3.5 w-3.5" />
                <span className="text-xs">Proyecto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {tarea.proyecto_nombre}
                </span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground',
                  'shrink-0'
                )}>
                  Fase {tarea.fase_origen}
                </span>
              </div>
            </div>

            {/* Estado */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                {getEstadoIcon(tarea.estado)}
                <span className="text-xs">Estado</span>
              </div>
              <select
                value={editedTarea?.estado}
                onChange={(e) => setEditedTarea({ ...editedTarea!, estado: e.target.value as EstadoTarea })}
                className="text-sm font-medium bg-transparent border-none outline-none w-full cursor-pointer"
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

            {/* Responsable o Cliente */}
            <div className={cn(
              "bg-muted/30 rounded-lg p-3",
              tarea.asignado_a_cliente && "col-span-2"
            )}>
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                {tarea.asignado_a_cliente ? (
                  <Users className="h-3.5 w-3.5" />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
                <span className="text-xs">
                  {tarea.asignado_a_cliente ? 'Contacto Cliente' : 'Responsable'}
                </span>
              </div>
              <span className="text-sm font-medium">
                {tarea.asignado_a_cliente
                  ? (tarea.contacto_cliente_nombre || 'Cliente')
                  : (tarea.responsable_nombre || 'Sin asignar')
                }
              </span>
            </div>

            {/* Fecha de vencimiento */}
            <div className={cn(
              "bg-muted/30 rounded-lg p-3",
              isOverdue && "bg-red-500/10 border border-red-500/20"
            )}>
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Vencimiento</span>
              </div>
              <span className={cn(
                "text-sm font-medium",
                isOverdue && "text-red-400"
              )}>
                {formatFecha(tarea.fecha_vencimiento)}
              </span>
              {isOverdue && (
                <span className="text-[10px] text-red-400 block">⚠️ Vencida</span>
              )}
            </div>
          </div>
        </SidePanelSection>

        {/* Sección de Dependencias */}
        {tarea.dependencias && tarea.dependencias.length > 0 && (
          <SidePanelSection>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">Dependencias</span>
                <span className="text-xs text-muted-foreground">
                  ({tarea.dependencias.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tarea.dependencias.map((dep) => (
                  <DependencyBadge
                    key={dep.tarea_id}
                    dependency={dep}
                  />
                ))}
              </div>
            </div>
          </SidePanelSection>
        )}

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
