'use client'

import { useState } from 'react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ProyectoCerrado, Clasificacion, getClasificacionColor } from '@/types/archivado'
import { ARCHIVADO_BOTONES, ARCHIVADO_CLASIFICACION, ARCHIVAR_MODAL } from '@/constants/archivado'
import { CheckCircle, AlertTriangle, Archive } from 'lucide-react'
import { ModalVariant } from '@/constants/modales'

interface ConfirmArchiveModalProps {
  proyecto: ProyectoCerrado | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (clasificacion: Clasificacion) => void
}

/**
 * ConfirmArchiveModal - Componente migrado a BaseModal
 * 
 * Antes: usaba Dialog de @/components/ui/dialog
 * Ahora: usa BaseModal + ModalHeader/Body/Footer
 */
export function ConfirmArchiveModal({
  proyecto,
  open,
  onOpenChange,
  onConfirm
}: ConfirmArchiveModalProps) {
  // Si no hay proyecto, no renderizar
  if (!proyecto) return null

  const esCompletado = proyecto.fase_actual === 5 && proyecto.tareas_fase5_completadas === proyecto.tareas_fase5_totales
  const [clasificacion, setClasificacion] = useState<Clasificacion>(esCompletado ? 'completado' : 'inconcluso')

  const handleConfirm = () => {
    onConfirm(clasificacion)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Variante del modal (warning para acción de archivar)
  const variant: ModalVariant = 'warning'

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      size="md"
      variant={variant}
      showAccentBar
    >
      {/* ✅ ModalHeader */}
      <ModalHeader
        title={ARCHIVAR_MODAL.titulo}
        variant={variant}
        showIcon
      />

      {/* ✅ ModalBody */}
      <ModalBody>
        <div className="space-y-4">
          {/* Info del proyecto */}
          <div>
            <p className="font-medium">{proyecto.nombre}</p>
            <p className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>

          {/* Clasificación automática */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">{ARCHIVAR_MODAL.clasificacionAutomatica}</p>
            {esCompletado ? (
              <Badge className={getClasificacionColor('completado')}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {ARCHIVADO_CLASIFICACION.completado}
              </Badge>
            ) : (
              <Badge className={getClasificacionColor('inconcluso')}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {ARCHIVADO_CLASIFICACION.inconcluso}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {ARCHIVAR_MODAL.basadoEn} {ARCHIVAR_MODAL.fase} {proyecto.fase_actual}, {ARCHIVAR_MODAL.tareasCierre} {proyecto.tareas_fase5_completadas}/{proyecto.tareas_fase5_totales} {ARCHIVAR_MODAL.completadas}
            </p>
          </div>

          {/* Selector de clasificación */}
          <div>
            <Label>{ARCHIVAR_MODAL.clasificacionEditable}</Label>
            <Select value={clasificacion} onValueChange={(v) => setClasificacion(v as Clasificacion)}>
              <SelectTrigger className="bg-background mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completado">{ARCHIVADO_CLASIFICACION.completado}</SelectItem>
                <SelectItem value="inconcluso">{ARCHIVADO_CLASIFICACION.inconcluso}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModalBody>

      {/* ✅ ModalFooter */}
      <ModalFooter variant={variant} layout="inline-between">
        <Button variant="outline" onClick={handleClose}>
          {ARCHIVADO_BOTONES.cancelar}
        </Button>
        <Button onClick={handleConfirm}>
          {ARCHIVADO_BOTONES.archivar}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
