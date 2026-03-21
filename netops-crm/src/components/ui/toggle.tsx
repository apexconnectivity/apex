'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  onLabel?: string
  offLabel?: string
  className?: string
}

export function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  onLabel = 'Activo',
  offLabel = 'Inactivo',
  className,
}: ToggleProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button
        variant={checked ? 'default' : 'outline'}
        size="sm"
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'min-w-[80px] transition-all duration-200',
          checked
            ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500'
            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
        )}
      >
        {checked ? onLabel : offLabel}
      </Button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-foreground">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Alias for ToggleSwitch - matches common naming conventions
export const Switch = ToggleSwitch

// Variante pequeña conmutador para uso en tablas o listas
interface ToggleSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function ToggleSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-emerald-500' : 'bg-muted',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}
