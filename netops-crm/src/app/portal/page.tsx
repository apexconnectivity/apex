"use client"

import { useState } from 'react'
import { ClienteUsuario, ProyectoCliente, TareaCliente, TicketCliente, DocumentoCliente, ArchivoProyectoCliente } from '@/types/portal'
import { getTicketEstadoColor } from '@/lib/colors'
import { PortalAuthProvider, usePortalAuth } from '@/contexts/portal-auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base/BaseModal'
import {
  Zap, FolderKanban, Headphones, FileText,
  LogOut, Upload,
  ExternalLink, Clock, AlertCircle, Building2,
  ArrowLeft, CheckCircle, Calendar, Plus
} from 'lucide-react'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Proyecto } from '@/types/proyectos'
import { Tarea } from '@/types/tareas'
import { Ticket } from '@/types/soporte'
import { Documento } from '@/types/crm'
import { SolicitudReunion } from '@/types/calendario'
import { type User } from '@/types/auth'
import { FASES } from '@/types/proyectos'

// Tipo para datos del formulario de ticket
type TicketFormData = Pick<TicketCliente, 'titulo' | 'descripcion' | 'categoria' | 'prioridad' | 'estado'>

const _DEMO_CLIENTE: ClienteUsuario = {
  id: 'c1',
  email: 'juan@soltec.com',
  nombre: 'Juan Pérez',
  rol: 'cliente',
  empresa_id: '1',
  empresa_nombre: 'Soluciones Tecnológicas SA',
  cargo: 'Director de TI',
  telefono: '+54 11 1234-5678',
}

const _DEMO_PROYECTOS: ProyectoCliente[] = [
  {
    id: '1',
    nombre: 'Implementación Firewall Fortinet',
    fase_actual: 4,
    fase_nombre: 'IMPLEMENTACIÓN',
    progreso: 65,
    fecha_inicio: '2026-01-15',
    fecha_estimada_fin: '2026-04-30',
    responsable_id: '1',
    responsable_nombre: 'Carlos Rodríguez',
    contacto_tecnico_id: 'c1',
    proximo_hito: 'Pruebas de penetración',
    proximo_hito_fecha: '2026-03-20',
  },
  {
    id: '2',
    nombre: 'Auditoría de Seguridad Q1',
    fase_actual: 5,
    fase_nombre: 'CIERRE',
    progreso: 95,
    fecha_inicio: '2026-01-01',
    fecha_estimada_fin: '2026-03-15',
    responsable_id: '2',
    responsable_nombre: 'Laura Pérez',
    contacto_tecnico_id: 'c1',
    proximo_hito: 'Entrega de informe final',
    proximo_hito_fecha: '2026-03-15',
  },
]

const _DEMO_TAREAS: TareaCliente[] = [
  { id: 't1', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Fortinet', nombre: 'Subir diagrama de red actual', descripcion: 'Documentar la topología actual de red incluyendo todos los equipos y conexiones', estado: 'Pendiente', prioridad: 'Alta', fecha_vencimiento: '2026-03-12', fecha_creacion: '2026-03-01', categoria: 'Técnica' },
  { id: 't2', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Fortinet', nombre: 'Confirmar horarios para capacitación', descripcion: 'Coordinar fecha y hora para la capacitación del equipo de TI', estado: 'Pendiente', prioridad: 'Media', fecha_vencimiento: '2026-03-15', fecha_creacion: '2026-03-05', categoria: 'General' },
  { id: 't3', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Fortinet', nombre: 'Revisar propuesta de seguridad', descripcion: 'Revisar y aprobar la propuesta de políticas de seguridad', estado: 'En progreso', prioridad: 'Baja', fecha_creacion: '2026-03-08', categoria: 'General' },
  { id: 't4', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Fortinet', nombre: 'Aprobar configuración de reglas', descripcion: 'Revisar y aprobar las reglas de firewall propuestas', estado: 'Pendiente', prioridad: 'Alta', fecha_vencimiento: '2026-03-18', fecha_creacion: '2026-03-10', categoria: 'Técnica' },
  { id: 't5', proyecto_id: '2', proyecto_nombre: 'Auditoría de Seguridad Q1', nombre: 'Revisar informe preliminar', descripcion: 'Revisar el informe preliminar de hallazgos', estado: 'Completada', prioridad: 'Alta', fecha_vencimiento: '2026-03-10', fecha_creacion: '2026-02-15', categoria: 'General' },
]

const _DEMO_TICKETS: TicketCliente[] = [
  { id: '1', numero_ticket: 'TK-2026-023', titulo: 'No hay conexión sede norte', descripcion: 'Desde esta mañana no tenemos acceso a internet en la sede norte. Todo el personal afectado.', estado: 'Abierto', prioridad: 'Urgente', categoria: 'Soporte técnico', creado_por_nombre: 'María García', fecha_apertura: '2026-03-10T10:30:00' },
  { id: '2', numero_ticket: 'TK-2026-018', titulo: 'Consulta sobre factura de febrero', descripcion: 'Necesitamos verificar los cargos adicionales del mes pasado', estado: 'En progreso', prioridad: 'Media', categoria: 'Facturación', creado_por_nombre: 'Juan Pérez', fecha_apertura: '2026-03-08T09:00:00' },
  { id: '3', numero_ticket: 'TK-2026-015', titulo: 'Solicitud de cambio de horario', descripcion: 'Necesitamos cambiar el horario de soporte técnico a turno noche', estado: 'Esperando cliente', prioridad: 'Baja', categoria: 'Consulta comercial', creado_por_nombre: 'Laura Pérez', fecha_apertura: '2026-03-05T14:00:00' },
  { id: '4', numero_ticket: 'TK-2026-010', titulo: 'Renovación de certificado SSL', descripcion: 'El certificado del dominio principal expira pronto', estado: 'Resuelto', prioridad: 'Alta', categoria: 'Soporte técnico', creado_por_nombre: 'Carlos Admin', fecha_apertura: '2026-03-01T08:00:00', fecha_cierre: '2026-03-03T16:00:00' },
]

const _DEMO_DOCUMENTOS: DocumentoCliente[] = [
  { id: 'd1', nombre_original: 'Condiciones Generales.pdf', mime_type: 'application/pdf', tamaño_bytes: 2500000, visibilidad: 'publico', fecha_subida: '2026-01-15T10:00:00', subido_por_nombre: 'Carlos Admin' },
  { id: 'd2', nombre_original: 'Manual de Usuario.pdf', mime_type: 'application/pdf', tamaño_bytes: 4500000, visibilidad: 'publico', fecha_subida: '2026-02-01T14:30:00', subido_por_nombre: 'Carlos Admin' },
  { id: 'd3', nombre_original: 'Propuesta Económica.pdf', mime_type: 'application/pdf', tamaño_bytes: 1200000, visibilidad: 'publico', fecha_subida: '2026-01-10T09:00:00', subido_por_nombre: 'Laura Pérez' },
  { id: 'd4', nombre_original: 'Contrato de Servicios.pdf', mime_type: 'application/pdf', tamaño_bytes: 890000, visibilidad: 'publico', fecha_subida: '2026-01-05T11:00:00', subido_por_nombre: 'Carlos Admin' },
]

const _DEMO_ARCHIVOS_PROYECTO: ArchivoProyectoCliente[] = [
  { id: 'a1', nombre_original: 'diagrama_red_actual.pdf', mime_type: 'application/pdf', tamaño_bytes: 850000, ruta_completa: '/Entregables Cliente/', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Fortinet', visibilidad: 'Entregables Cliente', fecha_subida: '2026-02-01T14:20:00', subido_por_nombre: 'Laura Pérez' },
  { id: 'a2', nombre_original: 'requisitos_usuarios.docx', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', tamaño_bytes: 45000, ruta_completa: '/Entregables Cliente/', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Fortinet', visibilidad: 'Entregables Cliente', fecha_subida: '2026-03-01T08:30:00', subido_por_nombre: 'Laura Pérez' },
  { id: 'a3', nombre_original: 'informe_preliminar.pdf', mime_type: 'application/pdf', tamaño_bytes: 2500000, ruta_completa: '/Entregables Cliente/', proyecto_id: '2', proyecto_nombre: 'Auditoría de Seguridad Q1', visibilidad: 'Entregables Cliente', fecha_subida: '2026-03-08T10:00:00', subido_por_nombre: 'Carlos Admin' },
]

const _DEMO_EQUIPO = [
  { id: '1', nombre: 'Carlos Rodríguez', cargo: 'Gerente de Proyecto', email: 'carlos@apex.com', telefono: '+54 11 1111-1111' },
  { id: '2', nombre: 'Laura Pérez', cargo: 'Ejecutiva Comercial', email: 'laura@apex.com', telefono: '+54 11 2222-2222' },
  { id: '3', nombre: 'Juan Técnico', cargo: 'Ingeniero de Soporte', email: 'juan@apex.com', telefono: '+54 11 3333-3333' },
]

type VistaPortal = 'dashboard' | 'proyecto' | 'tarea' | 'ticket'

function PortalLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin()
    } else {
      setError('Por favor ingresa tu email y contraseña')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Portal del Cliente</CardTitle>
          <p className="text-muted-foreground">Apex Connectivity</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="bg-background" />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-background" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Iniciar Sesión</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function NuevoTicketModal({ open, onClose, onCreate }: {
  open: boolean
  onClose: () => void
  onCreate: (ticket: Omit<TicketCliente, 'id' | 'numero_ticket' | 'creado_por_nombre' | 'fecha_apertura'>) => void
}) {
  const [ticket, setTicket] = useState<TicketFormData>({ titulo: '', descripcion: '', categoria: 'Soporte técnico', prioridad: 'Media', estado: 'Abierto' })

  const handleCreate = () => {
    if (!ticket.titulo || !ticket.descripcion) return
    onCreate(ticket)
    onClose()
    setTicket({ titulo: '', descripcion: '', categoria: 'Soporte técnico', prioridad: 'Media', estado: 'Abierto' })
  }

  return (
    <BaseModal open={open} onOpenChange={onClose} size="md">
      <ModalHeader title="Nuevo Ticket de Soporte" />
      <ModalBody>
        <div className="space-y-4">
          <div>
            <Label>Categoría</Label>
            <Select value={ticket.categoria} onValueChange={(v) => setTicket({ ...ticket, categoria: v })}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Soporte técnico">Soporte técnico</SelectItem>
                <SelectItem value="Consulta comercial">Consulta comercial</SelectItem>
                <SelectItem value="Facturación">Facturación</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridad</Label>
            <Select value={ticket.prioridad} onValueChange={(v) => setTicket({ ...ticket, prioridad: v })}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Título *</Label>
            <Input value={ticket.titulo} onChange={(e) => setTicket({ ...ticket, titulo: e.target.value })} placeholder="Describe el problema brevemente" className="bg-background" />
          </div>
          <div>
            <Label>Descripción *</Label>
            <Textarea value={ticket.descripcion} onChange={(e) => setTicket({ ...ticket, descripcion: e.target.value })} placeholder="Describe el problema con detalle" rows={4} className="bg-background" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleCreate} disabled={!ticket.titulo || !ticket.descripcion}>Enviar Ticket</Button>
      </ModalFooter>
    </BaseModal>
  )
}

function SolicitarReunionModal({ open, onClose, onSolicitar, proyectos }: {
  open: boolean
  onClose: () => void
  onSolicitar: (reunion: Partial<SolicitudReunion>) => void
  proyectos: Proyecto[]
}) {
  const [reunion, setReunion] = useState<Partial<SolicitudReunion>>({
    proyecto_id: '',
    fecha_solicitada: new Date().toISOString().split('T')[0],
    hora_solicitada: '10:00',
    duracion: 30,
    motivo: '',
    comentarios: ''
  })

  const handleSubmit = () => {
    if (!reunion.proyecto_id || !reunion.motivo) return
    onSolicitar(reunion)
    onClose()
  }

  return (
    <BaseModal open={open} onOpenChange={onClose} size="md">
      <ModalHeader title="Solicitar Reunión de Seguimiento" />
      <ModalBody className="space-y-4">
        <div>
          <Label>Proyecto Asociado</Label>
          <Select value={reunion.proyecto_id} onValueChange={(v) => setReunion({ ...reunion, proyecto_id: v, proyecto_nombre: proyectos.find(p => p.id === v)?.nombre })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Selecciona un proyecto" /></SelectTrigger>
            <SelectContent>
              {proyectos.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Fecha Sugerida</Label>
            <Input type="date" value={reunion.fecha_solicitada} onChange={(e) => setReunion({ ...reunion, fecha_solicitada: e.target.value })} />
          </div>
          <div>
            <Label>Hora Sugerida</Label>
            <Input type="time" value={reunion.hora_solicitada} onChange={(e) => setReunion({ ...reunion, hora_solicitada: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Motivo / Asunto</Label>
          <Input value={reunion.motivo} onChange={(e) => setReunion({ ...reunion, motivo: e.target.value })} placeholder="Ej: Revisión de avance semanal" />
        </div>
        <div>
          <Label>Comentarios Adicionales</Label>
          <Textarea value={reunion.comentarios} onChange={(e) => setReunion({ ...reunion, comentarios: e.target.value })} placeholder="Alguna nota o detalle para el equipo" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={!reunion.proyecto_id || !reunion.motivo}>Enviar Solicitud</Button>
      </ModalFooter>
    </BaseModal>
  )
}

function PortalClienteContent() {
  const { user, login, logout, isLoading: isAuthLoading } = usePortalAuth()
  const [vista, setVista] = useState<VistaPortal>('dashboard')
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  // Cargar datos reales de localStorage
  const [allProyectos] = useLocalStorage<Proyecto[]>(STORAGE_KEYS.proyectos, [])
  const [allTareas] = useLocalStorage<Tarea[]>(STORAGE_KEYS.tareas, [])
  const [allTickets, setAllTickets] = useLocalStorage<Ticket[]>(STORAGE_KEYS.tickets, [])
  const [allDocumentos] = useLocalStorage<Documento[]>(STORAGE_KEYS.documentos, [])
  const [_allReuniones, setAllReuniones] = useLocalStorage<SolicitudReunion[]>(STORAGE_KEYS.reuniones, [])

  // Filtrar datos por la empresa del cliente
  const misProyectos = allProyectos.filter(p => p.empresa_id === user?.empresa_id)
  const misTareas = allTareas.filter(t => misProyectos.some(p => p.id === t.proyecto_id))
  const misTickets = allTickets.filter(t => t.empresa_id === user?.empresa_id)
  const misDocumentos = allDocumentos.filter(d => d.empresa_id === user?.empresa_id || d.visibilidad === 'publico')

  const tareasPendientes = misTareas.filter(t => t.estado !== 'Completada')
  const ticketsAbiertos = misTickets.filter(t => t.estado !== 'Cerrado' && t.estado !== 'Resuelto')
  
  // Filtrado específico para el proyecto seleccionado
  const tareasDelProyecto = selectedProyecto ? misTareas.filter(t => t.proyecto_id === selectedProyecto.id) : []
  const ticketsDelProyecto = selectedProyecto ? misTickets.filter(t => t.proyecto_id === selectedProyecto.id) : []
  const documentosDelProyecto = selectedProyecto ? misDocumentos.filter(d => 'proyecto_id' in d && (d as { proyecto_id?: string }).proyecto_id === selectedProyecto.id) : []

  const handleLogin = () => {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.usuarios)
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : []
    const firstClient = users.find((u) => u.roles.includes('cliente'))
    if (firstClient) {
      login(firstClient.email, 'demo')
    } else {
      login('cliente@empresa.com', 'demo')
    }
  }

  const handleCreateTicket = (ticketData: Omit<Ticket, 'id' | 'numero_ticket' | 'creado_por' | 'creado_por_nombre' | 'creado_por_cliente' | 'fecha_apertura' | 'empresa_id' | 'tiempo_invertido_minutos'>) => {
    const nuevo: Ticket = {
      ...ticketData,
      id: crypto.randomUUID(),
      numero_ticket: `TK-${new Date().getFullYear()}-${String(allTickets.length + 1).padStart(3, '0')}`,
      creado_por: user?.id || 'cliente',
      creado_por_nombre: user?.nombre || 'Cliente',
      creado_por_cliente: true,
      fecha_apertura: new Date().toISOString(),
      empresa_id: user?.empresa_id || '',
      tiempo_invertido_minutos: 0
    }
    setAllTickets(prev => [nuevo, ...prev])
  }

  const handleSolicitarReunion = (reunionData: Partial<SolicitudReunion>) => {
    const nueva: SolicitudReunion = {
      proyecto_id: reunionData.proyecto_id || '',
      proyecto_nombre: reunionData.proyecto_nombre || '',
      fecha_solicitada: reunionData.fecha_solicitada || '',
      hora_solicitada: reunionData.hora_solicitada || '',
      duracion: reunionData.duracion || 60,
      motivo: reunionData.motivo || '',
      comentarios: reunionData.comentarios,
      id: crypto.randomUUID(),
      contacto_solicitante_id: user?.id || '',
      contacto_solicitante_nombre: user?.nombre || '',
      empresa_nombre: user?.empresa_nombre || '',
      estado: 'Pendiente',
      fecha_solicitud: new Date().toISOString()
    }
    setAllReuniones(prev => [nueva, ...prev])
    console.log('[Portal] Solicitud de reunión enviada:', nueva)
  }

  const openProyecto = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setVista('proyecto')
  }

  const openTarea = (tarea: Tarea) => {
    setSelectedTarea(tarea)
    setVista('tarea')
  }

  const openTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setVista('ticket')
  }

  if (isAuthLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  if (!user) return <PortalLogin onLogin={handleLogin} />

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Portal Cliente</h1>
              <p className="text-xs text-slate-400">Apex Connectivity</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.nombre}</p>
              <p className="text-xs text-slate-400">{user.empresa_nombre}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}><LogOut className="h-5 w-5 text-slate-400" /></Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {vista === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{user.empresa_nombre}</span>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-cyan-500 mb-2"><FolderKanban className="h-5 w-5" /><span className="text-sm font-medium">Proyectos Activos</span></div>
                  <p className="text-3xl font-bold">{misProyectos.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-amber-500 mb-2"><Calendar className="h-5 w-5" /><span className="text-sm font-medium">Citas / Reuniones</span></div>
                  <Button variant="ghost" size="sm" className="w-full text-xs h-8 border border-amber-500/20 hover:bg-amber-500/20" onClick={() => setShowNewMeeting(true)}>Agendar Ahora</Button>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-500 mb-2"><Headphones className="h-5 w-5" /><span className="text-sm font-medium">Tickets Abiertos</span></div>
                  <p className="text-3xl font-bold">{ticketsAbiertos.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-500 mb-2"><FileText className="h-5 w-5" /><span className="text-sm font-medium">Documentos</span></div>
                  <p className="text-3xl font-bold">{misDocumentos.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mis Proyectos y Avances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {misProyectos.length > 0 ? misProyectos.map(proyecto => {
                    // Calcular progreso basado en tareas si está disponible
                    const tareasProyecto = misTareas.filter(t => t.proyecto_id === proyecto.id)
                    const completadas = tareasProyecto.filter(t => t.estado === 'Completada').length
                    const total = tareasProyecto.length
                    const progresoCalculado = total > 0 ? Math.round((completadas / total) * 100) : 0

                    return (
                      <div key={proyecto.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => openProyecto(proyecto)}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{proyecto.nombre}</h3>
                            <p className="text-sm text-muted-foreground">Estado: {proyecto.estado || 'Activo'}</p>
                          </div>
                          <Badge variant="outline">{progresoCalculado}%</Badge>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${progresoCalculado}%` }} />
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="text-center py-8 text-muted-foreground">No tienes proyectos activos actualmente</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Tareas Pendientes</CardTitle>
                  <Button variant="ghost" size="sm">Ver todas</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tareasPendientes.slice(0, 5).map(tarea => (
                      <div key={tarea.id} className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" onClick={() => openTarea(tarea)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{tarea.nombre}</p>
                            <p className="text-xs text-muted-foreground">{tarea.proyecto_nombre}</p>
                            {tarea.fecha_vencimiento && <p className="text-xs text-amber-500 mt-1">Vence: {new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES')}</p>}
                          </div>
                          <Badge variant="outline" className="text-xs">{tarea.prioridad}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Soporte y Tickets</CardTitle>
                  <Button size="sm" onClick={() => setShowNewTicket(true)} className="gap-2"><Plus className="h-4 w-4" /> Nuevo</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ticketsAbiertos.length > 0 ? ticketsAbiertos.slice(0, 5).map(ticket => (
                      <div key={ticket.id} className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" onClick={() => openTicket(ticket)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium flex items-center gap-2 text-sm">
                              <span className="text-xs font-mono text-muted-foreground">{ticket.numero_ticket}</span>
                              {ticket.prioridad === 'Alta' || ticket.prioridad === 'Urgente' ? <AlertCircle className="h-3 w-3 text-red-500" /> : <Clock className="h-3 w-3 text-slate-400" />}
                            </p>
                            <p className="text-sm truncate">{ticket.titulo}</p>
                          </div>
                          <Badge className={getTicketEstadoColor(ticket.estado)}>{ticket.estado}</Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-xs text-muted-foreground">No tienes tickets abiertos. Todo al día.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {vista === 'proyecto' && selectedProyecto && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setVista('dashboard')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Volver</Button>
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  {(() => {
                    const fase = FASES.find(f => f.id === selectedProyecto.fase_actual)
                    const total = tareasDelProyecto.length
                    const completadas = tareasDelProyecto.filter(t => t.estado === 'Completada').length
                    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0
                    
                    return (
                      <>
                        <div>
                          <CardTitle className="text-2xl">{selectedProyecto.nombre}</CardTitle>
                          <p className="text-muted-foreground">Fase {selectedProyecto.fase_actual}: {fase?.nombre || 'Activo'}</p>
                        </div>
                        <Badge variant="outline" className="text-lg">{progreso}%</Badge>
                      </>
                    )
                  })()}
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const total = tareasDelProyecto.length
                  const completadas = tareasDelProyecto.filter(t => t.estado === 'Completada').length
                  const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0
                  
                  return (
                    <div className="w-full bg-muted h-3 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${progreso}%` }} />
                    </div>
                  )
                })()}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-sm text-muted-foreground">Inicio</p><p className="font-medium">{selectedProyecto.fecha_inicio ? new Date(selectedProyecto.fecha_inicio).toLocaleDateString('es-ES') : 'N/A'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Fin estimado</p><p className="font-medium">{selectedProyecto.fecha_estimada_fin ? new Date(selectedProyecto.fecha_estimada_fin).toLocaleDateString('es-ES') : 'Pendiente'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Responsable</p><p className="font-medium">{selectedProyecto.responsable_nombre || 'Asignando...'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Estado</p><p className="font-medium capitalize">{selectedProyecto.estado}</p></div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="tareas" className="space-y-4">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="tareas" className="data-[state=active]:bg-background">Tareas ({tareasDelProyecto.length})</TabsTrigger>
                <TabsTrigger value="tickets" className="data-[state=active]:bg-background">Tickets ({ticketsDelProyecto.length})</TabsTrigger>
                <TabsTrigger value="archivos" className="data-[state=active]:bg-background">Archivos ({documentosDelProyecto.length})</TabsTrigger>
                <TabsTrigger value="equipo" className="data-[state=active]:bg-background">Equipo</TabsTrigger>
              </TabsList>

              <TabsContent value="tareas">
                <Card><CardContent className="p-4">
                  <div className="space-y-3">
                    {tareasDelProyecto.length > 0 ? tareasDelProyecto.map(tarea => (
                      <div key={tarea.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => openTarea(tarea)}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {tarea.estado === 'Completada' ? <CheckCircle className="h-4 w-4 text-green-500" /> : tarea.estado === 'En progreso' ? <Clock className="h-4 w-4 text-blue-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                            <span className={tarea.estado === 'Completada' ? 'line-through text-muted-foreground' : ''}>{tarea.nombre}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{tarea.estado}</Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">No hay tareas registradas en este proyecto</div>
                    )}
                  </div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="tickets">
                <Card><CardContent className="p-4">
                  <div className="space-y-3">
                    {ticketsDelProyecto.length > 0 ? ticketsDelProyecto.map(ticket => (
                      <div key={ticket.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => openTicket(ticket)}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{ticket.numero_ticket} - {ticket.titulo}</p>
                            <p className="text-xs text-muted-foreground">{ticket.categoria}</p>
                          </div>
                          <Badge className={getTicketEstadoColor(ticket.estado)}>{ticket.estado}</Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">No hay tickets vinculados a este proyecto</div>
                    )}
                  </div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="archivos">
                <Card><CardContent className="p-4">
                  <div className="space-y-2">
                    {documentosDelProyecto.length > 0 ? documentosDelProyecto.map(archivo => (
                      <div key={archivo.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{archivo.nombre_archivo || 'Documento sin nombre'}</span>
                        </div>
                        <Button variant="ghost" size="sm"><ExternalLink className="h-3 w-3" /></Button>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">No hay documentos compartidos en este proyecto</div>
                    )}
                  </div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="equipo">
                <Card><CardContent className="p-4">
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    El equipo asignado se mostrará aquí cuando el proyecto inicie fase de ejecución.
                  </div>
                </CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {vista === 'tarea' && selectedTarea && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setVista('proyecto')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Volver al proyecto</Button>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{selectedTarea.nombre}</CardTitle>
                  <Badge variant="outline">{selectedTarea.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Proyecto</p><p className="font-medium">{selectedTarea.proyecto_nombre}</p></div>
                  <div><p className="text-muted-foreground">Categoría</p><p className="font-medium">{selectedTarea.categoria}</p></div>
                  <div><p className="text-muted-foreground">Prioridad</p><Badge variant="outline">{selectedTarea.prioridad}</Badge></div>
                  <div><p className="text-muted-foreground">Fecha límite</p><p className="font-medium">{selectedTarea.fecha_vencimiento ? new Date(selectedTarea.fecha_vencimiento).toLocaleDateString('es-ES') : 'Sin fecha'}</p></div>
                </div>
                {selectedTarea.descripcion && (
                  <div><p className="text-sm text-muted-foreground mb-1">Descripción</p><p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedTarea.descripcion}</p></div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button><Upload className="h-4 w-4 mr-2" />Subir archivo</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {vista === 'ticket' && selectedTicket && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setVista('dashboard')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Volver</Button>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedTicket.numero_ticket}</CardTitle>
                    <p className="text-lg font-medium">{selectedTicket.titulo}</p>
                  </div>
                  <Badge className={getTicketEstadoColor(selectedTicket.estado)}>{selectedTicket.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{selectedTicket.prioridad}</Badge>
                  <Badge variant="outline">{selectedTicket.categoria}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Creado por</p><p className="font-medium">{selectedTicket.creado_por_nombre}</p></div>
                  <div><p className="text-muted-foreground">Fecha de apertura</p><p className="font-medium">{new Date(selectedTicket.fecha_apertura).toLocaleString('es-ES')}</p></div>
                  {selectedTicket.fecha_cierre && <div><p className="text-muted-foreground">Cerrado</p><p className="font-medium">{new Date(selectedTicket.fecha_cierre).toLocaleString('es-ES')}</p></div>}
                </div>
                <div><p className="text-sm text-muted-foreground mb-1">Descripción</p><p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedTicket.descripcion}</p></div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <NuevoTicketModal 
        open={showNewTicket} 
        onClose={() => setShowNewTicket(false)} 
        onCreate={(ticket) => handleCreateTicket(ticket as Omit<Ticket, 'id' | 'numero_ticket' | 'creado_por' | 'creado_por_nombre' | 'creado_por_cliente' | 'fecha_apertura' | 'ultima_actualizacion' | 'empresa_id' | 'tiempo_invertido_minutos'>)} 
      />
      <SolicitarReunionModal 
        open={showNewMeeting} 
        onClose={() => setShowNewMeeting(false)} 
        onSolicitar={handleSolicitarReunion} 
        proyectos={misProyectos} 
      />
    </div>
  )
}

export default function PortalClientePage() {
  return (
    <PortalAuthProvider>
      <PortalClienteContent />
    </PortalAuthProvider>
  )
}
