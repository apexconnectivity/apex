"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { Reunion, SolicitudReunion, TipoReunion, EstadoReunion, TIPOS_REUNION, ESTADOS_REUNION, getEstadoColor, getTipoIcon, TIPOS_SOLICITUD } from '@/types/calendario'
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin,
  Users, Video, X, Check, Mail, Phone, User, Building2,
  AlertCircle, CalendarDays, List, Grid3X3, CalendarCheck, CalendarX, GripHorizontal
} from 'lucide-react'

const DEMO_PROYECTOS = [
  { id: '1', nombre: 'Implementación Firewall Corp' },
  { id: '2', nombre: 'Migración Cloud Tech' },
  { id: '3', nombre: 'Auditoría Seguridad Tech' },
]

const DEMO_USUARIOS = [
  { id: '1', nombre: 'Carlos Admin' },
  { id: '2', nombre: 'Laura Pérez' },
  { id: '3', nombre: 'Juan Técnico' },
]

const DEMO_REUNIONES: Reunion[] = [
  { id: '1', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', titulo: 'Reunión de diagnóstico', descripcion: 'Primera reunión con el cliente para entender necesidades', fecha_hora_inicio: '2026-03-15T10:00:00', fecha_hora_fin: '2026-03-15T11:00:00', duracion_minutos: 60, tipo: 'Diagnóstico', organizador_id: '1', organizador_nombre: 'Carlos Admin', asistentes_internos: [{ id: '3', nombre: 'Juan Técnico' }], asistente_cliente_id: 'c1', asistente_cliente_nombre: 'Juan Pérez', ubicacion: 'Google Meet', meet_link: 'https://meet.google.com/abc-defg-hij', estado: 'Programada', solicitada_por_cliente: false, creado_en: '2026-03-10T09:00:00' },
  { id: '2', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', titulo: 'Seguimiento de implementación', fecha_hora_inicio: '2026-03-18T14:00:00', fecha_hora_fin: '2026-03-18T15:00:00', duracion_minutos: 60, tipo: 'Seguimiento', organizador_id: '3', organizador_nombre: 'Juan Técnico', asistentes_internos: [{ id: '1', nombre: 'Carlos Admin' }], asistente_cliente_nombre: 'Juan Pérez', ubicacion: 'Google Meet', estado: 'Confirmada', solicitada_por_cliente: false, creado_en: '2026-03-12T10:00:00' },
  { id: '3', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', titulo: 'Presentación de propuesta', descripcion: 'Presentación de la propuesta técnica y económica', fecha_hora_inicio: '2026-03-20T11:00:00', fecha_hora_fin: '2026-03-20T12:30:00', duracion_minutos: 90, tipo: 'Propuesta', organizador_id: '2', organizador_nombre: 'Laura Pérez', asistentes_internos: [{ id: '1', nombre: 'Carlos Admin' }], asistente_cliente_nombre: 'María García', ubicacion: 'Oficina cliente', estado: 'Programada', solicitada_por_cliente: true, creado_en: '2026-03-11T14:00:00' },
  { id: '4', proyecto_id: '3', proyecto_nombre: 'Auditoría Seguridad Tech', titulo: 'Cierre de auditoría', fecha_hora_inicio: '2026-03-25T09:00:00', fecha_hora_fin: '2026-03-25T11:00:00', duracion_minutos: 120, tipo: 'Cierre', organizador_id: '1', organizador_nombre: 'Carlos Admin', asistentes_internos: [{ id: '3', nombre: 'Juan Técnico' }], ubicacion: 'Google Meet', meet_link: 'https://meet.google.com/xyz-uvw-rst', estado: 'Programada', solicitada_por_cliente: false, creado_en: '2026-03-08T16:00:00' },
]

const DEMO_SOLICITUDES: SolicitudReunion[] = [
  { id: 's1', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', contacto_solicitante_id: 'c1', contacto_solicitante_nombre: 'Juan Pérez', empresa_nombre: 'Soluciones Tecnológicas SA', fecha_solicitada: '2026-03-17', hora_solicitada: '15:00', duracion: 60, motivo: 'Revisión de avances', comentarios: 'Necesito verificar el progreso del proyecto', estado: 'Pendiente', fecha_solicitud: '2026-03-14T08:00:00' },
  { id: 's2', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', contacto_solicitante_id: 'c2', contacto_solicitante_nombre: 'María García', empresa_nombre: 'Hospital Regional Norte', fecha_solicitada: '2026-03-19', hora_solicitada: '10:00', duracion: 45, motivo: 'Consulta técnica', comentarios: 'Tenemos dudas sobre la arquitectura propuesta', estado: 'Pendiente', fecha_solicitud: '2026-03-13T11:00:00' },
]

function ReunionesList({ reuniones, title, onVer }: { reuniones: Reunion[]; title: string; onVer: (r: Reunion) => void }) {
  const sortedReuniones = [...reuniones].sort((a, b) => new Date(a.fecha_hora_inicio).getTime() - new Date(b.fecha_hora_inicio).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title} ({reuniones.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedReuniones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No hay reuniones</p>
        ) : (
          <div className="space-y-3">
            {sortedReuniones.map(reunion => (
              <div key={reunion.id} className="p-3 border rounded-lg hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" onClick={() => onVer(reunion)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTipoIcon(reunion.tipo)}</span>
                    <div>
                      <p className="font-medium text-sm">{reunion.titulo}</p>
                      <p className="text-xs text-muted-foreground">{reunion.proyecto_nombre}</p>
                    </div>
                  </div>
                  <Badge className={getEstadoColor(reunion.estado)}>{reunion.estado}</Badge>
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

function NuevaReunionModal({ isOpen, onClose, onCreate, proyectos, usuarios }: {
  isOpen: boolean
  onClose: () => void
  onCreate: (reunion: Omit<Reunion, 'id' | 'creado_en' | 'google_event_id'>) => void
  proyectos: { id: string; nombre: string }[]
  usuarios: { id: string; nombre: string }[]
}) {
  const [reunion, setReunion] = useState({
    proyecto_id: '',
    titulo: '',
    descripcion: '',
    fecha: '',
    hora_inicio: '',
    duracion: 60,
    tipo: 'Seguimiento' as TipoReunion,
    organizador_id: '',
    asistentes_internos: [] as string[],
    asistente_cliente_nombre: '',
    ubicacion: '',
  })

  const handleCreate = () => {
    if (!reunion.proyecto_id || !reunion.titulo || !reunion.fecha || !reunion.hora_inicio || !reunion.organizador_id) return

    const fechaInicio = new Date(`${reunion.fecha}T${reunion.hora_inicio}:00`)
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
      organizador_nombre: organizador?.nombre || '',
      asistentes_internos: reunion.asistentes_internos.map(id => ({ id, nombre: usuarios.find(u => u.id === id)?.nombre || '' })),
      asistente_cliente_nombre: reunion.asistente_cliente_nombre || undefined,
      ubicacion: reunion.ubicacion || undefined,
      meet_link: reunion.ubicacion?.includes('Meet') ? 'https://meet.google.com/demo-link' : undefined,
      estado: 'Programada' as EstadoReunion,
      solicitada_por_cliente: false,
    })
    onClose()
    setReunion({ proyecto_id: '', titulo: '', descripcion: '', fecha: '', hora_inicio: '', duracion: 60, tipo: 'Seguimiento', organizador_id: '', asistentes_internos: [], asistente_cliente_nombre: '', ubicacion: '' })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Nueva Reunión</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Label>Proyecto *</Label>
              <Select value={reunion.proyecto_id} onValueChange={(v) => setReunion({ ...reunion, proyecto_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar proyecto..." /></SelectTrigger>
                <SelectContent>
                  {proyectos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título *</Label>
              <Input value={reunion.titulo} onChange={(e) => setReunion({ ...reunion, titulo: e.target.value })} placeholder="Título de la reunión" className="bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha *</Label>
                <Input type="date" value={reunion.fecha} onChange={(e) => setReunion({ ...reunion, fecha: e.target.value })} className="bg-background" />
              </div>
              <div>
                <Label>Hora inicio *</Label>
                <Input type="time" value={reunion.hora_inicio} onChange={(e) => setReunion({ ...reunion, hora_inicio: e.target.value })} className="bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duración</Label>
                <Select value={String(reunion.duracion)} onValueChange={(v) => setReunion({ ...reunion, duracion: parseInt(v) })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1.5 horas</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={reunion.tipo} onValueChange={(v) => setReunion({ ...reunion, tipo: v as TipoReunion })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_REUNION.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Organizador *</Label>
              <Select value={reunion.organizador_id} onValueChange={(v) => setReunion({ ...reunion, organizador_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar organizador..." /></SelectTrigger>
                <SelectContent>
                  {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Asistentes internos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {usuarios.map(u => (
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
              <Label>Cliente asistente</Label>
              <Input value={reunion.asistente_cliente_nombre} onChange={(e) => setReunion({ ...reunion, asistente_cliente_nombre: e.target.value })} placeholder="Nombre del contacto cliente" className="bg-background" />
            </div>
            <div>
              <Label>Ubicación</Label>
              <Input value={reunion.ubicacion} onChange={(e) => setReunion({ ...reunion, ubicacion: e.target.value })} placeholder="Google Meet / Oficina" className="bg-background" />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={reunion.descripcion} onChange={(e) => setReunion({ ...reunion, descripcion: e.target.value })} placeholder="Agenda de la reunión" rows={2} className="bg-background" />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={!reunion.proyecto_id || !reunion.titulo || !reunion.fecha || !reunion.hora_inicio || !reunion.organizador_id}>Crear Reunión</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetalleReunionModal({ reunion, onClose, onCambiarEstado }: {
  reunion: Reunion
  onClose: () => void
  onCambiarEstado: (id: string, estado: EstadoReunion) => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getTipoIcon(reunion.tipo)}</span>
            {reunion.titulo}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getEstadoColor(reunion.estado)}>{reunion.estado}</Badge>
            <Badge variant="outline">{reunion.tipo}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">Proyecto</p><p className="font-medium">{reunion.proyecto_nombre}</p></div>
            <div><p className="text-muted-foreground">Organizador</p><p className="font-medium">{reunion.organizador_nombre}</p></div>
            <div><p className="text-muted-foreground">Fecha</p><p className="font-medium">{new Date(reunion.fecha_hora_inicio).toLocaleDateString('es-ES')}</p></div>
            <div><p className="text-muted-foreground">Hora</p><p className="font-medium">{new Date(reunion.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(reunion.fecha_hora_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p></div>
            <div><p className="text-muted-foreground">Duración</p><p className="font-medium">{reunion.duracion_minutos} min</p></div>
            {reunion.asistente_cliente_nombre && <div><p className="text-muted-foreground">Cliente</p><p className="font-medium">{reunion.asistente_cliente_nombre}</p></div>}
          </div>

          {reunion.ubicacion && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{reunion.ubicacion}</span>
              {reunion.meet_link && <Button variant="link" size="sm" asChild><a href={reunion.meet_link} target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4 mr-1" />Unirse</a></Button>}
            </div>
          )}

          {reunion.descripcion && (
            <div><p className="text-sm text-muted-foreground">Descripción</p><p className="text-sm bg-muted/50 p-3 rounded-lg">{reunion.descripcion}</p></div>
          )}

          {reunion.asistentes_internos.length > 0 && (
            <div><p className="text-sm text-muted-foreground mb-2">Asistentes</p><div className="flex flex-wrap gap-2">{reunion.asistentes_internos.map(a => <Badge key={a.id} variant="outline">{a.nombre}</Badge>)}</div></div>
          )}

          {reunion.estado !== 'Cancelada' && reunion.estado !== 'Completada' && (
            <div className="flex gap-2 pt-4 border-t">
              {reunion.estado === 'Programada' && <Button onClick={() => onCambiarEstado(reunion.id, 'Confirmada')}><Check className="h-4 w-4 mr-2" />Confirmar</Button>}
              {reunion.estado === 'Confirmada' && <Button onClick={() => onCambiarEstado(reunion.id, 'Completada')}><Check className="h-4 w-4 mr-2" />Completar</Button>}
              <Button variant="outline" onClick={() => onCambiarEstado(reunion.id, 'Cancelada')}><X className="h-4 w-4 mr-2" />Cancelar</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
                  <Badge className={getEstadoColor(sol.estado)}>{sol.estado}</Badge>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  <p><strong>Solicitante:</strong> {sol.contacto_solicitante_nombre}</p>
                  <p><strong>Fecha:</strong> {sol.fecha_solicitada} a las {sol.hora_solicitada} ({sol.duracion} min)</p>
                  <p><strong>Motivo:</strong> {sol.motivo}</p>
                  {sol.comentarios && <p className="text-muted-foreground"><i>"{sol.comentarios}"</i></p>}
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
  const [reuniones, setReuniones] = useState<Reunion[]>(DEMO_REUNIONES)
  const [solicitudes, setSolicitudes] = useState<SolicitudReunion[]>(DEMO_SOLICITUDES)
  const [vista, setVista] = useState<'calendario' | 'lista' | 'solicitudes'>('calendario')
  const [mesActual, setMesActual] = useState(new Date())
  const [showNueva, setShowNueva] = useState(false)
  const [selectedReunion, setSelectedReunion] = useState<Reunion | null>(null)
  const [filtroProyecto, setFiltroProyecto] = useState<string>('todos')

  const isAdmin = user?.roles.includes('admin')
  const canCreate = isAdmin || user?.roles.includes('tecnico') || user?.roles.includes('comercial')

  const filteredReuniones = useMemo(() => {
    return reuniones.filter(r => filtroProyecto === 'todos' || r.proyecto_id === filtroProyecto)
  }, [reuniones, filtroProyecto])

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
    <div className="space-y-6 w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Calendario
          </h1>
          <p className="text-muted-foreground">Gestión de reuniones y eventos</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
            <TabsList>
              <TabsTrigger value="calendario"><Grid3X3 className="h-4 w-4 mr-2" />Calendario</TabsTrigger>
              <TabsTrigger value="lista"><List className="h-4 w-4 mr-2" />Lista</TabsTrigger>
              <TabsTrigger value="solicitudes"><CalendarDays className="h-4 w-4 mr-2" />Solicitudes</TabsTrigger>
            </TabsList>
          </Tabs>
          {canCreate && vista !== 'solicitudes' && <Button onClick={() => setShowNueva(true)}><Plus className="h-4 w-4 mr-2" />Nueva Reunión</Button>}
        </div>
      </div>

      <StatGrid cols={4}>
        <MiniStat value={stats.total} label="Total reuniones" variant="primary" showBorder accentColor="#06b6d4" icon={<CalendarDays className="h-5 w-5" />} />
        <MiniStat value={stats.proximas} label="Próximas" variant="info" showBorder accentColor="#3b82f6" icon={<Clock className="h-5 w-5" />} />
        <MiniStat value={stats.confirmadas} label="Confirmadas" variant="success" showBorder accentColor="#10b981" icon={<CalendarCheck className="h-5 w-5" />} />
        <MiniStat value={stats.pendientes} label="Solicitudes pendientes" variant="warning" showBorder accentColor="#f59e0b" icon={<CalendarX className="h-5 w-5" />} />
      </StatGrid>

      {vista === 'calendario' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
                <SelectTrigger className="w-64 bg-background"><SelectValue placeholder="Filtrar por proyecto" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los proyectos</SelectItem>
                  {DEMO_PROYECTOS.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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

      <NuevaReunionModal isOpen={showNueva} onClose={() => setShowNueva(false)} onCreate={handleCreateReunion} proyectos={DEMO_PROYECTOS} usuarios={DEMO_USUARIOS} />

      {selectedReunion && <DetalleReunionModal reunion={selectedReunion} onClose={() => setSelectedReunion(null)} onCambiarEstado={handleCambiarEstado} />}
    </div>
  )
}
