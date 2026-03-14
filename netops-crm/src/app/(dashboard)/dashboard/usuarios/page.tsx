"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Modal, ModuleContainer } from '@/components/module'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  UserPlus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  KeyRound,
  Shield,
  Mail,
  Phone,
  Calendar,
  X,
  Check,
  Loader2
} from 'lucide-react'
import { Role, ROLE_DEFINITIONS } from '@/types/auth'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const getRoleBadgeColor = (role: Role) => {
    const colors: Record<Role, string> = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      comercial: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      tecnico: 'bg-green-500/20 text-green-400 border-green-500/30',
      compras: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      facturacion: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      cliente: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    }
    return colors[role]
  }

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, activo: !u.activo } : u
    ))
  }

  if (currentUser?.roles[0] !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Acceso Restringido</h2>
          <p className="text-slate-400">Solo los administradores pueden gestionar usuarios.</p>
        </div>
      </div>
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

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className={`hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 ${!user.activo ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-slate-800 text-white">
                      {getInitials(user.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{user.nombre}</h3>
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
                      <Badge
                        key={role}
                        className={`${getRoleBadgeColor(role)} border text-xs`}
                      >
                        {ROLE_DEFINITIONS[role]?.label || role}
                      </Badge>
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
                      onClick={() => handleToggleActive(user.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          size="md"
        >
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
                    className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all
                        ${formData.roles.includes(role)
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                      }
                      `}
                  >
                    <span className="text-sm text-white">
                      {ROLE_DEFINITIONS[role]?.label}
                    </span>
                    {formData.roles.includes(role) && (
                      <Check className="h-4 w-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={isLoading || !formData.nombre || !formData.email || formData.roles.length === 0}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ModuleContainer>
  )
}
