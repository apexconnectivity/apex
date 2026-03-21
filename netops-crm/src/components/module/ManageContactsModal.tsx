'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { Empresa, Contacto } from '@/types/crm'
import { User } from '@/types/auth'
import { BaseModal, ModalHeader, ModalBody } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputTextCase } from '@/components/ui/input-text-case'
import { InputPhone } from '@/components/ui/input-phone'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Building2,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  Mail,
  Phone,
  Plus,
  AlertCircle
} from 'lucide-react'

interface ManageContactsModalProps {
  isOpen: boolean
  onClose: () => void
  empresaId: string
  isReadOnly?: boolean
}

export function ManageContactsModal({ isOpen, onClose, empresaId, isReadOnly = false }: ManageContactsModalProps) {
  const [empresas] = useLocalStorage<Empresa[]>(STORAGE_KEYS.empresas, [])
  const [contactos, setContactos] = useLocalStorage<Contacto[]>(STORAGE_KEYS.contactos, [])
  const [, setUsuarios] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])

  const [isEditingContacto, setIsEditingContacto] = useState(false)
  const [editingContacto, setEditingContacto] = useState<Partial<Contacto> | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsEditingContacto(false)
      setEditingContacto(null)
    }
  }, [isOpen])

  const empresa = useMemo(() => empresas.find(e => e.id === empresaId), [empresas, empresaId])
  const empresaContactos = useMemo(() => contactos.filter(c => c.empresa_id === empresaId), [contactos, empresaId])

  const handleSaveContacto = () => {
    if (!editingContacto?.nombre || !editingContacto?.email) return

    const now = new Date().toISOString()
    const isNew = !editingContacto.id
    const contactoId = editingContacto.id || crypto.randomUUID()

    // 1. Actualizar lista de contactos
    setContactos(prev => {
      const updated = isNew
        ? [...prev, {
          ...editingContacto,
          id: contactoId,
          empresa_id: empresaId,
          creado_en: now.split('T')[0],
          es_principal: false
        } as Contacto]
        : prev.map(c => c.id === contactoId ? { ...c, ...editingContacto } as Contacto : c)
      return updated
    })

    // 2. Sincronizar con el usuario asociado para el portal de cliente
    setUsuarios(prev => {
      const email = editingContacto.email || ''
      const existingUserIndex = prev.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev]
        updatedUsers[existingUserIndex] = {
          ...updatedUsers[existingUserIndex],
          nombre: editingContacto.nombre || updatedUsers[existingUserIndex].nombre,
          telefono: editingContacto.telefono || updatedUsers[existingUserIndex].telefono,
        }
        return updatedUsers
      } else if (isNew) {
        return [...prev, {
          id: crypto.randomUUID(),
          email: email,
          nombre: editingContacto.nombre || '',
          telefono: editingContacto.telefono,
          activo: true,
          creado_en: now,
          cambiar_password_proximo_login: true,
          roles: ['cliente'],
          empresa_id: empresaId
        } as User]
      }
      return prev
    })

    setIsEditingContacto(false)
    setEditingContacto(null)
  }

  const handleDeleteContacto = (id: string) => {
    const contacto = contactos.find(c => c.id === id)
    if (contacto?.es_principal) return

    setContactos(prev => prev.filter(c => c.id !== id))
    // Opcional: Desactivar usuario también
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (!isOpen || !empresa) return null

  return (
    <BaseModal open={isOpen} onOpenChange={onClose} size="xl">
      <ModalHeader
        title={
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-500" />
            <span>Gestionar Directorio: {empresa.nombre}</span>
          </div>
        }
      />
      <ModalBody>
        <div className="grid md:grid-cols-5 gap-6 max-h-[70vh]">
          {/* Lista de Contactos */}
          <div className="md:col-span-3 space-y-4 overflow-y-auto pr-2">
            <div className="flex items-center justify-between sticky top-0 py-1 bg-background z-10">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Contactos Registrados
              </h3>
              {!isReadOnly && (
                <Button size="sm" variant="outline" className="h-8 gap-1 border-primary/20 hover:bg-primary/5 text-primary" onClick={() => {
                  setEditingContacto({ nombre: '', email: '', cargo: '', telefono: '' })
                  setIsEditingContacto(true)
                }}>
                  <Plus className="h-4 w-4" />
                  Nuevo Contacto
                </Button>
              )}
            </div>

            <div className="grid gap-3">
              {empresaContactos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-xl border-border/50">
                  No hay contactos registrados para esta empresa
                </div>
              ) : (
                empresaContactos.map(contacto => (
                  <Card key={contacto.id} className="group hover:border-primary/40 transition-all duration-200 border-border/50 bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                            <AvatarFallback className="bg-slate-800 text-xs text-slate-200">
                              {getInitials(contacto.nombre)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm truncate text-foreground">{contacto.nombre}</p>
                              {contacto.es_principal && (
                                <Badge variant="secondary" className="h-4 text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                  Principal
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">{contacto.cargo || 'Sin cargo definido'}</p>
                          </div>
                        </div>

                        {!isReadOnly && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-cyan-500 hover:bg-cyan-500/10"
                              disabled={contacto.es_principal}
                              onClick={() => {
                                setEditingContacto(contacto)
                                setIsEditingContacto(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {!contacto.es_principal && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => handleDeleteContacto(contacto.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/5">
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 opacity-60" /> {contacto.email}</span>
                        {contacto.telefono && <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 opacity-60" /> {contacto.telefono}</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Formulario de Edición */}
          <div className="md:col-span-2 flex flex-col">
            {isEditingContacto ? (
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 flex flex-col h-full shadow-inner animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {editingContacto?.id ? <Pencil className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
                  </div>
                  <h4 className="font-semibold text-sm">
                    {editingContacto?.id ? 'Editar Información' : 'Nuevo Contacto'}
                  </h4>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="manage_contact_nombre" className="text-xs text-muted-foreground">Nombre completo *</Label>
                    <InputTextCase
                      id="manage_contact_nombre"
                      value={editingContacto?.nombre || ''}
                      onChange={(e) => setEditingContacto(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Juan Pérez"
                      className="bg-background/50 h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manage_contact_email" className="text-xs text-muted-foreground">Email corporativo *</Label>
                    <Input
                      id="manage_contact_email"
                      type="email"
                      value={editingContacto?.email || ''}
                      onChange={e => setEditingContacto(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="juan@empresa.com"
                      className="bg-background/50 h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manage_contact_cargo" className="text-xs text-muted-foreground">Cargo / Puesto</Label>
                    <InputTextCase
                      id="manage_contact_cargo"
                      value={editingContacto?.cargo || ''}
                      onChange={(e) => setEditingContacto(prev => ({ ...prev, cargo: e.target.value }))}
                      placeholder="Ej: Gerente de TI"
                      className="bg-background/50 h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manage_contact_telefono" className="text-xs text-muted-foreground">Teléfono de contacto</Label>
                    <InputPhone
                      id="manage_contact_telefono"
                      value={editingContacto?.telefono || ''}
                      onChange={(value) => setEditingContacto(prev => ({ ...prev, telefono: value }))}
                      placeholder="55 1234 5678"
                      className="bg-background/50 h-9"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <Button variant="ghost" className="flex-1 h-10" onClick={() => setIsEditingContacto(false)}>
                    Descartar
                  </Button>
                  <Button
                    className="flex-1 h-10 shadow-lg shadow-primary/20"
                    onClick={handleSaveContacto}
                    disabled={!editingContacto?.nombre?.trim() || !editingContacto?.email?.trim()}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-2xl border-2 border-dashed border-border/30">
                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                  <UserPlus className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h4 className="font-medium text-sm text-foreground mb-2">Gestión de Contactos</h4>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                  Selecciona un contacto para modificar su información o añade a un nuevo integrante de tu equipo.
                </p>
                <div className="mt-8 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-start gap-2 text-left">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-200/70 leading-normal">
                    <strong>Nota de Seguridad:</strong> El contacto principal es el enlace oficial y solo puede ser modificado por administradores de redops.
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
