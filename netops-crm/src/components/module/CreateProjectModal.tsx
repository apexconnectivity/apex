"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { InputNumber } from '@/components/ui/input-number'
import { DatePicker } from '@/components/ui/date-picker'
import { InlineAddButton } from '@/components/ui/inline-add-button'
import { Building2, User as UserIcon, Loader2 } from 'lucide-react'
import { Proyecto, MONEDAS } from '@/types/proyectos'
import { User } from '@/types/auth'
import { Empresa } from '@/types/crm'
import { ModalVariant } from '@/constants/modales'
import { CreateEmpresaModal } from './CreateEmpresaModal'
import { CreateUserModal } from './CreateUserModal'
import { ManageContactsModal } from './ManageContactsModal'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Contacto } from '@/types/crm'

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (proyecto: Partial<Proyecto>, isNew: boolean) => void | Promise<void>
  proyecto?: Partial<Proyecto> | null
  empresas?: Empresa[]
  usuarios?: User[]
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
    u.activo && (u.roles.includes('admin') || u.roles.includes('tecnico'))
  )

  // Filtrar contactos de la empresa seleccionada - usar localContactos para mantener sincronización
  const contactosTecnicos = localContactos.filter(c => c.empresa_id === formData.empresa_id && c.tipo_contacto === 'Técnico')

  const handleSave = async () => {
    if (!formData.nombre?.trim()) return

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

  return (
    <>
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
            <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Implementación de Red"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          {/* Cliente */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="empresa">Cliente *</Label>
              <InlineAddButton
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
              <SelectTrigger className={errors.empresa_id ? 'border-red-500' : ''}>
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
            {errors.empresa_id && <p className="text-xs text-red-500 mt-1">{errors.empresa_id}</p>}
          </div>

          {/* Responsable */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="responsable">Responsable *</Label>
              <InlineAddButton
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
              <SelectTrigger className={errors.responsable_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un responsable" />
              </SelectTrigger>
              <SelectContent>
                {responsablesPosibles.length > 0 ? (
                  responsablesPosibles.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      <div className="flex items-center gap-2">
                        <span>{usuario.nombre}</span>
                        <Badge variant="secondary" className="text-xs">
                          {usuario.roles.includes('admin') ? 'Admin' : 'Técnico'}
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
            {errors.responsable_id && <p className="text-xs text-red-500 mt-1">{errors.responsable_id}</p>}
          </div>

          {/* Contacto Técnico */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="contacto_tecnico">Contacto Técnico del Cliente *</Label>
              <InlineAddButton
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
              <SelectTrigger className={errors.contacto_tecnico_id ? 'border-red-500' : ''}>
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
            {errors.contacto_tecnico_id && <p className="text-xs text-red-500 mt-1">{errors.contacto_tecnico_id}</p>}
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
          <Button className="flex-1" onClick={handleSave} disabled={isSaving || !formData.nombre?.trim()}>
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

      <CreateUserModal
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
