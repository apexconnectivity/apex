"use client"

import React, { useState, useEffect, useRef } from 'react'
import { InputTextCase } from '@/components/ui/input-text-case'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { InputNumber } from '@/components/ui/input-number'
import { DatePicker } from '@/components/ui/date-picker'
import { ButtonInline } from '@/components/ui/button-inline'
import { Building2, User as UserIcon, Loader2 } from 'lucide-react'
import { EmptyStateModal } from '@/components/base/EmptyStateModal'
import { Proyecto, MONEDAS, TIPOS_CONTRATO_PROYECTO, type TipoContratoProyecto } from '@/types/proyectos'
import { User } from '@/types/auth'
import { Empresa } from '@/types/crm'
import { ModalVariant } from '@/constants/modales'
import { CreateEmpresaModal } from './CreateEmpresaModal'
import { ManageColaboratorModal } from './ManageColaboratorModal'
import { ManageContactsModal } from './ManageContactsModal'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Contacto } from '@/types/crm'
import { validateRequired, validateNumberRange } from '@/lib/validation-utils'

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (proyecto: Partial<Proyecto>, isNew: boolean) => void | Promise<void>
  proyecto?: Partial<Proyecto> | null
  empresas?: Empresa[]
  usuarios?: User[]
  proyectos?: Partial<Proyecto>[]
  isSaving?: boolean
  errors?: Record<string, string>
}

const PROYECTO_VACIO: Partial<Proyecto> = {
  nombre: '',
  empresa_id: '',
  cliente_nombre: '',
  responsable_id: '',
  responsable_nombre: '',
  contacto_tecnico_id: '',
  contacto_tecnico_nombre: '',
  fase_actual: 1,
  tipo_contrato: undefined,
  moneda: 'USD',
  monto_estimado: 0,
  probabilidad_cierre: 20,
  requiere_compras: false,
  estado: 'activo',
  tags: [],
}

/**
 * CreateProjectModal - Modal único para crear/editar proyectos
 * Incluye sub-modales para crear empresa y usuario inline
 */
export function CreateProjectModal({
  open,
  onOpenChange,
  onSave,
  proyecto,
  empresas,
  usuarios,
  proyectos,
  isSaving = false,
  errors = {},
}: CreateProjectModalProps) {
  const isEditing = !!proyecto?.id

  // Usar ref para trackear el estado abierto sin causar re-renders
  const isOpenRef = useRef(false)

  const [formData, setFormData] = useState<Partial<Proyecto>>(
    proyecto || PROYECTO_VACIO
  )

  // State for sub-modals
  const [showNewEmpresa, setShowNewEmpresa] = useState(false)
  const [showNewUsuario, setShowNewUsuario] = useState(false)
  const [showManageContacts, setShowManageContacts] = useState(false)

  // Use localStorage directly for contacts to keep them in sync with ManageContactsModal
  const [localContactos] = useLocalStorage<Contacto[]>(STORAGE_KEYS.contactos, [])

  // Estado local para empresas y usuarios - se inicializa y actualiza solo cuando cambia open
  const [localEmpresas, setLocalEmpresas] = useState<Empresa[]>(empresas || [])
  const [localUsuarios, setLocalUsuarios] = useState<User[]>(usuarios || [])
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens - usar ref para evitar bucles
  useEffect(() => {
    if (open && !isOpenRef.current) {
      isOpenRef.current = true
      setFormData(proyecto || PROYECTO_VACIO)
      setLocalEmpresas(empresas || [])
      setLocalUsuarios(usuarios || [])
    } else if (!open) {
      isOpenRef.current = false
    }
  }, [open, proyecto, empresas, usuarios])

  // Filtrar empresas clientes
  const empresasClientes = localEmpresas.filter(e => e.tipo_entidad === 'cliente' || e.tipo_entidad === 'ambos' || !e.tipo_entidad)

  // Filtrar usuarios internos (admin y técnico)
  const responsablesPosibles = localUsuarios.filter(u =>
    u.activo && (u.roles.includes('admin') || u.roles.includes('especialista'))
  )

  // Filtrar contactos de la empresa seleccionada - usar localContactos para mantener sincronización
  const contactosTecnicos = localContactos.filter(c => c.empresa_id === formData.empresa_id && c.tipo_contacto === 'Técnico')

  // Validar formulario
  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {}

    // Nombre (obligatorio)
    const nombreValidation = validateRequired(formData.nombre)
    if (!nombreValidation.isValid) {
      validationErrors.nombre = nombreValidation.error || 'El nombre es obligatorio'
    } else {
      // Verificar duplicado por nombre + empresa
      // Una empresa no puede tener dos proyectos con el mismo nombre
      if (proyectos && formData.nombre?.trim() && formData.empresa_id) {
        const normalizedName = formData.nombre.trim().toLowerCase()
        const isDuplicate = proyectos.some(p => {
          // Excluir el proyecto actual en modo edición
          if (isEditing && p.id === proyecto?.id) return false
          // Verificar misma empresa y mismo nombre
          return p.empresa_id === formData.empresa_id &&
            p.nombre?.trim().toLowerCase() === normalizedName
        })
        if (isDuplicate) {
          validationErrors.nombre = 'Esta empresa ya tiene un proyecto con este nombre'
        }
      }
    }

    // Empresa (obligatorio)
    const empresaValidation = validateRequired(formData.empresa_id)
    if (!empresaValidation.isValid) {
      validationErrors.empresa_id = empresaValidation.error || 'Selecciona una empresa'
    }

    // Responsable (obligatorio)
    const responsableValidation = validateRequired(formData.responsable_id)
    if (!responsableValidation.isValid) {
      validationErrors.responsable_id = responsableValidation.error || 'Selecciona un responsable'
    }

    // Contacto técnico (obligatorio)
    const contactoValidation = validateRequired(formData.contacto_tecnico_id)
    if (!contactoValidation.isValid) {
      validationErrors.contacto_tecnico_id = contactoValidation.error || 'Selecciona un contacto técnico'
    }

    // Monto estimado (opcional, pero si se ingresa debe ser válido)
    if (formData.monto_estimado !== undefined && formData.monto_estimado !== null) {
      const montoRangeValidation = validateNumberRange(0, 999999999)(formData.monto_estimado)
      if (!montoRangeValidation.isValid) {
        validationErrors.monto_estimado = montoRangeValidation.error || 'Monto inválido'
      }
    }

    // Probabilidad de cierre (0-100)
    if (formData.probabilidad_cierre !== undefined && formData.probabilidad_cierre !== null) {
      const probabilidadValidation = validateNumberRange(0, 100)(formData.probabilidad_cierre)
      if (!probabilidadValidation.isValid) {
        validationErrors.probabilidad_cierre = probabilidadValidation.error || 'La probabilidad debe estar entre 0 y 100'
      }
    }

    setLocalErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    await onSave(formData, !isEditing)
    onOpenChange(false)
    // Reset form
    if (!isEditing) {
      setFormData(PROYECTO_VACIO)
    }
  }

  // Handler for saving new empresa
  const handleSaveEmpresa = (empresaData: Partial<Empresa>, isNew: boolean) => {
    if (!isNew) return

    const newEmpresa: Empresa = {
      ...empresaData,
      id: crypto.randomUUID(),
      creado_en: new Date().toISOString(),
      tipo_entidad: 'cliente',
    } as Empresa

    const updatedEmpresas = [...localEmpresas, newEmpresa]
    setLocalEmpresas(updatedEmpresas)

    // Save to localStorage using standard keys
    const stored = localStorage.getItem(STORAGE_KEYS.empresas)
    const existingEmpresas: Empresa[] = stored ? JSON.parse(stored) : []
    localStorage.setItem(STORAGE_KEYS.empresas, JSON.stringify([...existingEmpresas, newEmpresa]))

    setShowNewEmpresa(false)

    // Select the new empresa automatically
    setFormData({
      ...formData,
      empresa_id: newEmpresa.id,
      cliente_nombre: newEmpresa.nombre,
      contacto_tecnico_id: '',
      contacto_tecnico_nombre: ''
    })
  }

  // Handler for saving new user
  const handleSaveUsuario = (userData: Partial<User>, isNew: boolean) => {
    if (!isNew) return

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      activo: true,
      creado_en: new Date().toISOString(),
      cambiar_password_proximo_login: false,
    } as User

    const updatedUsers = [...localUsuarios, newUser]
    setLocalUsuarios(updatedUsers)

    // Save to localStorage using standard keys
    const stored = localStorage.getItem(STORAGE_KEYS.usuarios)
    const existingUsers: User[] = stored ? JSON.parse(stored) : []
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify([...existingUsers, newUser]))

    setShowNewUsuario(false)

    // Select the new user automatically
    setFormData({
      ...formData,
      responsable_id: newUser.id,
      responsable_nombre: newUser.nombre
    })
  }

  // Determinar variante según modo
  const variant: ModalVariant = isEditing ? 'edit' : 'create'

  // Combinar errores locales con errores de props
  const allErrors = { ...localErrors, ...errors }

  // Verificar si el formulario puede guardarse
  const canSave = (): boolean => {
    const hasRequiredFields = !!(
      formData.nombre?.trim() &&
      formData.empresa_id?.trim() &&
      formData.responsable_id?.trim() &&
      formData.contacto_tecnico_id?.trim()
    )
    const hasNoErrors = Object.keys(localErrors).length === 0
    return hasRequiredFields && hasNoErrors
  }

  return (
    <>
      {/* Empty State: No hay empresas - verificar prop empresas directamente */}
      {!isEditing && empresas && empresas.length === 0 && (
        <EmptyStateModal
          open={open}
          onOpenChange={onOpenChange}
          title="No hay empresas"
          description="Debes crear al menos una empresa antes de crear un proyecto."
          icon="folder"
          variant="warning"
          actions={[
            {
              label: 'Crear Empresa',
              onClick: () => {
                onOpenChange(false)
                setShowNewEmpresa(true)
              },
              variant: 'default',
              icon: <Building2 className="w-4 h-4 mr-2" />,
            },
            {
              label: 'Cancelar',
              onClick: () => onOpenChange(false),
              variant: 'outline',
            },
          ]}
        />
      )}

      <BaseModal
        open={open}
        onOpenChange={onOpenChange}
        size="lg"
        variant={variant}
        showAccentBar
        isLoading={isSaving}
        loadingMessage="Guardando proyecto..."
      >
        <ModalHeader
          title={isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          variant={variant}
          showIcon
        />

        <ModalBody className="space-y-4">
          {/* Nombre del Proyecto */}
          <div>
            <Label htmlFor="nombre">Nombre del Proyecto *</Label>
            <InputTextCase
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Implementación de Red"
              className={allErrors.nombre ? 'border-red-500' : ''}
            />
            {allErrors.nombre && <p className="text-xs text-red-500 mt-1">{allErrors.nombre}</p>}
          </div>

          {/* Cliente */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="empresa">Cliente *</Label>
              <ButtonInline
                onClick={() => setShowNewEmpresa(true)}
                icon={Building2}
                label="Nueva empresa"
              />
            </div>
            <Select
              value={formData.empresa_id || ''}
              onValueChange={(value) => {
                const empresa = localEmpresas.find(e => e.id === value)
                setFormData({
                  ...formData,
                  empresa_id: value,
                  cliente_nombre: empresa?.nombre || '',
                  contacto_tecnico_id: '',
                  contacto_tecnico_nombre: ''
                })
              }}
            >
              <SelectTrigger className={allErrors.empresa_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresasClientes.length > 0 ? (
                  empresasClientes.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>{empresa.nombre}</SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No hay empresas. Crea una nueva.
                  </div>
                )}
              </SelectContent>
            </Select>
            {allErrors.empresa_id && <p className="text-xs text-red-500 mt-1">{allErrors.empresa_id}</p>}
          </div>

          {/* Tipo de Contrato */}
          <div>
            <Label htmlFor="tipo_contrato">Tipo de Contrato</Label>
            <Select
              value={formData.tipo_contrato || ''}
              onValueChange={(value) => setFormData({ ...formData, tipo_contrato: value as TipoContratoProyecto })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CONTRATO_PROYECTO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              El tipo de contrato permite filtrar proyectos en el módulo de soporte
            </p>
          </div>

          {/* Responsable */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="responsable">Responsable *</Label>
              <ButtonInline
                onClick={() => setShowNewUsuario(true)}
                icon={UserIcon}
                label="Nuevo usuario"
              />
            </div>
            <Select
              value={formData.responsable_id || ''}
              onValueChange={(value) => {
                const responsable = localUsuarios.find(u => u.id === value)
                setFormData({
                  ...formData,
                  responsable_id: value,
                  responsable_nombre: responsable?.nombre || ''
                })
              }}
            >
              <SelectTrigger className={allErrors.responsable_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un responsable" />
              </SelectTrigger>
              <SelectContent>
                {responsablesPosibles.length > 0 ? (
                  responsablesPosibles.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      <div className="flex items-center gap-2">
                        <span>{usuario.nombre}</span>
                        <Badge variant="secondary" className="text-xs">
                          {usuario.roles.includes('admin') ? 'Admin' : 'Especialista'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No hay usuarios. Crea uno nuevo.
                  </div>
                )}
              </SelectContent>
            </Select>
            {allErrors.responsable_id && <p className="text-xs text-red-500 mt-1">{allErrors.responsable_id}</p>}
          </div>

          {/* Contacto Técnico */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="contacto_tecnico">Contacto Especialista del Cliente *</Label>
              <ButtonInline
                onClick={() => setShowManageContacts(true)}
                icon={UserIcon}
                label="Nuevo contacto"
                disabled={!formData.empresa_id}
              />
            </div>
            <Select
              value={formData.contacto_tecnico_id || ''}
              onValueChange={(value) => {
                const contacto = localContactos.find(c => c.id === value)
                setFormData({
                  ...formData,
                  contacto_tecnico_id: value,
                  contacto_tecnico_nombre: contacto?.nombre || ''
                })
              }}
              disabled={!formData.empresa_id}
            >
              <SelectTrigger className={allErrors.contacto_tecnico_id ? 'border-red-500' : ''}>
                <SelectValue placeholder={formData.empresa_id ? "Selecciona un contacto" : "Selecciona primero un cliente"} />
              </SelectTrigger>
              <SelectContent>
                {contactosTecnicos.length > 0 ? (
                  contactosTecnicos.map((contacto) => (
                    <SelectItem key={contacto.id} value={contacto.id}>
                      <div className="flex flex-col">
                        <span>{contacto.nombre}</span>
                        <span className="text-xs text-muted-foreground">{contacto.cargo}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    {formData.empresa_id ? "No hay contactos para esta empresa" : "Selecciona una empresa primero"}
                  </div>
                )}
              </SelectContent>
            </Select>
            {allErrors.contacto_tecnico_id && <p className="text-xs text-red-500 mt-1">{allErrors.contacto_tecnico_id}</p>}
          </div>

          {/* Monto Estimado */}
          <div className="grid grid-cols-2 gap-4">
            <InputNumber
              label="Monto Estimado"
              value={formData.monto_estimado || ''}
              onChange={(e) => setFormData({ ...formData, monto_estimado: Number(e.target.value) })}
              placeholder="0"
              showCurrency
              showStepper
              step={100}
              min={0}
              currency={formData.moneda || 'USD'}
              currencies={MONEDAS}
              onCurrencyChange={(value) => setFormData({ ...formData, moneda: value as 'USD' | 'MXN' | 'EUR' })}
              error={errors.monto_estimado}
            />
          </div>

          {/* Probabilidad y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <InputNumber
              label="Probabilidad de Cierre (%)"
              value={formData.probabilidad_cierre ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value)
                // Validar que el valor esté entre 0 y 100
                if (!isNaN(val) && val >= 0 && val <= 100) {
                  setFormData({ ...formData, probabilidad_cierre: val })
                } else if (e.target.value === '') {
                  setFormData({ ...formData, probabilidad_cierre: 0 })
                }
              }}
              placeholder="20"
              showStepper
              step={5}
              min={0}
              max={100}
              error={errors.probabilidad_cierre}
            />
            <div>
              <Label>Fecha Estimada de Fin</Label>
              <DatePicker
                value={formData.fecha_estimada_fin ? new Date(formData.fecha_estimada_fin) : undefined}
                onChange={(date) => setFormData({ ...formData, fecha_estimada_fin: date ? date.toISOString().split('T')[0] : '' })}
                placeholder="Seleccionar fecha"
              />
            </div>
          </div>

          {/* Requiere Compras */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="requiere_compras"
              checked={formData.requiere_compras || false}
              onCheckedChange={(checked) => setFormData({ ...formData, requiere_compras: checked === true })}
            />
            <Label htmlFor="requiere_compras" className="text-sm font-normal cursor-pointer">
              Requiere compras
            </Label>
          </div>
        </ModalBody>

        <ModalFooter variant={variant} layout="inline-between">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={isSaving || !canSave()}>
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

      {/* Sub-modales para crear empresa y usuario inline */}
      <CreateEmpresaModal
        open={showNewEmpresa}
        onOpenChange={setShowNewEmpresa}
        onSave={handleSaveEmpresa}
        empresa={null}
      />

      <ManageColaboratorModal
        open={showNewUsuario}
        onOpenChange={setShowNewUsuario}
        onSave={handleSaveUsuario}
        user={null}
      />

      <ManageContactsModal
        isOpen={showManageContacts}
        onClose={() => setShowManageContacts(false)}
        empresaId={formData.empresa_id || ''}
      />
    </>
  )
}
