"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ClienteUsuario } from '@/types/portal'

interface AuthContextType {
  user: ClienteUsuario | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const PortalAuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => { },
  isLoading: true,
})

const DEMO_CLIENTE: ClienteUsuario = {
  id: 'c1',
  email: 'juan@soltec.com',
  nombre: 'Juan Pérez',
  rol: 'cliente',
  empresa_id: '1',
  empresa_nombre: 'Soluciones Tecnológicas SA',
  cargo: 'Director de TI',
  telefono: '+54 11 1234-5678',
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClienteUsuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('portal_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      const user = DEMO_CLIENTE
      setUser(user)
      localStorage.setItem('portal_user', JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('portal_user')
  }

  return (
    <PortalAuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </PortalAuthContext.Provider>
  )
}

export function usePortalAuth() {
  return useContext(PortalAuthContext)
}
