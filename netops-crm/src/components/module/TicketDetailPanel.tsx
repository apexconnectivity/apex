"use client"

import { useState } from 'react'
import { X, Plus, CheckCircle, Clock, AlertCircle, MessageSquare, Calendar, User, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/module/StatusBadge'
import { Ticket, ComentarioTicket, EstadoTicket } from '@/types/soporte'
import { getStatusColor } from '@/lib/colors'
import { TICKET_DETALLE, TICKET_ACCIONES, TICKET_COMENTARIOS, TICKET_PANEL_EMPTY, SOPORTE_CONTRATOS } from '@/constants/soporte'

interface TicketDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
  comentarios: ComentarioTicket[]
  onUpdate: (ticket: Ticket) => void
  onAddComentario: (comentario: string, es_interno: boolean) => void
  onChangeState: (estado: EstadoTicket) => void
}

export function TicketDetailPanel({
  isOpen,
  onClose,
  ticket,
  comentarios,
  onUpdate,
  onAddComentario,
  onChangeState,
}: TicketDetailPanelProps) {
  const [newComentario, setNewComentario] = useState('')
  const [esInterno, setEsInterno] = useState(false)

  const isSlaBreached = ticket?.fecha_limite_respuesta && new Date(ticket.fecha_limite_respuesta) < new Date() && !ticket.fecha_primera_respuesta

  // Format fecha
  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Panel lateral */}
      <div className="h-full flex flex-col">
        {/* Header del panel */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">{ticket?.numero_ticket || TICKET_DETALLE.titulo}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          {ticket ? (
            <>
              {/* Tags de estado, categoría y prioridad */}
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={ticket.categoria} type="categoria" />
                <StatusBadge status={ticket.prioridad} type="prioridad" />
                <StatusBadge status={ticket.estado} type="estado" />
              </div>

              {/* Título */}
              <h3 className="font-semibold text-foreground text-lg">{ticket.titulo}</h3>

              {/* Descripción */}
              {ticket.descripcion && (
                <p className="text-sm bg-muted/30 p-3 rounded-lg text-muted-foreground">
                  {ticket.descripcion}
                </p>
              )}

              {/* Grid de información */}
              <div className="grid grid-cols-2 gap-3">
                {/* Contrato */}
                <div className="bg-muted/30 rounded-lg p-3 col-span-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">{TICKET_DETALLE.contrato}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground truncate block">
                    {ticket.contrato_nombre}
                  </span>
                </div>

                {/* Abierto por */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">{TICKET_DETALLE.abiertoPor}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground truncate block">
                    {ticket.creado_por_nombre}
                    {ticket.creado_por_cliente && <Badge variant="outline" className="ml-1 text-xs">Cliente</Badge>}
                  </span>
                </div>

                {/* Responsable */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">{TICKET_DETALLE.responsable}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground truncate block">
                    {ticket.responsable_nombre || SOPORTE_CONTRATOS.sinAsignar}
                  </span>
                </div>

                {/* Fecha apertura */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{TICKET_DETALLE.apertura}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatFecha(ticket.fecha_apertura)}
                  </span>
                </div>

                {/* Tiempo invertido */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{TICKET_DETALLE.tiempo}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {Math.floor(ticket.tiempo_invertido_minutos / 60)}h {ticket.tiempo_invertido_minutos % 60}m
                  </span>
                </div>

                {/* Fecha cierre */}
                {ticket.fecha_cierre && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="text-xs">{TICKET_DETALLE.cerrado}</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor('success').text}`}>
                      {formatFecha(ticket.fecha_cierre)}
                    </span>
                  </div>
                )}
              </div>

              {/* Alerta SLA */}
              {isSlaBreached && (
                <div className={`${getStatusColor('error').bg} border ${getStatusColor('error').bg.replace('bg-', 'border-').replace('/15', '/30')} p-3 rounded-lg flex items-center gap-2`}>
                  <AlertCircle className={`h-5 w-5 ${getStatusColor('error').text}`} />
                  <span className={`text-sm ${getStatusColor('error').text} font-medium`}>{TICKET_DETALLE.slaIncumplido}</span>
                </div>
              )}

              {/* Botones de acción */}
              {ticket.estado !== 'Cerrado' && (
                <div className="border-t border-border pt-4 flex flex-wrap gap-2">
                  {ticket.estado === 'Abierto' && (
                    <Button onClick={() => onChangeState('En progreso')} className="flex-1">
                      <Clock className="h-4 w-4 mr-2" />{TICKET_ACCIONES.iniciarTrabajo}
                    </Button>
                  )}
                  {ticket.estado === 'En progreso' && (
                    <>
                      <Button onClick={() => onChangeState('Esperando cliente')} className="flex-1">
                        {TICKET_ACCIONES.esperarCliente}
                      </Button>
                      <Button onClick={() => onChangeState('Resuelto')} variant="outline" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />{TICKET_ACCIONES.marcarResuelto}
                      </Button>
                    </>
                  )}
                  {ticket.estado === 'Esperando cliente' && (
                    <Button onClick={() => onChangeState('Resuelto')} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />{TICKET_ACCIONES.marcarResuelto}
                    </Button>
                  )}
                  {ticket.estado === 'Resuelto' && (
                    <Button onClick={() => onChangeState('Cerrado')} className="flex-1">
                      <X className="h-4 w-4 mr-2" />{TICKET_ACCIONES.cerrarTicket}
                    </Button>
                  )}
                </div>
              )}

              {/* Comentarios */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    {TICKET_COMENTARIOS.titulo}
                  </h3>
                  <Badge variant="secondary" className="text-xs">{comentarios.length}</Badge>
                </div>

                {/* Lista de comentarios */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {comentarios.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      {TICKET_COMENTARIOS.noHayComentarios}
                    </div>
                  ) : (
                    comentarios.map(c => (
                      <div key={c.id} className={`rounded-lg p-3 ${c.es_interno ? `${getStatusColor('warning').bg} border ${getStatusColor('warning').bg.replace('bg-', 'border-').replace('/15', '/30')}` : 'bg-muted/30'}`}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-muted-foreground flex items-center gap-1">
                            {c.usuario_nombre}
                            {c.es_interno && <Badge variant="outline" className="ml-1 text-[10px] h-4">Interno</Badge>}
                          </span>
                          <span className="text-muted-foreground">{new Date(c.fecha).toLocaleString('es-ES')}</span>
                        </div>
                        <p className="text-sm text-foreground">{c.comentario}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Agregar comentario */}
                <div className="flex gap-2">
                  <Input
                    placeholder={TICKET_COMENTARIOS.placeholder}
                    value={newComentario}
                    onChange={(e) => setNewComentario(e.target.value)}
                    className="bg-muted/50 border-input text-foreground text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newComentario) {
                        onAddComentario(newComentario, esInterno)
                        setNewComentario('')
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={() => {
                      if (newComentario) {
                        onAddComentario(newComentario, esInterno)
                        setNewComentario('')
                      }
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="interno-ticket"
                    checked={esInterno}
                    onChange={(e) => setEsInterno(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="interno-ticket" className="text-sm text-muted-foreground">{TICKET_COMENTARIOS.interno}</Label>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">{TICKET_PANEL_EMPTY.seleccionarTicket}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
