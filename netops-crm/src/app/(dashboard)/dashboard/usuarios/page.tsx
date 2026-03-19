"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { Card, CardContent } from '@/components/ui/card'
import { ModuleContainer, ModuleHeader, CreateUserModal } from '@/components/module'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RoleBadge } from '@/components/ui/role-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  KeyRound,
  Shield,
  Mail,
  Phone,
  Check,
  Loader2,
  X
} from 'lucide-react'
import { Role, ROLE_DEFINITIONS, type User } from '@/types/auth'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { cn } from '@/lib/utils'
import { USUARIOS_PAGE, BUTTON_LABELS, FORM_LABELS, USER_STATUS } from '@/constants/auth'

// ============================================================================
// Tipos locales para el formulario
// ============================================================================
type UserFormData = Pick<User, 'nombre' | 'email' | 'telefono' | 'roles'>

// Roles internos disponibles
const INTERNAL_ROLES: Role[] = ['admin', 'comercial', 'tecnico', 'compras', 'facturacion', 'marketing']

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos')
  const [filtroRol, setFiltroRol] = useState<'todos' | Role>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [userToModify, setUserToModify] = useState<{ id: string; action: 'activar' | 'desactivar' } | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    roles: [] as Role[],
  })

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
      setEditingUser(user)
      setFormData({
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono || '',
        roles: [...user.roles],
      })
    } else {
      setEditingUser(null)
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        roles: [],
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleRoleToggle = (role: Role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(u =>
          u.id === editingUser.id
            ? { ...u, ...formData }
            : u
        ))
      } else {
        // Create new user
        const newUser: User = {
          id: String(Date.now()),
          ...formData,
          activo: true,
          creado_en: new Date().toISOString().split('T')[0],
          cambiar_password_proximo_login: false,
        }
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
                        <Trash2 className="h-4 w-4" />
                      ) : (
                        <KeyRound className="h-4 w-4" />
                      )}
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
    </ModuleContainer>
  )
}
