'use client'

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonInlineProps {
  onClick?: (e?: React.MouseEvent) => void
  icon: LucideIcon
  label: string
  className?: string
  disabled?: boolean
}

/**
 * ButtonInline - Botón pequeño para acciones inline en formularios y listas.
 * Estilo unificado: ghost, h-7, text-[10px], icono h-3 w-3, hover primary.
 * 
 * @example
 * ```tsx
 * <ButtonInline
 *   onClick={() => setIsModalOpen(true)}
 *   icon={Building2}
 *   label="Nueva empresa"
 * />
 * ```
 */
export function ButtonInline({
  onClick,
  icon: Icon,
  label,
  className,
  disabled = false,
}: ButtonInlineProps) {
  const handleClick = (e: React.MouseEvent) => {
    e?.stopPropagation()
    onClick?.(e)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-7 text-[10px] gap-1',
        disabled 
          ? 'text-muted-foreground opacity-50 cursor-not-allowed' 
          : 'hover:bg-primary/10 hover:text-primary',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Button>
  )
}
