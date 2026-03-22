'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { type Tarea, type EstadoTarea } from '@/types/tareas'
import { PRIORITY_COLORS_MAP } from '@/constants/estadisticas'
import { Calendar, Link2, AlertCircle } from 'lucide-react'

interface TaskGanttChartProps {
  tasks: Tarea[]
  className?: string
}

interface GanttTask {
  task: Tarea
  startDate: Date
  endDate: Date | null
  duration: number
  dependencies: GanttDependency[]
  level: number
  isBlocked: boolean
}

interface GanttDependency {
  targetId: string
  type: string
}

const DAY_WIDTH = 40 // pixels per day
const ROW_HEIGHT = 48
const LABEL_WIDTH = 250

/**
 * TaskGanttChart - Visualización tipo Gantt para tareas y dependencias
 * Muestra las relaciones entre tareas y el estado de bloqueo
 */
export function TaskGanttChart({ tasks, className }: TaskGanttChartProps) {
  // Procesar tareas para el diagrama de Gantt
  const ganttTasks = useMemo(() => {
    if (tasks.length === 0) return []

    const result: GanttTask[] = []
    const taskMap = new Map(tasks.map(t => [t.id, t]))

    // Calcular fechas de inicio y fin para cada tarea
    const getTaskDates = (task: Tarea): { start: Date; end: Date | null } => {
      const start = task.fecha_creacion 
        ? new Date(task.fecha_creacion) 
        : new Date()
      
      let end: Date | null = null
      if (task.fecha_vencimiento) {
        end = new Date(task.fecha_vencimiento)
      } else if (task.fecha_completado) {
        end = new Date(task.fecha_completado)
      }
      
      return { start, end }
    }

    // Calcular nivel jerárquico basado en dependencias
    const calculateLevel = (taskId: string, visited = new Set<string>()): number => {
      if (visited.has(taskId)) return 0
      visited.add(taskId)
      
      const task = taskMap.get(taskId)
      if (!task || !task.dependencias || task.dependencias.length === 0) return 0
      
      let maxLevel = 0
      for (const dep of task.dependencias) {
        const depLevel = calculateLevel(dep.tarea_id, visited)
        maxLevel = Math.max(maxLevel, depLevel + 1)
      }
      return maxLevel
    }

    // Ordenar tareas por nivel y fecha
    const sortedTasks = [...tasks].sort((a, b) => {
      const levelA = calculateLevel(a.id)
      const levelB = calculateLevel(b.id)
      if (levelA !== levelB) return levelA - levelB
      return new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
    })

    for (const task of sortedTasks) {
      const { start, end } = getTaskDates(task)
      const duration = end 
        ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 7 //默认值7天

      result.push({
        task,
        startDate: start,
        endDate: end,
        duration: Math.max(duration, 1),
        dependencies: (task.dependencias || []).map(d => ({
          targetId: d.tarea_id,
          type: d.tipo,
        })),
        level: calculateLevel(task.id),
        isBlocked: task.estado === 'Bloqueada',
      })
    }

    return result
  }, [tasks])

  // Calcular rango de fechas para el diagrama
  const dateRange = useMemo(() => {
    if (ganttTasks.length === 0) {
      const today = new Date()
      return {
        start: today,
        end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      }
    }

    let minDate = ganttTasks[0].startDate
    let maxDate = ganttTasks[0].endDate || ganttTasks[0].startDate

    for (const ganttTask of ganttTasks) {
      if (ganttTask.startDate < minDate) minDate = ganttTask.startDate
      if (ganttTask.endDate && ganttTask.endDate > maxDate) maxDate = ganttTask.endDate
    }

    // Agregar márgenes
    const start = new Date(minDate.getTime() - 3 * 24 * 60 * 60 * 1000)
    const end = new Date(maxDate.getTime() + 7 * 24 * 60 * 60 * 1000)

    return { start, end }
  }, [ganttTasks])

  // Generar columnas de días
  const days = useMemo(() => {
    const result: Date[] = []
    const current = new Date(dateRange.start)
    while (current <= dateRange.end) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [dateRange])

  // Función para obtener la posición X de una fecha
  const getDatePosition = (date: Date): number => {
    const diffDays = Math.ceil(
      (date.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diffDays * DAY_WIDTH
  }

  // Función para obtener el ancho de una tarea
  const getTaskWidth = (duration: number): number => {
    return duration * DAY_WIDTH
  }

  const getTaskPriorityColor = (priority: string): string => {
    const config = PRIORITY_COLORS_MAP[priority]
    return config?.color || 'bg-slate-400'
  }

  const getStatusColor = (status: EstadoTarea): string => {
    switch (status) {
      case 'Completada':
        return 'bg-emerald-500'
      case 'En progreso':
        return 'bg-blue-500'
      case 'Bloqueada':
        return 'bg-red-500'
      case 'Pendiente':
      default:
        return 'bg-slate-400'
    }
  }

  if (tasks.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-muted-foreground', className)}>
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No hay tareas para mostrar en el diagrama de Gantt</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-auto bg-card rounded-lg border', className)}>
      {/* Header con fechas */}
      <div 
        className="sticky top-0 z-10 flex bg-muted/50 border-b"
        style={{ minWidth: LABEL_WIDTH + days.length * DAY_WIDTH }}
      >
        {/* Columna de etiquetas */}
        <div 
          className="flex-shrink-0 p-3 font-medium text-sm border-r bg-muted/30"
          style={{ width: LABEL_WIDTH }}
        >
          Tarea
        </div>
        
        {/* Columnas de días */}
        <div className="flex">
          {days.map((day, i) => {
            const isWeekend = day.getDay() === 0 || day.getDay() === 6
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div
                key={i}
                className={cn(
                  'flex-shrink-0 text-center text-xs p-1 border-r',
                  isWeekend ? 'bg-muted/30 text-muted-foreground' : 'bg-background',
                  isToday && 'bg-primary/10 font-bold text-primary'
                )}
                style={{ width: DAY_WIDTH, height: 40 }}
              >
                <div className="text-[10px]">{day.getDate()}</div>
                <div className="text-muted-foreground">
                  {['D', 'L', 'M', 'X', 'J', 'V', 'S'][day.getDay()]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filas de tareas */}
      <div 
        className="relative"
        style={{ minWidth: LABEL_WIDTH + days.length * DAY_WIDTH }}
      >
        {ganttTasks.map((ganttTask) => {
          const left = getDatePosition(ganttTask.startDate)
          const width = getTaskWidth(ganttTask.duration)
          const task = ganttTask.task

          return (
            <div
              key={task.id}
              className={cn(
                'flex border-b hover:bg-muted/20 transition-colors',
                ganttTask.isBlocked && 'bg-red-50/50'
              )}
              style={{ height: ROW_HEIGHT }}
            >
              {/* Etiqueta de tarea */}
              <div 
                className="flex-shrink-0 p-2 border-r overflow-hidden"
                style={{ width: LABEL_WIDTH }}
              >
                <div className="flex items-center gap-2">
                  {/* Indicador de nivel */}
                  {ganttTask.level > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: ganttTask.level }).map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-muted-foreground/30 rounded" />
                      ))}
                    </div>
                  )}
                  
                  {/* Indicador de estado */}
                  <div 
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      getStatusColor(task.estado)
                    )}
                  />
                  
                  {/* Nombre de tarea */}
                  <div className="min-w-0 flex-1">
                    <div 
                      className="text-sm font-medium truncate"
                      title={task.nombre}
                    >
                      {task.nombre}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{task.proyecto_nombre}</span>
                      {ganttTask.dependencies.length > 0 && (
                        <Link2 className="w-3 h-3 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Gantt */}
              <div className="relative flex-1">
                {/* Líneas verticales de días */}
                {days.map((day, i) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6
                  return (
                    <div
                      key={i}
                      className={cn(
                        'absolute top-0 bottom-0 border-r',
                        isWeekend ? 'bg-muted/20 border-muted-foreground/10' : 'border-muted-foreground/5'
                      )}
                      style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                    />
                  )
                })}

                {/* Barra de tarea */}
                <div
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 rounded-md flex items-center gap-1 px-2 text-white text-xs font-medium shadow-sm cursor-pointer hover:opacity-90 transition-opacity',
                    getTaskPriorityColor(task.prioridad),
                    ganttTask.isBlocked && 'ring-2 ring-red-500 ring-offset-1'
                  )}
                  style={{
                    left: left + 4,
                    width: Math.max(width - 8, 24),
                    height: ROW_HEIGHT - 16,
                  }}
                  title={`${task.nombre}\nPrioridad: ${task.prioridad}\nEstado: ${task.estado}`}
                >
                  {/* Indicador de bloqueo */}
                  {ganttTask.isBlocked && (
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="truncate">{task.responsable_nombre || 'Sin asignar'}</span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Conexiones de dependencias (simplificadas) */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            width: LABEL_WIDTH + days.length * DAY_WIDTH,
            height: ganttTasks.length * ROW_HEIGHT,
          }}
        >
        {ganttTasks.map((ganttTask, taskIndex) => {
            const y = taskIndex * ROW_HEIGHT + ROW_HEIGHT / 2
            return ganttTask.dependencies.map((dep, depIndex) => {
              const targetIndex = ganttTasks.findIndex(gt => gt.task.id === dep.targetId)
              if (targetIndex === -1) return null
              
              const targetY = targetIndex * ROW_HEIGHT + ROW_HEIGHT / 2
              const startX = LABEL_WIDTH + getDatePosition(ganttTask.startDate) + getTaskWidth(ganttTask.duration)
              const endX = LABEL_WIDTH + getDatePosition(ganttTasks[targetIndex].startDate)
              
              return (
                <g key={`${dep.targetId}-${depIndex}`}>
                  <path
                    d={`M ${startX} ${y} 
                        C ${startX + 20} ${y},
                          ${endX - 20} ${targetY},
                          ${endX} ${targetY}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeDasharray={dep.type === 'bloqueante' ? undefined : '4 2'}
                    className="text-muted-foreground/50"
                  />
                  {/* Flecha */}
                  <polygon
                    points={`${endX},${targetY} ${endX - 6},${targetY - 4} ${endX - 6},${targetY + 4}`}
                    fill="currentColor"
                    className="text-muted-foreground/50"
                  />
                </g>
              )
            })
          })}
        </svg>
      </div>

      {/* Leyenda */}
      <div className="sticky bottom-0 flex flex-wrap gap-4 p-3 bg-muted/50 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span>Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>En progreso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Bloqueada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-2 rounded bg-slate-400" />
          <span>Duración</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="12" className="text-muted-foreground/50">
            <path d="M0 6 L16 6" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 2" />
          </svg>
          <span>Dependencia</span>
        </div>
      </div>
    </div>
  )
}

// Versión compacta para嵌入其他组件
export function MiniGanttChart({ tasks, className }: TaskGanttChartProps) {
  const previewTasks = tasks.slice(0, 5) // 只显示前5个任务
  
  return (
    <div className={cn('space-y-2', className)}>
      {previewTasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2 text-sm">
          <div 
            className={cn(
              'w-2 h-2 rounded-full',
              task.estado === 'Completada' ? 'bg-emerald-500' :
              task.estado === 'En progreso' ? 'bg-blue-500' :
              task.estado === 'Bloqueada' ? 'bg-red-500' : 'bg-slate-400'
            )}
          />
          <span className="truncate flex-1">{task.nombre}</span>
          {task.fecha_vencimiento && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {new Date(task.fecha_vencimiento).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
          )}
        </div>
      ))}
      {tasks.length > 5 && (
        <div className="text-xs text-muted-foreground">
          +{tasks.length - 5} más...
        </div>
      )}
    </div>
  )
}
