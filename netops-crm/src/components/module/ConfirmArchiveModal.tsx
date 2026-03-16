import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ProyectoCerrado, Clasificacion, getClasificacionColor } from '@/types/archivado'
import { ARCHIVADO_BOTONES, ARCHIVADO_CLASIFICACION, ARCHIVAR_MODAL } from '@/constants/archivado'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface ConfirmArchiveModalProps {
  proyecto: ProyectoCerrado
  onClose: () => void
  onConfirm: (clasificacion: Clasificacion) => void
}

export function ConfirmArchiveModal({ proyecto, onClose, onConfirm }: ConfirmArchiveModalProps) {
  const esCompletado = proyecto.fase_actual === 5 && proyecto.tareas_fase5_completadas === proyecto.tareas_fase5_totales
  const [clasificacion, setClasificacion] = useState<Clasificacion>(esCompletado ? 'completado' : 'inconcluso')

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{ARCHIVAR_MODAL.titulo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-medium">{proyecto.nombre}</p>
            <p className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>

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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {ARCHIVADO_BOTONES.cancelar}
          </Button>
          <Button onClick={() => onConfirm(clasificacion)}>
            {ARCHIVADO_BOTONES.archivar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}