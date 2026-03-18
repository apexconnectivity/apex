"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { User, Role } from '@/types/auth'
import { cn } from '@/lib/utils'
import { ModalVariant } from '@/constants/modales'

interface UserModalProps {
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
 * UserModal - Modal para crear/editar usuarios
 */
export function UserModal({
  open,
  onOpenChange,
  onSave,
  user,
  isSaving = false,
  errors = {},
}: UserModalProps) {
  const isEditing = !!user?.id

  const [formData, setFormData] = useState<Partial<User>>({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    roles: user?.roles || [],
    activo: user?.activo ?? true,
  })

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
    onOpenChange(false)
  }

  // Determinar variante del modal según el modo
  const variant: ModalVariant = isEditing ? 'edit' : 'create'

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="md" variant={variant} showAccentBar>
      <ModalHeader title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'} variant={variant} showIcon />

      <ModalBody className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user_nombre">Nombre completo *</Label>
          <Input
            id="user_nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Juan Pérez"
            className={errors.nombre ? 'border-red-500' : ''}
          />
          {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_email">Email *</Label>
          <Input
            id="user_email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="juan@empresa.com"
            disabled={isEditing}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_telefono">Teléfono</Label>
          <Input
            id="user_telefono"
            value={formData.telefono || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
            placeholder="+54 9 11 1234-5678"
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

      <ModalFooter variant={variant}>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !formData.nombre || !formData.email || !formData.roles?.length}
        >
          {isSaving ? (
            <>
              Guardando...
            </>
          ) : (
            isEditing ? 'Guardar cambios' : 'Crear usuario'
          )}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
