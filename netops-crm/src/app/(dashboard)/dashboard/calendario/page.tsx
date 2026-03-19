"use client"

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Reunion, SolicitudReunion, TipoReunion, EstadoReunion, TIPOS_REUNION } from '@/types/calendario'
import { getReunionEstadoColor, getTipoReunionIcon, CALENDAR_STATS_COLORS } from '@/lib/colors'
import { useProyectos } from '@/hooks'
import { ManageContactsModal } from '@/components/module/ManageContactsModal'
import { Contacto } from '@/types/crm'
import {
  Calendar,
  Clock,
  User,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  MapPin,
  Video,
  Check,
  X,
  Building2,
  Plus,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react'
import { FilterBar } from '@/components/ui/filter-bar'
import { DatePicker } from '@/components/ui/date-picker'
import {
  BUTTON_LABELS,
  EMPTY_MESSAGES,
  FILTER_LABELS,
  DURATION_OPTIONS,
  FORM_LABELS_REUNION,
} from '@/constants/calendario'

// Constantes para filtros y estados (moved/removed hardcoded users)

function ReunionesList({ reuniones, title, onVer }: { reuniones: Reunion[]; title: string; onVer: (r: Reunion) => void }) {
  const sortedReuniones = [...reuniones].sort((a, b) => new Date(a.fecha_hora_inicio).getTime() - new Date(b.fecha_hora_inicio).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title} ({reuniones.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedReuniones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{EMPTY_MESSAGES.noReuniones}</p>
        ) : (
          <div className="space-y-3">
            {sortedReuniones.map(reunion => (
              <div key={reunion.id} className="p-3 border rounded-lg hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" onClick={() => onVer(reunion)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTipoReunionIcon(reunion.tipo)}</span>
                    <div>
                      <p className="font-medium text-sm">{reunion.titulo}</p>
                      <p className="text-xs text-muted-foreground">{reunion.proyecto_nombre}</p>
                    </div>
                  </div>
                  <Badge className={getReunionEstadoColor(reunion.estado)}>{reunion.estado}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(reunion.fecha_hora_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(reunion.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(reunion.fecha_hora_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{reunion.organizador_nombre}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NuevaReunionModal({ isOpen, onClose, onCreate, proyectos, usuarios, user, onOpenManageCompany }: {
  isOpen: boolean
  onClose: () => void
  onCreate: (reunion: Omit<Reunion, 'id' | 'creado_en' | 'google_event_id'>) => void
  proyectos: any[]
  usuarios: any[]
  user: any
  onOpenManageCompany?: (empresaId: string) => void
}) {
  const isCliente = user?.roles.includes('cliente')
  
  const [reunion, setReunion] = useState({
    proyecto_id: '',
    titulo: '',
    descripcion: '',
    fecha: undefined as Date | undefined,
    hora_inicio: '',
    duracion: 60,
    tipo: 'Seguimiento' as TipoReunion,
    organizador_id: isCliente ? user?.id : '',
    asistentes_internos: [] as string[],
    asistente_cliente_nombre: '',
    ubicacion: '',
  })

  const [allContactos] = useLocalStorage<Contacto[]>(STORAGE_KEYS.contactos, [])
  
  const proyectoSeleccionado = proyectos.find(p => p.id === reunion.proyecto_id)
  const empresaId = proyectoSeleccionado?.empresa_id
  const contactosEmpresa = allContactos.filter(c => c.empresa_id === empresaId)

  // Sincronizar organizador si el usuario cambia (o si es cliente)
  useEffect(() => {
    if (isCliente && user?.id) {
      setReunion(prev => ({ ...prev, organizador_id: user.id }))
    }
  }, [user?.id, isCliente, isOpen])

  const usuariosFiltrados = useMemo(() => {
    if (!isCliente) return usuarios
    
    const rolesAutorizados = ['tecnico', 'facturacion', 'compras', 'admin']
    const proyectoSeleccionado = proyectos.find(p => p.id === reunion.proyecto_id)
    const tecnicoAsignadoId = proyectoSeleccionado?.responsable_id
    
    return usuarios.filter(u => 
      u.roles?.some((r: string) => rolesAutorizados.includes(r)) || 
      u.id === tecnicoAsignadoId
    )
  }, [usuarios, isCliente, proyectos, reunion.proyecto_id])

  const handleCreate = () => {
    if (!reunion.proyecto_id || !reunion.titulo || !reunion.fecha || !reunion.hora_inicio || !reunion.organizador_id) return

    // Simulación de notificaciones
    console.log(`[Calendario] Enviando notificaciones a: ${reunion.asistentes_internos.join(', ')}`)
    if (isCliente) {
      alert(`Reunión agendada. Se ha notificado al equipo técnico y administrativo correspondiente.`)
    }

    const fechaInicio = new Date(reunion.fecha)
    fechaInicio.setHours(parseInt(reunion.hora_inicio.split(':')[0]), parseInt(reunion.hora_inicio.split(':')[1]))
    const fechaFin = new Date(fechaInicio.getTime() + reunion.duracion * 60000)

    const proyecto = proyectos.find(p => p.id === reunion.proyecto_id)
    const organizador = usuarios.find(u => u.id === reunion.organizador_id)

    onCreate({
      proyecto_id: reunion.proyecto_id,
      proyecto_nombre: proyecto?.nombre || '',
      titulo: reunion.titulo,
      descripcion: reunion.descripcion,
      fecha_hora_inicio: fechaInicio.toISOString(),
      fecha_hora_fin: fechaFin.toISOString(),
      duracion_minutos: reunion.duracion,
      tipo: reunion.tipo,
      organizador_id: reunion.organizador_id,
      organizador_nombre: organizador?.nombre || user?.nombre || '',
      asistentes_internos: reunion.asistentes_internos.map(id => ({ id, nombre: usuarios.find(u => u.id === id)?.nombre || '' })),
      asistente_cliente_nombre: reunion.asistente_cliente_nombre || undefined,
      ubicacion: reunion.ubicacion || undefined,
      meet_link: reunion.ubicacion?.includes('Meet') ? 'https://meet.google.com/demo-link' : undefined,
      estado: 'Programada' as EstadoReunion,
      solicitada_por_cliente: false,
    })
    onClose()
    setReunion({ proyecto_id: '', titulo: '', descripcion: '', fecha: undefined, hora_inicio: '', duracion: 60, tipo: 'Seguimiento', organizador_id: '', asistentes_internos: [], asistente_cliente_nombre: '', ubicacion: '' })
  }

  if (!isOpen) return null

  return (
    <>
      <BaseModal
        open={isOpen}
        onOpenChange={onClose}
        size="lg"
      >
        <ModalHeader
          title={
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              {BUTTON_LABELS.nuevaReunion}
            </span>
          }
        />
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>{FORM_LABELS_REUNION.proyecto} *</Label>
              <Select value={reunion.proyecto_id} onValueChange={(v) => setReunion({ ...reunion, proyecto_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder={FILTER_LABELS.todosLosProyectos} /></SelectTrigger>
                <SelectContent>
                  {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{FORM_LABELS_REUNION.titulo} *</Label>
              <Input value={reunion.titulo} onChange={(e) => setReunion({ ...reunion, titulo: e.target.value })} placeholder="Título de la reunión" className="bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha *</Label>
                <DatePicker
                  value={reunion.fecha}
                  onChange={(date) => setReunion({ ...reunion, fecha: date })}
                  placeholder="Seleccionar fecha"
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Hora inicio *</Label>
                <Input type="time" value={reunion.hora_inicio} onChange={(e) => setReunion({ ...reunion, hora_inicio: e.target.value })} className="bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{FORM_LABELS_REUNION.duracion}</Label>
                <Select value={String(reunion.duracion)} onValueChange={(v) => setReunion({ ...reunion, duracion: parseInt(v) })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map(d => <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{FORM_LABELS_REUNION.tipo}</Label>
                <Select value={reunion.tipo} onValueChange={(v) => setReunion({ ...reunion, tipo: v as TipoReunion })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_REUNION.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{FORM_LABELS_REUNION.organizador} *</Label>
              <Select 
                value={reunion.organizador_id} 
                onValueChange={(v) => setReunion({ ...reunion, organizador_id: v })}
                disabled={isCliente}
              >
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar organizador..." /></SelectTrigger>
                <SelectContent>
                  {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{FORM_LABELS_REUNION.asistentesInternos}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {usuariosFiltrados.map(u => (
                  <Button key={u.id} variant={reunion.asistentes_internos.includes(u.id) ? 'default' : 'outline'} size="sm" onClick={() => {
                    const nuevos = reunion.asistentes_internos.includes(u.id)
                      ? reunion.asistentes_internos.filter(id => id !== u.id)
                      : [...reunion.asistentes_internos, u.id]
                    setReunion({ ...reunion, asistentes_internos: nuevos })
                  }}>{u.nombre}</Button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{FORM_LABELS_REUNION.asistentesCliente}</Label>
                {empresaId && (
                  <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[10px] gap-1 text-cyan-400 hover:text-cyan-300"
                  onClick={() => empresaId && onOpenManageCompany?.(empresaId)}
                >
                    <UserPlus className="h-3 w-3" />
                    Gestionar Contactos
                  </Button>
                )}
              </div>
              {empresaId ? (
                <div className="flex flex-wrap gap-2">
                  {contactosEmpresa.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground italic">No hay contactos registrados para esta empresa.</p>
                  ) : (
                    contactosEmpresa.map(c => {
                      const isSelected = reunion.asistente_cliente_nombre.split(', ').includes(c.nombre)
                      return (
                        <Button 
                          key={c.id} 
                          variant={isSelected ? 'default' : 'outline'} 
                          size="sm"
                          className="h-7 text-[11px]"
                          onClick={() => {
                            const current = reunion.asistente_cliente_nombre ? reunion.asistente_cliente_nombre.split(', ') : []
                            const nuevos = isSelected 
                              ? current.filter(n => n !== c.nombre)
                              : [...current, c.nombre]
                            setReunion({ ...reunion, asistente_cliente_nombre: nuevos.join(', ') })
                          }}
                        >
                          {c.nombre}
                        </Button>
                      )
                    })
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground italic px-2 py-1 border border-dashed rounded bg-muted/20">Selecciona un proyecto para ver los contactos de la empresa.</p>
              )}
            </div>
            <div>
              <Label>{FORM_LABELS_REUNION.ubicacion}</Label>
              <Input value={reunion.ubicacion} onChange={(e) => setReunion({ ...reunion, ubicacion: e.target.value })} placeholder="Google Meet / Oficina" className="bg-background" />
            </div>
            <div>
              <Label>{FORM_LABELS_REUNION.descripcion}</Label>
              <Textarea value={reunion.descripcion} onChange={(e) => setReunion({ ...reunion, descripcion: e.target.value })} placeholder="Agenda de la reunión" rows={2} className="bg-background" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter layout="inline-between">
          <div />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>{BUTTON_LABELS.cancelar}</Button>
            <Button onClick={handleCreate} disabled={!reunion.proyecto_id || !reunion.titulo || !reunion.fecha || !reunion.hora_inicio || !reunion.organizador_id}>{BUTTON_LABELS.guardar}</Button>
          </div>
        </ModalFooter>
      </BaseModal>
    </>
  )
}

function DetalleReunionModal({ reunion, onClose, onCambiarEstado }: {
  reunion: Reunion
  onClose: () => void
  onCambiarEstado: (id: string, estado: EstadoReunion) => void
}) {
  return (
    <BaseModal
      open={true}
      onOpenChange={onClose}
      size="md"
    >
      <ModalHeader
        title={
          <span className="flex items-center gap-2">
            <span className="text-2xl">{getTipoReunionIcon(reunion.tipo)}</span>
            {reunion.titulo}
          </span>
        }
      />
      <ModalBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getReunionEstadoColor(reunion.estado)}>{reunion.estado}</Badge>
            <Badge variant="outline">{reunion.tipo}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">{FORM_LABELS_REUNION.proyecto}</p><p className="font-medium">{reunion.proyecto_nombre}</p></div>
            <div><p className="text-muted-foreground">{FORM_LABELS_REUNION.organizador}</p><p className="font-medium">{reunion.organizador_nombre}</p></div>
            <div><p className="text-muted-foreground">Fecha</p><p className="font-medium">{new Date(reunion.fecha_hora_inicio).toLocaleDateString('es-ES')}</p></div>
            <div><p className="text-muted-foreground">Hora</p><p className="font-medium">{new Date(reunion.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(reunion.fecha_hora_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p></div>
            <div><p className="text-muted-foreground">{FORM_LABELS_REUNION.duracion}</p><p className="font-medium">{reunion.duracion_minutos} min</p></div>
            {reunion.asistente_cliente_nombre && <div><p className="text-muted-foreground">{FORM_LABELS_REUNION.asistentesCliente}</p><p className="font-medium">{reunion.asistente_cliente_nombre}</p></div>}
          </div>

          {reunion.ubicacion && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{reunion.ubicacion}</span>
              {reunion.meet_link && <Button variant="link" size="sm" asChild><a href={reunion.meet_link} target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4 mr-1" />Unirse</a></Button>}
            </div>
          )}

          {reunion.descripcion && (
            <div><p className="text-sm text-muted-foreground">{FORM_LABELS_REUNION.descripcion}</p><p className="text-sm bg-muted/50 p-3 rounded-lg">{reunion.descripcion}</p></div>
          )}

          {reunion.asistentes_internos.length > 0 && (
            <div><p className="text-sm text-muted-foreground mb-2">{FORM_LABELS_REUNION.asistentesInternos}</p><div className="flex flex-wrap gap-2">{reunion.asistentes_internos.map(a => <Badge key={a.id} variant="outline">{a.nombre}</Badge>)}</div></div>
          )}

          {reunion.estado !== 'Cancelada' && reunion.estado !== 'Completada' && (
            <div className="flex gap-2 pt-4 border-t">
              {reunion.estado === 'Programada' && <Button onClick={() => onCambiarEstado(reunion.id, 'Confirmada')}><Check className="h-4 w-4 mr-2" />{BUTTON_LABELS.confirmar}</Button>}
              {reunion.estado === 'Confirmada' && <Button onClick={() => onCambiarEstado(reunion.id, 'Completada')}><Check className="h-4 w-4 mr-2" />Completar</Button>}
              <Button variant="outline" onClick={() => onCambiarEstado(reunion.id, 'Cancelada')}><X className="h-4 w-4 mr-2" />{BUTTON_LABELS.cancelar}</Button>
            </div>
          )}
        </div>
      </ModalBody>
    </BaseModal>
  )
}

function GestionSolicitudes({ solicitudes, onAprobar, onRechazar }: {
  solicitudes: SolicitudReunion[]
  onAprobar: (s: SolicitudReunion) => void
  onRechazar: (s: SolicitudReunion) => void
}) {
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Solicitudes de Reunión ({pendientes.length} pendientes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendientes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No hay solicitudes pendientes</p>
        ) : (
          <div className="space-y-3">
            {pendientes.map(sol => (
              <div key={sol.id} className="p-4 border rounded-lg bg-amber-500/5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{sol.empresa_nombre}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{sol.proyecto_nombre}</p>
                  </div>
                  <Badge className={getReunionEstadoColor(sol.estado)}>{sol.estado}</Badge>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  <p><strong>Solicitante:</strong> {sol.contacto_solicitante_nombre}</p>
                  <p><strong>Fecha:</strong> {sol.fecha_solicitada} a las {sol.hora_solicitada} ({sol.duracion} min)</p>
                  <p><strong>Motivo:</strong> {sol.motivo}</p>
                  {sol.comentarios && <p className="text-muted-foreground"><i>&quot;{sol.comentarios}&quot;</i></p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onAprobar(sol)}><Check className="h-4 w-4 mr-1" />Aprobar y agendar</Button>
                  <Button size="sm" variant="outline" onClick={() => onRechazar(sol)}><X className="h-4 w-4 mr-1" />Rechazar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function CalendarioPage() {
  const { user } = useAuth()
  const [proyectos] = useProyectos()
  const [reuniones, setReuniones] = useState<Reunion[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudReunion[]>([])
  const [vista, setVista] = useState<'calendario' | 'lista' | 'solicitudes'>('calendario')
  const [mesActual, setMesActual] = useState(new Date())
  const [showNueva, setShowNueva] = useState(false)
  const [isManageCompanyOpen, setIsManageCompanyOpen] = useState(false)
  const [activeEmpresaId, setActiveEmpresaId] = useState<string | null>(null)
  const [selectedReunion, setSelectedReunion] = useState<Reunion | null>(null)
  const [filtroProyecto, setFiltroProyecto] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const [allUsers] = useLocalStorage<any[]>(STORAGE_KEYS.usuarios, [])

  const isAdmin = user?.roles.includes('admin')
  const isCliente = user?.roles.includes('cliente')
  const canCreate = isAdmin || user?.roles.includes('tecnico') || user?.roles.includes('comercial') || isCliente

  const misProyectos = useMemo(() => {
    if (!isCliente) return proyectos
    return proyectos.filter(p => p.empresa_id === user?.empresa_id)
  }, [proyectos, isCliente, user?.empresa_id])

  const filteredReuniones = useMemo(() => {
    return reuniones.filter(r => {
      // Si es cliente, solo ve reuniones de SUS proyectos
      if (isCliente) {
        if (!misProyectos.some(p => p.id === r.proyecto_id)) return false
      }
      
      if (searchQuery && !r.titulo.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filtroProyecto !== 'todos' && r.proyecto_id !== filtroProyecto) return false
      return true
    })
  }, [reuniones, searchQuery, filtroProyecto, isCliente, misProyectos])

  const stats = useMemo(() => ({
    total: filteredReuniones.length,
    proximas: filteredReuniones.filter(r => new Date(r.fecha_hora_inicio) > new Date() && r.estado !== 'Cancelada').length,
    confirmadas: filteredReuniones.filter(r => r.estado === 'Confirmada').length,
    pendientes: solicitudes.filter(s => s.estado === 'Pendiente').length,
  }), [filteredReuniones, solicitudes])

  const handleCreateReunion = (reunion: Omit<Reunion, 'id' | 'creado_en' | 'google_event_id'>) => {
    const nueva: Reunion = { ...reunion, id: Date.now().toString(), creado_en: new Date().toISOString() }
    setReuniones(prev => [...prev, nueva])
  }

  const handleCambiarEstado = (id: string, estado: EstadoReunion) => {
    setReuniones(prev => prev.map(r => r.id === id ? { ...r, estado } : r))
    setSelectedReunion(null)
  }

  const handleAprobarSolicitud = (sol: SolicitudReunion) => {
    setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'Aprobada' } : s))
    setShowNueva(true)
  }

  const handleRechazarSolicitud = (sol: SolicitudReunion) => {
    setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'Rechazada' } : s))
  }

  const getDiasMes = () => {
    const año = mesActual.getFullYear()
    const mes = mesActual.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    const dias: { fecha: Date; esActual: boolean; esPasado: boolean }[] = []

    const primerDiaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1
    for (let i = 0; i < primerDiaSemana; i++) {
      const fecha = new Date(año, mes, -primerDiaSemana + i + 1)
      dias.push({ fecha, esActual: false, esPasado: fecha < new Date(new Date().setHours(0, 0, 0, 0)) })
    }

    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const fecha = new Date(año, mes, i)
      dias.push({ fecha, esActual: fecha.toDateString() === new Date().toDateString(), esPasado: fecha < new Date(new Date().setHours(0, 0, 0, 0)) })
    }

    const ultimosDias = 42 - dias.length
    for (let i = 1; i <= ultimosDias; i++) {
      const fecha = new Date(año, mes + 1, i)
      dias.push({ fecha, esActual: false, esPasado: false })
    }

    return dias
  }

  const getReunionesDelDia = (fecha: Date) => {
    return filteredReuniones.filter(r => {
      const fechaReunion = new Date(r.fecha_hora_inicio)
      return fechaReunion.toDateString() === fecha.toDateString()
    })
  }

  const dias = getDiasMes()
  const nombreDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <ModuleContainer>
      <ModuleHeader
        title="Calendario"
        description="Gestión de reuniones y eventos"
        tabs={[
          { value: 'calendario', label: 'Calendario' },
          { value: 'lista', label: 'Lista' },
          { value: 'solicitudes', label: 'Solicitudes' }
        ]}
        activeTab={vista}
        onTabChange={(v) => setVista(v as typeof vista)}
        actions={
          canCreate && vista !== 'solicitudes' && (
            <Button onClick={() => setShowNueva(true)}>
              <Plus className="h-4 w-4 mr-2" />Nueva Reunión
            </Button>
          )
        }
      />

      {/* Filtros */}
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar reuniones..."
        filters={[
          {
            key: 'proyecto',
            label: 'Proyecto',
            placeholder: 'Proyecto',
            options: [
              { value: 'todos', label: 'Todos' },
              ...misProyectos.map(p => ({ value: p.id, label: p.nombre })),
            ],
            width: 'w-48',
          },
        ]}
        values={{
          proyecto: filtroProyecto,
        }}
        onFilterChange={(key, value) => {
          if (key === 'proyecto') setFiltroProyecto(value)
        }}
        hasActiveFilters={filtroProyecto !== 'todos' || !!searchQuery}
        onClearFilters={() => {
          setSearchQuery('')
          setFiltroProyecto('todos')
        }}
      />

      <StatGrid cols={4}>
        <MiniStat value={stats.total} label="Total reuniones" variant="primary" showBorder accentColor={CALENDAR_STATS_COLORS.total} icon={<CalendarDays className="h-5 w-5" />} />
        <MiniStat value={stats.proximas} label="Próximas" variant="info" showBorder accentColor={CALENDAR_STATS_COLORS.proximas} icon={<Clock className="h-5 w-5" />} />
        <MiniStat value={stats.confirmadas} label="Confirmadas" variant="success" showBorder accentColor={CALENDAR_STATS_COLORS.confirmadas} icon={<CalendarCheck className="h-5 w-5" />} />
        <MiniStat value={stats.pendientes} label="Solicitudes pendientes" variant="warning" showBorder accentColor={CALENDAR_STATS_COLORS.pendientes} icon={<CalendarX className="h-5 w-5" />} />
      </StatGrid>

      {vista === 'calendario' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="font-semibold text-lg">{mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
              <Button variant="outline" size="icon" onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {nombreDias.map(dia => (
                  <div key={dia} className="text-center font-medium text-sm text-muted-foreground py-2">{dia}</div>
                ))}
                {dias.map((dia, idx) => {
                  const reunionesDia = getReunionesDelDia(dia.fecha)
                  const esDelMes = dia.fecha.getMonth() === mesActual.getMonth()
                  return (
                    <div key={idx} className={`min-h-[100px] p-1 border rounded ${!esDelMes ? 'bg-muted/30' : ''} ${dia.esActual ? 'ring-2 ring-primary' : ''}`}>
                      <p className={`text-xs font-medium ${dia.esPasado ? 'text-muted-foreground' : ''} ${!esDelMes ? 'text-muted-foreground/50' : ''}`}>{dia.fecha.getDate()}</p>
                      <div className="space-y-1 mt-1">
                        {reunionesDia.slice(0, 2).map(r => (
                          <div key={r.id} className={`text-[10px] p-1 rounded truncate cursor-pointer ${r.estado === 'Cancelada' ? 'bg-red-500/20 text-red-400 line-through' : 'bg-blue-500/20 text-blue-400'}`} onClick={() => setSelectedReunion(r)}>
                            {new Date(r.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} {r.titulo}
                          </div>
                        ))}
                        {reunionesDia.length > 2 && <p className="text-[10px] text-muted-foreground">+{reunionesDia.length - 2} más</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {vista === 'lista' && (
        <div className="grid md:grid-cols-2 gap-4">
          <ReunionesList reuniones={filteredReuniones.filter(r => new Date(r.fecha_hora_inicio) >= new Date())} title="Próximas Reuniones" onVer={setSelectedReunion} />
          <ReunionesList reuniones={filteredReuniones.filter(r => new Date(r.fecha_hora_inicio) < new Date() || r.estado === 'Completada')} title="Reuniones Pasadas" onVer={setSelectedReunion} />
        </div>
      )}

      {vista === 'solicitudes' && (
        <GestionSolicitudes solicitudes={solicitudes} onAprobar={handleAprobarSolicitud} onRechazar={handleRechazarSolicitud} />
      )}

      <NuevaReunionModal 
        isOpen={showNueva} 
        onClose={() => setShowNueva(false)} 
        onCreate={handleCreateReunion} 
        proyectos={misProyectos} 
        usuarios={allUsers}
        user={user}
        onOpenManageCompany={(id) => {
          setActiveEmpresaId(id)
          setIsManageCompanyOpen(true)
        }}
      />

      {isManageCompanyOpen && activeEmpresaId && (
        <ManageContactsModal 
          isOpen={isManageCompanyOpen}
          onClose={() => setIsManageCompanyOpen(false)}
          empresaId={activeEmpresaId}
        />
      )}

      {selectedReunion && <DetalleReunionModal reunion={selectedReunion} onClose={() => setSelectedReunion(null)} onCambiarEstado={handleCambiarEstado} />}
    </ModuleContainer>
  )
}
