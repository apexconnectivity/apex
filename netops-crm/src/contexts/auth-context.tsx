"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, Role, hasPermission, canAccessModule, isInternalUser } from '@/types/auth'

// ============================================================================
// CONFIGURACIÓN DE DEMO
// ============================================================================

// Credenciales demo configurables via variables de entorno
// Si no están definidas, usan los valores por defecto
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || 'admin@apex.com'
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'admin123'

// ============================================================================
// CONTEXTO DE AUTENTICACIÓN
// ============================================================================

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

// Usuario bootstrap inicial - mínimo necesario para que el sistema funcione
// Los usuarios deben gestionarse desde el módulo de Usuarios (pendiente localStorage)
const BOOTSTRAP_USER: User = {
  id: '1',
  email: DEMO_EMAIL,
  nombre: 'Administrador',
  telefono: '',
  activo: true,
  creado_en: new Date().toISOString(),
  cambiar_password_proximo_login: false,
  roles: ['admin'],
}

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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Usar usuario bootstrap para login inicial
      // TODO: Implementar usuarios en localStorage desde módulo de Usuarios
      const foundUser = email.toLowerCase() === BOOTSTRAP_USER.email.toLowerCase() ? BOOTSTRAP_USER : null

      if (!foundUser) {
        throw new Error('Email o contraseña incorrectos')
      }

      // En una app real, verificaríamos el hash de la contraseña
      // Por ahora, cualquier contraseña que coincida con DEMO_PASSWORD funciona
      if (password !== DEMO_PASSWORD) {
        throw new Error('Email o contraseña incorrectos')
      }

      // Update last access
      const updatedUser = {
        ...foundUser,
        ultimo_acceso: new Date().toISOString(),
      }

      setUser(updatedUser)
      localStorage.setItem('apex_user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('[AuthContext] Error en login:', error)
      throw error // Re-lanzar para que el componente maneje la UI
    } finally {
      setIsLoading(false)
    }
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
