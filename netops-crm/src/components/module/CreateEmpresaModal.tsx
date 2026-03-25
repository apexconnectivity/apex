"use client"

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputTextCase } from '@/components/ui/input-text-case'
import { InputPhone } from '@/components/ui/input-phone'
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
  TipoContrato,
  MetodoPago,
} from '@/types/crm'
import { ModalVariant } from '@/constants/modales'

// Validaciones unificadas
import {
  validateRequired,
  validateEmail,
  validateRFC,
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
  tipo_contrato: 'Ninguno',
  telefono_principal: '',
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
  const isSubmittingRef = React.useRef(false)

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

  // Función para verificar si el formulario tiene los campos obligatorios llenos
  // Usa las funciones de validación importadas
  const canSave = (): boolean => {
    const nombreValid = validateRequired(formData.nombre)
    const razonSocialValid = validateRequired(formData.razon_social)
    const telefonoDigits = formData.telefono_principal?.replace(/\s/g, '') || ''
    const nombreTrim = formData.nombre?.trim() ?? ''
    
    return Boolean(
      nombreValid.isValid &&
      nombreTrim.length >= 3 &&
      razonSocialValid.isValid &&
      formData.tipo_entidad &&
      formData.tipo_relacion &&
      telefonoDigits.length >= 10
    )
  }

  const handleSave = async () => {
    // Bloqueo sincrónico: si ya hay un submit en curso, ignorar
    if (isSubmittingRef.current || isSaving) return
    isSubmittingRef.current = true

    // Recopilar TODOS los errores de validación en un solo objeto
    const validationErrors: Record<string, string> = {}

    // Nombre (obligatorio, mínimo 3 caracteres)
    const nombreValidation = validateRequired(formData.nombre)
    if (!nombreValidation.isValid) {
      validationErrors.nombre = nombreValidation.error || 'Campo obligatorio'
    } else if (formData.nombre && formData.nombre.trim().length < 3) {
      validationErrors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }

    // Razón Social (obligatorio)
    const razonValidation = validateRequired(formData.razon_social)
    if (!razonValidation.isValid) {
      validationErrors.razon_social = razonValidation.error || 'Campo obligatorio'
    }

    // Tipo de entidad (obligatorio)
    if (!formData.tipo_entidad) {
      validationErrors.tipo_entidad = 'Selecciona un sector (Cliente/Proveedor/Ambos)'
    }

    // Tipo de Relación (obligatorio)
    if (!formData.tipo_relacion) {
      validationErrors.tipo_relacion = 'Selecciona un tipo de relación'
    }

    // Teléfono (obligatorio) - el InputPhone ya filtra caracteres no válidos
    const phoneReqValidation = validateRequired(formData.telefono_principal)
    if (!phoneReqValidation.isValid) {
      validationErrors.telefono_principal = phoneReqValidation.error || 'Campo obligatorio'
    } else {
      // Verificar que tenga al menos 10 dígitos (formato xx xxxx xxxx)
      const digits = formData.telefono_principal?.replace(/\s/g, '') || ''
      if (digits.length < 10) {
        validationErrors.telefono_principal = 'El teléfono debe tener 10 dígitos'
      }
    }

    // RFC (solo si se proporcionó)
    if (formData.rfc && formData.rfc.trim() !== '') {
      const rfcValidation = validateRFC(formData.rfc)
      if (!rfcValidation.isValid) {
        validationErrors.rfc = rfcValidation.error || 'RFC inválido'
      }
    }

    // Sitio web (solo si se proporcionó)
    if (formData.sitio_web && formData.sitio_web.trim() !== '') {
      const urlValidation = validateURL(formData.sitio_web)
      if (!urlValidation.isValid) {
        validationErrors.sitio_web = urlValidation.error || 'URL inválida'
      }
    }

    // Email de facturación (solo si se proporcionó)
    if (formData.email_facturacion && formData.email_facturacion.trim() !== '') {
      const emailFacturacionValidation = validateEmail(formData.email_facturacion)
      if (!emailFacturacionValidation.isValid) {
        validationErrors.email_facturacion = emailFacturacionValidation.error || 'Email inválido'
      }
    }

    // Plazo de pago (0-365 días, solo si se proporcionó)
    if (formData.plazo_pago !== undefined && formData.plazo_pago !== null) {
      const plazoValidation = validateNumberRange(0, 365)(formData.plazo_pago)
      if (!plazoValidation.isValid) {
        validationErrors.plazo_pago = plazoValidation.error || 'Valor fuera de rango'
      } else {
        const integerValidation = validateInteger(formData.plazo_pago)
        if (!integerValidation.isValid) {
          validationErrors.plazo_pago = integerValidation.error || 'Debe ser entero'
        }
      }
    }

    // Si hay errores de validación, mostrarlos y desbloquear
    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors)
      isSubmittingRef.current = false
      return
    }

    try {
      // Esperar a que termine el guardado antes de cerrar
      await onSave(formData, !isEditing)
    } catch (error) {
      console.error('Error guardando empresa:', error)
      isSubmittingRef.current = false
      return // No cerrar el modal si hay error
    }

    // Desbloquear y cerrar el modal solo si el guardado fue exitoso
    isSubmittingRef.current = false
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
            <InputTextCase
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
              <Label>Tipo de Relación *</Label>
              <SelectWithAdd
                label="Tipo de Relación"
                value={formData.tipo_relacion || ''}
                onValueChange={(value) => setFormData({ ...formData, tipo_relacion: value as TipoRelacion })}
                optionsType="tipos_relacion"
              />
              {allErrors.tipo_relacion && <p className="text-red-500 text-sm">{allErrors.tipo_relacion}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tipo de Contrato</Label>
              <SelectWithAdd
                label="Tipo de Contrato"
                value={formData.tipo_contrato || 'Ninguno'}
                onValueChange={(value) => setFormData({ ...formData, tipo_contrato: value as TipoContrato })}
                optionsType="tipos_contrato"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <InputPhone
                value={formData.telefono_principal || ''}
                onChange={(value) => setFormData({ ...formData, telefono_principal: value })}
                placeholder="55 1234 5678"
                error={allErrors.telefono_principal}
              />
            </div>
            <div className="space-y-2">
              <Label>Sitio Web</Label>
              <Input
                value={formData.sitio_web || ''}
                onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
                placeholder="www.empresa.com"
                className={allErrors.sitio_web ? 'border-red-500' : ''}
              />
              {allErrors.sitio_web && (
                <p className="text-red-500 text-sm">{allErrors.sitio_web}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dirección</Label>
            <InputTextCase
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <InputTextCase
                value={formData.ciudad || ''}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>País</Label>
              <InputTextCase
                value={formData.pais || ''}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              />
            </div>
          </div>



          {/* Datos de facturación */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Datos de Facturación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social *</Label>
                <InputTextCase
                  value={formData.razon_social || ''}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  placeholder="Razón social oficial"
                  className={allErrors.razon_social ? 'border-red-500' : ''}
                />
                {allErrors.razon_social && <p className="text-red-500 text-sm">{allErrors.razon_social}</p>}
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
                <InputTextCase
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
                  className={allErrors.email_facturacion ? 'border-red-500' : ''}
                />
                {allErrors.email_facturacion && (
                  <p className="text-red-500 text-sm">{allErrors.email_facturacion}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <SelectWithAdd
                  label="Método de Pago"
                  value={formData.metodo_pago || ''}
                  onValueChange={(value) => setFormData({ ...formData, metodo_pago: value as MetodoPago })}
                  optionsType="metodos_pago"
                />
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
        <Button className="flex-1" onClick={handleSave} disabled={isSaving || isSubmittingRef.current || !canSave()}>
          {(isSaving || isSubmittingRef.current) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Guardar
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
