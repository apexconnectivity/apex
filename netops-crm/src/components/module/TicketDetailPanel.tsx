"use client"

import { useState } from 'react'
import { Plus, CheckCircle, Clock, AlertCircle, MessageSquare, Calendar, User, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActivityFeed } from '@/components/ui/activity-feed'
import { StatusBadge } from '@/components/module/StatusBadge'
import { BaseSidePanel, SidePanelHeader, SidePanelContent, SidePanelSection, SidePanelFooter } from '@/components/base'
import { Ticket, ComentarioTicket, EstadoTicket } from '@/types/soporte'
import { TICKET_DETALLE, TICKET_COMENTARIOS, TICKET_LABELS } from '@/constants/soporte'

interface TicketDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
  comentarios: ComentarioTicket[]
  onUpdate: (ticket: Ticket) => void
  onAddComentario: (comentario: string, es_interno: boolean) => void
  onChangeState: (estado: EstadoTicket) => void
}

/**
 * TicketDetailPanel - Panel lateral de detalles de ticket
 * 
 * Usa BaseSidePanel para la estructura y SidePanelHeader/Content/Footer
 * para una arquitectura reutilizable.
 */
export function TicketDetailPanel({
  isOpen,
  onClose,
  ticket,
  comentarios,
  onUpdate,
  onAddComentario,
  onChangeState,
}: TicketDetailPanelProps) {


  const isSlaBreached = ticket?.fecha_limite_respuesta &&
    new Date(ticket.fecha_limite_respuesta) < new Date() &&
    !ticket.fecha_primera_respuesta

  // Format fecha
  const formatFecha = (fecha?: string) => {
    if (!fecha) return TICKET_LABELS.noEspecificada
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleAddComentario = (comment: string, isInternal?: boolean) => {
    onAddComentario(comment, isInternal || false)
  }

  if (!ticket) return null

  return (
    <BaseSidePanel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      width="w-[400px]"
      variant="ticket"
    >
      {/* Header */}
      <SidePanelHeader
        variant="ticket"
        title={ticket.numero_ticket}
        subtitle={ticket.titulo}
      />

      {/* Contenido */}
      <SidePanelContent>
        {/* Tags de estado, categoría y prioridad */}
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={ticket.categoria} type="categoria" />
          <StatusBadge status={ticket.prioridad} type="prioridad" />
          <StatusBadge status={ticket.estado} type="estado" />
        </div>

        {/* Descripción */}
        {ticket.descripcion && (
          <p className="text-sm bg-muted/30 p-3 rounded-lg text-muted-foreground">
            {ticket.descripcion}
          </p>
        )}

        {/* Grid de información */}
        <SidePanelSection>
          <div className="grid grid-cols-2 gap-3">
            {/* Contrato */}
            <div className="bg-muted/30 rounded-lg p-3 col-span-2">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">{TICKET_LABELS.contrato}</span>
              </div>
              <span className="text-sm font-medium truncate block">
                {ticket.contrato_nombre}
              </span>
            </div>

            {/* Estado */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="text-xs">{TICKET_LABELS.estado}</span>
              </div>
              <select
                value={ticket.estado}
                onChange={(e) => onChangeState(e.target.value as EstadoTicket)}
                className="text-sm font-medium bg-transparent border-none outline-none w-full"
              >
                <option value="Abierto">Abierto</option>
                <option value="En proceso">En proceso</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>

            {/* Prioridad */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs">{TICKET_LABELS.prioridad}</span>
              </div>
              <span className="text-sm font-medium">{ticket.prioridad}</span>
            </div>

            {/* Creado */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">{TICKET_LABELS.creado}</span>
              </div>
              <span className="text-sm font-medium">{formatFecha(ticket.fecha_apertura)}</span>
            </div>

            {/* Responsable */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <User className="h-3.5 w-3.5" />
                <span className="text-xs">{TICKET_LABELS.responsable}</span>
              </div>
              <span className="text-sm font-medium">{ticket.responsable_nombre || TICKET_LABELS.sinAsignar}</span>
            </div>

            {/* SLA */}
            {ticket.fecha_limite_respuesta && (
              <div className={`bg-muted/30 rounded-lg p-3 col-span-2 ${isSlaBreached ? 'border border-red-500/50' : ''}`}>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">{TICKET_LABELS.sla}</span>
                  {isSlaBreached && (
                    <Badge variant="destructive" className="ml-auto text-xs">VENCIDO</Badge>
                  )}
                </div>
                <span className={`text-sm font-medium ${isSlaBreached ? 'text-red-400' : ''}`}>
                  {formatFecha(ticket.fecha_limite_respuesta)}
                </span>
              </div>
            )}
          </div>
        </SidePanelSection>

        {/* Comentarios */}
        <SidePanelSection>
          <ActivityFeed
            comments={comentarios}
            onAddComment={handleAddComentario}
            placeholder={TICKET_COMENTARIOS.placeholder}
            submitLabel={TICKET_COMENTARIOS.agregar}
            showDate
            showInternalToggle
            emptyMessage={TICKET_COMENTARIOS.noHayComentarios}
            title={TICKET_COMENTARIOS.titulo}
          />
        </SidePanelSection>
      </SidePanelContent>

      {/* Footer */}
      <SidePanelFooter>
        <Button variant="outline" onClick={() => onClose()}>
          Cerrar
        </Button>
      </SidePanelFooter>
    </BaseSidePanel>
  )
}
