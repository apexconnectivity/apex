'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <h4 className="font-medium text-sm text-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

interface SettingsRowProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsRow({
  label,
  description,
  children,
  className,
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

interface SettingsDividerProps {
  className?: string
}

export function SettingsDivider({ className }: SettingsDividerProps) {
  return (
    <div
      className={cn('h-px bg-border/50 my-4', className)}
    />
  )
}
