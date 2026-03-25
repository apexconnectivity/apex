import { ReactNode } from 'react'
import { BaseCard } from '@/components/base'

interface ModuleCardProps {
  children: ReactNode
  onClick?: () => void
  hover?: boolean
  className?: string
  noPadding?: boolean
  borderColor?: string
}

/**
 * ModuleCard - Card base para módulos
 * 
 * Usa BaseCard como estructura base.
 * Proporciona efectos de hover y glow por defecto.
 */
export function ModuleCard({
  children,
  onClick,
  hover = true,
  className = '',
  noPadding = false,
  borderColor
}: ModuleCardProps) {
  return (
    <BaseCard
      hoverable={hover}
      clickable={!!onClick}
      onClick={onClick}
      glowOnHover={hover}
      padding={noPadding ? 'none' : 'md'}
      className={className}
      borderColor={borderColor}
    >
      {children}
    </BaseCard>
  )
}
