import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
  children: ReactNode
  onClick?: () => void
  hover?: boolean
  className?: string
  noPadding?: boolean
}

export function ModuleCard({
  children,
  onClick,
  hover = true,
  className = '',
  noPadding = false
}: ModuleCardProps) {
  return (
    <Card
      className={cn(
        'bg-card border-border/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30 overflow-hidden',
        hover && 'card-hover-glow',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn(noPadding ? 'p-0' : 'p-4')}>
        {children}
      </CardContent>
    </Card>
  )
}
