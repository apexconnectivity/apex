'use client'

import { useState } from 'react'
import { Settings, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SettingsCard, SettingsCardContent, SettingsCardFooter } from '@/components/ui/settings-card'
import { SettingsSection, SettingsDivider } from '@/components/ui/settings-section'
import { CONFIG_GENERAL_LABELS, ZONAS_HORARIAS, FORMATOS_FECHA, FORMATOS_HORA, IDIOMAS } from '@/constants/configuracion'
import { ConfigGeneral } from '@/types/configuracion'

interface SettingsGeneralProps {
  config: ConfigGeneral
  onSave: (config: ConfigGeneral) => Promise<void>
}

export function SettingsGeneral({ config, onSave }: SettingsGeneralProps) {
  const [local, setLocal] = useState<ConfigGeneral>(config)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      await onSave(local)
      setSaveMessage({ type: 'success', text: CONFIG_GENERAL_LABELS.guardado_exito })
    } catch {
      setSaveMessage({ type: 'error', text: CONFIG_GENERAL_LABELS.guardado_error })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleLogoUpload = () => {
    // Simular carga de archivo
    setLocal({ ...local, logo_url: '/logo.png' })
  }

  const handleFaviconUpload = () => {
    // Simular carga de archivo
    setLocal({ ...local, favicon_url: '/favicon.ico' })
  }

  return (
    <SettingsCard
      title={CONFIG_GENERAL_LABELS.titulo}
      description={CONFIG_GENERAL_LABELS.descripcion}
      icon={Settings}
    >
      <SettingsCardContent>
        {/* Nombre de la aplicación */}
        <SettingsSection
          title={CONFIG_GENERAL_LABELS.nombre_app.label}
        >
          <Input
            value={local.nombre_app}
            onChange={(e) => setLocal({ ...local, nombre_app: e.target.value })}
            placeholder={CONFIG_GENERAL_LABELS.nombre_app.placeholder}
            className="max-w-md"
          />
        </SettingsSection>

        <SettingsDivider />

        {/* Logo y Favicon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <SettingsSection
            title={CONFIG_GENERAL_LABELS.logo.label}
          >
            <div className="flex items-center gap-4">
              {local.logo_url ? (
                <div className="relative">
                  <div className="h-16 w-16 rounded-lg border bg-background flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {local.nombre_app.charAt(0)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setLocal({ ...local, logo_url: null })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-lg border border-dashed bg-muted/30 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogoUpload}>
                {local.logo_url ? CONFIG_GENERAL_LABELS.logo.remove : CONFIG_GENERAL_LABELS.logo.upload}
              </Button>
            </div>
          </SettingsSection>

          {/* Favicon */}
          <SettingsSection
            title={CONFIG_GENERAL_LABELS.favicon.label}
          >
            <div className="flex items-center gap-4">
              {local.favicon_url ? (
                <div className="h-8 w-8 rounded border bg-background flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    {local.nombre_app.charAt(0)}
                  </span>
                </div>
              ) : (
                <div className="h-8 w-8 rounded border border-dashed bg-muted/30 flex items-center justify-center">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleFaviconUpload}>
                {CONFIG_GENERAL_LABELS.favicon.upload}
              </Button>
            </div>
          </SettingsSection>
        </div>

        <SettingsDivider />

        {/* Zona Horaria */}
        <SettingsSection
          title={CONFIG_GENERAL_LABELS.zona_horaria.label}
        >
          <Select
            value={local.zona_horaria}
            onValueChange={(value) => setLocal({ ...local, zona_horaria: value })}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={CONFIG_GENERAL_LABELS.zona_horaria.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {ZONAS_HORARIAS.map((zona) => (
                <SelectItem key={zona.value} value={zona.value}>
                  {zona.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsSection>

        <SettingsDivider />

        {/* Formato de fecha y hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsSection
            title={CONFIG_GENERAL_LABELS.formato_fecha.label}
          >
            <Select
              value={local.formato_fecha}
              onValueChange={(value) => setLocal({ ...local, formato_fecha: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATOS_FECHA.map((formato) => (
                  <SelectItem key={formato.value} value={formato.value}>
                    {formato.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsSection>

          <SettingsSection
            title={CONFIG_GENERAL_LABELS.formato_hora.label}
          >
            <Select
              value={local.formato_hora}
              onValueChange={(value) => setLocal({ ...local, formato_hora: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATOS_HORA.map((formato) => (
                  <SelectItem key={formato.value} value={formato.value}>
                    {formato.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsSection>
        </div>

        <SettingsDivider />

        {/* Idioma */}
        <SettingsSection
          title={CONFIG_GENERAL_LABELS.idioma.label}
        >
          <Select
            value={local.idioma}
            onValueChange={(value) => setLocal({ ...local, idioma: value })}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IDIOMAS.map((idioma) => (
                <SelectItem key={idioma.value} value={idioma.value}>
                  {idioma.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsSection>

        <SettingsDivider />

        {/* Tema */}
        <SettingsSection
          title={CONFIG_GENERAL_LABELS.tema.label}
        >
          <div className="flex gap-2">
            {(['sistema', 'claro', 'oscuro'] as const).map((tema) => (
              <Button
                key={tema}
                variant={local.tema === tema ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocal({ ...local, tema })}
              >
                {CONFIG_GENERAL_LABELS.tema.opciones[tema]}
              </Button>
            ))}
          </div>
        </SettingsSection>
      </SettingsCardContent>

      <SettingsCardFooter>
        {saveMessage && (
          <div className={`flex items-center gap-2 text-sm ${saveMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
            {saveMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : null}
            {saveMessage.text}
          </div>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {CONFIG_GENERAL_LABELS.guardando}
            </>
          ) : (
            CONFIG_GENERAL_LABELS.guardar
          )}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  )
}
