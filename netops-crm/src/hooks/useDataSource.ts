'use client'

/**
 * ============================================
 * useDataSource - Hook de Abstracción de Datos
 * ============================================
 * Este hook abstrae la fuente de datos entre:
 * - localStorage (para desarrollo/pruebas locales)
 * - Supabase (para producción)
 * 
 * Permite una migración fluida de localStorage a Supabase
 * sin reescribir la lógica de los componentes.
 */

import { useState, useEffect, useCallback } from 'react'
import { StorageKeys, getSupabaseTable } from '@/constants/storage-config'

// ============================================================================
// TIPOS
// ============================================================================

export type DataSource = 'localStorage' | 'supabase'

export interface UseDataSourceOptions<K extends string> {
  /** Clave de storage */
  key: K
  /** Fuente de datos: localStorage o Supabase */
  source: DataSource
  /** Nombre de la tabla en Supabase (requerido si source='supabase') */
  table?: string
  /** Valor inicial por defecto */
  initialValue?: unknown
  /** Habilitar sincronización entre tabs (solo localStorage) */
  syncTabs?: boolean
}

export interface UseDataSourceReturn<T> {
  /** Datos actuales */
  data: T
  /** Estado de carga */
  isLoading: boolean
  /** Error si ocurrió */
  error: Error | null
  /** Función para guardar datos */
  save: (data: T | ((prev: T) => T)) => Promise<void>
  /** Función para eliminar datos */
  remove: () => Promise<void>
  /** Función para recargar datos */
  refresh: () => Promise<void>
  /** Verificar si hay datos */
  hasData: boolean
}

// ============================================================================
// FUNCIONES DE SUPABASE (placeholder para futura implementación)
// ============================================================================

async function fetchFromSupabase(_table: string): Promise<unknown> {
  console.warn('Supabase not configured. Please set up Supabase client.')
  return null
}

async function saveToSupabase(_table: string, _data: unknown): Promise<void> {
  console.warn('Supabase not configured. Please set up Supabase client.')
}

async function deleteFromSupabase(_table: string): Promise<void> {
  console.warn('Supabase not configured. Please set up Supabase client.')
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useDataSource<T>(
  options: UseDataSourceOptions<string>
): UseDataSourceReturn<T> {
  const {
    key,
    source,
    table,
    initialValue,
    syncTabs = true,
  } = options

  const [data, setData] = useState<T>(initialValue as T)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ==========================================================================
  // Cargar datos
  // ==========================================================================
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (source === 'localStorage') {
        // Cargar desde localStorage
        if (typeof window !== 'undefined') {
          const item = localStorage.getItem(key)
          if (item) {
            setData(JSON.parse(item) as T)
          }
        }
      } else if (source === 'supabase') {
        // Cargar desde Supabase
        const supabaseTable = table || getSupabaseTable(key as StorageKeys)
        if (!supabaseTable) {
          throw new Error(`No table mapping for key: ${key}`)
        }

        const result = await fetchFromSupabase(supabaseTable)
        if (result) {
          setData(result as T)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error loading data')
      setError(error)
      console.error(`Error loading data for ${key}:`, err)
    } finally {
      setIsLoading(false)
    }
  }, [source, key, table])

  // Cargar al iniciar
  useEffect(() => {
    loadData()
  }, [loadData])

  // ==========================================================================
  // Sincronización entre tabs (solo localStorage)
  // ==========================================================================
  useEffect(() => {
    if (source !== 'localStorage' || !syncTabs || typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return

      try {
        const newValue = event.newValue
          ? JSON.parse(event.newValue) as T
          : initialValue

        if (newValue !== null) {
          setData(newValue as T)
        }
      } catch (err) {
        console.warn(`Error syncing ${key}:`, err)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, source, syncTabs, initialValue])

  // ==========================================================================
  // Función para guardar
  // ==========================================================================
  const save = useCallback(async (
    newData: T | ((prev: T) => T)
  ) => {
    setError(null)

    try {
      // Calcular el valor a guardar
      const valueToStore = newData instanceof Function
        ? newData(data)
        : newData

      if (source === 'localStorage') {
        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore))
          setData(valueToStore)
        }
      } else if (source === 'supabase') {
        // Guardar en Supabase
        const supabaseTable = table || getSupabaseTable(key as StorageKeys)
        if (!supabaseTable) {
          throw new Error(`No table mapping for key: ${key}`)
        }

        await saveToSupabase(supabaseTable, valueToStore)
        setData(valueToStore)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error saving data')
      setError(error)
      console.error(`Error saving data for ${key}:`, err)
      throw error
    }
  }, [source, key, table, data])

  // ==========================================================================
  // Función para eliminar
  // ==========================================================================
  const remove = useCallback(async () => {
    setError(null)

    try {
      if (source === 'localStorage') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key)
          setData(initialValue as T)
        }
      } else if (source === 'supabase') {
        const supabaseTable = table || getSupabaseTable(key as StorageKeys)
        if (!supabaseTable) {
          throw new Error(`No table mapping for key: ${key}`)
        }

        await deleteFromSupabase(supabaseTable)
        setData(initialValue as T)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error removing data')
      setError(error)
      console.error(`Error removing data for ${key}:`, err)
      throw error
    }
  }, [source, key, table, initialValue])

  // ==========================================================================
  // Retornar valor
  // ==========================================================================
  const hasData = data !== null && data !== undefined &&
    (typeof data === 'object' ? Object.keys(data).length > 0 : true)

  return {
    data,
    isLoading,
    error,
    save,
    remove,
    refresh: loadData,
    hasData,
  }
}

// ============================================================================
// HOOK CONVENIENCE: useLocalStorageData
// ============================================================================

/**
 * Hook convenience para usar localStorage con la nueva estructura
 */
export function useLocalStorageData<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState<T | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true)
      return
    }

    try {
      const item = localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item) as T)
      } else if (initialValue !== undefined) {
        setStoredValue(initialValue)
        localStorage.setItem(key, JSON.stringify(initialValue))
      }
    } catch (err) {
      console.warn(`Error reading ${key}:`, err)
      if (initialValue !== undefined) {
        setStoredValue(initialValue)
      }
    } finally {
      setIsLoaded(true)
    }
  }, [key, initialValue])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function
        ? value((prev ?? initialValue) as T)
        : value

      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }

      return valueToStore
    })
  }, [key, initialValue])

  return {
    data: storedValue ?? initialValue,
    setValue,
    isLoaded,
  }
}
