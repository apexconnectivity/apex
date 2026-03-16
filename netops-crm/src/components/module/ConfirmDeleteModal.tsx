import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProyectoArchivado } from '@/types/archivado'
import { ARCHIVADO_BOTONES, ELIMINAR_MODAL } from '@/constants/archivado'
import { AlertCircle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  proyecto: ProyectoArchivado
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({ proyecto, onClose, onConfirm }: ConfirmDeleteModalProps) {
  const [confirmText, setConfirmText] = useState('')

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {ELIMINAR_MODAL.titulo}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="font-medium">{proyecto.nombre}</p>
            <p className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>
          <p className="text-sm">{ELIMINAR_MODAL.advertenciaPermanente}</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{ELIMINAR_MODAL.carpetaDrive}</li>
            <li>{ELIMINAR_MODAL.registroBd}</li>
          </ul>
          <p className="text-sm text-destructive font-medium">{ELIMINAR_MODAL.accionNoReversible}</p>
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {ARCHIVADO_BOTONES.cancelar}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={confirmText !== 'ELIMINAR'}
          >
            {ARCHIVADO_BOTONES.eliminarDefinitivamente}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}