"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Lock,
  Bell,
  Save,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { ROLE_DEFINITIONS } from '@/types/auth'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Determinar si el usuario es admin (puede ver/editar todos los perfiles)
  const isAdmin = user?.roles.includes('admin') ?? false

  // Profile form
  const [profileData, setProfileData] = useState({
    nombre: '',
    telefono: '',
  })

  // Sync profile data when user changes
  useState(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre,
        telefono: user.telefono || '',
      })
    }
  })

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const getInitials = (name: string) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)

      // Llamar a AuthContext para actualizar los datos reales
      await updateUser({
        nombre: profileData.nombre,
        telefono: profileData.telefono
      })

      setSaveMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
      setIsEditing(false)
    } catch { // eslint-disable-line @typescript-eslint/no-unused-vars
      setSaveMessage({ type: 'error', text: 'No se pudo actualizar el perfil' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleChangePassword = async () => {
    setPasswordMessage(null)

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    setIsSaving(true)

    // Simulación de cambio de contraseña
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // En una app real llamaríamos a un endpoint de cambio de pass

      setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch { // eslint-disable-line @typescript-eslint/no-unused-vars
      setPasswordMessage({ type: 'error', text: 'Error al cambiar la contraseña' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setPasswordMessage(null), 3000)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu información personal y seguridad
        </p>
      </div>

      <Tabs defaultValue={isAdmin ? "perfil" : "seguridad"} className="space-y-6">
        <TabsList>
          {isAdmin && (
            <TabsTrigger value="perfil" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
          )}
          <TabsTrigger value="seguridad" className="gap-2">
            <Lock className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="notificaciones" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab - Solo para admins */}
        {isAdmin && (
          <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {saveMessage && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${saveMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                  {saveMessage.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{saveMessage.text}</span>
                </div>
              )}

              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
                  <AvatarFallback className="text-2xl bg-slate-800">
                    {getInitials(user.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.nombre}</h3>
                  <div className="flex gap-1 mt-1">
                    {user.roles.map(role => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="bg-slate-800"
                      >
                        {ROLE_DEFINITIONS[role]?.label || role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre completo</label>
                  <Input
                    value={profileData.nombre}
                    onChange={(e) => setProfileData(prev => ({ ...prev, nombre: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={user.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={profileData.telefono}
                    onChange={(e) => setProfileData(prev => ({ ...prev, telefono: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha de registro</label>
                  <Input value={new Date(user.creado_en).toLocaleDateString('es-AR')} disabled className="bg-muted" />
                </div>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setProfileData({ nombre: user.nombre, telefono: user.telefono || '' })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        {/* Security Tab */}
        <TabsContent value="seguridad">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordMessage && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${passwordMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña actual</label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva contraseña</label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar nueva contraseña</label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                <Lock className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab - Solo para admins */}
        {isAdmin && (
          <TabsContent value="notificaciones">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'email_projects', label: 'Proyectos', desc: 'Notificaciones sobre proyectos' },
                    { id: 'email_tasks', label: 'Tareas', desc: 'Recordatorios de tareas' },
                    { id: 'email_tickets', label: 'Tickets', desc: 'Actualizaciones de tickets de soporte' },
                    { id: 'email_calendar', label: 'Calendario', desc: 'Recordatorios de reuniones' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
