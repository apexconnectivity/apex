'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface SettingsCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  action,
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-card p-6',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

interface SettingsCardContentProps {
  children: React.ReactNode
  className?: string
}

export function SettingsCardContent({
  children,
  className,
}: SettingsCardContentProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

interface SettingsCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function SettingsCardFooter({
  children,
  className,
}: SettingsCardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 pt-4 mt-4 border-t border-border/50',
        className
      )}
    >
      {children}
    </div>
  )
}
