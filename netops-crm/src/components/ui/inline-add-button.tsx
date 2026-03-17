"use client"

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InlineAddButtonProps {
  onClick: () => void
  icon: LucideIcon
  label: string
  className?: string
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
}: InlineAddButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 text-xs text-muted-foreground hover:text-foreground ${className || ''}`}
      onClick={onClick}
    >
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Button>
  )
}
