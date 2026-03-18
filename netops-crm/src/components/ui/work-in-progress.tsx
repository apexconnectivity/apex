'use client'

import { LucideIcon, Construction } from 'lucide-react'

interface WorkInProgressCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function WorkInProgressCard({
  title,
  description,
  icon: Icon = Construction,
  action,
  className,
}: WorkInProgressCardProps) {
  return (
    <div className={`p-6 rounded-xl border border-border/50 bg-card ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && (
        <p className="text-sm text-muted-foreground">
          {action.label}{' '}
          <a href={action.href} className="text-primary hover:underline">
            página de perfil
          </a>
          .
        </p>
      )}
    </div>
  )
}
