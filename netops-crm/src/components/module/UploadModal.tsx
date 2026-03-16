'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Archivo, EntidadTipo, Visibilidad, formatBytes, TAMAÑO_MAXIMO } from '@/types/archivos'
import {
  UPLOAD_MODAL,
  FILE_TYPES,
  VISIBILITY_OPTIONS,
  FILE_PLACEHOLDER,
  ERROR_MESSAGES,
  BUTTON_LABELS,
} from '@/constants/archivos'

interface EntidadOption {
  id: string
  nombre: string
}

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (archivo: Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'ruta_completa' | 'fecha_subida'>) => void
  empresas?: EntidadOption[]
  proyectos?: EntidadOption[]
}

/**
 * UploadModal - Componente migrado a BaseModal
 * 
 * Antes: usaba Dialog de @/components/ui/dialog
 * Ahora: usa BaseModal + ModalHeader/Body/Footer
 */
export default function UploadModal({
  open,
  onOpenChange,
  onUpload,
  empresas = [],
  proyectos = [],
}: UploadModalProps) {
  const [archivo, setArchivo] = useState({
    nombre_original: '',
    mime_type: '',
    tamaño_bytes: 0,
    entidad_tipo: '' as EntidadTipo | '',
    entidad_id: '',
    visibilidad: 'interno' as Visibilidad,
    descripcion: '',
    tipo: '',
  })
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setArchivo({ ...archivo, nombre_original: f.name, mime_type: f.type, tamaño_bytes: f.size })
    }
  }

  const handleUpload = () => {
    if (!file || !archivo.entidad_tipo || !archivo.entidad_id) return
    const nombreFinal = archivo.descripcion.trim() || file.name
    onUpload({
      ...archivo,
      nombre_original: nombreFinal,
      entidad_tipo: archivo.entidad_tipo as EntidadTipo,
      subido_por: '1',
      subido_por_nombre: 'Carlos Admin',
    })
    handleClose()
  }

  const handleClose = () => {
    onOpenChange(false)
    setFile(null)
    setArchivo({
      nombre_original: '',
      mime_type: '',
      tamaño_bytes: 0,
      entidad_tipo: '',
      entidad_id: '',
      visibilidad: 'interno',
      descripcion: '',
      tipo: '',
    })
  }

  const canUpload = file && archivo.entidad_tipo && archivo.entidad_id && file.size <= TAMAÑO_MAXIMO

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      size="md"
    >
      {/* ✅ ModalHeader */}
      <ModalHeader
        title={
          <span className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-cyan-400" />
            {UPLOAD_MODAL.titulo}
          </span>
        }
      />

      {/* ✅ ModalBody */}
      <ModalBody>
        <div className="space-y-4">
          {/* Tipo de entidad y tipo de archivo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{UPLOAD_MODAL.destino}</Label>
              <Select
                value={archivo.entidad_tipo}
                onValueChange={(v) => setArchivo({ ...archivo, entidad_tipo: v as EntidadTipo, entidad_id: '' })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa">Empresa</SelectItem>
                  <SelectItem value="proyecto">Proyecto</SelectItem>
                  <SelectItem value="ticket">Ticket</SelectItem>
                  <SelectItem value="tarea">Tarea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{UPLOAD_MODAL.tipo}</Label>
              <Select
                value={archivo.tipo}
                onValueChange={(v) => setArchivo({ ...archivo, tipo: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contrato">{FILE_TYPES.contrato.label}</SelectItem>
                  <SelectItem value="factura">{FILE_TYPES.factura.label}</SelectItem>
                  <SelectItem value="presupuesto">{FILE_TYPES.presupuesto.label}</SelectItem>
                  <SelectItem value="documentoTecnico">{FILE_TYPES.documentoTecnico.label}</SelectItem>
                  <SelectItem value="entregable">{FILE_TYPES.entregable.label}</SelectItem>
                  <SelectItem value="manual">{FILE_TYPES.manual.label}</SelectItem>
                  <SelectItem value="otro">{FILE_TYPES.otro.label}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selector de empresa */}
          {archivo.entidad_tipo === 'empresa' && (
            <div>
              <Label>{UPLOAD_MODAL.empresa}</Label>
              <Select
                value={archivo.entidad_id}
                onValueChange={(v) => setArchivo({ ...archivo, entidad_id: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={UPLOAD_MODAL.seleccionar} />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector de proyecto */}
          {archivo.entidad_tipo === 'proyecto' && (
            <div>
              <Label>{UPLOAD_MODAL.proyecto}</Label>
              <Select
                value={archivo.entidad_id}
                onValueChange={(v) => setArchivo({ ...archivo, entidad_id: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={UPLOAD_MODAL.seleccionar} />
                </SelectTrigger>
                <SelectContent>
                  {proyectos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Visibilidad */}
          {archivo.entidad_tipo === 'empresa' && (
            <div>
              <Label>{UPLOAD_MODAL.visibilidad}</Label>
              <Select
                value={archivo.visibilidad}
                onValueChange={(v) => setArchivo({ ...archivo, visibilidad: v as Visibilidad })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">{VISIBILITY_OPTIONS.interno.label}</SelectItem>
                  <SelectItem value="publico">{VISIBILITY_OPTIONS.publico.label}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descripción */}
          <div>
            <Label>{UPLOAD_MODAL.descripcion}</Label>
            <Input
              placeholder={UPLOAD_MODAL.placeholderNombre}
              value={archivo.descripcion}
              onChange={(e) => setArchivo({ ...archivo, descripcion: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {UPLOAD_MODAL.ayudaNombre}
            </p>
          </div>

          {/* Selector de archivo */}
          <div>
            <Label>{UPLOAD_MODAL.archivo}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/30 transition-colors">
              <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : FILE_PLACEHOLDER}
                </p>
                {file && <p className="text-xs text-muted-foreground mt-1">{formatBytes(file.size)}</p>}
              </label>
            </div>
            {file && file.size > TAMAÑO_MAXIMO && (
              <p className="text-sm text-destructive mt-1">{ERROR_MESSAGES.tamanoMaximo(25)}</p>
            )}
          </div>
        </div>
      </ModalBody>

      {/* ✅ ModalFooter */}
      <ModalFooter layout="inline-between">
        <Button variant="outline" onClick={handleClose}>
          {BUTTON_LABELS.cancelar}
        </Button>
        <Button onClick={handleUpload} disabled={!canUpload}>
          <Upload className="h-4 w-4 mr-2" />
          {BUTTON_LABELS.subir}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
