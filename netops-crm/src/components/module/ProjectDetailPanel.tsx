"use client"

import { useMemo } from 'react'
import { X, CheckCircle2, Circle, Clock, AlertCircle, Calendar, User, Building2, DollarSign, Target, XCircle, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/module/StatusBadge'
import { Proyecto, FASES } from '@/types/proyectos'
import { Tarea, EstadoTarea } from '@/types/tareas'

interface ProjectDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  proyecto: Proyecto | null
  tareas: Tarea[]
  onCerrar?: (proyecto: Proyecto) => void
  onArchivar?: (proyecto: Proyecto) => void
  canClose?: boolean
}

export function ProjectDetailPanel({
  isOpen,
  onClose,
  proyecto,
  tareas,
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

  // Formatear fecha
  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Renderizar icono según estado de tarea
  const renderEstadoIcono = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Completada':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
      case 'En progreso':
        return <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 animate-pulse" />
      case 'Bloqueada':
        return <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
      default:
        return <Circle className="h-5 w-5 text-slate-500 flex-shrink-0" />
    }
  }

  // Obtener clase según estado para el texto
  const getEstadoClase = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Completada':
        return 'line-through text-muted-foreground'
      case 'En progreso':
        return 'text-blue-300'
      case 'Bloqueada':
        return 'text-red-300'
      default:
        return 'text-slate-300'
    }
  }

  return (
    <>
      {/* Panel lateral */}
      <div className="h-full flex flex-col">
        {/* Header del panel */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: faseActual?.color || '#6b7280' }}
            />
            <h2 className="font-semibold text-white truncate max-w-[280px]">
              {proyecto?.nombre || 'Detalles del Proyecto'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-slate-700/50 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          {proyecto ? (
            <>
              {/* Información del cliente */}
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{proyecto.cliente_nombre}</span>
              </div>

              {/* Progreso del proyecto */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progreso del Proyecto</span>
                  <span className="text-white font-medium">{proyecto.probabilidad_cierre}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${proyecto.probabilidad_cierre}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">Probabilidad de cierre</p>
              </div>

              {/* Grid de información */}
              <div className="grid grid-cols-2 gap-3">
                {/* Fase */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Target className="h-3.5 w-3.5" />
                    <span className="text-xs">Fase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: faseActual?.color }}
                    />
                    <span className="text-sm font-medium text-white">{faseActual?.nombre}</span>
                  </div>
                </div>

                {/* Estado */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">Estado</span>
                  </div>
                  <StatusBadge
                    status={proyecto.estado === 'activo' ? 'Activo' : 'Cerrado'}
                    className="mt-0.5"
                  />
                </div>

                {/* Monto */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-xs">Monto</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {proyecto.moneda} {proyecto.monto_estimado?.toLocaleString() || '0'}
                  </span>
                </div>

                {/* Responsable */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">Responsable</span>
                  </div>
                  <span className="text-sm font-medium text-white truncate block">
                    {proyecto.responsable_nombre || 'Sin asignar'}
                  </span>
                </div>

                {/* Fecha inicio */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Inicio</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {formatFecha(proyecto.fecha_inicio)}
                  </span>
                </div>

                {/* Fecha fin estimada */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Fin Estimada</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {formatFecha(proyecto.fecha_estimada_fin)}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {proyecto.tags && proyecto.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {proyecto.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-slate-700/50 text-slate-300 text-xs hover:bg-slate-700/70"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Sección de Tareas */}
              <div className="space-y-3">
                {/* Header de tareas con progreso */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-400" />
                    Tareas del Proyecto
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {tareasDelProyecto.filter(t => t.estado === 'Completada').length}/{tareasDelProyecto.length}
                    </span>
                    <span className="text-xs font-medium text-emerald-400">
                      {progresoTareas}%
                    </span>
                  </div>
                </div>

                {/* Barra de progreso de tareas */}
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progresoTareas}%` }}
                  />
                </div>

                {/* Lista de tareas */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {tareasDelProyecto.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay tareas en esta fase</p>
                    </div>
                  ) : (
                    tareasDelProyecto.map((tarea) => (
                      <div
                        key={tarea.id}
                        className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/40 transition-colors group"
                      >
                        {renderEstadoIcono(tarea.estado)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${getEstadoClase(tarea.estado)}`}>
                            {tarea.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <StatusBadge
                              status={tarea.estado}
                              className="text-[10px] h-5"
                            />
                            {tarea.categoria && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-5 bg-slate-600/50 text-slate-300"
                              >
                                {tarea.categoria}
                              </Badge>
                            )}
                          </div>
                          {tarea.fecha_vencimiento && (
                            <p className="text-xs text-slate-500 mt-1">
                              Vence: {formatFecha(tarea.fecha_vencimiento)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Target className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">Selecciona un proyecto para ver detalles</p>
            </div>
          )}

          {/* Botón de cerrar proyecto - al final del panel */}
          {canClose && proyecto && proyecto.estado === 'activo' && (
            <div className="pt-4 border-t border-slate-700/50">
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
                onClick={() => onCerrar?.(proyecto)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cerrar Proyecto
              </Button>
            </div>
          )}

          {/* Botón de archivar proyecto - solo para proyectos cerrados */}
          {canClose && proyecto && proyecto.estado === 'cerrado' && (
            <div className="pt-4 border-t border-slate-700/50">
              <Button
                variant="outline"
                className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500"
                onClick={() => onArchivar?.(proyecto)}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archivar Proyecto
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
