'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useEmpresas, useProyectos, useTareas, useContactos } from '@/hooks'

interface DataContextType {
  empresas: ReturnType<typeof useEmpresas>
  proyectos: ReturnType<typeof useProyectos>
  tareas: ReturnType<typeof useTareas>
  contactos: ReturnType<typeof useContactos>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const empresas = useEmpresas()
  const proyectos = useProyectos()
  const tareas = useTareas()
  const contactos = useContactos()

  return (
    <DataContext.Provider value={{ empresas, proyectos, tareas, contactos }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}