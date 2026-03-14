"use client"

import { useMemo } from 'react'
import { X, Plus, CheckCircle2, Circle, Clock, AlertCircle, Calendar, User, Building2, DollarSign, Target } from 'lucide-react'
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
  onAddTarea?: () => void
}

export function ProjectDetailPanel({
  isOpen,
  onClose,
  proyecto,
  tareas,
  onAddTarea,
}: ProjectDetailPanelProps) {
  // Filtrar tareas por proyecto_id
  const tareasDelProyecto = useMemo(() => {
    if (!proyecto) return []
    return tareas.filter(t => t.proyecto_id === proyecto.id)
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
      {/* Overlay con animación fade-in suave */}
      <div
        className={`absolute inset-0 bg-black/60 z-40 transition-all duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="h-full flex flex-col bg-slate-800">
        {/* Header del panel */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
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
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-64px)] pb-20">
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

                {/* Botón agregar tarea */}
                {onAddTarea && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddTarea}
                    className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Tarea
                  </Button>
                )}

                {/* Lista de tareas */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {tareasDelProyecto.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay tareas para este proyecto</p>
                      {onAddTarea && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={onAddTarea}
                          className="text-blue-400 hover:text-blue-300 mt-2"
                        >
                          Crear primera tarea
                        </Button>
                      )}
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
        </div>
      </div>
    </>
  )
}
