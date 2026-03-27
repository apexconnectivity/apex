'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterTagProps {
  label: string
  value: string
  onRemove: () => void
  variant?: 'default' | 'warning' | 'danger' | 'success'
  className?: string
}

const VARIANTS = {
  default: 'bg-muted/50 text-muted-foreground border-border',
  warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export function FilterTag({ 
  label, 
  value, 
  onRemove,
  variant = 'default',
  className 
}: FilterTagProps) {
  if (value === 'todos' || value === 'todas' || !value) return null
  
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105',
        VARIANTS[variant],
        className
      )}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <button 
        onClick={onRemove}
        className="ml-0.5 hover:bg-white/10 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}