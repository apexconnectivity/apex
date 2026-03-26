'use client'

import { useState } from 'react'
import { Building2, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsCard, SettingsCardContent, SettingsCardFooter } from '@/components/ui/settings-card'
import { SettingsSection, SettingsDivider } from '@/components/ui/settings-section'
import { CONFIG_EMPRESA_LABELS, CONFIG_COLORS } from '@/constants/configuracion'
import { MESSAGE_TIMEOUT_MS } from '@/constants/timing'
import { ConfigEmpresa } from '@/types/configuracion'

interface SettingsEmpresaProps {
  config: ConfigEmpresa
  onSave: (config: ConfigEmpresa) => Promise<void>
}

export function SettingsEmpresa({ config, onSave }: SettingsEmpresaProps) {
  const [local, setLocal] = useState<ConfigEmpresa>(config)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      await onSave(local)
      setSaveMessage({ type: 'success', text: CONFIG_EMPRESA_LABELS.guardado_exito })
    } catch {
      setSaveMessage({ type: 'error', text: CONFIG_EMPRESA_LABELS.guardado_error })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), MESSAGE_TIMEOUT_MS)
    }
  }

  const handleLogoUpload = () => {
    // Simular carga de archivo
    setLocal({ ...local, logo_url: '/logo-empresa.png' })
  }

  return (
    <SettingsCard
      title={CONFIG_EMPRESA_LABELS.titulo}
      description={CONFIG_EMPRESA_LABELS.descripcion}
      icon={Building2}
    >
      <SettingsCardContent>
        {/* Logo Corporativo */}
        <SettingsSection
          title={CONFIG_EMPRESA_LABELS.logo.label}
        >
          <div className="flex items-center gap-4">
            {local.logo_url ? (
              <div className="relative">
                <div className="h-20 w-20 rounded-lg border bg-background flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
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
              <div className="h-20 w-20 rounded-lg border border-dashed bg-muted/30 flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleLogoUpload}>
              {local.logo_url ? CONFIG_EMPRESA_LABELS.logo.remove : CONFIG_EMPRESA_LABELS.logo.upload}
            </Button>
          </div>
        </SettingsSection>

        <SettingsDivider />

        {/* Nombre de la Empresa */}
        <SettingsSection
          title={CONFIG_EMPRESA_LABELS.nombre_empresa.label}
        >
          <Input
            value={local.nombre_empresa}
            onChange={(e) => setLocal({ ...local, nombre_empresa: e.target.value })}
            placeholder={CONFIG_EMPRESA_LABELS.nombre_empresa.placeholder}
            className="max-w-md"
          />
        </SettingsSection>

        <SettingsDivider />

        {/* RFC */}
        <SettingsSection
          title={CONFIG_EMPRESA_LABELS.rfc.label}
        >
          <Input
            value={local.rfc}
            onChange={(e) => setLocal({ ...local, rfc: e.target.value.toUpperCase() })}
            placeholder={CONFIG_EMPRESA_LABELS.rfc.placeholder}
            className="max-w-xs uppercase"
            maxLength={13}
          />
        </SettingsSection>

        <SettingsDivider />

        {/* Dirección */}
        <SettingsSection
          title={CONFIG_EMPRESA_LABELS.direccion.label}
        >
          <Input
            value={local.direccion}
            onChange={(e) => setLocal({ ...local, direccion: e.target.value })}
            placeholder={CONFIG_EMPRESA_LABELS.direccion.placeholder}
            className="max-w-lg"
          />
        </SettingsSection>

        <SettingsDivider />

        {/* Teléfono y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsSection
            title={CONFIG_EMPRESA_LABELS.telefono.label}
          >
            <Input
              value={local.telefono}
              onChange={(e) => setLocal({ ...local, telefono: e.target.value })}
              placeholder={CONFIG_EMPRESA_LABELS.telefono.placeholder}
              className="max-w-xs"
            />
          </SettingsSection>

          <SettingsSection
            title={CONFIG_EMPRESA_LABELS.email.label}
          >
            <Input
              type="email"
              value={local.email}
              onChange={(e) => setLocal({ ...local, email: e.target.value })}
              placeholder={CONFIG_EMPRESA_LABELS.email.placeholder}
              className="max-w-xs"
            />
          </SettingsSection>
        </div>

        <SettingsDivider />

        {/* Colores Institucionales */}
        <SettingsSection
          title={CONFIG_EMPRESA_LABELS.colores.label}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">{CONFIG_EMPRESA_LABELS.colores.primary}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={local.color_primario}
                  onChange={(e) => setLocal({ ...local, color_primario: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={local.color_primario}
                  onChange={(e) => setLocal({ ...local, color_primario: e.target.value })}
                  className="w-24 uppercase"
                  maxLength={7}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">{CONFIG_EMPRESA_LABELS.colores.secondary}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={local.color_secundario}
                  onChange={(e) => setLocal({ ...local, color_secundario: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={local.color_secundario}
                  onChange={(e) => setLocal({ ...local, color_secundario: e.target.value })}
                  className="w-24 uppercase"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Vista previa de colores */}
          <div className="mt-4 p-4 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">{CONFIG_EMPRESA_LABELS.colores.vista_previa}</p>
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: local.color_primario }}
              />
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: local.color_secundario }}
              />
            </div>
          </div>
        </SettingsSection>
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
              {CONFIG_EMPRESA_LABELS.guardando}
            </>
          ) : (
            CONFIG_EMPRESA_LABELS.guardar
          )}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  )
}
