"use client"

import { CheckCircle2, Circle, Clock, AlertCircle, Calendar, User, Link2, FileText, MessageSquare, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/module/StatusBadge'
import { type Tarea, type EstadoTarea } from '@/types/tareas'

// ============================================================================
// PROPS
// ============================================================================

export interface TaskCardProps {
  tarea: Tarea
  /** Mostrar nombre del proyecto */
  showProject?: boolean
  /** Mostrar nombre del cliente */
  showClient?: boolean
  /** Modo de visualización */
  variant?: 'default' | 'compact' | 'kanban'
  /** Estado de drag (para Kanban) */
  isDragging?: boolean
  /** Cantidad de comentarios */
  commentCount?: number
  /** Cantidad de archivos adjuntos */
  attachmentCount?: number
  /** Mostrar indicador de dependencias */
  showDependencies?: boolean
  /** Callback cuando se hace clic en la tarjeta */
  onClick?: () => void
  /** Callback para completar tarea */
  onComplete?: () => void
  /** Clase CSS adicional */
  className?: string
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtiene el icono según el estado de la tarea
 */
function getEstadoIcon(estado: EstadoTarea, className?: string) {
  const baseClass = cn('flex-shrink-0', className)
  switch (estado) {
    case 'Completada':
      return <CheckCircle2 className={cn('h-5 w-5 text-emerald-400', baseClass)} />
    case 'En progreso':
      return <Clock className={cn('h-5 w-5 text-blue-400 animate-pulse', baseClass)} />
    case 'Bloqueada':
      return <AlertCircle className={cn('h-5 w-5 text-red-400', baseClass)} />
    default:
      return <Circle className={cn('h-5 w-5 text-slate-400', baseClass)} />
  }
}

/**
 * Obtiene las clases de texto según el estado
 */
function getEstadoTextClass(estado: EstadoTarea): string {
  switch (estado) {
    case 'Completada':
      return 'line-through text-muted-foreground'
    case 'En progreso':
      return 'text-foreground'
    case 'Bloqueada':
      return 'text-red-400'
    default:
      return 'text-foreground'
  }
}

/**
 * Formatea una fecha para mostrar
 */
function formatDate(dateString?: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Si es hoy
  if (date.toDateString() === now.toDateString()) {
    return 'Hoy'
  }
  
  // Si es mañana
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Mañana'
  }
  
  // Si está vencida
  if (date < now) {
    return `Vencida (${Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))}d)`
  }
  
  return date.toLocaleDateString('es-ES', options || { day: '2-digit', month: 'short' })
}

/**
 * Obtiene el color de la fecha según proximidad
 */
function getDateColor(dateString?: string): string {
  if (!dateString) return 'text-muted-foreground'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-400' // Vencida
  if (diffDays === 0) return 'text-red-400 font-medium' // Hoy
  if (diffDays <= 2) return 'text-amber-400' // Muy próximo
  if (diffDays <= 7) return 'text-blue-400' // Esta semana
  return 'text-muted-foreground'
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * TaskCard - Tarjeta reutilizable para mostrar tareas
 * 
 * Características:
 * - Múltiples variantes de visualización (default, compact, kanban)
 * - Muestra información contextual: proyecto, cliente, fechas, dependencias
 * - Acciones rápidas: completar, ver detalle
 * - Indicadores visuales de estado y prioridad
 * - Compatible con drag & drop para Kanban
 */
export function TaskCard({
  tarea,
  showProject = true,
  showClient = true,
  variant = 'default',
  isDragging = false,
  commentCount = 0,
  attachmentCount = 0,
  showDependencies = true,
  onClick,
  onComplete,
  className,
}: TaskCardProps) {
  const hasDependencies = showDependencies && tarea.dependencias && tarea.dependencias.length > 0
  const isCompleted = tarea.estado === 'Completada'
  
  // Determinar si la fecha está vencida
  const isOverdue = tarea.fecha_vencimiento && 
    new Date(tarea.fecha_vencimiento) < new Date() && 
    !isCompleted

  // ========================================================================
  // RENDER: VARIANT KANBAN
  // ========================================================================
  if (variant === 'kanban') {
    return (
      <div
        className={cn(
          'group relative bg-card rounded-lg border border-border/50 p-3',
          'hover:border-primary/30 hover:shadow-md transition-all duration-200',
          'cursor-pointer',
          isDragging && 'opacity-50 shadow-lg rotate-2',
          isCompleted && 'opacity-60',
          isOverdue && 'border-red-500/30',
          className
        )}
        onClick={onClick}
      >
        {/* Indicador de categoría (strip lateral) */}
        <div className={cn(
          'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
          tarea.categoria === 'Técnica' && 'bg-purple-500',
          tarea.categoria === 'Comercial' && 'bg-violet-500',
          tarea.categoria === 'Compras' && 'bg-emerald-500',
          tarea.categoria === 'Administrativa' && 'bg-amber-500',
          tarea.categoria === 'General' && 'bg-slate-500',
        )} />
        
        {/* Contenido */}
        <div className="pl-2 space-y-2">
          {/* Header: Prioridad + Estado */}
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={tarea.prioridad} type="prioridad" />
            {getEstadoIcon(tarea.estado, 'h-4 w-4')}
          </div>
          
          {/* Título */}
          <h4 className={cn(
            'text-sm font-medium line-clamp-2 leading-tight',
            getEstadoTextClass(tarea.estado)
          )}>
            {tarea.nombre}
          </h4>
          
          {/* Meta info */}
          <div className="space-y-1.5">
            {/* Fecha */}
            {tarea.fecha_vencimiento && (
              <div className={cn(
                'flex items-center gap-1.5 text-xs',
                getDateColor(tarea.fecha_vencimiento)
              )}>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(tarea.fecha_vencimiento)}</span>
              </div>
            )}
            
            {/* Responsable o Cliente */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {tarea.asignado_a_cliente ? (
                <>
                  <User className="h-3 w-3" />
                  <span className="truncate">{tarea.contacto_cliente_nombre || 'Cliente'}</span>
                </>
              ) : tarea.responsable_nombre ? (
                <>
                  <User className="h-3 w-3" />
                  <span className="truncate">{tarea.responsable_nombre}</span>
                </>
              ) : null}
            </div>
          </div>
          
          {/* Footer: indicadores adicionales */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            <div className="flex items-center gap-2">
              {commentCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{commentCount}</span>
                </div>
              )}
              {attachmentCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{attachmentCount}</span>
                </div>
              )}
              {hasDependencies && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Link2 className="h-3 w-3" />
                  <span>{tarea.dependencias?.length}</span>
                </div>
              )}
            </div>
            
            {/* Botón completar rápido */}
            {!isCompleted && onComplete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  onComplete()
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ========================================================================
  // RENDER: VARIANT COMPACT
  // ========================================================================
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors',
          'cursor-pointer',
          isCompleted && 'opacity-60',
          className
        )}
        onClick={onClick}
      >
        {/* Checkbox */}
        {!isCompleted && onComplete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onComplete()
            }}
          >
            <Circle className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
        {isCompleted && (
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        )}
        
        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium truncate',
            getEstadoTextClass(tarea.estado)
          )}>
            {tarea.nombre}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {showProject && tarea.proyecto_nombre && (
              <span className="truncate">{tarea.proyecto_nombre}</span>
            )}
            {tarea.fecha_vencimiento && (
              <span className={cn(
                'shrink-0',
                getDateColor(tarea.fecha_vencimiento)
              )}>
                {formatDate(tarea.fecha_vencimiento)}
              </span>
            )}
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={tarea.prioridad} type="prioridad" />
          <StatusBadge status={tarea.categoria} type="categoria" />
        </div>
      </div>
    )
  }

  // ========================================================================
  // RENDER: VARIANT DEFAULT
  // ========================================================================
  return (
    <div
      className={cn(
        'group bg-card rounded-xl border border-border/50 p-4',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        'transition-all duration-200',
        'cursor-pointer',
        isDragging && 'opacity-50 shadow-xl',
        isCompleted && 'opacity-75',
        isOverdue && 'border-red-500/30 bg-red-500/5',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {getEstadoIcon(tarea.estado)}
          <h4 className={cn(
            'text-sm font-semibold leading-tight line-clamp-2',
            getEstadoTextClass(tarea.estado)
          )}>
            {tarea.nombre}
          </h4>
        </div>
        
        {/* Acciones rápidas */}
        {!isCompleted && onComplete && (
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onComplete()
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-400" />
            Completar
          </Button>
        )}
      </div>

      {/* Descripción (si existe y no es muy larga) */}
      {tarea.descripcion && tarea.descripcion.length < 100 && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {tarea.descripcion}
        </p>
      )}

      {/* Badges de estado */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <StatusBadge status={tarea.estado} />
        <StatusBadge status={tarea.prioridad} type="prioridad" />
        <StatusBadge status={tarea.categoria} type="categoria" />
      </div>

      {/* Información contextual */}
      <div className="space-y-2 text-xs">
        {/* Proyecto */}
        {showProject && tarea.proyecto_nombre && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tarea.proyecto_nombre}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
              Fase {tarea.fase_origen}
            </Badge>
          </div>
        )}

        {/* Cliente */}
        {showClient && tarea.asignado_a_cliente && tarea.contacto_cliente_nombre && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tarea.contacto_cliente_nombre}</span>
          </div>
        )}

        {/* Responsable interno */}
        {!tarea.asignado_a_cliente && tarea.responsable_nombre && (
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 shrink-0">
              <AvatarFallback className="text-[10px]">
                {tarea.responsable_nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{tarea.responsable_nombre}</span>
          </div>
        )}

        {/* Fecha de vencimiento */}
        {tarea.fecha_vencimiento && (
          <div className={cn(
            'flex items-center gap-2',
            getDateColor(tarea.fecha_vencimiento)
          )}>
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>Vence: {formatDate(tarea.fecha_vencimiento, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            {isOverdue && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ml-auto">
                Vencida
              </Badge>
            )}
          </div>
        )}

        {/* Dependencias */}
        {hasDependencies && (
          <div className="flex items-center gap-2 text-amber-400">
            <Link2 className="h-3.5 w-3.5 shrink-0" />
            <span>
              {tarea.dependencias!.length} dependencia{tarea.dependencias!.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Footer: comentarios y archivos */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {commentCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{commentCount}</span>
            </div>
          )}
          {attachmentCount > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{attachmentCount}</span>
            </div>
          )}
        </div>
        
        {/* Indicador de drag (Kanban) */}
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-50 transition-opacity cursor-grab" />
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { getEstadoIcon, getEstadoTextClass, formatDate, getDateColor }
