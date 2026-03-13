import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { ModuleCard } from './ModuleCard'
import { StatusBadge } from './StatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ItemMeta {
  label: string
  value: string | number
  icon?: LucideIcon
}

interface ItemBadge {
  label: string
  type?: 'estado' | 'prioridad' | 'categoria' | 'tipo'
  customColor?: string
}

interface ItemCardProps {
  title: string
  subtitle?: string
  meta?: ItemMeta[]
  badges?: ItemBadge[]
  actions?: ReactNode
  onClick?: () => void
  className?: string
  children?: ReactNode
}

interface ProjectCardProps {
  title: string
  subtitle?: string
  progress?: number
  progressLabel?: string
  dueDate?: string
  value?: string
  assignee?: {
    name: string
    avatar?: string
  }
  tags?: { label: string; color?: string }[]
  onClick?: () => void
  onMenuClick?: () => void
  className?: string
  children?: ReactNode
}

function ItemCard({
  title,
  subtitle,
  meta,
  badges,
  actions,
  onClick,
  className = '',
  children
}: ItemCardProps) {
  return (
    <ModuleCard onClick={onClick} className={className}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{title}</h4>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
        
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, idx) => (
              <StatusBadge
                key={idx}
                status={badge.label}
                type={badge.type}
                customColor={badge.customColor}
              />
            ))}
          </div>
        )}
        
        {meta && meta.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {meta.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                {item.icon && <item.icon className="h-3 w-3" />}
                <span>{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {children}
      </div>
    </ModuleCard>
  )
}

function ProjectCard({
  title,
  subtitle,
  progress,
  progressLabel = 'Progreso',
  dueDate,
  value,
  assignee,
  tags,
  onClick,
  onMenuClick,
  className = '',
  children
}: ProjectCardProps) {
  return (
    <ModuleCard onClick={onClick} className={`group ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onMenuClick() }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>

      {progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{progressLabel}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, idx) => (
            <StatusBadge
              key={idx}
              status={tag.label}
              customColor={tag.color || 'bg-slate-500/20 text-slate-400'}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        {dueDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{dueDate}</span>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {value && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              {value}
            </span>
          )}
          {assignee && (
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="text-[10px]">
                {assignee.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {children}
    </ModuleCard>
  )
}

export { ItemCard, ProjectCard }
