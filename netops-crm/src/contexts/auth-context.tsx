"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, hasPermission, canAccessModule, isInternalUser } from '@/types/auth'
import { STORAGE_KEYS } from '@/constants/storage'

// ============================================================================
// CONFIGURACIÓN DE DEMO
// ============================================================================

// Credenciales demo configurables via variables de entorno
// Si no están definidas, usan los valores por defecto
const DEMO_USERNAME = process.env.NEXT_PUBLIC_DEMO_USERNAME || 'admin'
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'admin123'

// ============================================================================
// CONTEXTO DE AUTENTICACIÓN
// ============================================================================

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updatedData: Partial<User>) => Promise<void>
  hasPermission: (module: string, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete') => boolean
  canAccessModule: (module: string) => boolean
  isInternalUser: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario bootstrap inicial - mínimo necesario para que el sistema funcione
// Los usuarios deben gestionarse desde el módulo de Usuarios (pendiente localStorage)
const BOOTSTRAP_USER: User = {
  id: '1',
  email: 'admin@apex.com',
  username: DEMO_USERNAME,
  password_hash: btoa(DEMO_PASSWORD), // Hash simple para demo
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

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (!username.trim()) {
        throw new Error('El nombre de usuario es requerido')
      }

      if (!password) {
        throw new Error('La contraseña es requerida')
      }

      // Buscar en usuarios dinámicos (localStorage)
      const storedUsers = localStorage.getItem(STORAGE_KEYS.usuarios)
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : []
      
      // Buscar por username (prioridad al bootstrap user)
      let foundUser = username.toLowerCase() === BOOTSTRAP_USER.username.toLowerCase() ? BOOTSTRAP_USER : null
      
      if (!foundUser) {
        foundUser = users.find(u => u.username?.toLowerCase() === username.toLowerCase()) || null
      }

      if (!foundUser) {
        throw new Error('Usuario o contraseña incorrectos')
      }

      // Validar contraseña
      // Para usuarios sin password_hash (legacy), aceptar cualquier contraseña no vacía en demo
      // Para usuarios con password_hash, validar contra el hash
      if (foundUser.password_hash) {
        const isValidPassword = atob(foundUser.password_hash) === password
        if (!isValidPassword) {
          throw new Error('Usuario o contraseña incorrectos')
        }
      } else {
        // Compatibilidad con usuarios sin hash (demo)
        if (!password) {
          throw new Error('Usuario o contraseña incorrectos')
        }
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

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updatedData }
    
    // Update local state and current session storage
    setUser(updatedUser)
    localStorage.setItem('apex_user', JSON.stringify(updatedUser))

    // Update global users list in localStorage
    const storedUsers = localStorage.getItem(STORAGE_KEYS.usuarios)
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers)
      const index = users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedData }
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(users))
      }
    }
  }, [user])

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
        updateUser,
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
