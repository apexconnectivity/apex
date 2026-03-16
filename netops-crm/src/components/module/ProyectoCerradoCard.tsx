import { BaseCard } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Archive, Calendar, Building2, CheckCircle, AlertTriangle } from 'lucide-react'
import { ProyectoCerrado, getClasificacionColor } from '@/types/archivado'
import { ARCHIVADO_BOTONES, ARCHIVADO_CLASIFICACION, PROYECTO_CERRADO_LABELS } from '@/constants/archivado'

interface ProyectoCerradoCardProps {
  proyecto: ProyectoCerrado
  onArchivar: (proyecto: ProyectoCerrado) => void
}

/**
 * ProyectoCerradoCard - Card para proyectos cerrados
 * 
 * Usa BaseCard con efectos de hover y glow.
 */
export function ProyectoCerradoCard({ proyecto, onArchivar }: ProyectoCerradoCardProps) {
  const esCompletado = proyecto.fase_actual === 5 && proyecto.tareas_fase5_completadas === proyecto.tareas_fase5_totales

  return (
    <BaseCard hoverable glowOnHover padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</span>
          </div>
          <h3 className="font-semibold">{proyecto.nombre}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Archive className="h-3 w-3" />
              {proyecto.dias_cerrado} {PROYECTO_CERRADO_LABELS.diasCerrado}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {PROYECTO_CERRADO_LABELS.cerrado}: {new Date(proyecto.fecha_cierre).toLocaleDateString('es-ES')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
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
            <Badge variant="outline">
              {PROYECTO_CERRADO_LABELS.fase} {proyecto.fase_actual}: {proyecto.fase_nombre}
            </Badge>
          </div>
        </div>
        <Button onClick={() => onArchivar(proyecto)}>
          <Archive className="h-4 w-4 mr-2" />
          {ARCHIVADO_BOTONES.archivar}
        </Button>
      </div>
    </BaseCard>
  )
}
