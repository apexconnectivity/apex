'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Archivo, type EntidadTipo, type Visibilidad } from '@/types/archivos'

// ============================================================================
// Keys para localStorage
// ============================================================================
const STORAGE_KEYS = {
  ARCHIVOS: 'netops_archivos',
} as const

// ============================================================================
// Tipo para datos de archivo sin ID generado (ruta_completa es opcional)
// ============================================================================
export type ArchivoInput = Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'fecha_subida'> & { ruta_completa?: string }

// ============================================================================
// Hook para gestionar archivos en localStorage
// ============================================================================
export interface UseArchivosStorageReturn {
  archivos: Archivo[]
  loading: boolean
  addArchivo: (archivo: ArchivoInput) => void
  removeArchivo: (id: string) => void
  clearArchivos: () => void
}

export function useArchivosStorage(): UseArchivosStorageReturn {
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const [loading, setLoading] = useState(true)

  // ==========================================================================
  // Cargar archivos desde localStorage al inicializar
  // ==========================================================================
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARCHIVOS)
      
      if (stored) {
        const parsed = JSON.parse(stored) as Archivo[]
        setArchivos(parsed)
      } else {
        // Inicializar vacío - sin datos demo
        localStorage.setItem(STORAGE_KEYS.ARCHIVOS, JSON.stringify([]))
        setArchivos([])
      }
    } catch (error) {
      console.error('Error loading archivos from localStorage:', error)
      setArchivos([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ==========================================================================
  // Función para generar ID único
  // ==========================================================================
  const generateId = useCallback((): string => {
    return `arch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }, [])

  // ==========================================================================
  // Función para agregar un archivo
  // ==========================================================================
  const addArchivo = useCallback((archivo: ArchivoInput): void => {
    const now = new Date().toISOString()
    const newArchivo: Archivo = {
      ...archivo,
      id: generateId(),
      drive_file_id: `drive_${generateId()}`,
      nombre_guardado: `${now.split('T')[0]}_${archivo.nombre_original}`,
      drive_view_link: '#',
      drive_download_link: '#',
      // Usar la ruta proporcionada o valor por defecto
      ruta_completa: archivo.ruta_completa || '/Sin asignar/',
      fecha_subida: now,
    }

    setArchivos((prev) => {
      const updated = [...prev, newArchivo]
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ARCHIVOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error saving archivo to localStorage:', error)
        }
      }
      
      return updated
    })
  }, [generateId])

  // ==========================================================================
  // Función para eliminar un archivo
  // ==========================================================================
  const removeArchivo = useCallback((id: string): void => {
    setArchivos((prev) => {
      const updated = prev.filter((archivo) => archivo.id !== id)
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ARCHIVOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error removing archivo from localStorage:', error)
        }
      }
      
      return updated
    })
  }, [])

  // ==========================================================================
  // Función para limpiar todos los archivos (para testing)
  // ==========================================================================
  const clearArchivos = useCallback((): void => {
    setArchivos([])
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.ARCHIVOS)
      } catch (error) {
        console.error('Error clearing archivos from localStorage:', error)
      }
    }
  }, [])

  return {
    archivos,
    loading,
    addArchivo,
    removeArchivo,
    clearArchivos,
  }
}

// ============================================================================
// Exportar keys para uso externo si es necesario
// ============================================================================
export { STORAGE_KEYS as ARCHIVOS_STORAGE_KEYS }
