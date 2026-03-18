'use client'

import { useState } from 'react'
import { Plug, Loader2, CheckCircle2, ExternalLink, Key, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsCard, SettingsCardContent, SettingsCardFooter } from '@/components/ui/settings-card'
import { SettingsSection, SettingsRow, SettingsDivider } from '@/components/ui/settings-section'
import { ToggleSwitch } from '@/components/ui/toggle'
import { CONFIG_INTEGRACIONES_LABELS, CONFIG_COLORS } from '@/constants/configuracion'
import { ConfigIntegraciones, IntegracionConfig } from '@/types/configuracion'

interface SettingsIntegracionesProps {
  config: ConfigIntegraciones
  onSave: (config: ConfigIntegraciones) => Promise<void>
}

interface IntegracionItemProps {
  integracion: IntegracionConfig
  onToggle: (habilitada: boolean) => void
  children?: React.ReactNode
}

function IntegracionItem({ integracion, onToggle, children }: IntegracionItemProps) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plug className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{integracion.nombre}</h4>
            <p className="text-sm text-muted-foreground">{integracion.descripcion}</p>
          </div>
        </div>
        <ToggleSwitch
          checked={integracion.habilitada}
          onCheckedChange={onToggle}
        />
      </div>
      {children}
    </div>
  )
}

export function SettingsIntegraciones({ config, onSave }: SettingsIntegracionesProps) {
  const [local, setLocal] = useState<ConfigIntegraciones>(config)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Estado local para campos de SMTP
  const [smtpData, setSmtpData] = useState({
    host: local.email_smtp.config.host || '',
    port: local.email_smtp.config.port || '587',
    user: local.email_smtp.config.user || '',
    password: local.email_smtp.config.password || '',
    from_email: local.email_smtp.config.from_email || '',
    from_name: local.email_smtp.config.from_name || '',
  })

  const handleToggleIntegracion = (integracionId: string, habilitada: boolean) => {
    setLocal({
      ...local,
      [integracionId]: {
        ...local[integracionId as keyof ConfigIntegraciones],
        habilitada,
      },
    } as ConfigIntegraciones)
  }

  const handleSmtpChange = (field: string, value: string) => {
    setSmtpData({ ...smtpData, [field]: value })
    setLocal({
      ...local,
      email_smtp: {
        ...local.email_smtp,
        config: {
          ...local.email_smtp.config,
          [field]: value,
        },
      },
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      await onSave(local)
      setSaveMessage({ type: 'success', text: CONFIG_INTEGRACIONES_LABELS.guardado_exito })
    } catch {
      setSaveMessage({ type: 'error', text: CONFIG_INTEGRACIONES_LABELS.guardado_error })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  return (
    <SettingsCard
      title={CONFIG_INTEGRACIONES_LABELS.titulo}
      description={CONFIG_INTEGRACIONES_LABELS.descripcion}
      icon={Plug}
    >
      <SettingsCardContent className="space-y-4">
        {/* Google Drive */}
        <IntegracionItem
          integracion={local.google_drive}
          onToggle={(habilitada) => handleToggleIntegracion('google_drive', habilitada)}
        >
          {local.google_drive.habilitada && (
            <div className="ml-13 pl-13 mt-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {CONFIG_INTEGRACIONES_LABELS.google.conectar}
              </Button>
            </div>
          )}
        </IntegracionItem>

        {/* Google Calendar */}
        <IntegracionItem
          integracion={local.google_calendar}
          onToggle={(habilitada) => handleToggleIntegracion('google_calendar', habilitada)}
        >
          {local.google_calendar.habilitada && (
            <div className="ml-13 pl-13 mt-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {CONFIG_INTEGRACIONES_LABELS.google.conectar}
              </Button>
            </div>
          )}
        </IntegracionItem>

        {/* N8N */}
        <IntegracionItem
          integracion={local.n8n}
          onToggle={(habilitada) => handleToggleIntegracion('n8n', habilitada)}
        >
          {local.n8n.habilitada && (
            <div className="ml-13 pl-13 mt-2 space-y-3">
              <div>
                <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.n8n.webhook_url}</label>
                <Input
                  placeholder="https://tu-servidor-n8n.io/webhook/..."
                  className="mt-1"
                  value={local.n8n.config.webhook_url || ''}
                  onChange={(e) => setLocal({
                    ...local,
                    n8n: {
                      ...local.n8n,
                      config: { ...local.n8n.config, webhook_url: e.target.value }
                    }
                  })}
                />
              </div>
            </div>
          )}
        </IntegracionItem>

        {/* Email SMTP */}
        <IntegracionItem
          integracion={local.email_smtp}
          onToggle={(habilitada) => handleToggleIntegracion('email_smtp', habilitada)}
        >
          {local.email_smtp.habilitada && (
            <div className="ml-13 pl-13 mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.smtp.host}</label>
                  <Input
                    placeholder="smtp.gmail.com"
                    className="mt-1"
                    value={smtpData.host}
                    onChange={(e) => handleSmtpChange('host', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.smtp.port}</label>
                  <Input
                    placeholder="587"
                    className="mt-1"
                    value={smtpData.port}
                    onChange={(e) => handleSmtpChange('port', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.smtp.usuario}</label>
                <Input
                  placeholder="correo@empresa.com"
                  className="mt-1"
                  value={smtpData.user}
                  onChange={(e) => handleSmtpChange('user', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.smtp.password}</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                  value={smtpData.password}
                  onChange={(e) => handleSmtpChange('password', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.smtp.from_email}</label>
                  <Input
                    placeholder="noreply@empresa.com"
                    className="mt-1"
                    value={smtpData.from_email}
                    onChange={(e) => handleSmtpChange('from_email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{CONFIG_INTEGRACIONES_LABELS.smtp.from_name}</label>
                  <Input
                    placeholder="NetOps CRM"
                    className="mt-1"
                    value={smtpData.from_name}
                    onChange={(e) => handleSmtpChange('from_name', e.target.value)}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                {CONFIG_INTEGRACIONES_LABELS.smtp.probar}
              </Button>
            </div>
          )}
        </IntegracionItem>

        {/* Supabase - Solo lectura */}
        <div className="p-4 rounded-lg border bg-muted/30 opacity-75">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{CONFIG_INTEGRACIONES_LABELS.supabase.nombre}</h4>
                <p className="text-sm text-muted-foreground">{CONFIG_INTEGRACIONES_LABELS.supabase.descripcion}</p>
              </div>
            </div>
            <span className="text-sm text-emerald-500 font-medium">{CONFIG_INTEGRACIONES_LABELS.supabase.conectado}</span>
          </div>
        </div>
      </SettingsCardContent>

      <SettingsCardFooter>
        {saveMessage && (
          <div className={`flex items-center gap-2 text-sm ${saveMessage.type === 'success' ? CONFIG_COLORS.success.text : CONFIG_COLORS.error.text}`}>
            {saveMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : null}
            {saveMessage.text}
          </div>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {CONFIG_INTEGRACIONES_LABELS.guardando}
            </>
          ) : (
            CONFIG_INTEGRACIONES_LABELS.guardar
          )}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  )
}
