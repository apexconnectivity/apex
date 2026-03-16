'use client'

import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getClasificacionColor, ProyectoArchivado } from '@/types/archivado'
import { ARCHIVADO_BOTONES, DETALLE_ARCHIVADO_MODAL, ARCHIVADO_CLASIFICACION } from '@/constants/archivado'
import { Archive, FileText, Download, Folder, RotateCcw, Trash2, ExternalLink } from 'lucide-react'

interface DetalleArchivadoModalProps {
  proyecto: ProyectoArchivado | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRestaurar: () => void
  onEliminar: () => void
}

/**
 * DetalleArchivadoModal - Componente migrado a BaseModal
 * 
 * Antes: usaba Dialog de @/components/ui/dialog
 * Ahora: usa BaseModal + ModalHeader/Body
 */
export function DetalleArchivadoModal({ 
  proyecto, 
  open, 
  onOpenChange,
  onRestaurar, 
  onEliminar 
}: DetalleArchivadoModalProps) {
  // Si no hay proyecto, no renderizar
  if (!proyecto) return null
  
  const handleClose = () => onOpenChange(false)

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      size="lg"
    >
      {/* ✅ ModalHeader */}
      <ModalHeader
        title={
          <span className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-cyan-400" />
            {DETALLE_ARCHIVADO_MODAL.titulo}
          </span>
        }
        showBorder={false}
      />
      
      {/* ✅ ModalBody - Todo el contenido */}
      <ModalBody>
        <div className="space-y-6">
          {/* Título y empresa */}
          <div>
            <h2 className="text-xl font-bold">{proyecto.nombre}</h2>
            <p className="text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{ARCHIVADO_CLASIFICACION.clasificacion}</p>
              <Badge className={getClasificacionColor(proyecto.clasificacion)}>
                {proyecto.clasificacion === 'completado' ? ARCHIVADO_CLASIFICACION.completado : ARCHIVADO_CLASIFICACION.inconcluso}
              </Badge>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{ARCHIVADO_CLASIFICACION.duracion}</p>
              <p className="font-medium">{proyecto.duracion_dias} {ARCHIVADO_CLASIFICACION.dias}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.fechaCierre}</p>
              <p className="font-medium">{new Date(proyecto.fecha_cierre).toLocaleDateString('es-ES')}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.fechaArchivado}</p>
              <p className="font-medium">{new Date(proyecto.fecha_archivado).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          {/* Motivo de cierre */}
          <div>
            <p className="text-sm text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.motivoCierre}</p>
            <p className="text-sm bg-muted/50 p-3 rounded-lg">{proyecto.motivo_cierre}</p>
          </div>

          {/* Resumen */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">{DETALLE_ARCHIVADO_MODAL.resumen}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.tareas}</p>
                <p className="font-medium">{proyecto.tareas_completadas}/{proyecto.tareas_totales}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.tickets}</p>
                <p className="font-medium">{proyecto.tickets_count}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.reuniones}</p>
                <p className="font-medium">{proyecto.reuniones_count}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{DETALLE_ARCHIVADO_MODAL.archivos}</p>
                <p className="font-medium">{proyecto.archivos_count}</p>
              </div>
            </div>
          </div>

          {/* Archivos generados */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">{DETALLE_ARCHIVADO_MODAL.archivosGenerados}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{DETALLE_ARCHIVADO_MODAL.exportacionDatos}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {proyecto.archivo_pdf_link && (
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{DETALLE_ARCHIVADO_MODAL.resumenEjecutivo}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span>{DETALLE_ARCHIVADO_MODAL.carpetaDrive}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={proyecto.drive_carpeta_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="border-t pt-4 flex gap-2">
            <Button className="flex-1" onClick={onRestaurar}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {ARCHIVADO_BOTONES.restaurar}
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onEliminar}>
              <Trash2 className="h-4 w-4 mr-2" />
              {ARCHIVADO_BOTONES.eliminarDefinitivamente}
            </Button>
          </div>
        </div>
      </ModalBody>
    </BaseModal>
  )
}
