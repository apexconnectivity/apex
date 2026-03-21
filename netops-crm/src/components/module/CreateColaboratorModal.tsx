"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { InputTextCase } from '@/components/ui/input-text-case'
import { InputPhone } from '@/components/ui/input-phone'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { User, Role } from '@/types/auth'
import { cn } from '@/lib/utils'
import { ModalVariant } from '@/constants/modales'

interface CreateColaboratorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (user: Partial<User>, isNew: boolean) => void | Promise<void>
  user?: Partial<User> | null
  isSaving?: boolean
  errors?: Record<string, string>
}

const INTERNAL_ROLES: Role[] = ['admin', 'comercial', 'tecnico', 'compras', 'facturacion', 'marketing']

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  comercial: 'Comercial',
  tecnico: 'Técnico',
  compras: 'Compras',
  facturacion: 'Facturación',
  marketing: 'Marketing',
  cliente: 'Cliente',
}

/**
 * CreateColaboratorModal - Modal para crear/editar colaboradores (usuarios internos)
 */
export function CreateColaboratorModal({
  open,
  onOpenChange,
  onSave,
  user,
  isSaving = false,
  errors = {},
}: CreateColaboratorModalProps) {
  const isEditing = !!user?.id

  // Form data is now managed inside CreateColaboratorModal
  const [formData, setFormData] = useState<Partial<User>>({
    nombre: '',
    email: '',
    telefono: '',
    roles: [],
    activo: true,
  })

  // Sincronizar estado interno cuando cambia el usuario prop o se abre el modal
  useEffect(() => {
    if (open) {
      setFormData({
        id: user?.id,
        nombre: user?.nombre || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        roles: user?.roles || [],
        activo: user?.activo ?? true,
      })
    }
  }, [user, open])

  const handleRoleToggle = (role: Role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles?.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...(prev.roles || []), role]
    }))
  }

  const handleSave = async () => {
    if (!formData.nombre || !formData.email || !formData.roles?.length) {
      return
    }
    await onSave(formData, !isEditing)
    // El cierre lo maneja UsersPage via open/onOpenChange
  }

  // Determinar variante del modal según el modo
  const variant: ModalVariant = isEditing ? 'edit' : 'create'

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="md" variant={variant} showAccentBar>
      <ModalHeader title={isEditing ? 'Editar Colaborador' : 'Nuevo Colaborador'} variant={variant} showIcon />

      <ModalBody className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="colaborator_nombre">Nombre completo *</Label>
          <InputTextCase
            id="colaborator_nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Juan Pérez"
            className={errors.nombre ? 'border-red-500' : ''}
          />
          {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="colaborator_email">Email *</Label>
          <Input
            id="colaborator_email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="juan@empresa.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="colaborator_telefono">Teléfono</Label>
          <InputPhone
            id="colaborator_telefono"
            value={formData.telefono || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, telefono: value }))}
            placeholder="55 1234 5678"
            error={errors.telefono}
          />
        </div>

        <div className="space-y-2">
          <Label>Roles *</Label>
          <div className="grid grid-cols-2 gap-2">
            {INTERNAL_ROLES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleToggle(role)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border transition-all',
                  formData.roles?.includes(role)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-sm">
                  {ROLE_LABELS[role]}
                </span>
                {formData.roles?.includes(role) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          {errors.roles && <p className="text-xs text-red-500 mt-1">{errors.roles}</p>}
        </div>
      </ModalBody>

      <ModalFooter variant={variant} layout="inline-between">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={isSaving || !formData.nombre || !formData.email || !formData.roles?.length}
        >
          {isSaving ? (
            <>
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
