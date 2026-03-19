"use client"

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { SelectWithAdd } from './SelectWithAdd'
import {
  Empresa,
  TipoEntidad,
  Industria,
  Tamaño,
  Origen,
  TipoRelacion,
  MetodoPago,
  METODOS_PAGO,
} from '@/types/crm'
import { ModalVariant } from '@/constants/modales'

// Validaciones unificadas
import {
  validateRequired,
  validateEmail,
  validateRFC,
  validatePhoneMexican,
  validateURL,
  validateNumberRange,
  validateInteger,
} from '@/lib/validation-utils'

interface CreateEmpresaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (empresa: Partial<Empresa>, isNew: boolean) => void | Promise<void>
  empresa?: Partial<Empresa> | null
  isSaving?: boolean
  errors?: Record<string, string>
  userRoles?: string[]
}

const EMPRESA_VACIA: Partial<Empresa> = {
  tipo_entidad: 'cliente',
  nombre: '',
  industria: undefined,
  tamaño: undefined,
  origen: undefined,
  tipo_relacion: 'Cliente',
  telefono_principal: '',
  email_principal: '',
  sitio_web: '',
  direccion: '',
  ciudad: '',
  pais: '',
  razon_social: '',
  rfc: '',
  direccion_fiscal: '',
  regimen_fiscal: '',
  email_facturacion: '',
  metodo_pago: undefined,
  plazo_pago: undefined,
  moneda_preferida: undefined,
}

/**
 * CreateEmpresaModal - Componente para crear/editar empresas
 * 
 * Antes: usaba Dialog de @/components/ui/dialog
 * Ahora: usa BaseModal + ModalHeader/Body/Footer
 */
export function CreateEmpresaModal({
  open,
  onOpenChange,
  onSave,
  empresa,
  isSaving = false,
  errors = {},
  userRoles = [],
}: CreateEmpresaModalProps) {
  const [formData, setFormData] = useState<Partial<Empresa>>(EMPRESA_VACIA)
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const isEditing = !!empresa?.id

  useEffect(() => {
    if (open) {
      if (empresa) {
        setFormData({ ...EMPRESA_VACIA, ...empresa })
      } else {
        // Nueva empresa - sin ID, se genera al guardar
        setFormData({ ...EMPRESA_VACIA })
      }
      setLocalErrors({})
    }
  }, [open, empresa])

  const handleSave = async () => {
    setLocalErrors({})

    // Validar nombre (obligatorio, mínimo 3 caracteres)
    const nombreValidation = validateRequired(formData.nombre)
    if (!nombreValidation.isValid) {
      setLocalErrors({ nombre: nombreValidation.error || 'Error de validación' })
      return
    }
    if (formData.nombre && formData.nombre.trim().length < 3) {
      setLocalErrors({ nombre: 'El nombre debe tener al menos 3 caracteres' })
      return
    }

    // Validar tipo de entidad (obligatorio)
    if (!formData.tipo_entidad) {
      setLocalErrors({ tipo_entidad: 'Selecciona un tipo' })
      return
    }

    // Validar email principal
    const emailValidation = validateEmail(formData.email_principal)
    if (!emailValidation.isValid) {
      setLocalErrors({ email_principal: emailValidation.error || 'Email inválido' })
      return
    }

    // Validar RFC (formato mexicano)
    const rfcValidation = validateRFC(formData.rfc)
    if (!rfcValidation.isValid) {
      setLocalErrors({ rfc: rfcValidation.error || 'RFC inválido' })
      return
    }

    // Validar teléfono
    const phoneValidation = validatePhoneMexican(formData.telefono_principal)
    if (!phoneValidation.isValid) {
      setLocalErrors({ telefono_principal: phoneValidation.error || 'Teléfono inválido' })
      return
    }

    // Validar sitio web
    const urlValidation = validateURL(formData.sitio_web)
    if (!urlValidation.isValid) {
      setLocalErrors({ sitio_web: urlValidation.error || 'URL inválida' })
      return
    }

    // Validar email de facturación
    const emailFacturacionValidation = validateEmail(formData.email_facturacion)
    if (!emailFacturacionValidation.isValid) {
      setLocalErrors({ email_facturacion: emailFacturacionValidation.error || 'Email inválido' })
      return
    }

    // Validar plazo de pago (0-365 días)
    if (formData.plazo_pago !== undefined && formData.plazo_pago !== null) {
      const plazoValidation = validateNumberRange(0, 365)(formData.plazo_pago)
      if (!plazoValidation.isValid) {
        setLocalErrors({ plazo_pago: plazoValidation.error || 'Valor fuera de rango' })
        return
      }
      const integerValidation = validateInteger(formData.plazo_pago)
      if (!integerValidation.isValid) {
        setLocalErrors({ plazo_pago: integerValidation.error || 'Debe ser entero' })
        return
      }
    }

    try {
      // Esperar a que termine el guardado antes de cerrar
      await onSave(formData, !isEditing)
    } catch (error) {
      console.error('Error guardando empresa:', error)
      return // No cerrar el modal si hay error
    }

    // Cerrar el modal solo si el guardado fue exitoso
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const allErrors = { ...localErrors, ...errors }

  // Determinar tipos disponibles según rol
  const isComercial = userRoles.includes('comercial')
  const isCompras = userRoles.includes('compras')
  const isAdmin = userRoles.includes('admin')

  let tiposDisponibles: TipoEntidad[] = []
  if (isAdmin || (!isComercial && !isCompras)) {
    tiposDisponibles = ['cliente', 'proveedor', 'ambos']
  } else if (isComercial) {
    tiposDisponibles = ['cliente', 'ambos']
  } else if (isCompras) {
    tiposDisponibles = ['proveedor', 'ambos']
  }

  // Determinar variante del modal según el modo
  const variant: ModalVariant = isEditing ? 'edit' : 'create'

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      size="lg"
      description={isEditing ? 'Editar los datos de una empresa existente' : 'Crear una nueva empresa en el CRM'}
      variant={variant}
      showAccentBar
    >
      {/* ✅ ModalHeader */}
      <ModalHeader
        title={isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
        variant={variant}
        showIcon
      />

      {/* ✅ ModalBody */}
      <ModalBody>
        <div className="space-y-6">
          {/* Sector */}
          <div className="space-y-2">
            <Label>Sector *</Label>
            <div className="flex gap-4">
              {tiposDisponibles.map((tipo) => (
                <label
                  key={tipo}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 ${formData.tipo_entidad === tipo
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700'
                    }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={formData.tipo_entidad === tipo}
                    onChange={() => setFormData({ ...formData, tipo_entidad: tipo })}
                    className="sr-only"
                  />
                  <span className="text-sm">
                    {tipo === 'cliente' ? 'Cliente' : tipo === 'proveedor' ? 'Proveedor' : 'Ambos'}
                  </span>
                </label>
              ))}
            </div>
            {allErrors.tipo_entidad && (
              <p className="text-red-500 text-sm">{allErrors.tipo_entidad}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Mi Empresa SA"
              className={allErrors.nombre ? 'border-red-500' : ''}
            />
            {allErrors.nombre && <p className="text-red-500 text-sm">{allErrors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Industria</Label>
              <SelectWithAdd
                label="Industria"
                value={formData.industria || ''}
                onValueChange={(value) => setFormData({ ...formData, industria: value as Industria })}
                optionsType="industrias"
              />
            </div>
            <div className="space-y-2">
              <Label>Tamaño</Label>
              <SelectWithAdd
                label="Tamaño"
                value={formData.tamaño || ''}
                onValueChange={(value) => setFormData({ ...formData, tamaño: value as Tamaño })}
                optionsType="tamanios"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origen</Label>
              <SelectWithAdd
                label="Origen"
                value={formData.origen || ''}
                onValueChange={(value) => setFormData({ ...formData, origen: value as Origen })}
                optionsType="origenes"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Relación</Label>
              <SelectWithAdd
                label="Tipo de Relación"
                value={formData.tipo_relacion || ''}
                onValueChange={(value) => setFormData({ ...formData, tipo_relacion: value as TipoRelacion })}
                optionsType="tipos_relacion"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={formData.telefono_principal || ''}
                onChange={(e) => setFormData({ ...formData, telefono_principal: e.target.value })}
                placeholder="Ej: +54 9 11 1234-5678"
                className={allErrors.telefono_principal ? 'border-red-500' : ''}
              />
              {allErrors.telefono_principal && (
                <p className="text-red-500 text-sm">{allErrors.telefono_principal}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email_principal || ''}
                onChange={(e) => setFormData({ ...formData, email_principal: e.target.value })}
                placeholder="Ej: contacto@empresa.com"
                className={allErrors.email_principal ? 'border-red-500' : ''}
              />
              {allErrors.email_principal && (
                <p className="text-red-500 text-sm">{allErrors.email_principal}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input
                value={formData.ciudad || ''}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>País</Label>
              <Input
                value={formData.pais || ''}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sitio Web</Label>
            <Input
              value={formData.sitio_web || ''}
              onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
              placeholder="Ej: www.empresa.com"
              className={allErrors.sitio_web ? 'border-red-500' : ''}
            />
            {allErrors.sitio_web && <p className="text-red-500 text-sm">{allErrors.sitio_web}</p>}
          </div>

          {/* Datos de facturación */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Datos de Facturación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social</Label>
                <Input
                  value={formData.razon_social || ''}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  placeholder="Razón social oficial"
                />
              </div>
              <div className="space-y-2">
                <Label>RFC</Label>
                <Input
                  value={formData.rfc || ''}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                  placeholder="Ej: ABC123456789"
                  className={allErrors.rfc ? 'border-red-500' : ''}
                />
                {allErrors.rfc && <p className="text-red-500 text-sm">{allErrors.rfc}</p>}
              </div>
              <div className="space-y-2">
                <Label>Dirección Fiscal</Label>
                <Input
                  value={formData.direccion_fiscal || ''}
                  onChange={(e) => setFormData({ ...formData, direccion_fiscal: e.target.value })}
                  placeholder="Dirección para facturación"
                />
              </div>
              <div className="space-y-2">
                <Label>Régimen Fiscal</Label>
                <SelectWithAdd
                  label="Régimen Fiscal"
                  value={formData.regimen_fiscal || ''}
                  onValueChange={(value) => setFormData({ ...formData, regimen_fiscal: value })}
                  optionsType="regimenes_fiscales"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Facturación</Label>
                <Input
                  type="email"
                  value={formData.email_facturacion || ''}
                  onChange={(e) => setFormData({ ...formData, email_facturacion: e.target.value })}
                  placeholder="facturacion@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <select
                  value={formData.metodo_pago || ''}
                  onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value as MetodoPago })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Seleccionar método</option>
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Plazo de Pago (días)</Label>
                <Input
                  type="number"
                  value={formData.plazo_pago || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, plazo_pago: parseInt(e.target.value) })
                  }
                  placeholder="Ej: 30"
                  min={0}
                  max={365}
                  className={allErrors.plazo_pago ? 'border-red-500' : ''}
                />
                {allErrors.plazo_pago && (
                  <p className="text-red-500 text-sm">{allErrors.plazo_pago}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      {/* ✅ ModalFooter */}
      <ModalFooter variant={variant} layout="inline-between">
        <Button variant="outline" className="flex-1" onClick={handleClose}>
          Cancelar
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Guardar
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
