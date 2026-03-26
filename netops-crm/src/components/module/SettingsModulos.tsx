'use client'

import { useState } from 'react'
import { LayoutGrid, Loader2, CheckCircle2, Building2, FolderKanban, CheckSquare, Headphones, FileText, Calendar, Bell, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsCard, SettingsCardContent, SettingsCardFooter } from '@/components/ui/settings-card'
import { SettingsSection, SettingsDivider } from '@/components/ui/settings-section'
import { CONFIG_MODULOS_LABELS, CONFIG_COMMON_LABELS, CONFIG_COLORS } from '@/constants/configuracion'
import { MESSAGE_TIMEOUT_MS } from '@/constants/timing'
import { ConfigModulos, ModuloConfig } from '@/types/configuracion'

interface SettingsModulosProps {
  config: ConfigModulos
  onSave: (config: ConfigModulos) => Promise<void>
}

// Mapeo de iconos por módulo
const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  crm: Building2,
  proyectos: FolderKanban,
  tareas: CheckSquare,
  soporte: Headphones,
  archivos: FileText,
  compras: ShoppingCart,
  calendario: Calendar,
  notificaciones: Bell,
}

interface ModuloItemProps {
  modulo: ModuloConfig
  onToggle: (habilitado: boolean) => void
}

function ModuloItem({ modulo, onToggle }: ModuloItemProps) {
  const Icon = MODULE_ICONS[modulo.id] || LayoutGrid

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{modulo.nombre}</p>
          <p className="text-sm text-muted-foreground">{modulo.descripcion}</p>
        </div>
      </div>
      <Button
        variant={modulo.habilitado ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle(!modulo.habilitado)}
        className={modulo.habilitado ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
      >
        {modulo.habilitado ? CONFIG_MODULOS_LABELS.habilitar : CONFIG_MODULOS_LABELS.deshabilitar}
      </Button>
    </div>
  )
}

export function SettingsModulos({ config, onSave }: SettingsModulosProps) {
  const [local, setLocal] = useState<ConfigModulos>(config)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleToggleModulo = (moduloId: string, habilitado: boolean) => {
    setLocal({
      ...local,
      [moduloId]: {
        ...local[moduloId as keyof ConfigModulos],
        habilitado,
      },
    } as ConfigModulos)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      await onSave(local)
      setSaveMessage({ type: 'success', text: 'Configuración guardada correctamente' })
    } catch {
      setSaveMessage({ type: 'error', text: 'Error al guardar la configuración' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), MESSAGE_TIMEOUT_MS)
    }
  }

  const modulosList = Object.values(local)
  const enabledCount = modulosList.filter(m => m.habilitado).length
  const disabledCount = modulosList.filter(m => !m.habilitado).length

  return (
    <SettingsCard
      title={CONFIG_MODULOS_LABELS.titulo}
      description={CONFIG_MODULOS_LABELS.descripcion}
      icon={LayoutGrid}
    >
      <SettingsCardContent>
        {/* Lista de módulos */}
        <SettingsSection
          title={CONFIG_MODULOS_LABELS.titulo_lista}
          description={CONFIG_MODULOS_LABELS.descripcion_lista}
        >
          <div className="space-y-2">
            {modulosList.map((modulo) => (
              <ModuloItem
                key={modulo.id}
                modulo={modulo}
                onToggle={(habilitado) => handleToggleModulo(modulo.id, habilitado)}
              />
            ))}
          </div>
        </SettingsSection>

        <SettingsDivider />

        {/* Estadísticas de módulos */}
        <SettingsSection
          title={CONFIG_MODULOS_LABELS.resumen}
          description={CONFIG_MODULOS_LABELS.resumen_descripcion}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${CONFIG_COLORS.success.bg} ${CONFIG_COLORS.success.border}`}>
              <p className={`text-2xl font-bold ${CONFIG_COLORS.success.text}`}>
                {enabledCount}
              </p>
              <p className="text-sm text-muted-foreground">{CONFIG_MODULOS_LABELS.habilitados}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted border">
              <p className="text-2xl font-bold text-muted-foreground">
                {disabledCount}
              </p>
              <p className="text-sm text-muted-foreground">{CONFIG_MODULOS_LABELS.deshabilitados}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {CONFIG_MODULOS_LABELS.cambios_nota}
          </p>
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
              {CONFIG_COMMON_LABELS.guardando}
            </>
          ) : (
            CONFIG_MODULOS_LABELS.guardar
          )}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  )
}
