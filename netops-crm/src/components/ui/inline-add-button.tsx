"use client"

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InlineAddButtonProps {
  onClick: () => void
  icon: LucideIcon
  label: string
  className?: string
  disabled?: boolean
}

/**
 * InlineAddButton - Botón pequeño para agregar nuevas entidades dentro de un select
 * 
 * @example
 * ```tsx
 * <InlineAddButton
 *   onClick={() => setIsModalOpen(true)}
 *   icon={Building2}
 *   label="Nueva empresa"
 * />
 * ```
 */
export function InlineAddButton({
  onClick,
  icon: Icon,
  label,
  className,
  disabled = false,
}: InlineAddButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 text-xs ${disabled ? 'text-muted-foreground opacity-50 cursor-not-allowed' : 'text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10'} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Button>
  )
}
