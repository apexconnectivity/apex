import { FileText, Image, FileSpreadsheet, Folder } from 'lucide-react'
import type { ReactNode } from 'react'

export type EntidadTipo = 'proyecto' | 'ticket' | 'tarea' | 'empresa'

export type Visibilidad = 'interno' | 'publico'

export type TipoMime = 
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'image/jpeg'
  | 'image/png'
  | 'text/plain'
  | 'application/octet-stream'

export interface Archivo {
  id: string
  drive_file_id: string
  nombre_original: string
  nombre_guardado: string
  mime_type: string
  tamaño_bytes: number
  drive_view_link: string
  drive_download_link: string
  drive_embed_link?: string
  ruta_completa: string
  entidad_tipo: EntidadTipo
  entidad_id: string
  visibilidad: Visibilidad
  subido_por: string
  subido_por_nombre: string
  fecha_subida: string
  ultima_descarga?: string
}

export interface CarpetaDrive {
  id: string
  drive_folder_id: string
  nombre: string
  empresa_id?: string
  proyecto_id?: string
  ticket_id?: string
  padre_id?: string
  ruta_completa: string
  archivos: Archivo[]
  subcarpetas: CarpetaDrive[]
}

export const TIPOS_ARCHIVO_PERMITIDOS = [
  { ext: '.pdf', mime: 'application/pdf', label: 'PDF' },
  { ext: '.doc', mime: 'application/msword', label: 'Word' },
  { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word' },
  { ext: '.xls', mime: 'application/vnd.ms-excel', label: 'Excel' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel' },
  { ext: '.jpg', mime: 'image/jpeg', label: 'Imagen' },
  { ext: '.jpeg', mime: 'image/jpeg', label: 'Imagen' },
  { ext: '.png', mime: 'image/png', label: 'Imagen' },
  { ext: '.txt', mime: 'text/plain', label: 'Texto' },
  { ext: '.conf', mime: 'application/octet-stream', label: 'Configuración' },
  { ext: '.log', mime: 'application/octet-stream', label: 'Log' },
]

export const TAMAÑO_MAXIMO = 25 * 1024 * 1024

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// eslint-disable-next-line jsx-a11y/alt-text
export const getFileIcon = (mimeType: string): ReactNode => {
  if (mimeType.includes('pdf')) return <FileText className="h-5 w-5" aria-hidden="true" />
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="h-5 w-5" aria-hidden="true" />
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
  if (mimeType.includes('image')) return <Image className="h-5 w-5" aria-hidden="true" />
  if (mimeType.includes('text')) return <FileText className="h-5 w-5" aria-hidden="true" />
  return <Folder className="h-5 w-5" aria-hidden="true" />
}
