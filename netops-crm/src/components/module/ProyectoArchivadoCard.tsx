import { BaseCard } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getClasificacionColor, ProyectoArchivado } from '@/types/archivado'
import { ARCHIVADO_BOTONES, ARCHIVADO_CLASIFICACION } from '@/constants/archivado'
import { ExternalLink, RotateCcw, Trash2, Calendar, Database, Building2 } from 'lucide-react'

interface ProyectoArchivadoCardProps {
  proyecto: ProyectoArchivado
  onVer: (proyecto: ProyectoArchivado) => void
  onRestaurar: (proyecto: ProyectoArchivado) => void
  onEliminar: (proyecto: ProyectoArchivado) => void
}

/**
 * ProyectoArchivadoCard - Card para proyectos archivados
 * 
 * Usa BaseCard con efectos de hover y glow.
 */
export function ProyectoArchivadoCard({ proyecto, onVer, onRestaurar, onEliminar }: ProyectoArchivadoCardProps) {
  return (
    <BaseCard hoverable glowOnHover padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => onVer(proyecto)}>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</span>
          </div>
          <h3 className="font-semibold">{proyecto.nombre}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(proyecto.fecha_archivado).toLocaleDateString('es-ES')}
            </span>
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              {proyecto.tamaño_archivo_mb} MB
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getClasificacionColor(proyecto.clasificacion)}>
              {proyecto.clasificacion === 'completado' ? ARCHIVADO_CLASIFICACION.completado : ARCHIVADO_CLASIFICACION.inconcluso}
            </Badge>
            <Badge variant="outline">
              {proyecto.tareas_completadas}/{proyecto.tareas_totales} tareas
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onVer(proyecto)}>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onRestaurar(proyecto)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => onEliminar(proyecto)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </BaseCard>
  )
}
