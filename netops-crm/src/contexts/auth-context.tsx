"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, Role, hasPermission, canAccessModule, isInternalUser } from '@/types/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (module: string, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete') => boolean
  canAccessModule: (module: string) => boolean
  isInternalUser: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for development
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@apex.com',
    nombre: 'Carlos Admin',
    telefono: '+54 9 11 1234-5678',
    activo: true,
    creado_en: '2024-01-01T00:00:00Z',
    cambiar_password_proximo_login: false,
    roles: ['admin'],
  },
  {
    id: '2',
    email: 'comercial@apex.com',
    nombre: 'Laura Comercial',
    telefono: '+54 9 11 2345-6789',
    activo: true,
    creado_en: '2024-02-01T00:00:00Z',
    cambiar_password_proximo_login: false,
    roles: ['comercial'],
  },
  {
    id: '3',
    email: 'tecnico@apex.com',
    nombre: 'Juan Técnico',
    telefono: '+54 9 11 3456-7890',
    activo: true,
    creado_en: '2024-03-01T00:00:00Z',
    cambiar_password_proximo_login: false,
    roles: ['tecnico'],
  },
  {
    id: '4',
    email: 'cliente@empresa.com',
    nombre: 'Pedro Cliente',
    telefono: '+54 9 11 4567-8901',
    activo: true,
    creado_en: '2024-04-01T00:00:00Z',
    cambiar_password_proximo_login: false,
    roles: ['cliente'],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('apex_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('apex_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!foundUser) {
      setIsLoading(false)
      throw new Error('Email o contraseña incorrectos')
    }
    
    // In a real app, we'd verify the password hash
    if (password.length < 6) {
      setIsLoading(false)
      throw new Error('Email o contraseña incorrectos')
    }
    
    // Update last access
    const updatedUser = {
      ...foundUser,
      ultimo_acceso: new Date().toISOString(),
    }
    
    setUser(updatedUser)
    localStorage.setItem('apex_user', JSON.stringify(updatedUser))
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('apex_user')
  }, [])

  const checkPermission = useCallback((module: string, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete') => {
    return hasPermission(user, module, action)
  }, [user])

  const checkModuleAccess = useCallback((module: string) => {
    return canAccessModule(user, module)
  }, [user])

  const checkInternalUser = useCallback(() => {
    return isInternalUser(user)
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission: checkPermission,
        canAccessModule: checkModuleAccess,
        isInternalUser: checkInternalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
