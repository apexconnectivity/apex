"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { Card, CardContent } from '@/components/ui/card'
import { ModuleContainer, ModuleHeader, CreateUserModal } from '@/components/module'
import { ManageContactsModal } from '@/components/module/ManageContactsModal'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/ui/filter-bar'
import { Badge } from '@/components/ui/badge'
import { RoleBadge } from '@/components/ui/role-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import {
  UserPlus,
  Pencil,
  Trash2,
  KeyRound,
  Shield,
  Mail,
  Phone,
  AlertTriangle,
  Building2,
} from 'lucide-react'
import { Role, ROLE_DEFINITIONS, type User } from '@/types/auth'
import { cn } from '@/lib/utils'
import { USUARIOS_PAGE, BUTTON_LABELS } from '@/constants/auth'

// Roles internos disponibles
const INTERNAL_ROLES: Role[] = ['admin', 'comercial', 'tecnico', 'compras', 'facturacion', 'marketing']

export default function UsersPage() {
  const { user: currentUser, updateUser } = useAuth()
  const [users, setUsers] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])
  const [empresas] = useLocalStorage<any[]>(STORAGE_KEYS.empresas, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos')
  const [filtroRol, setFiltroRol] = useState<'todos' | Role>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToModify, setUserToModify] = useState<{ id: string; action: 'activar' | 'desactivar' } | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  const [isManageContactsOpen, setIsManageContactsOpen] = useState(false)
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const filteredUsers = users.filter(user => {
    // Filtro búsqueda
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro estado
    const matchesEstado = filtroEstado === 'todos'
      ? true
      : filtroEstado === 'activo' ? user.activo : !user.activo

    // Filtro rol
    const matchesRol = filtroRol === 'todos'
      ? true
      : user.roles.includes(filtroRol)

    return matchesSearch && matchesEstado && matchesRol
  })

  const handleOpenModal = (user?: User) => {
    if (user) {
      if (user.roles.includes('cliente') && user.empresa_id) {
        setSelectedEmpresaId(user.empresa_id)
        setIsManageContactsOpen(true)
        return
      }
      setEditingUser(user)
    } else {
      setEditingUser(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSave = async (data: Partial<User>, isNew: boolean) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!isNew && editingUser) {
        // Update existing user
        const updatedData = { ...editingUser, ...data }
        setUsers(prev => prev.map(u =>
          u.id === editingUser.id
            ? updatedData
            : u
        ))

        // Si es el usuario actual, actualizar la sesión también
        if (editingUser.id === currentUser?.id) {
          updateUser(data)
        }
      } else {
        // Create new user
        const newUser: User = {
          id: crypto.randomUUID(),
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          roles: data.roles || [],
          activo: true,
          creado_en: new Date().toISOString().split('T')[0],
          cambiar_password_proximo_login: true,
        } as User
        setUsers(prev => [...prev, newUser])
      }

      handleCloseModal()
    } catch (error) {
      console.error('[Usuarios] Error al guardar usuario:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestToggleActive = (user: User) => {
    setUserToModify({
      id: user.id,
      action: user.activo ? 'desactivar' : 'activar'
    })
    setIsConfirmModalOpen(true)
  }

  const handleConfirmToggleActive = () => {
    if (!userToModify) return
    setUsers(prev => prev.map(u =>
      u.id === userToModify.id
        ? { ...u, activo: userToModify.action === 'activar' }
        : u
    ))
    setIsConfirmModalOpen(false)
    setUserToModify(null)
  }

  const handleRequestDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      alert("No puedes eliminar tu propia cuenta mientras estés en sesión.")
      return
    }
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!userToDelete) return
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  if (currentUser?.roles[0] !== 'admin') {
    return (
      <AccessDeniedCard
        icon={Shield}
        description={USUARIOS_PAGE.soloAdmin}
      />
    )
  }

  return (
    <ModuleContainer>
      <ModuleHeader
        title={USUARIOS_PAGE.titulo}
        description={USUARIOS_PAGE.descripcion}
        actions={
          <Button onClick={() => handleOpenModal()}>
            <UserPlus className="h-4 w-4 mr-2" />
            {USUARIOS_PAGE.nuevoUsuario}
          </Button>
        }
      />

      {/* Filtros */}
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={USUARIOS_PAGE.buscarPlaceholder}
        filters={[
          {
            key: 'estado',
            label: USUARIOS_PAGE.estado,
            options: [
              { value: 'todos', label: USUARIOS_PAGE.todos },
              { value: 'activo', label: USUARIOS_PAGE.activos },
              { value: 'inactivo', label: USUARIOS_PAGE.inactivos }
            ]
          },
          {
            key: 'rol',
            label: USUARIOS_PAGE.rol,
            options: [
              { value: 'todos', label: USUARIOS_PAGE.todos },
              ...INTERNAL_ROLES.map(role => ({ value: role, label: ROLE_DEFINITIONS[role]?.label }))
            ]
          }
        ]}
        values={{ estado: filtroEstado, rol: filtroRol }}
        onFilterChange={(key, value) => {
          if (key === 'estado') setFiltroEstado(value as typeof filtroEstado)
          if (key === 'rol') setFiltroRol(value as typeof filtroRol)
        }}
        hasActiveFilters={filtroEstado !== 'todos' || filtroRol !== 'todos'}
        onClearFilters={() => {
          setFiltroEstado('todos')
          setFiltroRol('todos')
        }}
      />

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className={cn('hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5', !user.activo ? 'opacity-60' : '')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.nombre}</h3>
                      {!user.activo && (
                        <Badge variant="secondary" className="text-xs">
                          {USUARIOS_PAGE.inactivo}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.telefono}
                      </span>
                      {user.empresa_id && (
                        <span className="flex items-center gap-1 text-primary">
                          <Building2 className="h-3 w-3" />
                          {empresas.find(e => e.id === user.empresa_id)?.nombre || 'Empresa no encontrada'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {user.roles.map(role => (
                      <RoleBadge key={role} role={role} className="text-xs" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRequestToggleActive(user)}
                      className={user.activo ? 'hover:text-red-400' : 'hover:text-green-400'}
                    >
                        {user.activo ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <Shield className="h-4 w-4 opacity-50" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRequestDelete(user)}
                        className="hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Modal - Usando componente reutilizable */}
      <CreateUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={editingUser}
        onSave={handleSave}
        isSaving={isLoading}
      />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && userToModify && (
        <BaseModal open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <ModalHeader title={
            <div className="flex items-center gap-2">
              {userToModify.action === 'desactivar' ? (
                <>
                  <Trash2 className="h-5 w-5 text-destructive" />
                  {USUARIOS_PAGE.desactivarUsuario}
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5 text-green-400" />
                  {USUARIOS_PAGE.reactivarUsuario}
                </>
              )}
            </div>
          } />
          <ModalBody>
            <p className="text-sm text-muted-foreground">
              {userToModify.action === 'desactivar'
                ? USUARIOS_PAGE.msgDesactivar
                : USUARIOS_PAGE.msgReactivar
              }
            </p>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">
                {users.find(u => u.id === userToModify.id)?.nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                {users.find(u => u.id === userToModify.id)?.email}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              {BUTTON_LABELS.cancelar}
            </Button>
            <Button
              variant={userToModify.action === 'desactivar' ? 'destructive' : 'default'}
              onClick={handleConfirmToggleActive}
            >
              {userToModify.action === 'desactivar' ? USUARIOS_PAGE.desactivarUsuario : USUARIOS_PAGE.reactivarUsuario}
            </Button>
          </ModalFooter>
        </BaseModal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <BaseModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} variant="danger">
          <ModalHeader title={
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span>Cuidado: Eliminación Permanente</span>
            </div>
          } variant="danger" />
          <ModalBody>
            <div className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
                <p className="text-sm font-medium items-center flex gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Esta acción no se puede deshacer
                </p>
                <p className="text-xs mt-1 opacity-80">
                  El usuario <strong>{userToDelete.nombre}</strong> perderá el acceso a la plataforma y toda su configuración personal será eliminada.
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-800 text-xs">
                      {getInitials(userToDelete.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{userToDelete.nombre}</p>
                    <p className="text-xs text-muted-foreground">{userToDelete.email}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                ¿Estás seguro de que deseas eliminar definitivamente a este usuario?
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar Definitivamente
            </Button>
          </ModalFooter>
        </BaseModal>
      )}

      {isManageContactsOpen && selectedEmpresaId && (
        <ManageContactsModal 
          isOpen={isManageContactsOpen}
          onClose={() => setIsManageContactsOpen(false)}
          empresaId={selectedEmpresaId}
        />
      )}
    </ModuleContainer>
  )
}
