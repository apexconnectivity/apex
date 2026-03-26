"use client"

import { CheckCircle2, Circle, Clock, AlertCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KanbanCard } from '@/components/module/ItemCard'
import { cn } from '@/lib/utils'
import { type Tarea, type EstadoTarea } from '@/types/tareas'

// ============================================================================
// PROPS
// ============================================================================

export interface TaskKanbanBoardProps {
  /** Tareas a mostrar */
  tasks: Tarea[]
  /** Callback cuando se selecciona una tarea */
  onTaskClick?: (tarea: Tarea) => void
  /** Callback cuando se completa una tarea */
  onTaskComplete?: (tarea: Tarea) => void
  /** Tareas bloqueadas (con dependencias pendientes) */
  blockedTaskIds?: string[]
  /** Columnas a mostrar */
  columns?: EstadoTarea[]
  /** Deshabilitar drag (lectura nomas) */
  readOnly?: boolean
  /** Mostrar botón de agregar tarea en cada columna */
  showAddButton?: boolean
  /** Callback para agregar tarea en columna específica */
  onAddTask?: (estado: EstadoTarea) => void
  /** Clase CSS adicional */
  className?: string
}

// ============================================================================
// CONFIGURACIÓN DE COLUMNAS
// ============================================================================

const DEFAULT_COLUMNS: EstadoTarea[] = ['Pendiente', 'En progreso', 'Bloqueada', 'Completada']

const COLUMN_CONFIG: Record<EstadoTarea, {
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  label: string
}> = {
  Pendiente: {
    icon: <Circle className="h-4 w-4" />,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
    label: 'Pendiente',
  },
  'En progreso': {
    icon: <Clock className="h-4 w-4 animate-pulse" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'En Progreso',
  },
  Bloqueada: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Bloqueada',
  },
  Completada: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    label: 'Completada',
  },
}

// ============================================================================
// COMPONENTE: COLUMNA KANBAN
// ============================================================================

interface KanbanColumnProps {
  estado: EstadoTarea
  tasks: Tarea[]
  blockedTaskIds?: string[]
  onTaskClick?: (tarea: Tarea) => void
  onTaskComplete?: (tarea: Tarea) => void
  readOnly?: boolean
  showAddButton?: boolean
  onAddTask?: () => void
}

function KanbanColumn({
  estado,
  tasks,
  blockedTaskIds = [],
  onTaskClick,
  onTaskComplete,
  readOnly = false,
  showAddButton = false,
  onAddTask,
}: KanbanColumnProps) {
  const config = COLUMN_CONFIG[estado]
  const isCompleted = estado === 'Completada'
  const isBlocked = estado === 'Bloqueada'

  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[320px]">
      {/* Header de columna */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2 rounded-t-lg border-b',
        config.bgColor,
        config.borderColor
      )}>
        <div className="flex items-center gap-2">
          <span className={config.color}>{config.icon}</span>
          <span className={cn('text-sm font-semibold', config.color)}>
            {config.label}
          </span>
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded-full font-medium',
            config.bgColor,
            config.color
          )}>
            {tasks.length}
          </span>
        </div>
        
        {showAddButton && !readOnly && !isCompleted && (
          <Button
            size="icon"
            variant="ghost"
            className={cn('h-6 w-6', config.color)}
            onClick={onAddTask}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Contenido de columna */}
      <div className={cn(
        'flex-1 overflow-y-auto p-2 space-y-2 rounded-b-lg border-x border-b min-h-[200px]',
        config.borderColor,
        isCompleted && 'bg-emerald-500/5'
      )}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
            <p className="text-xs">Sin tareas</p>
          </div>
        ) : (
          tasks.map((tarea) => {
            // Color del borde según estado
            const estadoToColor: Record<EstadoTarea, string> = {
              'Pendiente': '#64748b',    // slate-500
              'En progreso': '#3b82f6',   // blue-500
              'Bloqueada': '#ef4444',    // red-500
              'Completada': '#10b981',   // emerald-500
            }
            const indicatorColor = estadoToColor[tarea.estado] || '#64748b'
            
            return (
              <KanbanCard
                key={tarea.id}
                title={tarea.nombre}
                subtitle={tarea.descripcion ? tarea.descripcion.substring(0, 60) + (tarea.descripcion.length > 60 ? '...' : '') : undefined}
                indicatorColor={indicatorColor}
                progress={tarea.estado === 'Completada' ? 100 : tarea.estado === 'En progreso' ? 50 : 0}
                dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                onClick={() => onTaskClick?.(tarea)}
                className={cn(
                  isBlocked && blockedTaskIds.includes(tarea.id) && 'border-red-500/50',
                  isCompleted && 'opacity-75'
                )}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * TaskKanbanBoard - Tablero Kanban para visualizar y gestionar tareas
 * 
 * Características:
 * - Columnas por estado (Pendiente, En progreso, Bloqueada, Completada)
 * - Drag & drop entre columnas (para futuro)
 * - Indicadores de tareas bloqueadas
 * - Contadores por columna
 * - Acciones rápidas desde las tarjetas
 */
export function TaskKanbanBoard({
  tasks,
  onTaskClick,
  onTaskComplete,
  blockedTaskIds = [],
  columns = DEFAULT_COLUMNS,
  readOnly = false,
  showAddButton = false,
  onAddTask,
  className,
}: TaskKanbanBoardProps) {
  // Agrupar tareas por estado
  const tasksByEstado = columns.reduce((acc, estado) => {
    acc[estado] = tasks.filter(t => t.estado === estado)
    return acc
  }, {} as Record<EstadoTarea, Tarea[]>)

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((estado) => (
        <KanbanColumn
          key={estado}
          estado={estado}
          tasks={tasksByEstado[estado] || []}
          blockedTaskIds={blockedTaskIds}
          onTaskClick={onTaskClick}
          onTaskComplete={onTaskComplete}
          readOnly={readOnly}
          showAddButton={showAddButton}
          onAddTask={showAddButton ? () => onAddTask?.(estado) : undefined}
        />
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENTE: KANBAN COLUMN SELECTOR
// ============================================================================

export interface KanbanColumnSelectorProps {
  currentColumn: EstadoTarea
  onColumnChange: (column: EstadoTarea) => void
  disabled?: boolean
  className?: string
}

/**
 * KanbanColumnSelector - Selector visual de columna Kanban
 * Para mover tareas entre estados
 */
export function KanbanColumnSelector({
  currentColumn,
  onColumnChange,
  disabled = false,
  className,
}: KanbanColumnSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {(Object.keys(COLUMN_CONFIG) as EstadoTarea[]).map((column) => {
        const config = COLUMN_CONFIG[column]
        const isActive = column === currentColumn
        
        return (
          <button
            key={column}
            type="button"
            disabled={disabled}
            onClick={() => onColumnChange(column)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              'border',
              isActive
                ? cn(config.bgColor, config.color, config.borderColor)
                : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {config.icon}
            <span>{config.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Re-exportar columnas disponibles
export { DEFAULT_COLUMNS as KANBAN_COLUMNS, COLUMN_CONFIG as KANBAN_COLUMN_CONFIG }
