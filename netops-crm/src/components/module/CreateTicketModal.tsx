"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Ticket, Building2, Briefcase, User, AlertCircle, Info, Calendar } from 'lucide-react'
import { Ticket as TicketType, ContratoSoporte, CategoriaTicket, PrioridadTicket, EstadoTicket, CATEGORIAS_TICKET, PRIORIDADES_TICKET, ESTADOS_TICKET } from '@/types/soporte'
import { Empresa } from '@/types/crm'
import { Proyecto } from '@/types/proyectos'
import { CREATE_TICKET_MODAL } from '@/constants/soporte'

export type TicketModalMode = 'create' | 'edit' | 'cliente'

interface CreateTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contratos: ContratoSoporte[]
  empresas: Empresa[]
  proyectos?: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  mode?: TicketModalMode
  ticket?: TicketType | null
  onSave: (data: CreateTicketData) => void
  onDelete?: () => void
}

export interface CreateTicketData {
  mode: 'create' | 'edit'
  ticket: Omit<TicketType, 'id' | 'numero_ticket' | 'creado_en' | 'creado_por' | 'creado_por_nombre' | 'creado_por_cliente' | 'fecha_apertura'>
}

type TicketFormData = Omit<TicketType, 'id' | 'numero_ticket' | 'creado_en' | 'creado_por' | 'creado_por_nombre' | 'creado_por_cliente' | 'fecha_apertura'>

// Función para auto-asignar responsable según categoría
function getSuggestedResponsable(
  categoria: CategoriaTicket,
  contratos: ContratoSoporte[],
  usuarios: { id: string; nombre: string; rol: string }[],
  empresaId?: string
): { id: string; nombre: string } | null {
  const activeContracts = contratos.filter(c => c.estado === 'Activo')

  switch (categoria) {
    case 'Soporte técnico': {
      // Buscar técnico asignado del contrato de esta empresa
      const contrato = empresaId ? activeContracts.find(c => c.empresa_id === empresaId) : null
      if (contrato?.tecnico_asignado_id && contrato.tecnico_asignado_nombre) {
        return { id: contrato.tecnico_asignado_id, nombre: contrato.tecnico_asignado_nombre }
      }
      // Si no hay contrato, buscar cualquier técnico
      const tecnico = usuarios.find(u => u.rol === 'tecnico' || u.rol === 'admin')
      if (tecnico) return { id: tecnico.id, nombre: tecnico.nombre }
      return null
    }
    case 'Consulta comercial': {
      // Buscar comercial de la empresa (futuro: campo en Empresa)
      const comercial = usuarios.find(u => u.rol === 'comercial')
      if (comercial) return { id: comercial.id, nombre: comercial.nombre }
      return null
    }
    case 'Facturación': {
      const facturacion = usuarios.find(u => u.rol === 'facturacion')
      if (facturacion) return { id: facturacion.id, nombre: facturacion.nombre }
      return null
    }
    case 'Compras': {
      const compras = usuarios.find(u => u.rol === 'compras')
      if (compras) return { id: compras.id, nombre: compras.nombre }
      return null
    }
    case 'Otro':
    default:
      return null
  }
}

function TicketFormFields({
  ticket,
  setTicket,
  contratos,
  empresas,
  proyectos,
  usuarios,
  mode,
  disabled
}: {
  ticket: TicketFormData
  setTicket: React.Dispatch<React.SetStateAction<TicketFormData>>
  contratos: ContratoSoporte[]
  empresas: Empresa[]
  proyectos?: Proyecto[]
  usuarios: { id: string; nombre: string; rol: string }[]
  mode?: TicketModalMode
  disabled?: boolean
}) {
  const activeContracts = contratos.filter(c => c.estado === 'Activo')
  const clientEmpresas = empresas.filter(e => e.tipo_entidad === 'cliente' || e.tipo_entidad === 'ambos')

  // Proyectos activos ( filtrar por empresa seleccionada si aplica)
  const proyectosActivos = useMemo(() => {
    if (!proyectos) return []
    return proyectos.filter(p => p.estado === 'activo')
  }, [proyectos])

  // Contratos de la empresa seleccionada
  const contratosFiltrados = useMemo(() => {
    if (!ticket.empresa_id) return activeContracts
    return activeContracts.filter(c => c.empresa_id === ticket.empresa_id)
  }, [activeContracts, ticket.empresa_id])

  // Manejar cambio de categoría - auto-asignar responsable
  const handleCategoriaChange = (categoria: CategoriaTicket) => {
    const sugerido = getSuggestedResponsable(categoria, contratos, usuarios, ticket.empresa_id)
    setTicket({
      ...ticket,
      categoria,
      responsable_id: sugerido?.id || '',
      responsable_nombre: sugerido?.nombre || ''
    })
  }

  // Manejar cambio de empresa
  const handleEmpresaChange = (empresaId: string) => {
    const empresa = empresas.find(e => e.id === empresaId)
    // NO auto-seleccionar contrato - dejar que el usuario elija
    setTicket({
      ...ticket,
      empresa_id: empresaId,
      empresa_nombre: empresa?.nombre || '',
      contrato_id: '',
      contrato_nombre: '',
    })
  }

  // Manejar cambio de contrato
  const handleContratoChange = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId)
    if (contrato) {
      setTicket({
        ...ticket,
        contrato_id: contratoId,
        contrato_nombre: contrato.nombre,
        tipo_origen: 'soporte',
        proyecto_id: '',
        proyecto_nombre: '',
      })
    }
  }

  // Manejar cambio de proyecto
  const handleProyectoChange = (proyectoId: string) => {
    const proyecto = proyectos?.find(p => p.id === proyectoId)
    if (proyecto) {
      // Si es proyecto, el tipo origen es proyecto
      setTicket({
        ...ticket,
        proyecto_id: proyectoId,
        proyecto_nombre: proyecto.nombre,
        tipo_origen: 'proyecto',
        contrato_id: undefined,
        contrato_nombre: undefined,
      })
    }
  }

  const isClienteMode = mode === 'cliente'
  const isEditMode = mode === 'edit'

  // Mostrar responsable sugerido
  const suggestedResponsable = getSuggestedResponsable(ticket.categoria, contratos, usuarios, ticket.empresa_id)

  return (
    <div className="space-y-4">
      {/* Selector de Cliente (solo interno) */}
      {!isClienteMode && (
        <div>
          <Label>{CREATE_TICKET_MODAL.labels.cliente}</Label>
          <Select
            value={ticket.empresa_id || ''}
            onValueChange={handleEmpresaChange}
            disabled={disabled || isEditMode}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={CREATE_TICKET_MODAL.placeholders.seleccionarCliente} />
            </SelectTrigger>
            <SelectContent>
              {clientEmpresas.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tipo de origen: Contrato o Proyecto */}
      {!isClienteMode && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{CREATE_TICKET_MODAL.labels.tipoTicket}</Label>
            <Select
              value={ticket.tipo_origen}
              onValueChange={(v) => setTicket({ ...ticket, tipo_origen: v as 'soporte' | 'proyecto' })}
              disabled={disabled || isEditMode}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soporte">{CREATE_TICKET_MODAL.opciones.contratoSoporte}</SelectItem>
                <SelectItem value="proyecto">{CREATE_TICKET_MODAL.opciones.proyecto}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ticket.tipo_origen === 'soporte' ? (
            <div>
              <Label>{CREATE_TICKET_MODAL.labels.contrato}</Label>
              <Select
                value={ticket.contrato_id || ''}
                onValueChange={handleContratoChange}
                disabled={disabled || isEditMode || !ticket.empresa_id}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={CREATE_TICKET_MODAL.placeholders.seleccionarContrato} />
                </SelectTrigger>
                <SelectContent>
                  {contratosFiltrados.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>{CREATE_TICKET_MODAL.labels.proyecto}</Label>
              <Select
                value={ticket.proyecto_id || ''}
                onValueChange={handleProyectoChange}
                disabled={disabled || isEditMode}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={CREATE_TICKET_MODAL.placeholders.seleccionarProyecto} />
                </SelectTrigger>
                <SelectContent>
                  {proyectosActivos.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* En modo cliente: mostrar contratos disponibles */}
      {isClienteMode && (
        <div>
          <Label>{CREATE_TICKET_MODAL.opciones.contratoSoporte} *</Label>
          <Select
            value={ticket.contrato_id || ''}
            onValueChange={(v) => {
              const contrato = contratos.find(c => c.id === v)
              setTicket({
                ...ticket,
                contrato_id: v,
                contrato_nombre: contrato?.nombre || '',
                empresa_id: contrato?.empresa_id || '',
                empresa_nombre: contrato?.empresa_nombre || '',
              })
            }}
            disabled={disabled}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={CREATE_TICKET_MODAL.placeholders.seleccionarContrato} />
            </SelectTrigger>
            <SelectContent>
              {activeContracts.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.empresa_nombre} - {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Categoría */}
      <div>
        <Label>{CREATE_TICKET_MODAL.labels.categoria}</Label>
        <Select
          value={ticket.categoria}
          onValueChange={(v) => handleCategoriaChange(v as CategoriaTicket)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS_TICKET.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Mostrar sugerencia de auto-asignación */}
        {!isClienteMode && suggestedResponsable && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>{CREATE_TICKET_MODAL.sugerencias.seAsignara} <strong>{suggestedResponsable.nombre}</strong></span>
          </div>
        )}
      </div>

      {/* Prioridad y Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{CREATE_TICKET_MODAL.labels.prioridad}</Label>
          <Select
            value={ticket.prioridad}
            onValueChange={(v) => setTicket({ ...ticket, prioridad: v as PrioridadTicket })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORIDADES_TICKET.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Estado: solo editable en modo edit e interno */}
        {!isClienteMode && (
          <div>
            <Label>{CREATE_TICKET_MODAL.labels.estado}</Label>
            <Select
              value={ticket.estado}
              onValueChange={(v) => setTicket({ ...ticket, estado: v as EstadoTicket })}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_TICKET.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Fecha de ejecución (ventana de trabajo) */}
      {!isClienteMode && (
        <div>
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {CREATE_TICKET_MODAL.labels.fechaEjecucion}
          </Label>
          <Input
            type="datetime-local"
            value={ticket.fecha_ejecucion || ''}
            onChange={(e) => setTicket({ ...ticket, fecha_ejecucion: e.target.value })}
            disabled={disabled}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {CREATE_TICKET_MODAL.ayuda.fechaEjecucion}
          </p>
        </div>
      )}

      {/* Responsable: solo en modo interno */}
      {!isClienteMode && (
        <div>
          <Label>{CREATE_TICKET_MODAL.labels.responsable}</Label>
          <Select
            value={ticket.responsable_id || ''}
            onValueChange={(v) => setTicket({
              ...ticket,
              responsable_id: v,
              responsable_nombre: usuarios.find(u => u.id === v)?.nombre
            })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={CREATE_TICKET_MODAL.placeholders.seleccionarResponsable} />
            </SelectTrigger>
            <SelectContent>
              {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Título */}
      <div>
        <Label>{CREATE_TICKET_MODAL.labels.titulo}</Label>
        <Input
          value={ticket.titulo}
          onChange={(e) => setTicket({ ...ticket, titulo: e.target.value })}
          placeholder={CREATE_TICKET_MODAL.placeholders.resumenProblema}
          disabled={disabled}
        />
      </div>

      {/* Descripción */}
      <div>
        <Label>{CREATE_TICKET_MODAL.labels.descripcion}</Label>
        <Textarea
          value={ticket.descripcion}
          onChange={(e) => setTicket({ ...ticket, descripcion: e.target.value })}
          placeholder={CREATE_TICKET_MODAL.placeholders.descripcionProblema}
          rows={4}
          disabled={disabled}
        />
      </div>

      {/* Alerta si no hay contrato para tickets de soporte */}
      {
        !isClienteMode && ticket.tipo_origen === 'soporte' && !ticket.contrato_id && ticket.empresa_id && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-400">
              {CREATE_TICKET_MODAL.alertas.sinContratosAlerta}
            </span>
          </div>
        )
      }
    </div >
  )
}

export function CreateTicketModal({
  open,
  onOpenChange,
  contratos,
  empresas,
  proyectos,
  usuarios,
  mode = 'create',
  ticket,
  onSave,
  onDelete
}: CreateTicketModalProps) {
  const isEditMode = mode === 'edit'
  const isClienteMode = mode === 'cliente'

  const [ticketData, setTicketData] = useState<TicketFormData>({
    empresa_id: '',
    empresa_nombre: '',
    contrato_id: '',
    contrato_nombre: '',
    proyecto_id: '',
    proyecto_nombre: '',
    tipo_origen: 'soporte',
    categoria: 'Soporte técnico',
    titulo: '',
    descripcion: '',
    estado: 'Abierto',
    prioridad: 'Media',
    responsable_id: '',
    responsable_nombre: '',
    tiempo_invertido_minutos: 0,
  })

  const initializedRef = useRef(false)

  useEffect(() => {
    if (!open) {
      initializedRef.current = false
      return
    }

    if (initializedRef.current && ticket?.id) {
      return
    }

    initializedRef.current = true

    if (ticket && isEditMode) {
      setTicketData({
        empresa_id: ticket.empresa_id || '',
        empresa_nombre: ticket.empresa_nombre || '',
        contrato_id: ticket.contrato_id || '',
        contrato_nombre: ticket.contrato_nombre || '',
        proyecto_id: ticket.proyecto_id || '',
        proyecto_nombre: ticket.proyecto_nombre || '',
        tipo_origen: ticket.tipo_origen,
        categoria: ticket.categoria,
        titulo: ticket.titulo,
        descripcion: ticket.descripcion,
        estado: ticket.estado,
        prioridad: ticket.prioridad,
        responsable_id: ticket.responsable_id || '',
        responsable_nombre: ticket.responsable_nombre || '',
        tiempo_invertido_minutos: ticket.tiempo_invertido_minutos,
      })
    } else {
      // Reset para modo create/cliente
      setTicketData({
        empresa_id: '',
        empresa_nombre: '',
        contrato_id: '',
        contrato_nombre: '',
        proyecto_id: '',
        proyecto_nombre: '',
        tipo_origen: 'soporte',
        categoria: 'Soporte técnico',
        titulo: '',
        descripcion: '',
        estado: 'Abierto',
        prioridad: 'Media',
        responsable_id: '',
        responsable_nombre: '',
        tiempo_invertido_minutos: 0,
      })
    }
  }, [open, ticket, isEditMode])

  const handleSave = () => {
    // Validaciones
    if (!ticketData.titulo || !ticketData.descripcion) return

    // Para interno: necesita empresa o contrato/proyecto
    if (!isClienteMode) {
      if (ticketData.tipo_origen === 'soporte' && !ticketData.contrato_id) return
      if (ticketData.tipo_origen === 'proyecto' && !ticketData.proyecto_id) return
    } else {
      // Para cliente: necesita contrato
      if (!ticketData.contrato_id) return
    }

    const data: CreateTicketData = {
      mode: isEditMode ? 'edit' : 'create',
      ticket: ticketData,
    }

    onSave(data)
    onOpenChange(false)
  }

  const hasContratos = contratos.filter(c => c.estado === 'Activo').length > 0
  const hasEmpresas = empresas.filter(e => e.tipo_entidad === 'cliente' || e.tipo_entidad === 'ambos').length > 0

  // Validación según modo
  const canSave = (() => {
    if (!ticketData.titulo || !ticketData.descripcion) return false

    if (isClienteMode) {
      return !!ticketData.contrato_id
    }

    if (ticketData.tipo_origen === 'soporte') {
      return !!ticketData.contrato_id
    }

    return !!ticketData.proyecto_id
  })()

  // Título del modal según modo
  const getModalTitle = () => {
    if (isEditMode) return CREATE_TICKET_MODAL.tituloEditar
    if (isClienteMode) return CREATE_TICKET_MODAL.tituloCliente
    return CREATE_TICKET_MODAL.tituloCrear
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-blue-400" />
            </div>
            <DialogTitle>{getModalTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        <DialogBody className="overflow-y-auto">
          {!hasContratos && !isClienteMode ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{CREATE_TICKET_MODAL.alertas.sinContratos}</p>
              <p className="text-sm text-muted-foreground">{CREATE_TICKET_MODAL.alertas.crearContratoPrimero}</p>
            </div>
          ) : !hasEmpresas && !isClienteMode ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{CREATE_TICKET_MODAL.alertas.sinEmpresas}</p>
              <p className="text-sm text-muted-foreground">{CREATE_TICKET_MODAL.alertas.crearEmpresaPrimero}</p>
            </div>
          ) : (
            <TicketFormFields
              ticket={ticketData}
              setTicket={setTicketData}
              contratos={contratos}
              empresas={empresas}
              proyectos={proyectos}
              usuarios={usuarios}
              mode={mode}
            />
          )}
        </DialogBody>

        <DialogFooter>
          {isEditMode && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> {CREATE_TICKET_MODAL.botones.eliminar}
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>{CREATE_TICKET_MODAL.botones.cancelar}</Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {isEditMode ? CREATE_TICKET_MODAL.botones.guardar : isClienteMode ? CREATE_TICKET_MODAL.botones.enviar : CREATE_TICKET_MODAL.botones.crear}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
