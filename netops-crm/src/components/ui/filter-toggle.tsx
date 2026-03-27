'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface FilterToggleProps {
  label: string
  active: boolean
  onChange: (value: boolean) => void
  variant?: 'default' | 'warning' | 'danger'
  icon?: React.ReactNode
  className?: string
}

const VARIANTS = {
  default: {
    active: 'bg-primary/20 text-primary border-primary/30',
    inactive: 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50',
  },
  warning: {
    active: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    inactive: 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50',
  },
  danger: {
    active: 'bg-red-500/20 text-red-400 border-red-500/30',
    inactive: 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50',
  },
}

export function FilterToggle({ 
  label, 
  active, 
  onChange,
  variant = 'default',
  icon,
  className 
}: FilterToggleProps) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
        active ? VARIANTS[variant].active : VARIANTS[variant].inactive,
        'hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
    >
      {icon && <span className="h-3 w-3">{icon}</span>}
      {label}
      {active && <Check className="h-3 w-3 ml-0.5" />}
    </button>
  )
}