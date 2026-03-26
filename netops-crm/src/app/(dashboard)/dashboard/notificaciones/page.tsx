"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModuleContainer, ModuleHeader } from '@/components/module'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { ConfiguracionGlobal, EventoNotificacion, LogNotificacion, PreferenciaNotificacion, EVENTOS_NOTIFICACION, getEstadoNotificacionColor } from '@/types/notificaciones'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { NOTIFICACIONES_STATS_COLORS } from '@/lib/colors'
import {
  Bell, Settings, Slack, Mail, Clock, CheckCircle, XCircle,
  AlertCircle, Activity, Zap, Save, RefreshCw, Eye, EyeOff,
  MessageSquare, Calendar, FileText, Building2, Ticket, User, Send, AlertTriangle
} from 'lucide-react'
import { NOTIFICACIONES_TEXTS, NOTIFICACIONES_STORAGE_KEYS, CONFIG_INICIAL, PREFERENCIA_INICIAL } from '@/constants/notificaciones'
import { StaggeredList } from '@/components/ui/page-animation'

// Función para obtener el icono del canal
function getCanalIconComponent(canal: string) {
  switch (canal) {
    case 'slack': return <Slack className="h-4 w-4" />
    case 'email': return <Mail className="h-4 w-4" />
    default: return <MessageSquare className="h-4 w-4" />
  }
}

function ConfiguracionGlobalTab({ config, onUpdate }: { config: ConfiguracionGlobal; onUpdate: (c: ConfiguracionGlobal) => void }) {
  const [local, setLocal] = useState(config)
  const { titulos, canales, sla, resumen, webhook, botones } = NOTIFICACIONES_TEXTS.configGlobal
  const { canalesActivos, umbralesSLA, umbralSLADesc, resumenDiario, integracionN8N } = titulos

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {canalesActivos}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Slack */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Slack className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">{canales.slack.titulo}</p>
                <p className="text-sm text-muted-foreground">{canales.slack.descripcion}</p>
              </div>
            </div>
            <Button variant={local.slack_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, slack_activo: !local.slack_activo })}>
              {local.slack_activo ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              {local.slack_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>

          {/* Email Clientes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{canales.emailClientes.titulo}</p>
                <p className="text-sm text-muted-foreground">{canales.emailClientes.descripcion}</p>
              </div>
            </div>
            <Button variant={local.email_clientes_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, email_clientes_activo: !local.email_clientes_activo })}>
              {local.email_clientes_activo ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              {local.email_clientes_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>

          {/* Email Internos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{canales.emailInternos.titulo}</p>
                <p className="text-sm text-muted-foreground">{canales.emailInternos.descripcion}</p>
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
            {umbralesSLA}
          </CardTitle>
          <CardDescription>{umbralSLADesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-destructive">{sla.urgente}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_urgente} onChange={(e) => setLocal({ ...local, umbral_sla_urgente: parseInt(e.target.value) || 0 })} className="bg-background w-20" />
                <span className="text-sm text-muted-foreground">{sla.horas}</span>
              </div>
            </div>
            <div>
              <Label className="text-orange-500">{sla.alta}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_alta} onChange={(e) => setLocal({ ...local, umbral_sla_alta: parseInt(e.target.value) || 0 })} className="bg-background w-20" />
                <span className="text-sm text-muted-foreground">{sla.horas}</span>
              </div>
            </div>
            <div>
              <Label className="text-blue-500">{sla.media}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_media} onChange={(e) => setLocal({ ...local, umbral_sla_media: parseInt(e.target.value) || 0 })} className="bg-background w-20" />
                <span className="text-sm text-muted-foreground">{sla.horas}</span>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">{sla.baja}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" value={local.umbral_sla_baja} onChange={(e) => setLocal({ ...local, umbral_sla_baja: parseInt(e.target.value) || 0 })} className="bg-background w-20" />
                <span className="text-sm text-muted-foreground">{sla.horas}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {resumenDiario}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{resumen.activar}</p>
              <p className="text-sm text-muted-foreground">{resumen.activarDesc}</p>
            </div>
            <Button variant={local.resumen_diario_activo ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, resumen_diario_activo: !local.resumen_diario_activo })}>
              {local.resumen_diario_activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
          {local.resumen_diario_activo && (
            <div>
              <Label>{resumen.horaEnvio}</Label>
              <Input type="time" value={local.resumen_diario_hora} onChange={(e) => setLocal({ ...local, resumen_diario_hora: e.target.value })} className="bg-background w-32 mt-1" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {integracionN8N}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{webhook.label}</Label>
            <div className="flex gap-2 mt-1">
              <Input value={local.n8n_webhook_url} onChange={(e) => setLocal({ ...local, n8n_webhook_url: e.target.value })} placeholder={webhook.placeholder} className="bg-background" />
              <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{webhook.help}</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => onUpdate(local)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {botones.guardar}
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

  const { eventosGrupos } = NOTIFICACIONES_TEXTS

  return (
    <div className="space-y-6">
      {Object.entries(grupos).map(([tipo, evs]) => (
        <Card key={tipo}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getIcon(tipo)}
              {eventosGrupos[tipo as keyof typeof eventosGrupos] || `${tipo}s`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StaggeredList stagger={30}>
              <div className="space-y-2">
                {evs.map(evento => (
                <div key={evento.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium">{evento.nombre}</p>
                    <p className="text-sm text-muted-foreground">{evento.descripcion}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getCanalIconComponent(evento.canal_default)}
                        <span className="ml-1">{evento.canal_default}</span>
                      </Badge>
                    </div>
                  </div>
                  <Button variant={evento.activo ? 'default' : 'outline'} size="sm" onClick={() => toggleEvento(evento.id)}>
                    {evento.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
              </div>
            </StaggeredList>
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
          {NOTIFICACIONES_TEXTS.logs}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StaggeredList stagger={30}>
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
                {log.error && <p className="text-xs text-destructive mt-1">{log.error}</p>}
              </div>
            </div>
          ))}
          </div>
        </StaggeredList>
      </CardContent>
    </Card>
  )
}

function MisPreferenciasTab({ preferencia, onUpdate }: { preferencia: PreferenciaNotificacion; onUpdate: (p: PreferenciaNotificacion) => void }) {
  const [local, setLocal] = useState(preferencia)
  const { titulos, botones } = NOTIFICACIONES_TEXTS.preferencias

  // Función para obtener el icono según el canal
  const getCanalIcon = (value: string) => {
    switch (value) {
      case 'email': return Mail
      case 'slack': return MessageSquare
      case 'ninguno': return AlertCircle
      default: return Bell
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{titulos.canalesPreferidos}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {NOTIFICACIONES_TEXTS.canalesPreferencia.map(opcion => {
              const IconComponent = getCanalIcon(opcion.value)
              return (
                <Button
                  key={opcion.value}
                  variant={local.canal_preferido === opcion.value ? 'default' : 'outline'}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => setLocal({ ...local, canal_preferido: opcion.value as any })}
                  className="flex-1"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {opcion.label}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{titulos.eventosNotificar}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {NOTIFICACIONES_TEXTS.eventosNotificar.map(opcion => {
            // Obtener el icono según la clave
            const getEventIcon = (key: string) => {
              switch (key) {
                case 'notificaciones_tareas': return CheckCircle
                case 'notificaciones_tickets': return Ticket
                case 'notificaciones_proyectos': return Building2
                case 'notificaciones_reuniones': return Calendar
                case 'notificaciones_sla': return AlertCircle
                case 'notificaciones_resumen_diario': return Activity
                default: return Bell
              }
            }
            const IconComponent = getEventIcon(opcion.key)

            return (
              <div key={opcion.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span>{opcion.label}</span>
                </div>
                <Button
                  variant={local[opcion.key as keyof PreferenciaNotificacion] ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocal({ ...local, [opcion.key]: !local[opcion.key as keyof PreferenciaNotificacion] })}
                >
                  {local[opcion.key as keyof PreferenciaNotificacion] ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Button onClick={() => onUpdate(local)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {botones.guardar}
      </Button>
    </div>
  )
}

export default function NotificacionesPage() {
  const { user } = useAuth()

  // Usar localStorage para persistir los datos
  const [config, setConfig] = useLocalStorage<ConfiguracionGlobal>(NOTIFICACIONES_STORAGE_KEYS.config, CONFIG_INICIAL)
  const [eventos, _setEventos] = useLocalStorage<EventoNotificacion[]>(NOTIFICACIONES_STORAGE_KEYS.eventos, EVENTOS_NOTIFICACION)
  const [logs, setLogs] = useLocalStorage<LogNotificacion[]>(NOTIFICACIONES_STORAGE_KEYS.config, [])
  const [preferencia, setPreferencia] = useLocalStorage<PreferenciaNotificacion>(NOTIFICACIONES_STORAGE_KEYS.preferencia, PREFERENCIA_INICIAL)
  const [vista, setVista] = useLocalStorage<'config' | 'eventos' | 'logs' | 'mispreferencias'>(NOTIFICACIONES_STORAGE_KEYS.vista, 'config')

  const isAdmin = user?.roles.includes('admin')

  // Agregar un log de prueba para demostrar funcionalidad
  const handleAddLog = () => {
    const nuevosLogs: LogNotificacion[] = [
      ...logs,
      {
        id: Date.now().toString(),
        evento_id: 'test',
        evento_tipo: 'Notificación de prueba',
        destinatario: 'test@apex.com',
        canal: 'email',
        estado: 'enviado',
        fecha_envio: new Date().toISOString(),
        intentos: 1
      }
    ]
    setLogs(nuevosLogs)
  }

  const stats = useMemo(() => ({
    total: logs.length || 0,
    enviados: logs.filter(l => l.estado === 'enviado').length,
    fallidos: logs.filter(l => l.estado === 'fallido').length,
    pendientes: logs.filter(l => l.estado === 'pendiente').length,
  }), [logs])

  const { titulos, tabs, stats: statsLabels, accesoDenegado } = NOTIFICACIONES_TEXTS

  return (
    <ModuleContainer>
      <ModuleHeader
        title={titulos.titulo}
        description={titulos.descripcion}
        actions={
          logs.length === 0 ? (
            <Button variant="outline" onClick={handleAddLog}>
              <Activity className="h-4 w-4 mr-2" />
              Generar Log de Prueba
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}
      <StatGrid cols={4}>
        <MiniStat value={stats.total} label={statsLabels.total} variant="primary" showBorder accentColor={NOTIFICACIONES_STATS_COLORS.total} icon={<Bell className="h-5 w-5" />} />
        <MiniStat value={stats.enviados} label={statsLabels.enviados} variant="success" showBorder accentColor={NOTIFICACIONES_STATS_COLORS.enviados} icon={<Send className="h-5 w-5" />} />
        <MiniStat value={stats.fallidos} label={statsLabels.fallidos} variant="danger" showBorder accentColor={NOTIFICACIONES_STATS_COLORS.fallidos} icon={<AlertTriangle className="h-5 w-5" />} />
        <MiniStat value={stats.pendientes} label={statsLabels.pendientes} variant="warning" showBorder accentColor={NOTIFICACIONES_STATS_COLORS.pendientes} icon={<Clock className="h-5 w-5" />} />
      </StatGrid>

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="config"><Settings className="h-4 w-4 mr-2" />{tabs.configuracion}</TabsTrigger>
          <TabsTrigger value="eventos"><Bell className="h-4 w-4 mr-2" />{tabs.eventos}</TabsTrigger>
          <TabsTrigger value="logs"><Activity className="h-4 w-4 mr-2" />{tabs.logs}</TabsTrigger>
          <TabsTrigger value="mispreferencias"><User className="h-4 w-4 mr-2" />{tabs.misPreferencias}</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          {isAdmin ? (
            <ConfiguracionGlobalTab config={config} onUpdate={setConfig} />
          ) : (
            <AccessDeniedCard
              icon={AlertCircle}
              description={accesoDenegado.descripcion}
            />
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
    </ModuleContainer>
  )
}
