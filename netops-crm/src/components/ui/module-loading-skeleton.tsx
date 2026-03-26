'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ModuleLoadingSkeletonProps {
  // Tipo de contenido
  type?: 'kanban' | 'list' | 'stats' | 'grid' | 'custom'
  
  // Configuración del layout
  columns?: number  // columnas en grid/kanban
  rows?: number     // filas de items
  minWidth?: string // min-width del container
  
  // Para kanban: estados/columnas
  estados?: string[]
  
  // Para stats: cuántos stat cards
  statCount?: number
  
  // Para grid: tamaño de cards
  cardSize?: 'sm' | 'md' | 'lg'
  
  // Clases adicionales
  className?: string
}

const CARD_SIZES = {
  sm: 'h-20',
  md: 'h-32', 
  lg: 'h-48'
}

export function ModuleLoadingSkeleton({
  type = 'list',
  columns = 4,
  rows = 3,
  minWidth = '1000px',
  estados = ['Pendiente', 'En progreso', 'Bloqueada', 'Completada'],
  statCount = 4,
  cardSize = 'md',
  className
}: ModuleLoadingSkeletonProps) {
  
  const cardHeight = CARD_SIZES[cardSize]
  
  // Kanban loading
  if (type === 'kanban') {
    return (
      <div 
        className={cn("grid gap-4 pb-6", className)}
        style={{ 
          gridTemplateColumns: `repeat(${estados.length}, minmax(250px, 1fr))`,
          minWidth 
        }}
      >
        {estados.map((estado) => (
          <div key={estado} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="space-y-3">
              {[...Array(rows)].map((_, i) => (
                <Skeleton key={i} className={cn("w-full", cardHeight)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Stats loading
  if (type === 'stats') {
    return (
      <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${statCount}, minmax(150px, 1fr))` }}>
        {[...Array(statCount)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }
  
  // Grid loading
  if (type === 'grid') {
    return (
      <div 
        className={cn("grid gap-4", className)}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(200px, 1fr))` }}
      >
        {[...Array(columns * rows)].map((_, i) => (
          <Skeleton key={i} className={cn("w-full", cardHeight)} />
        ))}
      </div>
    )
  }
  
  // List loading (default)
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-20 w-full" />
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <Skeleton key={i} className={cn("w-full", cardHeight)} />
        ))}
      </div>
    </div>
  )
}

// Loading específico para Dashboard
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      {/* Stats */}
      <ModuleLoadingSkeleton type="stats" statCount={4} />
      
      {/* Kanban pipeline */}
      <ModuleLoadingSkeleton 
        type="kanban" 
        estados={['Prospecto', 'Diagnóstico', 'Propuesta', 'Implementación', 'Cierre']}
        rows={2}
      />
    </div>
  )
}

// Loading específico para CRM
export function CRMLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <ModuleLoadingSkeleton type="stats" statCount={4} />
      <ModuleLoadingSkeleton type="grid" columns={3} rows={4} cardSize="md" />
    </div>
  )
}

// Loading específico para Tareas
export function TareasLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <ModuleLoadingSkeleton type="stats" statCount={6} />
      <ModuleLoadingSkeleton 
        type="kanban" 
        estados={['Pendiente', 'En progreso', 'Bloqueada', 'Completada']}
        rows={3}
      />
    </div>
  )
}