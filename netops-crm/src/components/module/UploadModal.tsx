import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '@/components/ui/dialog'
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
  BADGE_LABELS,
  BUTTON_LABELS,
} from '@/lib/constants/archivos'

interface EntidadOption {
  id: string
  nombre: string
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (archivo: Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'ruta_completa' | 'fecha_subida'>) => void
  empresas?: EntidadOption[]
  proyectos?: EntidadOption[]
}

export default function UploadModal({
  isOpen,
  onClose,
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
      // Extraer extensión del archivo original
      setArchivo({ ...archivo, nombre_original: f.name, mime_type: f.type, tamaño_bytes: f.size })
    }
  }

  const handleUpload = () => {
    if (!file || !archivo.entidad_tipo || !archivo.entidad_id) return
    // Usar el nombre personalizado o el original
    const nombreFinal = archivo.descripcion.trim() || file.name
    onUpload({
      ...archivo,
      nombre_original: nombreFinal,
      entidad_tipo: archivo.entidad_tipo as EntidadTipo,
      subido_por: '1',
      subido_por_nombre: 'Carlos Admin',
    })
    onClose()
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

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {UPLOAD_MODAL.titulo}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
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
                    <SelectItem value="contrato">{FILE_TYPES.contrato}</SelectItem>
                    <SelectItem value="factura">{FILE_TYPES.factura}</SelectItem>
                    <SelectItem value="presupuesto">{FILE_TYPES.presupuesto}</SelectItem>
                    <SelectItem value="documentoTecnico">{FILE_TYPES.documentoTecnico}</SelectItem>
                    <SelectItem value="entregable">{FILE_TYPES.entregable}</SelectItem>
                    <SelectItem value="manual">{FILE_TYPES.manual}</SelectItem>
                    <SelectItem value="otro">{FILE_TYPES.otro}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {archivo.entidad_tipo === 'empresa' && (
              <div>
                <Label>{UPLOAD_MODAL.empresa}</Label>
                <Select
                  value={archivo.entidad_id}
                  onValueChange={(v) => setArchivo({ ...archivo, entidad_id: v })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Seleccionar..." />
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

            {archivo.entidad_tipo === 'proyecto' && (
              <div>
                <Label>{UPLOAD_MODAL.proyecto}</Label>
                <Select
                  value={archivo.entidad_id}
                  onValueChange={(v) => setArchivo({ ...archivo, entidad_id: v })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Seleccionar..." />
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
                    <SelectItem value="interno">{VISIBILITY_OPTIONS.interno}</SelectItem>
                    <SelectItem value="publico">{VISIBILITY_OPTIONS.publico}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>{UPLOAD_MODAL.descripcion}</Label>
              <Input
                placeholder="Nombre o descripción del archivo..."
                value={archivo.descripcion}
                onChange={(e) => setArchivo({ ...archivo, descripcion: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Este nombre se usará para guardar el archivo en Drive
              </p>
            </div>

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
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {BUTTON_LABELS.cancelar}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !archivo.entidad_tipo || !archivo.entidad_id || file.size > TAMAÑO_MAXIMO}
          >
            <Upload className="h-4 w-4 mr-2" />
            {BUTTON_LABELS.subir}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
