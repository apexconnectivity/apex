"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TASK_DASHBOARD_GROUP_COLORS } from '@/lib/colors'
import type { GrupoDashboardTareas } from '@/types/tareas'

// ============================================================================
// PROPS
// ============================================================================

export interface TaskGroupProps {
  /** Tipo de grupo (determina colores y etiqueta) */
  type: GrupoDashboardTareas
  /** Tareas en el grupo */
  count: number
  /** Si el grupo está expandido por defecto */
  defaultExpanded?: boolean
  /** Callback cuando se togglea el expand */
  onToggle?: (expanded: boolean) => void
  /** Contenido del grupo (renderizado de tareas) */
  children: React.ReactNode
  /** Clase CSS adicional */
  className?: string
  /** Variante de tamaño */
  size?: 'sm' | 'md' | 'lg'
}

// ============================================================================
// HELPERS
// ============================================================================

function getGroupIcon(type: GrupoDashboardTareas): string {
  const icons: Record<GrupoDashboardTareas, string> = {
    vencen_hoy: '🔴',
    proximos_7_dias: '⚠️',
    en_progreso: '🔄',
    sin_vencimiento: '⏳',
    completadas_recientes: '✅',
  }
  return icons[type]
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * TaskGroup - Agrupación con header colapsable para el Dashboard de Tareas
 * 
 * Características:
 * - Header con icono, título y contador
 * - Colores basados en el tipo de grupo
 * - Animación de expand/collapse
 * - Indicador visual de urgencia
 */
export function TaskGroup({
  type,
  count,
  defaultExpanded = true,
  onToggle,
  children,
  className,
  size = 'md',
}: TaskGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  const config = TASK_DASHBOARD_GROUP_COLORS[type]
  const icon = getGroupIcon(type)
  
  const handleToggle = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    onToggle?.(newState)
  }

  // Clases según tamaño
  const sizeClasses = {
    sm: {
      container: 'p-3',
      header: 'text-sm',
      count: 'text-xs px-2 py-0.5',
    },
    md: {
      container: 'p-4',
      header: 'text-base',
      count: 'text-xs px-2.5 py-0.5',
    },
    lg: {
      container: 'p-5',
      header: 'text-lg',
      count: 'text-sm px-3 py-1',
    },
  }

  const classes = sizeClasses[size]

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border/50 overflow-hidden',
        'transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center justify-between',
          classes.container,
          config.bg,
          'hover:opacity-80 transition-opacity'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icono */}
          <span className="text-lg">{icon}</span>
          
          {/* Título */}
          <h3 className={cn(
            'font-semibold',
            config.color,
            classes.header
          )}>
            {config.label}
          </h3>
          
          {/* Contador */}
          <span className={cn(
            'rounded-full font-medium',
            config.bg,
            config.color,
            classes.count
          )}>
            {count}
          </span>
        </div>
        
        {/* Chevron */}
        <div className={cn(
          'transition-transform duration-200',
          config.color,
          isExpanded ? 'rotate-0' : '-rotate-90'
        )}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>

      {/* Contenido (colapsable) */}
      <div className={cn(
        'transition-all duration-300 ease-out overflow-hidden',
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="p-4 space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE SIMPLIFICADO PARA USO EN LISTS
// ============================================================================

export interface TaskGroupHeaderProps {
  type: GrupoDashboardTareas
  count: number
  isExpanded?: boolean
  onToggle?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * TaskGroupHeader - Header simple para usar dentro de otros layouts
 */
export function TaskGroupHeader({
  type,
  count,
  isExpanded = true,
  onToggle,
  size = 'md',
  className,
}: TaskGroupHeaderProps) {
  const config = TASK_DASHBOARD_GROUP_COLORS[type]
  const icon = getGroupIcon(type)
  
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-2.5 px-4',
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between rounded-lg',
        'hover:bg-muted/50 transition-colors',
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className={cn('font-semibold', config.color)}>
          {config.label}
        </span>
        <span className={cn(
          'rounded-full font-medium text-xs',
          config.bg,
          config.color,
          'px-2 py-0.5'
        )}>
          {count}
        </span>
      </div>
      
      <ChevronDown className={cn(
        'h-4 w-4 transition-transform duration-200 text-muted-foreground',
        isExpanded ? 'rotate-0' : '-rotate-90'
      )} />
    </button>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { getGroupIcon }
