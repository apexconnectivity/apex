'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ConfigArchivado } from '@/types/archivado'
import { ARCHIVADO_CONFIG, ARCHIVADO_BOTONES } from '@/constants/archivado'
import { Settings, Database, Trash2, Save } from 'lucide-react'

interface ConfiguracionTabProps {
  config: ConfigArchivado
  onUpdate: (config: ConfigArchivado) => void
}

export function ConfiguracionTab({ config, onUpdate }: ConfiguracionTabProps) {
  const [local, setLocal] = useState(config)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {ARCHIVADO_CONFIG.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{ARCHIVADO_CONFIG.archivadoAutomatico.titulo}</p>
              <p className="text-sm text-muted-foreground">{ARCHIVADO_CONFIG.archivadoAutomatico.descripcion}</p>
            </div>
            <Button
              variant={local.archivado_automatico ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocal({ ...local, archivado_automatico: !local.archivado_automatico })}
            >
              {local.archivado_automatico ? ARCHIVADO_CONFIG.archivadoAutomatico.activado : ARCHIVADO_CONFIG.archivadoAutomatico.desactivado}
            </Button>
          </div>

          {local.archivado_automatico && (
            <div>
              <Label>{ARCHIVADO_CONFIG.archivadoAutomatico.diasNotificacion}</Label>
              <Input
                type="number"
                value={local.dias_antes_notificacion}
                onChange={(e) => setLocal({ ...local, dias_antes_notificacion: parseInt(e.target.value) })}
                className="bg-background w-32 mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {ARCHIVADO_CONFIG.queArchivar.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{ARCHIVADO_CONFIG.queArchivar.incluirTickets.titulo}</p>
              <p className="text-sm text-muted-foreground">{ARCHIVADO_CONFIG.queArchivar.incluirTickets.descripcion}</p>
            </div>
            <Button
              variant={local.incluir_tickets ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocal({ ...local, incluir_tickets: !local.incluir_tickets })}
            >
              {local.incluir_tickets ? ARCHIVADO_CONFIG.si : ARCHIVADO_CONFIG.no}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{ARCHIVADO_CONFIG.queArchivar.generarPdf.titulo}</p>
              <p className="text-sm text-muted-foreground">{ARCHIVADO_CONFIG.queArchivar.generarPdf.descripcion}</p>
            </div>
            <Button
              variant={local.generar_pdf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocal({ ...local, generar_pdf: !local.generar_pdf })}
            >
              {local.generar_pdf ? ARCHIVADO_CONFIG.si : ARCHIVADO_CONFIG.no}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {ARCHIVADO_CONFIG.queEliminar.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">{ARCHIVADO_CONFIG.queEliminar.eliminarTareas}</p>
            <Button
              variant={local.eliminar_tareas ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocal({ ...local, eliminar_tareas: !local.eliminar_tareas })}
            >
              {local.eliminar_tareas ? ARCHIVADO_CONFIG.si : ARCHIVADO_CONFIG.no}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">{ARCHIVADO_CONFIG.queEliminar.eliminarReuniones}</p>
            <Button
              variant={local.eliminar_reuniones ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocal({ ...local, eliminar_reuniones: !local.eliminar_reuniones })}
            >
              {local.eliminar_reuniones ? ARCHIVADO_CONFIG.si : ARCHIVADO_CONFIG.no}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">{ARCHIVADO_CONFIG.queEliminar.eliminarArchivos}</p>
            <Button
              variant={local.eliminar_archivos ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocal({ ...local, eliminar_archivos: !local.eliminar_archivos })}
            >
              {local.eliminar_archivos ? ARCHIVADO_CONFIG.si : ARCHIVADO_CONFIG.no}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ARCHIVADO_CONFIG.ubicacionDrive.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>{ARCHIVADO_CONFIG.ubicacionDrive.carpetaRaiz}</Label>
          <Input
            value={local.carpeta_raiz}
            onChange={(e) => setLocal({ ...local, carpeta_raiz: e.target.value })}
            className="bg-background mt-1"
          />
        </CardContent>
      </Card>

      <Button onClick={() => onUpdate(local)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {ARCHIVADO_BOTONES.guardarConfiguracion}
      </Button>
    </div>
  )
}