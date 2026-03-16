"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { ModuleContainer } from '@/components/module'
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
import { Role, ROLE_DEFINITIONS } from '@/types/auth'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { cn } from '@/lib/utils'

// Demo users data
const INITIAL_USERS = [
  {
    id: '1',
    email: 'admin@apex.com',
    nombre: 'Carlos Admin',
    telefono: '+54 9 11 1234-5678',
    activo: true,
    roles: ['admin'] as Role[],
    creado_en: '2024-01-15',
  },
  {
    id: '2',
    email: 'laura@apex.com',
    nombre: 'Laura Pérez',
    telefono: '+54 9 11 2345-6789',
    activo: true,
    roles: ['comercial'] as Role[],
    creado_en: '2024-02-20',
  },
  {
    id: '3',
    email: 'juan@apex.com',
    nombre: 'Juan García',
    telefono: '+54 9 11 3456-7890',
    activo: true,
    roles: ['tecnico'] as Role[],
    creado_en: '2024-03-10',
  },
  {
    id: '4',
    email: 'maria@apex.com',
    nombre: 'María López',
    telefono: '+54 9 11 4567-8901',
    activo: true,
    roles: ['tecnico', 'compras'] as Role[],
    creado_en: '2024-04-05',
  },
  {
    id: '5',
    email: 'pedro@apex.com',
    nombre: 'Pedro Martínez',
    telefono: '+54 9 11 5678-9012',
    activo: false,
    roles: ['facturacion'] as Role[],
    creado_en: '2024-05-12',
  },
]

const INTERNAL_ROLES: Role[] = ['admin', 'comercial', 'tecnico', 'compras', 'facturacion', 'marketing']

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos')
  const [filtroRol, setFiltroRol] = useState<'todos' | Role>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [userToModify, setUserToModify] = useState<{ id: string; action: 'activar' | 'desactivar' } | null>(null)
  const [editingUser, setEditingUser] = useState<typeof INITIAL_USERS[0] | null>(null)
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

  const handleOpenModal = (user?: typeof INITIAL_USERS[0]) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
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
      const newUser = {
        id: String(Date.now()),
        ...formData,
        activo: true,
        creado_en: new Date().toISOString().split('T')[0],
      }
      setUsers(prev => [...prev, newUser])
    }

    setIsLoading(false)
    handleCloseModal()
  }

  const handleRequestToggleActive = (user: typeof INITIAL_USERS[0]) => {
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
        description="Solo los administradores pueden gestionar usuarios."
      />
    )
  }

  return (
    <ModuleContainer>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los usuarios internos del sistema
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 bg-background/80 border-border/50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="text-muted-foreground mr-1">Filtros:</span>
        
        <div className="flex items-center gap-1">
          <Label className="text-xs text-muted-foreground mr-1">Estado:</Label>
          <Select value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as typeof filtroEstado)}>
            <SelectTrigger className="w-32 h-8 bg-input border-border">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="inactivo">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Label className="text-xs text-muted-foreground mr-1">Rol:</Label>
          <Select value={filtroRol} onValueChange={(v) => setFiltroRol(v as typeof filtroRol)}>
            <SelectTrigger className="w-40 h-8 bg-input border-border">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
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
            Limpiar
          </Button>
        )}
        
        <span className="text-sm text-muted-foreground ml-auto">
          {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
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
                          Inactivo
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

      {/* User Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre completo</label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="juan@apex.com"
                    disabled={!!editingUser}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Roles</label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTERNAL_ROLES.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border transition-all',
                          formData.roles.includes(role)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <span className="text-sm">
                          {ROLE_DEFINITIONS[role]?.label}
                        </span>
                        {formData.roles.includes(role) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading || !formData.nombre || !formData.email || formData.roles.length === 0}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && userToModify && (
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {userToModify.action === 'desactivar' ? (
                  <>
                    <Trash2 className="h-5 w-5 text-destructive" />
                    Desactivar Usuario
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5 text-green-400" />
                    Reactivar Usuario
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                {userToModify.action === 'desactivar' 
                  ? '¿Estás seguro de que deseas desactivar este usuario? Ya no podrá acceder al sistema.'
                  : '¿Estás seguro de que deseas reactivar este usuario? Volverá a tener acceso al sistema.'
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
                Cancelar
              </Button>
              <Button 
                variant={userToModify.action === 'desactivar' ? 'destructive' : 'default'}
                onClick={handleConfirmToggleActive}
              >
                {userToModify.action === 'desactivar' ? 'Desactivar' : 'Reactivar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ModuleContainer>
  )
}
