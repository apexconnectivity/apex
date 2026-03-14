"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { ConfiguracionGlobal, EventoNotificacion, LogNotificacion, PreferenciaNotificacion, EVENTOS_NOTIFICACION, getCanalIcon, getEstadoNotificacionColor } from '@/types/notificaciones'
import {
  Bell, Settings, Slack, Mail, Clock, CheckCircle, XCircle,
  AlertCircle, Activity, Zap, Save, RefreshCw, Eye, EyeOff,
  MessageSquare, Calendar, FileText, Building2, Ticket, User, Send, AlertTriangle
} from 'lucide-react'

const DEMO_CONFIG: ConfiguracionGlobal = {
  slack_activo: true,
  email_clientes_activo: true,
  email_internos_activo: true,
  umbral_sla_urgente: 1,
  umbral_sla_alta: 2,
  umbral_sla_media: 4,
  umbral_sla_baja: 8,
  resumen_diario_activo: true,
  resumen_diario_hora: '09:00',
  n8n_webhook_url: 'https://n8n.apexconnectivity.com/webhook',
}

const DEMO_LOGS: LogNotificacion[] = [
  { id: '1', evento_id: 'tarea_asignada', evento_tipo: 'Tarea asignada', destinatario: 'carlos@apex.com', canal: 'email', estado: 'enviado', fecha_envio: '2026-03-15T10:30:00', intentos: 1 },
  { id: '2', evento_id: 'ticket_nuevo', evento_tipo: 'Ticket nuevo', destinatario: '#soporte', canal: 'slack', estado: 'enviado', fecha_envio: '2026-03-15T09:15:00', intentos: 1 },
  { id: '3', evento_id: 'tarea_vencida', evento_tipo: 'Tarea vencida', destinatario: 'juan@apex.com', canal: 'slack', estado: 'fallido', intentos: 3, error: 'Usuario no encontrado en Slack' },
  { id: '4', evento_id: 'reunion_recordatorio', evento_tipo: 'Recordatorio', destinatario: 'juan@soltec.com', canal: 'email', estado: 'enviado', fecha_envio: '2026-03-15T08:00:00', intentos: 1 },
  { id: '5', evento_id: 'proyecto_fase', evento_tipo: 'Cambio de fase', destinatario: '#proyectos', canal: 'slack', estado: 'pendiente', intentos: 1 },
]

const DEMO_PREFERENCIA: PreferenciaNotificacion = {
  id: 'p1',
  usuario_id: '1',
  canal_preferido: 'ambos',
  notificaciones_tareas: true,
  notificaciones_tickets: true,
  notificaciones_proyectos: true,
  notificaciones_reuniones: true,
  notificaciones_sla: true,
  notificaciones_resumen_diario: true,
  resumen_diario_hora: '09:00',
}

function ConfiguracionGlobalTab({ config, onUpdate }: { config: ConfiguracionGlobal; onUpdate: (c: ConfiguracionGlobal) => void }) {
  const [local, setLocal] = useState(config)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Canales Activos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#4A154B] rounded-lg flex items-center justify-center">
                <Slack className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Slack</p>
                <p className="text-sm text-muted-foreground">Notificaciones a canales y DMs</p>
              </div>
            </div>
            <Button variant={local.slack_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, slack_activo: !local.slack_activo })}>
              {local.slack_activo ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              {local.slack_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Email a Clientes</p>
                <p className="text-sm text-muted-foreground">Notificaciones hacia clientes</p>
              </div>
            </div>
            <Button variant={local.email_clientes_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, email_clientes_activo: !local.email_clientes_activo })}>
              {local.email_clientes_activo ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              {local.email_clientes_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Email a Internos</p>
                <p className="text-sm text-muted-foreground">Notificaciones hacia el equipo</p>
              </div>
            </div>
            <Button variant={local.email_internos_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, email_internos_activo: !local.email_internos_activo })}>
              {local.email_internos_activo ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              {local.email_internos_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Umbrales de SLA
          </CardTitle>
          <CardDescription>Tiempo antes del vencimiento para enviar alertas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-red-400">Urgente</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_urgente} onChange={(e) => setLocal({ ...local, umbral_sla_urgente: parseInt(e.target.value) })} className="bg-background w-20" />
                <span className="text-sm">horas</span>
              </div>
            </div>
            <div>
              <Label className="text-amber-400">Alta</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_alta} onChange={(e) => setLocal({ ...local, umbral_sla_alta: parseInt(e.target.value) })} className="bg-background w-20" />
                <span className="text-sm">horas</span>
              </div>
            </div>
            <div>
              <Label className="text-blue-400">Media</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_media} onChange={(e) => setLocal({ ...local, umbral_sla_media: parseInt(e.target.value) })} className="bg-background w-20" />
                <span className="text-sm">horas</span>
              </div>
            </div>
            <div>
              <Label className="text-slate-400">Baja</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_baja} onChange={(e) => setLocal({ ...local, umbral_sla_baja: parseInt(e.target.value) })} className="bg-background w-20" />
                <span className="text-sm">horas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Resumen Diario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activar resumen diario</p>
              <p className="text-sm text-muted-foreground">Enviar resumen matutino de actividades</p>
            </div>
            <Button variant={local.resumen_diario_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, resumen_diario_activo: !local.resumen_diario_activo })}>
              {local.resumen_diario_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
          {local.resumen_diario_activo && (
            <div>
              <Label>Hora de envío</Label>
              <Input type="time" value={local.resumen_diario_hora} onChange={(e) => setLocal({ ...local, resumen_diario_hora: e.target.value })} className="bg-background w-32 mt-1" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Integración n8n
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Webhook URL</Label>
            <div className="flex gap-2 mt-1">
              <Input value={local.n8n_webhook_url} onChange={(e) => setLocal({ ...local, n8n_webhook_url: e.target.value })} placeholder="https://n8n.example.com/webhook" className="bg-background" />
              <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">URL del webhook de n8n para recibir eventos</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => onUpdate(local)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Guardar Configuración
      </Button>
    </div>
  )
}

function EventosTab({ eventos }: { eventos: EventoNotificacion[] }) {
  const [localEventos, setLocalEventos] = useState(eventos)

  const toggleEvento = (id: string) => {
    setLocalEventos(prev => prev.map(e => e.id === id ? { ...e, activo: !e.activo } : e))
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'proyecto': return <Building2 className="h-4 w-4" />
      case 'tarea': return <CheckCircle className="h-4 w-4" />
      case 'ticket': return <Ticket className="h-4 w-4" />
      case 'reunion': return <Calendar className="h-4 w-4" />
      case 'archivo': return <FileText className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const grupos = useMemo(() => {
    const g: Record<string, EventoNotificacion[]> = {}
    localEventos.forEach(e => {
      if (!g[e.tipo]) g[e.tipo] = []
      g[e.tipo].push(e)
    })
    return g
  }, [localEventos])

  return (
    <div className="space-y-6">
      {Object.entries(grupos).map(([tipo, evs]) => (
        <Card key={tipo}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getIcon(tipo)}
              {tipo}s
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evs.map(evento => (
                <div key={evento.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium">{evento.nombre}</p>
                    <p className="text-sm text-muted-foreground">{evento.descripcion}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{getCanalIcon(evento.canal_default)} {evento.canal_default}</Badge>
                    </div>
                  </div>
                  <Button variant={evento.activo ? 'default' : 'outline'} size="sm" onClick={() => toggleEvento(evento.id)}>
                    {evento.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function LogsTab({ logs }: { logs: LogNotificacion[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Historial de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{log.evento_tipo}</p>
                <p className="text-sm text-muted-foreground">
                  {log.canal === 'slack' ? <Slack className="h-3 w-3 inline mr-1" /> : <Mail className="h-3 w-3 inline mr-1" />}
                  {log.destinatario}
                </p>
                {log.fecha_envio && <p className="text-xs text-muted-foreground">{new Date(log.fecha_envio).toLocaleString('es-ES')}</p>}
              </div>
              <div className="text-right">
                <Badge className={getEstadoNotificacionColor(log.estado)}>{log.estado}</Badge>
                {log.error && <p className="text-xs text-red-400 mt-1">{log.error}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MisPreferenciasTab({ preferencia, onUpdate }: { preferencia: PreferenciaNotificacion; onUpdate: (p: PreferenciaNotificacion) => void }) {
  const [local, setLocal] = useState(preferencia)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Canales Preferidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {[
              { value: 'email', label: 'Solo Email', icon: Mail },
              { value: 'slack', label: 'Solo Slack', icon: MessageSquare },
              { value: 'ambos', label: 'Ambos', icon: Bell },
              { value: 'ninguno', label: 'Solo urgentes', icon: AlertCircle },
            ].map(opcion => (
              <Button key={opcion.value} variant={local.canal_preferido === opcion.value ? 'default' : 'outline'} onClick={() => setLocal({ ...local, canal_preferido: opcion.value as any })} className="flex-1">
                <opcion.icon className="h-4 w-4 mr-2" />
                {opcion.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos a Notificar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'notificaciones_tareas', label: 'Tareas asignadas', icon: CheckCircle },
            { key: 'notificaciones_tickets', label: 'Tickets nuevos y comentarios', icon: Ticket },
            { key: 'notificaciones_proyectos', label: 'Cambios en proyectos', icon: Building2 },
            { key: 'notificaciones_reuniones', label: 'Reuniones y recordatorios', icon: Calendar },
            { key: 'notificaciones_sla', label: 'Alertas de SLA', icon: AlertCircle },
            { key: 'notificaciones_resumen_diario', label: 'Resumen diario', icon: Activity },
          ].map(opcion => (
            <div key={opcion.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <opcion.icon className="h-4 w-4 text-muted-foreground" />
                <span>{opcion.label}</span>
              </div>
              <Button variant={local[opcion.key as keyof PreferenciaNotificacion] ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, [opcion.key]: !local[opcion.key as keyof PreferenciaNotificacion] })}>
                {local[opcion.key as keyof PreferenciaNotificacion] ? 'Activado' : 'Desactivado'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => onUpdate(local)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Guardar Preferencias
      </Button>
    </div>
  )
}

export default function NotificacionesPage() {
  const { user } = useAuth()
  const [config, setConfig] = useState<ConfiguracionGlobal>(DEMO_CONFIG)
  const [eventos, setEventos] = useState<EventoNotificacion[]>(EVENTOS_NOTIFICACION)
  const [logs] = useState<LogNotificacion[]>(DEMO_LOGS)
  const [preferencia, setPreferencia] = useState<PreferenciaNotificacion>(DEMO_PREFERENCIA)
  const [vista, setVista] = useState<'config' | 'eventos' | 'logs' | 'mispreferencias'>('config')

  const isAdmin = user?.roles.includes('admin')

  const stats = useMemo(() => ({
    total: logs.length,
    enviados: logs.filter(l => l.estado === 'enviado').length,
    fallidos: logs.filter(l => l.estado === 'fallido').length,
    pendientes: logs.filter(l => l.estado === 'pendiente').length,
  }), [logs])

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notificaciones
          </h1>
          <p className="text-muted-foreground">Configuración de notificaciones y automatizaciones</p>
        </div>
      </div>

      <StatGrid cols={4}>
        <MiniStat value={stats.total} label="Total" variant="primary" showBorder accentColor="#06b6d4" icon={<Bell className="h-5 w-5" />} />
        <MiniStat value={stats.enviados} label="Enviados" variant="success" showBorder accentColor="#10b981" icon={<Send className="h-5 w-5" />} />
        <MiniStat value={stats.fallidos} label="Fallidos" variant="danger" showBorder accentColor="#ef4444" icon={<AlertTriangle className="h-5 w-5" />} />
        <MiniStat value={stats.pendientes} label="Pendientes" variant="warning" showBorder accentColor="#f59e0b" icon={<Clock className="h-5 w-5" />} />
      </StatGrid>

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="config"><Settings className="h-4 w-4 mr-2" />Configuración</TabsTrigger>
          <TabsTrigger value="eventos"><Bell className="h-4 w-4 mr-2" />Eventos</TabsTrigger>
          <TabsTrigger value="logs"><Activity className="h-4 w-4 mr-2" />Logs</TabsTrigger>
          <TabsTrigger value="mispreferencias"><User className="h-4 w-4 mr-2" />Mis Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          {isAdmin ? (
            <ConfiguracionGlobalTab config={config} onUpdate={setConfig} />
          ) : (
            <Card><CardContent className="p-8 text-center"><AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" /><h2 className="text-xl font-semibold">Acceso Restringido</h2><p className="text-muted-foreground">Solo los administradores pueden configurar las notificaciones globales.</p></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="eventos">
          <EventosTab eventos={eventos} />
        </TabsContent>

        <TabsContent value="logs">
          <LogsTab logs={logs} />
        </TabsContent>

        <TabsContent value="mispreferencias">
          <MisPreferenciasTab preferencia={preferencia} onUpdate={setPreferencia} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
