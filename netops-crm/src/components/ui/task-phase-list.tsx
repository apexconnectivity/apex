"use client"

import { useState } from 'react'
import { ChevronDown, ChevronRight, FolderOpen, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TaskCard } from '@/components/ui/task-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Tarea, type EstadoTarea } from '@/types/tareas'

// ============================================================================
// PROPS
// ============================================================================

export interface TaskPhaseListProps {
  /** Tareas a mostrar */
  tasks: Tarea[]
  /** Nombres de fases */
  phaseNames?: { [key: number]: string }
  /** Callback cuando se selecciona una tarea */
  onTaskClick?: (tarea: Tarea) => void
  /** Callback cuando se completa una tarea */
  onTaskComplete?: (tarea: Tarea) => void
  /** Tareas bloqueadas */
  blockedTaskIds?: string[]
  /** Ocultar tareas completadas */
  hideCompleted?: boolean
  /** Solo mostrar fase actual */
  onlyCurrentPhase?: boolean
  /** Fase actual del proyecto */
  currentPhase?: number
  /** Clase CSS adicional */
  className?: string
}

// ============================================================================
// CONFIGURACIÓN DE FASES
// ============================================================================

const DEFAULT_PHASE_NAMES: { [key: number]: string } = {
  1: 'Prospecto',
  2: 'Diagnóstico',
  3: 'Propuesta',
  4: 'Implementación',
  5: 'Cierre',
}

const PHASE_CONFIG: { [key: number]: { color: string; bgColor: string; icon: string } } = {
  1: { color: 'text-slate-400', bgColor: 'bg-slate-500/15', icon: '📋' },
  2: { color: 'text-blue-400', bgColor: 'bg-blue-500/15', icon: '🔍' },
  3: { color: 'text-amber-400', bgColor: 'bg-amber-500/15', icon: '📝' },
  4: { color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', icon: '⚙️' },
  5: { color: 'text-violet-400', bgColor: 'bg-violet-500/15', icon: '🎯' },
}

// ============================================================================
// COMPONENTE: TAREA ROW (para vista compacta)
// ============================================================================

interface TaskRowProps {
  tarea: Tarea
  isBlocked?: boolean
  onClick?: () => void
  onComplete?: () => void
  compact?: boolean
}

function TaskRow({ tarea, isBlocked = false, onClick, onComplete, compact = true }: TaskRowProps) {
  const estadoIcons: Record<EstadoTarea, React.ReactNode> = {
    Pendiente: <Circle className="h-4 w-4 text-slate-400" />,
    'En progreso': <Clock className="h-4 w-4 text-blue-400 animate-pulse" />,
    Bloqueada: <AlertCircle className="h-4 w-4 text-red-400" />,
    Completada: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  }

  const priorityColors: Record<string, string> = {
    Urgente: 'bg-red-500/20 text-red-400',
    Alta: 'bg-orange-500/20 text-orange-400',
    Media: 'bg-blue-500/20 text-blue-400',
    Baja: 'bg-slate-500/20 text-slate-400',
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group',
          tarea.estado === 'Completada' && 'opacity-60'
        )}
        onClick={onClick}
      >
        {/* Checkbox */}
        <button
          type="button"
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onComplete?.()
          }}
        >
          {estadoIcons[tarea.estado]}
        </button>

        {/* Categoría */}
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] px-1.5 py-0 shrink-0',
            tarea.categoria === 'Técnica' && 'border-purple-500/50 text-purple-400',
            tarea.categoria === 'Comercial' && 'border-violet-500/50 text-violet-400',
            tarea.categoria === 'Compras' && 'border-emerald-500/50 text-emerald-400',
            tarea.categoria === 'Administrativa' && 'border-amber-500/50 text-amber-400',
            tarea.categoria === 'General' && 'border-slate-500/50 text-slate-400'
          )}
        >
          {tarea.categoria.slice(0, 4)}
        </Badge>

        {/* Nombre */}
        <span className={cn(
          'flex-1 text-sm truncate',
          tarea.estado === 'Completada' && 'line-through text-muted-foreground'
        )}>
          {tarea.nombre}
        </span>

        {/* Responsable/Vence */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          {tarea.responsable_nombre && (
            <span className="truncate max-w-[100px]">{tarea.responsable_nombre.split(' ')[0]}</span>
          )}
          {tarea.fecha_vencimiento && (
            <span className={cn(
              tarea.estado !== 'Completada' && new Date(tarea.fecha_vencimiento) < new Date() && 'text-red-400'
            )}>
              {new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>

        {/* Indicador de bloqueada */}
        {isBlocked && (
          <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
        )}
      </div>
    )
  }

  // Vista no compacta (usando TaskCard)
  return (
    <TaskCard
      tarea={tarea}
      variant="default"
      onClick={onClick}
      onComplete={onComplete}
    />
  )
}

// ============================================================================
// COMPONENTE: SECCIÓN DE FASE
// ============================================================================

interface PhaseSectionProps {
  phase: number
  name: string
  tasks: Tarea[]
  currentPhase?: number
  blockedTaskIds?: string[]
  hideCompleted?: boolean
  onTaskClick?: (tarea: Tarea) => void
  onTaskComplete?: (tarea: Tarea) => void
  defaultExpanded?: boolean
}

function PhaseSection({
  phase,
  name,
  tasks,
  currentPhase,
  blockedTaskIds = [],
  hideCompleted = false,
  onTaskClick,
  onTaskComplete,
  defaultExpanded = true,
}: PhaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  const config = PHASE_CONFIG[phase] || PHASE_CONFIG[1]
  const isCurrentPhase = currentPhase === phase
  const isPastPhase = currentPhase !== undefined && phase < currentPhase
  
  // Filtrar tareas según opciones
  let visibleTasks = hideCompleted ? tasks.filter(t => t.estado !== 'Completada') : tasks
  const completedCount = hideCompleted ? 0 : tasks.filter(t => t.estado === 'Completada').length
  const pendingCount = tasks.filter(t => t.estado !== 'Completada').length

  if (visibleTasks.length === 0 && !hideCompleted) {
    visibleTasks = tasks
  }

  // Determinar si esta fase está completa
  const isPhaseComplete = tasks.length > 0 && tasks.every(t => t.estado === 'Completada')

  return (
    <div className={cn(
      'rounded-lg border overflow-hidden',
      isCurrentPhase && 'border-cyan-500/30',
      isPastPhase && 'border-slate-500/20 opacity-75',
      !isCurrentPhase && !isPastPhase && 'border-border/50'
    )}>
      {/* Header de fase */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 transition-colors',
          isCurrentPhase ? config.bgColor : 'bg-muted/50',
          'hover:opacity-80'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icono de expandir */}
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          
          {/* Fase */}
          <span className={cn('text-lg', isPastPhase && 'text-muted-foreground')}>
            {config.icon}
          </span>
          
          <div className="text-left">
            <h3 className={cn(
              'text-sm font-semibold',
              config.color,
              isPastPhase && 'text-muted-foreground'
            )}>
              FASE {phase}: {name.toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}</span>
              {completedCount > 0 && (
                <span>· {completedCount} completada{completedCount !== 1 ? 's' : ''}</span>
              )}
              {isCurrentPhase && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/50 text-cyan-400">
                  Actual
                </Badge>
              )}
              {isPhaseComplete && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/50 text-emerald-400">
                  Completada
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Indicador de estado */}
        {isPhaseComplete ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Lista de tareas */}
      {isExpanded && visibleTasks.length > 0 && (
        <div className="p-3 space-y-1">
          {visibleTasks.map((tarea) => (
            <TaskRow
              key={tarea.id}
              tarea={tarea}
              isBlocked={blockedTaskIds.includes(tarea.id)}
              onClick={() => onTaskClick?.(tarea)}
              onComplete={() => onTaskComplete?.(tarea)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {isExpanded && visibleTasks.length === 0 && (
        <div className="p-6 text-center text-muted-foreground">
          <p className="text-sm">No hay tareas en esta fase</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * TaskPhaseList - Lista de tareas agrupadas por fase del proyecto
 * 
 * Características:
 * - Secciones colapsables por fase
 * - Indicador visual de fase actual
 * - Contadores de tareas completadas/pendientes
 * - Indicadores de tareas bloqueadas
 * - Vista compacta de tareas
 */
export function TaskPhaseList({
  tasks,
  phaseNames = DEFAULT_PHASE_NAMES,
  onTaskClick,
  onTaskComplete,
  blockedTaskIds = [],
  hideCompleted = false,
  onlyCurrentPhase = false,
  currentPhase,
  className,
}: TaskPhaseListProps) {
  // Agrupar tareas por fase
  const tasksByPhase = tasks.reduce((acc, tarea) => {
    const fase = tarea.fase_origen || 1
    if (!acc[fase]) acc[fase] = []
    acc[fase].push(tarea)
    return acc
  }, {} as Record<number, Tarea[]>)

  // Ordenar fases
  const fases = Object.keys(tasksByPhase)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className={cn('space-y-4', className)}>
      {fases.map((phase) => {
        // Si soloCurrentPhase, solo mostrar fase actual y anteriores
        if (onlyCurrentPhase && currentPhase !== undefined && phase > currentPhase) {
          return null
        }

        return (
          <PhaseSection
            key={phase}
            phase={phase}
            name={phaseNames[phase] || `Fase ${phase}`}
            tasks={tasksByPhase[phase]}
            currentPhase={currentPhase}
            blockedTaskIds={blockedTaskIds}
            hideCompleted={hideCompleted}
            onTaskClick={onTaskClick}
            onTaskComplete={onTaskComplete}
            defaultExpanded={!onlyCurrentPhase || phase === currentPhase}
          />
        )
      })}

      {fases.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No hay tareas en este proyecto</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { DEFAULT_PHASE_NAMES as PHASE_NAMES, PHASE_CONFIG as PHASE_STYLES }
