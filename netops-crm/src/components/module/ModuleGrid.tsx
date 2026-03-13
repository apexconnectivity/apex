import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type GridCols = 1 | 2 | 3 | 4 | 5
type GridGap = 'sm' | 'md' | 'lg'

interface ModuleGridProps {
  children: ReactNode
  cols?: GridCols
  gap?: GridGap
  className?: string
}

const colsClasses: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
}

const gapClasses: Record<GridGap, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

export function ModuleGrid({ 
  children, 
  cols = 3, 
  gap = 'md',
  className = '' 
}: ModuleGridProps) {
  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}
