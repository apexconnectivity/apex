import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  className?: string
}

/**
 * Componente reutilizable para mostrar información en grids.
 * Usa las variables CSS del theme para mantener consistencia con dark mode.
 */
export function InfoCard({ icon: Icon, label, value, className }: InfoCardProps) {
  return (
    <div className={cn('bg-muted/30 rounded-lg p-3', className)}>
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground truncate">
        {value}
      </div>
    </div>
  )
}
