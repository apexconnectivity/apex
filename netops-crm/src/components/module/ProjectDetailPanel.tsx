"use client"

import { useMemo } from 'react'
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar, Target, Archive, XCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/module/StatusBadge'
import { PIPELINE_FASE_COLORS } from '@/lib/colors'
import { BaseSidePanel, SidePanelHeader, SidePanelContent, SidePanelSection, SidePanelFooter } from '@/components/base'
import { Proyecto, FASES } from '@/types/proyectos'
import { Tarea, EstadoTarea } from '@/types/tareas'
import { HistorialProyecto } from '@/types/proyectos'

interface ProjectDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  proyecto: Proyecto | null
  tareas: Tarea[]
  historial?: HistorialProyecto[]
  onCerrar?: (proyecto: Proyecto) => void
  onArchivar?: (proyecto: Proyecto) => void
  canClose?: boolean
}

/**
 * ProjectDetailPanel - Panel lateral de detalles de proyecto
 * 
 * Usa BaseSidePanel para la estructura y SidePanelHeader/Content/Footer
 * para una arquitectura reutilizable.
 */
export function ProjectDetailPanel({
  isOpen,
  onClose,
  proyecto,
  tareas,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  historial = [],
  onCerrar,
  onArchivar,
  canClose,
}: ProjectDetailPanelProps) {
  // Filtrar tareas por proyecto_id Y fase actual
  const tareasDelProyecto = useMemo(() => {
    if (!proyecto) return []
    return tareas.filter(t =>
      t.proyecto_id === proyecto.id &&
      t.fase_origen === proyecto.fase_actual
    )
  }, [tareas, proyecto])

  // Calcular progreso de tareas
  const progresoTareas = useMemo(() => {
    if (tareasDelProyecto.length === 0) return 0
    const completadas = tareasDelProyecto.filter(t => t.estado === 'Completada').length
    return Math.round((completadas / tareasDelProyecto.length) * 100)
  }, [tareasDelProyecto])

  // Obtener la fase actual del proyecto
  const faseActual = useMemo(() => {
    if (!proyecto) return null
    return FASES.find(f => f.id === proyecto.fase_actual)
  }, [proyecto])

  // Función para renderizar icono según estado de tarea
  const renderEstadoIcono = (estado: EstadoTarea) => {
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

  // Obtener clase según estado
  const getEstadoClase = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Completada':
        return 'text-emerald-400 line-through'
      case 'En progreso':
        return 'text-blue-400'
      case 'Bloqueada':
        return 'text-orange-400'
      default:
        return 'text-amber-400'
    }
  }

  if (!proyecto) return null

  return (
    <BaseSidePanel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      width="w-[500px]"
      variant="project"
    >
      {/* Header */}
      <SidePanelHeader
        variant="project"
        icon={
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: faseActual?.color || PIPELINE_FASE_COLORS[1] }}
          />
        }
        title={proyecto.nombre}
        subtitle={proyecto.cliente_nombre}
      />

      {/* Contenido */}
      <SidePanelContent>
        {/* Progreso de tareas de la fase actual */}
        <SidePanelSection title={`Progreso - ${faseActual?.nombre}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tareas ejecutadas</span>
              <span className="font-medium">{progresoTareas}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progresoTareas}%` }}
              />
            </div>
          </div>
        </SidePanelSection>

        {/* Grid de información */}
        <SidePanelSection>
          <div className="grid grid-cols-2 gap-3">
            {/* Fase */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Target className="h-3.5 w-3.5" />
                <span className="text-xs">Fase</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: faseActual?.color }}
                />
                <span className="text-sm font-medium">{faseActual?.nombre}</span>
              </div>
            </div>

            {/* Responsable */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <User className="h-3.5 w-3.5" />
                <span className="text-xs">Responsable</span>
              </div>
              <span className="text-sm font-medium">
                {proyecto.responsable_nombre || 'Sin asignar'}
              </span>
            </div>

            {/* Estado */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">Estado</span>
              </div>
              <StatusBadge
                status={proyecto.estado === 'activo' ? 'Activo' : 'Cerrado'}
                className="mt-0.5"
              />
            </div>

            {/* Tareas */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-xs">Tareas</span>
              </div>
              <span className="text-sm font-medium">
                {progresoTareas}%
                <span className="text-muted-foreground text-xs ml-1">
                  ({tareasDelProyecto.filter(t => t.estado === 'Completada').length}/{tareasDelProyecto.length})
                </span>
              </span>
            </div>

            {/* Presupuesto */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Fecha Inicio</span>
              </div>
              <span className="text-sm font-medium">
                {proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString('es-ES') : '-'}
              </span>
            </div>
          </div>
        </SidePanelSection>

        {/* Lista de tareas */}
        {tareasDelProyecto.length > 0 && (
          <SidePanelSection title={`Tareas de ${faseActual?.nombre}`}>
            <div className="space-y-2">
              {tareasDelProyecto.slice(0, 5).map((tarea) => (
                <div
                  key={tarea.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                >
                  {renderEstadoIcono(tarea.estado)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${getEstadoClase(tarea.estado)}`}>
                      {tarea.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tarea.responsable_nombre || 'Sin asignar'}
                    </p>
                  </div>
                </div>
              ))}
              {tareasDelProyecto.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{tareasDelProyecto.length - 5} más
                </p>
              )}
            </div>
          </SidePanelSection>
        )}
      </SidePanelContent>

      {/* Footer con acciones */}
      {(onCerrar || onArchivar) && (
        <SidePanelFooter>
          {canClose && onCerrar && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCerrar(proyecto)}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cerrar Proyecto
            </Button>
          )}
          {onArchivar && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onArchivar(proyecto)}
              className="flex-1"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archivar
            </Button>
          )}
        </SidePanelFooter>
      )}
    </BaseSidePanel>
  )
}
