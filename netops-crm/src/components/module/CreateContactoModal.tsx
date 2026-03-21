"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Contacto, TipoContacto, TIPOS_CONTACTO } from '@/types/crm'
import { Loader2 } from 'lucide-react'
import { VARIANT_COLORS } from '@/lib/colors'
import { ModalVariant } from '@/constants/modales'

interface CreateContactoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contacto: Partial<Contacto>, isNew: boolean) => void | Promise<void>
  contacto?: Partial<Contacto> | null
  empresaId: string
  isSaving?: boolean
  errors?: Record<string, string>
}

const CONTACTO_VACIO: Partial<Contacto> = {
  nombre: '',
  cargo: '',
  tipo_contacto: 'Técnico',
  email: '',
  telefono: '',
  es_principal: false,
  recibe_facturas: false,
  activo: true,
}

export function CreateContactoModal({
  open,
  onOpenChange,
  onSave,
  contacto,
  empresaId,
  isSaving = false,
  errors = {},
}: CreateContactoModalProps) {
  const isEditing = !!contacto?.id

  const [formData, setFormData] = useState<Partial<Contacto>>(
    contacto || CONTACTO_VACIO
  )

  // Reset form when opening
  useEffect(() => {
    if (open) {
      if (contacto) {
        setFormData(contacto)
      } else {
        setFormData({ ...CONTACTO_VACIO, empresa_id: empresaId })
      }
    }
  }, [open, contacto, empresaId])

  const handleSave = async () => {
    if (!formData.nombre?.trim() || !formData.email?.trim()) return

    await onSave(formData, !isEditing)
    onOpenChange(false)

    // Reset form if creating new
    if (!isEditing) {
      setFormData(CONTACTO_VACIO)
    }
  }

  const handleClose = () => {
    setFormData(CONTACTO_VACIO)
    onOpenChange(false)
  }

  // Determinar variante del modal según el modo
  const variant: ModalVariant = isEditing ? 'edit' : 'create'

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="lg" variant={variant} showAccentBar>
      <ModalHeader
        title={isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
        variant={variant}
        showIcon
      />

      <ModalBody className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre *</Label>
          <Input
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={errors.nombre ? VARIANT_COLORS.danger.borderColor : ''}
          />
          {errors.nombre && <p className={`${VARIANT_COLORS.danger.valueColor} text-xs`}>{errors.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label>Cargo</Label>
          <Input
            value={formData.cargo || ''}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Contacto *</Label>
          <Select
            value={formData.tipo_contacto || ''}
            onValueChange={(v) => setFormData({ ...formData, tipo_contacto: v as TipoContacto })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_CONTACTO.map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? VARIANT_COLORS.danger.borderColor : ''}
          />
          {errors.email && <p className={`${VARIANT_COLORS.danger.valueColor} text-xs`}>{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label>Teléfono</Label>
          <Input
            value={formData.telefono || ''}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className={errors.telefono ? VARIANT_COLORS.danger.borderColor : ''}
          />
          {errors.telefono && <p className={`${VARIANT_COLORS.danger.valueColor} text-xs`}>{errors.telefono}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="es_principal"
            checked={formData.es_principal || false}
            onCheckedChange={(checked) => setFormData({ ...formData, es_principal: checked === true })}
          />
          <Label htmlFor="es_principal" className="text-sm font-normal cursor-pointer">
            Contacto principal
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="recibe_facturas"
            checked={formData.recibe_facturas || false}
            onCheckedChange={(checked) => setFormData({ ...formData, recibe_facturas: checked === true })}
          />
          <Label htmlFor="recibe_facturas" className="text-sm font-normal cursor-pointer">
            Recibe facturas
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="activo"
            checked={formData.activo !== false}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked === true })}
          />
          <Label htmlFor="activo" className="text-sm font-normal cursor-pointer">
            Contacto activo
          </Label>
        </div>
      </ModalBody>

      <ModalFooter variant={variant} layout="inline-between">
        <Button variant="outline" className="flex-1" onClick={handleClose}>
          Cancelar
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={isSaving || !formData.nombre?.trim() || !formData.email?.trim()}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
