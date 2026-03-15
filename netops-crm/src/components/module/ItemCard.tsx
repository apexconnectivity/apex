import { ReactNode } from 'react'
import { LucideIcon, MoreHorizontal, AlertTriangle, Calendar } from 'lucide-react'
import { ModuleCard } from './ModuleCard'
import { StatusBadge } from './StatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatDateShort } from '@/lib/date-utils'

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
  tasksInfo?: {
    total: number
    completadas: number
    enProgreso: number
    bloqueadas: number
    proximaVence: string | null
  }
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
  tasksInfo,
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
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
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
              className="bg-slate-700/50 text-slate-300 text-xs hover:bg-slate-700/70"
            />
          ))}
        </div>
      )}

      {tasksInfo && tasksInfo.total > 0 && (
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {tasksInfo.completadas}/{tasksInfo.total} tareas
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: tasksInfo.total }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < tasksInfo.completadas ? 'bg-emerald-500' :
                    i < tasksInfo.completadas + tasksInfo.enProgreso ? 'bg-blue-500' :
                    'bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {tasksInfo.bloqueadas > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{tasksInfo.bloqueadas} bloqueada{tasksInfo.bloqueadas > 1 ? 's' : ''}</span>
            </div>
          )}
          
          {tasksInfo.proximaVence && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Vence: {formatDateShort(tasksInfo.proximaVence)}</span>
            </div>
          )}
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
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-[10px]">
                  {assignee.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                {assignee.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {children}
    </ModuleCard>
  )
}

export { ItemCard, ProjectCard }
