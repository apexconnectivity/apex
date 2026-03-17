"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Upload } from 'lucide-react'

interface DocumentoData {
  visibilidad: 'interno' | 'publico'
  descripcion: string
  nombreArchivo: string
}

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (documento: Partial<DocumentoData>, isNew: boolean) => void | Promise<void>
  entidadId: string
  entidadTipo: 'empresa' | 'proyecto' | 'tarea'
}

const DOCUMENTO_VACIO: DocumentoData = {
  visibilidad: 'interno',
  descripcion: '',
  nombreArchivo: '',
}

export function UploadDocumentModal({
  open,
  onOpenChange,
  onSave,
  entidadId,
  entidadTipo,
}: UploadDocumentModalProps) {
  const [formData, setFormData] = useState<DocumentoData>(DOCUMENTO_VACIO)

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setFormData(DOCUMENTO_VACIO)
    }
  }, [open])

  const handleSave = async () => {
    await onSave(formData, true)
    onOpenChange(false)
    setFormData(DOCUMENTO_VACIO)
  }

  const handleClose = () => {
    setFormData(DOCUMENTO_VACIO)
    onOpenChange(false)
  }

  const getEntidadLabel = () => {
    switch (entidadTipo) {
      case 'empresa':
        return 'empresa'
      case 'proyecto':
        return 'proyecto'
      case 'tarea':
        return 'tarea'
      default:
        return 'entidad'
    }
  }

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="md">
      <ModalHeader title={`Subir Documento - ${getEntidadLabel()}`} />

      <ModalBody className="space-y-4">
        <div className="space-y-2">
          <Label>Visibilidad</Label>
          <Select
            value={formData.visibilidad}
            onValueChange={(v: 'interno' | 'publico') => setFormData({ ...formData, visibilidad: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interno">Interno</SelectItem>
              <SelectItem value="publico">Público</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Descripción</Label>
          <Input
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción del documento"
          />
        </div>

        <div className="space-y-2">
          <Label>Nombre del Archivo</Label>
          <Input
            value={formData.nombreArchivo}
            onChange={(e) => setFormData({ ...formData, nombreArchivo: e.target.value })}
            placeholder="ej: contrato_2024.pdf"
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          <Upload className="h-4 w-4 mr-2" />
          Subir
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
