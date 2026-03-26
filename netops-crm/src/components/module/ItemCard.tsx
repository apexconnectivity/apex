import { ReactNode } from 'react'
import { LucideIcon, AlertTriangle, Calendar, Pencil } from 'lucide-react'
import { ModuleCard } from './ModuleCard'
import { StatusBadge } from './StatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ButtonInline } from '@/components/ui/button-inline'
import { getProjectCardProgressColor, getProjectCardTaskDotColor, getProjectCardFaseColor, getBadgeColorByLabel } from '@/lib/colors'

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

// ============================================================================
// KanbanCard - Componente base para tarjetas de Kanban/Pipeline
// Usado por: Proyectos, Tareas, Soporte
// ============================================================================

interface KanbanCardProps {
  /** Título principal */
  title: string
  /** Subtítulo/descripción breve */
  subtitle?: string
  /** Color del indicador lateral (borde) */
  indicatorColor?: string
  /** Fecha de vencimiento */
  dueDate?: string
  /** Etiquetas/badges (incluye badge principal como primer elemento si se desea) */
  badges?: { label: string; color?: string }[]
  /** Responsable */
  assignee?: {
    name: string
    avatar?: string
  }
  /** Progress bar */
  progress?: number
  progressLabel?: string
  /** Valor monetario */
  value?: string
  /** Click handler */
  onClick?: () => void
  /** Clase CSS adicional */
  className?: string
  /** Contenido adicional */
  children?: ReactNode
}

/**
 * KanbanCard - Tarjeta base para pipelines/Kanban
 * Incluye:
 * - Borde lateral coloreable según tipo/estado/fase
 * - Título y subtítulo
 * - Progress bar opcional
 * - Badges/etiquetas
 * - Responsable con avatar
 * - Fecha
 */
export function KanbanCard({
  title,
  subtitle,
  indicatorColor,
  dueDate,
  badges,
  assignee,
  progress,
  progressLabel = 'Progreso',
  value,
  onClick,
  className = '',
  children
}: KanbanCardProps) {
  return (
    <ModuleCard 
      onClick={onClick} 
      className={`group relative ${className}`}
      borderColor={indicatorColor}
    >
      {/* Indicador lateral de color */}
      {indicatorColor && (
        <div 
          className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
          style={{ backgroundColor: indicatorColor }}
        />
      )}
      
      <div className="flex items-start justify-between mb-2">
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
      </div>

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {badges.map((b, idx) => {
            // Color automático según el texto del badge
            const badgeColor = b.color || getBadgeColorByLabel(b.label)
            return (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{ 
                  backgroundColor: `${badgeColor}20`, 
                  color: badgeColor 
                }}
              >
                {b.label}
              </span>
            )
          })}
        </div>
      )}

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{progressLabel}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: indicatorColor 
                  ? `linear-gradient(to right, ${indicatorColor}, ${indicatorColor}80)`
                  : getProjectCardProgressColor(progress),
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        {dueDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{dueDate}</span>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {value && (
            <span className="text-xs font-medium text-emerald-400">
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

interface ProjectCardProps {
  title: string
  subtitle?: string
  progress?: number
  progressLabel?: string
  dueDate?: string
  value?: string
  fase?: number
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
  fase,
  assignee,
  tags,
  tasksInfo,
  onClick,
  onMenuClick,
  className = '',
  children
}: ProjectCardProps) {
  // Obtener colores según la fase del proyecto
  const faseColors = fase ? getProjectCardFaseColor(fase) : null

  // ========================================================================
  // RENDER: ProjectCard (usa KanbanCard como base)
  // ========================================================================
  return (
    <KanbanCard
      title={title}
      subtitle={subtitle}
      indicatorColor={faseColors?.border}
      progress={progress}
      progressLabel={progressLabel}
      dueDate={dueDate}
      value={value}
      assignee={assignee}
      badges={tags?.map(tag => ({ label: tag.label || String(tag) }))}
      onClick={onClick}
      className={className}
    >
      {/* Badge de fase adicional */}
      {faseColors && (
        <div className="mb-2 flex items-center gap-2">
          <span 
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${faseColors.badge.bg} ${faseColors.badge.text} border ${faseColors.badge.border}`}
          >
            Fase {fase}
          </span>
        </div>
      )}

      {/* Info de tareas (solo si hay) */}
      {tasksInfo && tasksInfo.total > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {tasksInfo.completadas}/{tasksInfo.total} tareas
            </span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(tasksInfo.total, 8) }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full ring-1 ring-white/20"
                  style={{
                    backgroundColor: getProjectCardTaskDotColor(
                      i,
                      tasksInfo.completadas,
                      tasksInfo.enProgreso
                    ),
                  }}
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
        </div>
      )}

      {/* Menú de edición */}
      {onMenuClick && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ButtonInline
            onClick={() => onMenuClick()}
            icon={Pencil}
            label="Editar"
          />
        </div>
      )}

      {children}
    </KanbanCard>
  )
}

export { ItemCard, ProjectCard }
