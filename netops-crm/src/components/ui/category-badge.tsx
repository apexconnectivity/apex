"use client"

import { Badge, BadgeProps } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CATEGORY_COLORS, getCategoryColor } from '@/lib/colors'
import type { CategoriaTarea } from '@/types/tareas'

// ============================================================================
// PROPS
// ============================================================================

export interface CategoryBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** Categoría de tarea */
  category: CategoriaTarea | string
  /** Mostrar indicador de color (dot) */
  showDot?: boolean
  /** Tamaño */
  size?: 'sm' | 'md' | 'lg'
  /** Variante de estilo */
  variant?: 'default' | 'solid' | 'outline'
}

// ============================================================================
// CONFIGURACIÓN DE CATEGORÍAS
// ============================================================================

const CATEGORY_CONFIG: Record<CategoriaTarea, { 
  dotColor: string
  label: string
  shortLabel?: string
}> = {
  Técnica: {
    dotColor: 'bg-purple-500',
    label: 'Técnica',
    shortLabel: 'Téc',
  },
  Comercial: {
    dotColor: 'bg-violet-500',
    label: 'Comercial',
    shortLabel: 'Com',
  },
  Compras: {
    dotColor: 'bg-emerald-500',
    label: 'Compras',
    shortLabel: 'Comp',
  },
  Administrativa: {
    dotColor: 'bg-amber-500',
    label: 'Administrativa',
    shortLabel: 'Admin',
  },
  General: {
    dotColor: 'bg-slate-500',
    label: 'General',
    shortLabel: 'Gen',
  },
}

// ============================================================================
// HELPERS
// ============================================================================

function getCategoryConfig(category: string): { 
  color: string
  bg: string
  dotColor: string
  label: string
  shortLabel: string
} {
  // Buscar en la configuración local primero
  const normalizedCategory = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  const config = CATEGORY_CONFIG[category as CategoriaTarea]
  if (config) {
    const colorConfig = CATEGORY_COLORS[normalizedCategory.replace(/\s+/g, '_') as keyof typeof CATEGORY_COLORS]
    return {
      color: colorConfig?.color || 'text-slate-400',
      bg: colorConfig?.bg || 'bg-slate-500/15',
      dotColor: config.dotColor,
      label: config.label,
      shortLabel: config.shortLabel || config.label,
    }
  }
  
  // Fallback usando la función centralizada
  const centralizedColor = getCategoryColor(category)
  return {
    color: centralizedColor.color,
    bg: centralizedColor.bg,
    dotColor: 'bg-slate-500',
    label: centralizedColor.label,
    shortLabel: centralizedColor.label.slice(0, 4),
  }
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * CategoryBadge - Badge específico para categorías de tareas
 * 
 * Características:
 * - Colores distintivos por categoría
 * - Opcional: indicador visual (dot)
 * - Múltiples tamaños
 * - Variantes de estilo
 */
export function CategoryBadge({
  category,
  showDot = false,
  size = 'md',
  variant = 'default',
  className,
  ...props
}: CategoryBadgeProps) {
  const config = getCategoryConfig(category)
  
  // Clases de tamaño
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-sm px-2.5 py-1 gap-2',
  }

  // Clases de variante
  const variantClasses = {
    default: cn(config.bg, config.color),
    solid: cn(config.dotColor.replace('bg-', 'bg-'), 'text-white'),
    outline: cn(
      'border',
      config.color.replace('text-', 'border-'),
      config.color
    ),
  }

  return (
    <Badge
      className={cn(
        'font-medium inline-flex items-center',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
      )}
      {config.label}
    </Badge>
  )
}

// ============================================================================
// COMPONENTE COMPACTO (Para espacios reducidos)
// ============================================================================

export interface CategoryDotProps {
  category: CategoriaTarea | string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

/**
 * CategoryDot - Indicador visual compacto de categoría
 * Útil para espacios reducidos en listas o tablas
 */
export function CategoryDot({
  category,
  size = 'md',
  showLabel = false,
  className,
}: CategoryDotProps) {
  const config = getCategoryConfig(category)
  
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('rounded-full shrink-0', dotSizes[size], config.dotColor)} />
      {showLabel && (
        <span className={cn('text-xs font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// SELECT ITEM (Para uso en Select de shadcn/ui)
// ============================================================================

export interface CategorySelectOptionProps {
  category: CategoriaTarea | string
  selected?: boolean
  className?: string
}

/**
 * CategorySelectOption - Opción para usar en dropdowns de selección
 */
export function CategorySelectOption({
  category,
  selected = false,
  className,
}: CategorySelectOptionProps) {
  const config = getCategoryConfig(category)
  
  return (
    <div className={cn(
      'flex items-center gap-2',
      selected && 'font-medium',
      className
    )}>
      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', config.dotColor)} />
      <span className={cn(
        'text-sm',
        selected ? config.color : 'text-foreground'
      )}>
        {config.label}
      </span>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { getCategoryConfig }
