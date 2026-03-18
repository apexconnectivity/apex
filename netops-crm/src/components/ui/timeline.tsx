"use client"

import { Clock, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Generic timeline event type
export interface TimelineEvent {
  id: string
  tipo_evento?: string
  descripcion: string
  fecha: string
  usuario_nombre?: string
  datos_anteriores?: Record<string, unknown>
  datos_nuevos?: Record<string, unknown>
}

interface TimelineProps {
  events: TimelineEvent[]
  title?: string
  emptyMessage?: string
  showUser?: boolean
  maxItems?: number
}

export function Timeline({
  events,
  title = 'Historial',
  emptyMessage = 'No hay actividad registrada',
  showUser = true,
  maxItems,
}: TimelineProps) {
  // Sort events by date (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  // Limit events if maxItems is specified
  const displayEvents = maxItems ? sortedEvents.slice(0, maxItems) : sortedEvents

  // Format date helper
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get icon based on event type
  const getEventIcon = (tipoEvento?: string) => {
    const type = tipoEvento?.toLowerCase() || ''

    if (type.includes('creacion') || type.includes('creado') || type.includes('creada')) {
      return '🟢'
    }
    if (type.includes('actualizacion') || type.includes('edit')) {
      return '🔵'
    }
    if (type.includes('cambio') || type.includes('cambiado')) {
      return '🟡'
    }
    if (type.includes('cierre') || type.includes('cerrado')) {
      return '🔴'
    }
    if (type.includes('archiv') || type.includes('archivo')) {
      return '📦'
    }
    if (type.includes('elimin') || type.includes('borrado')) {
      return '❌'
    }

    return '⚪'
  }

  // Get color based on event type
  const getEventColor = (tipoEvento?: string) => {
    const type = tipoEvento?.toLowerCase() || ''

    if (type.includes('creacion') || type.includes('creado') || type.includes('creada')) {
      return 'text-emerald-400'
    }
    if (type.includes('actualizacion') || type.includes('edit')) {
      return 'text-blue-400'
    }
    if (type.includes('cambio') || type.includes('cambiado')) {
      return 'text-amber-400'
    }
    if (type.includes('cierre') || type.includes('cerrado')) {
      return 'text-red-400'
    }
    if (type.includes('archiv') || type.includes('archivo')) {
      return 'text-purple-400'
    }

    return 'text-muted-foreground'
  }

  return (
    <div className="space-y-3">
      {/* Title */}
      {title && (
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {title} ({events.length})
        </h3>
      )}

      {/* Timeline */}
      <div className="space-y-1">
        {displayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-2 top-3 bottom-3 w-px bg-border" />

            {displayEvents.map((event, index) => (
              <div key={event.id} className="relative flex gap-3 py-2">
                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs",
                    getEventColor(event.tipo_evento)
                  )}
                >
                  <span className="text-xs">{getEventIcon(event.tipo_evento)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{event.descripcion}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatFecha(event.fecha)}</span>

                    {showUser && event.usuario_nombre && (
                      <>
                        <ChevronRight className="h-3 w-3" />
                        <User className="h-3 w-3" />
                        <span>{event.usuario_nombre}</span>
                      </>
                    )}
                  </div>

                  {/* Show data changes if available */}
                  {(event.datos_anteriores || event.datos_nuevos) && (
                    <div className="mt-2 p-2 bg-muted/30 rounded text-xs space-y-1">
                      {event.datos_anteriores && (
                        <div className="text-muted-foreground">
                          <span className="text-red-400">- </span>
                          {JSON.stringify(event.datos_anteriores)}
                        </div>
                      )}
                      {event.datos_nuevos && (
                        <div className="text-muted-foreground">
                          <span className="text-emerald-400">+ </span>
                          {JSON.stringify(event.datos_nuevos)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
