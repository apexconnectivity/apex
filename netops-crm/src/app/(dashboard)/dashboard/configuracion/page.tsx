'use client'

import { useState, useEffect } from 'react'
import { Bell, Database } from 'lucide-react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { ModuleContainer, ModuleHeader } from '@/components/module'
import { SettingsGeneral } from '@/components/module/SettingsGeneral'
import { SettingsEmpresa } from '@/components/module/SettingsEmpresa'
import { SettingsModulos } from '@/components/module/SettingsModulos'
import { SettingsIntegraciones } from '@/components/module/SettingsIntegraciones'
import { CONFIG_TABS, CONFIG_PERMISOS_LABELS } from '@/constants/configuracion'
import {
  ConfiguracionCompleta,
  ConfigGeneral,
  ConfigEmpresa,
  ConfigModulos,
  ConfigIntegraciones,
  DEFAULT_CONFIG,
  SettingsTab,
} from '@/types/configuracion'

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [config, setConfig] = useState<ConfiguracionCompleta>(DEFAULT_CONFIG)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar configuración (simulado - luego se conectará a Supabase/localStorage)
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true)
      try {
        // Simular carga
        await new Promise(resolve => setTimeout(resolve, 500))

        // Cargar desde localStorage si existe
        const saved = localStorage.getItem('app_config')
        if (saved) {
          try {
            setConfig(JSON.parse(saved))
          } catch {
            setConfig(DEFAULT_CONFIG)
          }
        }
      } catch (error) {
        console.error('[Configuracion] Error al cargar configuración:', error)
        setConfig(DEFAULT_CONFIG)
      } finally {
        setIsLoading(false)
      }
    }
    loadConfig()
  }, [])

  // Handlers para guardar cada sección
  const handleSaveGeneral = async (general: ConfigGeneral) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newConfig = { ...config, general }
      setConfig(newConfig)
      localStorage.setItem('app_config', JSON.stringify(newConfig))
    } catch (error) {
      console.error('[Configuracion] Error al guardar configuración general:', error)
    }
  }

  const handleSaveEmpresa = async (empresa: ConfigEmpresa) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newConfig = { ...config, empresa }
      setConfig(newConfig)
      localStorage.setItem('app_config', JSON.stringify(newConfig))
    } catch (error) {
      console.error('[Configuracion] Error al guardar configuración de empresa:', error)
    }
  }

  const handleSaveModulos = async (modulos: ConfigModulos) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newConfig = { ...config, modulos }
      setConfig(newConfig)
      localStorage.setItem('app_config', JSON.stringify(newConfig))
    } catch (error) {
      console.error('[Configuracion] Error al guardar configuración de módulos:', error)
    }
  }

  const handleSaveIntegraciones = async (integraciones: ConfigIntegraciones) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newConfig = { ...config, integraciones }
      setConfig(newConfig)
      localStorage.setItem('app_config', JSON.stringify(newConfig))
    } catch (error) {
      console.error('[Configuracion] Error al guardar configuración de integraciones:', error)
    }
  }

  // Verificar si el usuario es admin
  const isAdmin = user?.roles.includes('admin')

  // Construir tabs para el header
  const tabs = [
    { value: 'general', label: CONFIG_TABS.general.label },
    { value: 'empresa', label: CONFIG_TABS.empresa.label },
    ...(isAdmin ? [
      { value: 'modulos', label: CONFIG_TABS.modulos.label },
      { value: 'integraciones', label: CONFIG_TABS.integraciones.label },
    ] : []),
    { value: 'notificaciones', label: CONFIG_TABS.notificaciones.label },
    ...(isAdmin ? [
      { value: 'respaldos', label: CONFIG_TABS.respaldos.label },
    ] : []),
  ]

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <ModuleContainer>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </ModuleContainer>
    )
  }

  return (
    <ModuleContainer>
      <ModuleHeader
        title="Configuración"
        description="Gestiona la configuración de la aplicación y tu organización"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value as SettingsTab)}
      />

      {/* Contenido de las tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingsTab)} className="mt-6 space-y-4">
        {/* General - Disponible para todos */}
        <TabsContent value="general" className="space-y-4 mt-0">
          <SettingsGeneral
            config={config.general}
            onSave={handleSaveGeneral}
          />
        </TabsContent>

        {/* Empresa - Disponible para admin */}
        <TabsContent value="empresa" className="space-y-4 mt-0">
          {isAdmin ? (
            <SettingsEmpresa
              config={config.empresa}
              onSave={handleSaveEmpresa}
            />
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">
                {CONFIG_PERMISOS_LABELS.empresa}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Módulos - Solo admin */}
        <TabsContent value="modulos" className="space-y-4 mt-0">
          {isAdmin ? (
            <SettingsModulos
              config={config.modulos}
              onSave={handleSaveModulos}
            />
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">
                {CONFIG_PERMISOS_LABELS.modulos}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Integraciones - Solo admin */}
        <TabsContent value="integraciones" className="space-y-4 mt-0">
          {isAdmin ? (
            <SettingsIntegraciones
              config={config.integraciones}
              onSave={handleSaveIntegraciones}
            />
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">
                {CONFIG_PERMISOS_LABELS.integraciones}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Notificaciones - Disponible para todos */}
        <TabsContent value="notificaciones" className="space-y-4 mt-0">
          <div className="p-6 rounded-xl border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{CONFIG_TABS.notificaciones.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {CONFIG_TABS.notificaciones.description}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta sección está en desarrollo. Por ahora, las notificaciones se configuran en la{' '}
              <a href="/dashboard/perfil" className="text-primary hover:underline">
                página de perfil
              </a>
              .
            </p>
          </div>
        </TabsContent>

        {/* Respaldos - Solo admin */}
        <TabsContent value="respaldos" className="space-y-4 mt-0">
          {isAdmin ? (
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{CONFIG_TABS.respaldos.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {CONFIG_TABS.respaldos.description}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Esta sección está en desarrollo. Los respaldos automáticos se configuran a nivel de servidor.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">
                {CONFIG_PERMISOS_LABELS.respaldos}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ModuleContainer>
  )
}
