'use client'

import { useState } from 'react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProyectoArchivado } from '@/types/archivado'
import { ARCHIVADO_BOTONES, ELIMINAR_MODAL } from '@/constants/archivado'
import { AlertCircle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  proyecto: ProyectoArchivado | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

/**
 * ConfirmDeleteModal - Componente migrado a BaseModal
 * 
 * Antes: usaba Dialog de @/components/ui/dialog
 * Ahora: usa BaseModal + ModalHeader/Body/Footer
 */
export function ConfirmDeleteModal({ 
  proyecto, 
  open, 
  onOpenChange,
  onConfirm 
}: ConfirmDeleteModalProps) {
  // Si no hay proyecto, no renderizar
  if (!proyecto) return null
  
  const [confirmText, setConfirmText] = useState('')
  
  const isConfirmed = confirmText === 'ELIMINAR'
  
  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
      onOpenChange(false)
      setConfirmText('')
    }
  }
  
  const handleClose = () => {
    onOpenChange(false)
    setConfirmText('')
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      size="md"
      disableClose={false}
    >
      {/* ✅ ModalHeader con título y estilo danger */}
      <ModalHeader
        title={
          <span className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {ELIMINAR_MODAL.titulo}
          </span>
        }
        showBorder={false}
      />
      
      {/* ✅ ModalBody con el contenido */}
      <ModalBody>
        <div className="space-y-4">
          {/* Info del proyecto */}
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="font-medium">{proyecto.nombre}</p>
            <p className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>
          
          {/* Advertencias */}
          <p className="text-sm">{ELIMINAR_MODAL.advertenciaPermanente}</p>
          
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{ELIMINAR_MODAL.carpetaDrive}</li>
            <li>{ELIMINAR_MODAL.registroBd}</li>
          </ul>
          
          <p className="text-sm text-destructive font-medium">
            {ELIMINAR_MODAL.accionNoReversible}
          </p>
          
          {/* Campo de confirmación */}
          <div>
            <Label>{ELIMINAR_MODAL.confirmarEliminacion}</Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-background mt-1"
              placeholder={ELIMINAR_MODAL.placeholderConfirmar}
            />
          </div>
        </div>
      </ModalBody>
      
      {/* ✅ ModalFooter con acciones */}
      <ModalFooter layout="inline-between">
        <Button variant="outline" onClick={handleClose}>
          {ARCHIVADO_BOTONES.cancelar}
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={!isConfirmed}
        >
          {ARCHIVADO_BOTONES.eliminarDefinitivamente}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
