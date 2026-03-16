import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Archivo, getFileIcon, formatBytes } from '@/types/archivos'
import { BADGE_LABELS } from '@/lib/constants/archivos'
import { Eye, Link2, Trash2, Globe, Lock } from 'lucide-react'

interface ArchivoCardProps {
  archivo: Archivo
  onVer: () => void
  onEliminar: () => void
}

export default function ArchivoCard({ archivo, onVer, onEliminar }: ArchivoCardProps) {
  return (
    <Card className="card-hover-scale-glow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-muted-foreground">{getFileIcon(archivo.mime_type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{archivo.nombre_original}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{formatBytes(archivo.tamaño_bytes)}</span>
              <span>•</span>
              <span>{new Date(archivo.fecha_subida).toLocaleDateString('es-ES')}</span>
              <span>•</span>
              <span>{archivo.subido_por_nombre}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {archivo.visibilidad === 'publico' && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  {BADGE_LABELS.publico}
                </Badge>
              )}
              {archivo.visibilidad === 'interno' && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  {BADGE_LABELS.interno}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onVer} title="Ver en Drive">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(archivo.drive_view_link)} title="Copiar enlace">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onEliminar} title="Eliminar">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
