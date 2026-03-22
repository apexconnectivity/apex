"use client"

import { useState, useEffect, useMemo } from 'react'
import { BaseModal, ModalHeader, ModalBody } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputTextCase } from '@/components/ui/input-text-case'
import { InputPhone } from '@/components/ui/input-phone'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User as UserType, Role } from '@/types/auth'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { useAuth } from '@/contexts/auth-context'
import {
  User,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  Mail,
  Phone,
  Plus,
  AlertCircle
} from 'lucide-react'

interface ManageColaboratorModalProps {
  /** Estado de apertura del modal - alias de `open` */
  isOpen?: boolean
  /** Callback al cerrar el modal - alias de `onOpenChange` */
  onClose?: () => void
  /** Estado de apertura del modal (formato BaseModal) */
  open?: boolean
  /** Callback de cambio de estado (formato BaseModal) */
  onOpenChange?: (open: boolean) => void
  /** Datos del usuario a editar (legacy - mantener compatibilidad) */
  user?: Partial<UserType> | null
  /** Callback al guardar */
  onSave: (user: Partial<UserType>, isNew: boolean) => void | Promise<void>
  isSaving?: boolean
  errors?: Record<string, string>
  /** Si es true, requiere username y password para nuevos usuarios (colaboradores) */
  requireCredentials?: boolean
}

const INTERNAL_ROLES: Role[] = ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing']

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  comercial: 'Comercial',
  especialista: 'Especialista',
  compras: 'Compras',
  facturacion: 'Facturación',
  marketing: 'Marketing',
  cliente: 'Cliente',
}

export function ManageColaboratorModal({
  isOpen,
  onClose,
  open,
  onOpenChange,
  user,
  onSave,
  isSaving = false,
  errors = {},
  requireCredentials = true,
}: ManageColaboratorModalProps) {
  // Obtener usuario actual y permisos
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.roles.includes('admin') ?? false

  // Normalize props for compatibility
  const modalOpen = isOpen ?? open ?? false
  const _handleClose = onClose ?? (onOpenChange ? (_open: boolean) => onOpenChange(!_open) : () => {})
  const handleOpenChange = onOpenChange ?? (onClose ? (_open: boolean) => onClose() : () => {})

  const [usuarios] = useLocalStorage<UserType[]>(STORAGE_KEYS.usuarios, [])

  const [editingUser, setEditingUser] = useState<Partial<UserType> | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<UserType>>({
    nombre: '',
    email: '',
    username: '',
    password_hash: '',
    telefono: '',
    roles: [],
    activo: true,
  })

  // Verificar si el usuario actual está editando su propio perfil (después de que editingUser está definido)
  const isEditingSelf = editingUser?.id === currentUser?.id
  const canEditPassword = isAdmin || isEditingSelf
  const canEditAllFields = isAdmin

  // Filtrar solo colaboradores internos (no clientes)
  const colaboradores = useMemo(
    () => usuarios.filter(u => u.roles?.some(r => INTERNAL_ROLES.includes(r))),
    [usuarios]
  )

  // Sync with user prop for legacy compatibility
  useEffect(() => {
    if (modalOpen && user) {
      setEditingUser(user)
    }
  }, [user, modalOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!modalOpen) {
      setEditingUser(null)
      setUsernameError(null)
      setFormData({
        nombre: '',
        email: '',
        username: '',
        password_hash: '',
        telefono: '',
        roles: [],
        activo: true,
      })
    }
  }, [modalOpen])

  // Sync form data when editing user changes
  useEffect(() => {
    if (editingUser) {
      setUsernameError(null) // Clear username error when switching users
      setFormData({
        id: editingUser.id,
        nombre: editingUser.nombre || '',
        email: editingUser.email || '',
        username: editingUser.username || '',
        password_hash: '', // Don't show existing password
        telefono: editingUser.telefono || '',
        roles: editingUser.roles || [],
        activo: editingUser.activo ?? true,
      })
    }
  }, [editingUser])

  const handleRoleToggle = (role: Role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles?.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...(prev.roles || []), role],
    }))
  }

  const handleSave = async () => {
    // Validaciones según permisos
    if (canEditAllFields) {
      // Admin: validar todos los campos requeridos
      if (!formData.nombre || !formData.email || !formData.roles?.length) {
        return
      }

      // Validar username único (solo para admin)
      const usernameToCheck = formData.username?.trim().toLowerCase()
      if (usernameToCheck) {
        const existingUser = usuarios.find(
          u => u.username?.toLowerCase() === usernameToCheck && u.id !== formData.id
        )
        if (existingUser) {
          setUsernameError('El nombre de usuario ya está en uso')
          return
        }
      }
    }

    // Validar contraseña si se está editando (admin o propio usuario)
    if (canEditPassword && formData.password_hash && formData.password_hash.length < 6) {
      return
    }

    // Hash password before saving
    const dataToSave = {
      ...formData,
      password_hash: formData.password_hash ? btoa(formData.password_hash) : undefined,
    }

    await onSave(dataToSave, !formData.id)
  }

  const handleDeleteUser = (id: string) => {
    // Could implement soft delete or confirmation
    // For now, just close editing if this user is being edited
    if (editingUser?.id === id) {
      setEditingUser(null)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (!modalOpen) return null

  return (
    <BaseModal open={modalOpen} onOpenChange={handleOpenChange} size="xl">
      <ModalHeader
        title={
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-500" />
            <span>Gestionar Colaboradores</span>
          </div>
        }
      />
      <ModalBody>
        <div className="grid md:grid-cols-5 gap-6 max-h-[70vh]">
          {/* Lista de Colaboradores */}
          <div className="md:col-span-3 space-y-4 overflow-y-auto pr-2">
            <div className="flex items-center justify-between sticky top-0 py-1 bg-background z-10">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Colaboradores Registrados
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 border-primary/20 hover:bg-primary/5 text-primary"
                onClick={() => {
                  setEditingUser({
                    nombre: '',
                    email: '',
                    username: '',
                    telefono: '',
                    roles: [],
                    activo: true,
                  })
                }}
              >
                <Plus className="h-4 w-4" />
                Nuevo
              </Button>
            </div>

            <div className="grid gap-3">
              {colaboradores.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-xl border-border/50">
                  No hay colaboradores registrados
                </div>
              ) : (
                colaboradores.map(colaborador => (
                  <Card
                    key={colaborador.id}
                    className={cn(
                      'group hover:border-primary/40 transition-all duration-200 border-border/50 bg-muted/20 cursor-pointer',
                      editingUser?.id === colaborador.id && 'border-primary/60 bg-primary/5'
                    )}
                    onClick={() => setEditingUser(colaborador)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                            <AvatarFallback className="bg-slate-800 text-xs text-slate-200">
                              {getInitials(colaborador.nombre)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm truncate text-foreground">
                                {colaborador.nombre}
                              </p>
                              {!colaborador.activo && (
                                <Badge
                                  variant="secondary"
                                  className="h-4 text-[9px] uppercase tracking-wider bg-red-500/10 text-red-400 border-red-500/20"
                                >
                                  Inactivo
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {colaborador.roles?.map(role => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className="h-4 text-[9px] px-1.5 bg-primary/5 text-primary border-primary/20"
                                >
                                  {ROLE_LABELS[role]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-cyan-500 hover:bg-cyan-500/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingUser(colaborador)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteUser(colaborador.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/5">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 opacity-60" /> {colaborador.email}
                        </span>
                        {colaborador.telefono && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 opacity-60" /> {colaborador.telefono}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Formulario de Edición */}
          <div className="md:col-span-2 flex flex-col">
            {editingUser ? (
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 flex flex-col h-full shadow-inner animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {editingUser?.id ? (
                      <Pencil className="h-4 w-4 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm">
                    {editingUser?.id ? 'Editar Colaborador' : 'Nuevo Colaborador'}
                  </h4>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="colaborator_nombre" className="text-xs text-muted-foreground">
                      Nombre completo {canEditAllFields ? '*' : '(solo lectura)'}
                    </Label>
                    <InputTextCase
                      id="colaborator_nombre"
                      value={formData.nombre || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Juan Pérez"
                      disabled={!canEditAllFields}
                      readOnly={!canEditAllFields}
                      className={cn(
                        'h-9',
                        canEditAllFields ? 'bg-background/50' : 'bg-muted/50 cursor-not-allowed opacity-70',
                        errors.nombre && 'border-red-500'
                      )}
                    />
                    {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colaborator_email" className="text-xs text-muted-foreground">
                      Email corporativo {canEditAllFields ? '*' : '(solo lectura)'}
                    </Label>
                    <Input
                      id="colaborator_email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="juan@empresa.com"
                      disabled={!canEditAllFields}
                      readOnly={!canEditAllFields}
                      className={cn(
                        'h-9',
                        canEditAllFields ? 'bg-background/50' : 'bg-muted/50 cursor-not-allowed opacity-70',
                        errors.email && 'border-red-500'
                      )}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Username - visible y editable solo para admin */}
                  {isAdmin && (
                    <div className="space-y-2">
                      <Label htmlFor="colaborator_username" className="text-xs text-muted-foreground">
                        Usuario *
                      </Label>
                      <Input
                        id="colaborator_username"
                        type="text"
                        value={formData.username || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))
                          setUsernameError(null)
                        }}
                        placeholder="usuario"
                        className={cn('bg-background/50 h-9', (errors.username || usernameError) && 'border-red-500')}
                        autoComplete="off"
                      />
                      {(errors.username || usernameError) ? (
                        <p className="text-xs text-red-500 mt-1">{errors.username || usernameError}</p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground/70">Para acceso al sistema</p>
                      )}
                    </div>
                  )}

                  {/* Password - editable por admin o el propio usuario */}
                  {canEditPassword && (
                    <div className="space-y-2">
                      <Label htmlFor="colaborator_password" className="text-xs text-muted-foreground">
                        {editingUser?.id ? 'Nueva Contraseña' : 'Contraseña *'}
                      </Label>
                      <Input
                        id="colaborator_password"
                        type="password"
                        value={formData.password_hash || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, password_hash: e.target.value }))}
                        placeholder={editingUser?.id ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
                        className={cn('bg-background/50 h-9', errors.password_hash && 'border-red-500')}
                      />
                      {errors.password_hash && (
                        <p className="text-xs text-red-500 mt-1">{errors.password_hash}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="colaborator_telefono" className="text-xs text-muted-foreground">
                      Teléfono {canEditAllFields ? '' : '(solo lectura)'}
                    </Label>
                    <InputPhone
                      id="colaborator_telefono"
                      value={formData.telefono || ''}
                      onChange={(value) => setFormData(prev => ({ ...prev, telefono: value }))}
                      placeholder="55 1234 5678"
                      disabled={!canEditAllFields}
                      className={cn(
                        'h-9',
                        canEditAllFields ? '' : 'opacity-70 cursor-not-allowed'
                      )}
                      error={errors.telefono}
                    />
                  </div>

                  {/* Roles - solo visible y editable para admin */}
                  {isAdmin && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Roles *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {INTERNAL_ROLES.map(role => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleToggle(role)}
                            className={cn(
                              'flex items-center justify-between p-2 rounded-lg border transition-all text-xs',
                              formData.roles?.includes(role)
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50 bg-background/50'
                            )}
                          >
                            <span>{ROLE_LABELS[role]}</span>
                            {formData.roles?.includes(role) && (
                              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                <Pencil className="h-2.5 w-2.5 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      {errors.roles && <p className="text-xs text-red-500 mt-1">{errors.roles}</p>}
                    </div>
                  )}
                </div>

                <div className="pt-6 flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1 h-10"
                    onClick={() => setEditingUser(null)}
                  >
                    Descartar
                  </Button>
                  <Button
                    className="flex-1 h-10 shadow-lg shadow-primary/20"
                    onClick={handleSave}
                    disabled={
                      isSaving ||
                      (canEditAllFields && Boolean(!formData.nombre?.trim())) ||
                      (canEditAllFields && Boolean(!formData.email?.trim())) ||
                      (canEditAllFields && !formData.roles?.length) ||
                      (canEditAllFields && requireCredentials && !formData.username?.trim()) ||
                      (Boolean(formData.password_hash) && (formData.password_hash?.length ?? 0) < 6) ||
                      Boolean(usernameError)
                    }
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-2xl border-2 border-dashed border-border/30">
                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                  <UserPlus className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h4 className="font-medium text-sm text-foreground mb-2">Gestión de Colaboradores</h4>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                  Selecciona un colaborador para modificar su información o añade un nuevo integrante a tu equipo.
                </p>
                <div className="mt-8 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-start gap-2 text-left">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-200/70 leading-normal">
                    Los colaboradores tienen acceso al sistema según los roles asignados.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalBody>
    </BaseModal>
  )
}
