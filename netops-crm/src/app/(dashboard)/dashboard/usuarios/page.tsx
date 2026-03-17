"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { Card, CardContent } from '@/components/ui/card'
import { ModuleContainer, UserModal } from '@/components/module'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import RoleBadge from '@/components/ui/role-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'
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

    setIsLoading(false)
    handleCloseModal()
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{USUARIOS_PAGE.titulo}</h1>
          <p className="text-muted-foreground mt-1">
            {USUARIOS_PAGE.descripcion}
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <UserPlus className="h-4 w-4 mr-2" />
          {USUARIOS_PAGE.nuevoUsuario}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder={USUARIOS_PAGE.buscarPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 bg-background/80 border-border/50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="text-muted-foreground mr-1">{USUARIOS_PAGE.filtros}</span>

        <div className="flex items-center gap-1">
          <Label className="text-xs text-muted-foreground mr-1">{USUARIOS_PAGE.estado}</Label>
          <Select value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as typeof filtroEstado)}>
            <SelectTrigger className="w-32 h-8 bg-input border-border">
              <SelectValue placeholder={USUARIOS_PAGE.todos} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{USUARIOS_PAGE.todos}</SelectItem>
              <SelectItem value="activo">{USUARIOS_PAGE.activos}</SelectItem>
              <SelectItem value="inactivo">{USUARIOS_PAGE.inactivos}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Label className="text-xs text-muted-foreground mr-1">{USUARIOS_PAGE.rol}</Label>
          <Select value={filtroRol} onValueChange={(v) => setFiltroRol(v as typeof filtroRol)}>
            <SelectTrigger className="w-40 h-8 bg-input border-border">
              <SelectValue placeholder={USUARIOS_PAGE.todos} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{USUARIOS_PAGE.todos}</SelectItem>
              {INTERNAL_ROLES.map(role => (
                <SelectItem key={role} value={role}>
                  {ROLE_DEFINITIONS[role]?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(filtroEstado !== 'todos' || filtroRol !== 'todos') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFiltroEstado('todos')
              setFiltroRol('todos')
            }}
          >
            <X className="h-3 w-3 mr-1" />
            {USUARIOS_PAGE.limpiar}
          </Button>
        )}

        <span className="text-sm text-muted-foreground ml-auto">
          {filteredUsers.length} {filteredUsers.length !== 1 ? USUARIOS_PAGE.usuarioPlural : USUARIOS_PAGE.usuarioSingular}
        </span>
      </div>

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
      <UserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={editingUser}
        onSave={handleSave}
        isSaving={isLoading}
      />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && userToModify && (
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
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
              </DialogTitle>
            </DialogHeader>
            <DialogBody>
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
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                {BUTTON_LABELS.cancelar}
              </Button>
              <Button
                variant={userToModify.action === 'desactivar' ? 'destructive' : 'default'}
                onClick={handleConfirmToggleActive}
              >
                {userToModify.action === 'desactivar' ? USUARIOS_PAGE.desactivarUsuario : USUARIOS_PAGE.reactivarUsuario}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ModuleContainer>
  )
}
