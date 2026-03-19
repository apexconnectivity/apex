'use client'

/**
 * ============================================
 * Utilerías de Storage
 * ============================================
 * Funciones helper para gestionar datos en localStorage
 * Incluye: export, import, clear, sincronización entre tabs
 */

import { useState, useCallback, useEffect } from 'react'
import { StorageKeys, STORAGE_TO_SUPABASE_MAP, type StorageDataMap } from '@/constants/storage-config'

// ============================================================================
// VERIFICACIÓN DE ENTORNO
// ============================================================================

/**
 * Verifica si estamos en el navegador
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

// ============================================================================
// EXPORT/IMPORT DE DATOS
// ============================================================================

/**
 * Exporta todos los datos de localStorage
 * Útil para backup manual o migración
 */
export function exportAllData(): Record<string, unknown> {
  if (!isBrowser()) return {}

  const data: Record<string, unknown> = {}

  // Iterar sobre todas las keys del enum
  for (const key of Object.values(StorageKeys)) {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        data[key] = JSON.parse(item)
      }
    } catch (error) {
      console.warn(`Error exporting key "${key}":`, error)
    }
  }

  return data
}

/**
 * Importa datos a localStorage
 * @param data - Datos exportados previamente
 * @param merge - Si true, fusiona con datos existentes; si false, reemplaza
 */
export function importData(data: Record<string, unknown>, merge = false): void {
  if (!isBrowser()) return

  for (const [key, value] of Object.entries(data)) {
    try {
      if (merge) {
        // Fusionar con datos existentes
        const existing = localStorage.getItem(key)
        if (existing) {
          const existingData = JSON.parse(existing)
          const newData = Array.isArray(existingData)
            ? [...existingData, ...(Array.isArray(value) ? value : [])]
            : { ...existingData, ...(value as object) }
          localStorage.setItem(key, JSON.stringify(newData))
        } else {
          localStorage.setItem(key, JSON.stringify(value))
        }
      } else {
        // Reemplazar completamente
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.warn(`Error importing key "${key}":`, error)
    }
  }
}

/**
 * Limpia todos los datos de localStorage relacionados con la app
 */
export function clearAllData(): void {
  if (!isBrowser()) return

  for (const key of Object.values(StorageKeys)) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error clearing key "${key}":`, error)
    }
  }
}

/**
 * Limpia solo datos de usuario (no configuración)
 */
export function clearUserData(): void {
  if (!isBrowser()) return

  // Keys que contienen datos de usuario
  const userDataKeys = [
    StorageKeys.EMPRESAS,
    StorageKeys.CONTACTOS,
    StorageKeys.PROYECTOS,
    StorageKeys.TAREAS,
    StorageKeys.TICKETS,
    StorageKeys.CONTRATOS,
    StorageKeys.ORDENES_COMPRA,
    StorageKeys.PROVEEDORES,
    StorageKeys.COTIZACIONES,
    StorageKeys.REUNIONES,
    StorageKeys.ARCHIVOS,
    StorageKeys.PROYECTOS_CERRADOS,
    StorageKeys.PROYECTOS_ARCHIVADOS,
    StorageKeys.USUARIOS,
    StorageKeys.COMENTARIOS,
    StorageKeys.SUBTAREAS,
    StorageKeys.COMENTARIOS_TICKETS,
    StorageKeys.HISTORIAL_PROYECTOS,
  ]

  for (const key of userDataKeys) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error clearing user data key "${key}":`, error)
    }
  }
}

// ============================================================================
// GESTIÓN DE TAMAÑO
// ============================================================================

// Tamaño máximo de localStorage (5MB en bytes)
const MAX_LOCAL_STORAGE_SIZE = 5 * 1024 * 1024

/**
 * Obtiene el tamaño aproximado usado en localStorage
 */
export function getStorageUsage(): { used: number; total: number; percentage: number } {
  if (!isBrowser()) {
    return { used: 0, total: 0, percentage: 0 }
  }

  let used = 0
  for (const key of Object.values(StorageKeys)) {
    const item = localStorage.getItem(key)
    if (item) {
      used += item.length * 2 // 2 bytes por carácter (UTF-16)
    }
  }

  const percentage = (used / MAX_LOCAL_STORAGE_SIZE) * 100

  return {
    used: Math.round(used / 1024), // KB
    total: Math.round(MAX_LOCAL_STORAGE_SIZE / 1024), // KB
    percentage: Math.round(percentage * 100) / 100,
  }
}

/**
 * Obtiene el tamaño de un item específico
 */
export function getItemSize(key: string): number {
  if (!isBrowser()) return 0

  const item = localStorage.getItem(key)
  return item ? item.length * 2 : 0 // bytes
}

// ============================================================================
// SINCRONIZACIÓN ENTRE TABS
// ============================================================================

type StorageListener = (key: string, newValue: unknown, oldValue: unknown) => void

/**
 * Suscribe a cambios de storage en otras tabs
 * @param callback - Función a ejecutar cuando cambie el storage
 * @returns Función para cancelar la suscripción
 */
export function subscribeToStorageChanges(callback: StorageListener): () => void {
  if (!isBrowser()) return () => { }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key && event.newValue !== event.oldValue) {
      callback(
        event.key,
        event.newValue ? JSON.parse(event.newValue) : null,
        event.oldValue ? JSON.parse(event.oldValue) : null
      )
    }
  }

  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}

/**
 * Fuerza un evento de storage para sincronizar entre tabs
 * Útil después de hacer cambios locales
 */
export function syncStorage(key: string): void {
  if (!isBrowser()) return

  const item = localStorage.getItem(key)
  // Establecer el mismo valor para dispara el evento en otras tabs
  localStorage.setItem(key, item || '')
  // Luego establecer el valor correcto
  if (item) {
    localStorage.setItem(key, item)
  }
}

// ============================================================================
// VALIDACIÓN DE DATOS
// ============================================================================

/**
 * Valida que un valor sea del tipo esperado
 * @deprecated Use Zod para validación más robusta
 */
export function validateStorageData<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback
  }

  // Si el fallback es array, verificar que value también sea array
  if (Array.isArray(fallback)) {
    return Array.isArray(value) ? (value as T) : fallback
  }

  // Si el fallback es objeto
  if (typeof fallback === 'object' && fallback !== null) {
    return typeof value === 'object' && value !== null ? (value as T) : fallback
  }

  // Primitivos
  return typeof value === typeof fallback ? (value as T) : fallback
}

// ============================================================================
// UTILIDADES DE DEBUG
// ============================================================================

/**
 * Lista todas las keys de la app en localStorage con sus tamaños
 */
export function listStorageKeys(): Array<{ key: string; size: number; hasData: boolean }> {
  if (!isBrowser()) return []

  const result: Array<{ key: string; size: number; hasData: boolean }> = []

  for (const key of Object.values(StorageKeys)) {
    const item = localStorage.getItem(key)
    result.push({
      key,
      size: item ? Math.round((item.length * 2) / 1024 * 100) / 100 : 0, // KB
      hasData: !!item,
    })
  }

  return result
}

/**
 * Obtiene datos de una key específica
 */
export function getStorageItem<K extends StorageKeys>(key: K): StorageDataMap[K] | null {
  if (!isBrowser()) return null

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

/**
 * Establece datos en una key específica
 */
export function setStorageItem<K extends StorageKeys>(key: K, value: StorageDataMap[K]): boolean {
  if (!isBrowser()) return false

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting storage key "${key}":`, error)
    return false
  }
}

// ============================================================================
// PREPARACIÓN PARA SUPABASE
// ============================================================================

/**
 * Obtiene lista de keys que se pueden migrar a Supabase
 * (excluye UI state y auth)
 */
export function getMigratableKeys(): Array<{ key: StorageKeys; table: string }> {
  const migratable: Array<{ key: StorageKeys; table: string }> = []

  for (const key of Object.values(StorageKeys)) {
    const table = STORAGE_TO_SUPABASE_MAP[key]
    if (table) {
      migratable.push({ key, table })
    }
  }

  return migratable
}

/**
 * Exporta solo datos migrables (para futura migración a Supabase)
 */
export function exportMigratableData(): Record<string, unknown> {
  const migratableKeys = getMigratableKeys()
  const data: Record<string, unknown> = {}

  for (const { key } of migratableKeys) {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        data[key] = JSON.parse(item)
      }
    } catch (error) {
      console.warn(`Error exporting migratable key "${key}":`, error)
    }
  }

  return data
}

// ============================================================================
// HOOK HELPER: useSyncStorage
// ============================================================================

/**
 * Hook para sincronizar un valor específico con otras tabs
 * Este es un ejemplo de cómo usar las utilerías en componentes
 */
export function createStorageSyncHook<K extends StorageKeys>(key: K) {
  return function useSync(initialValue: StorageDataMap[K]) {
    const [value, setValue] = useState<StorageDataMap[K]>(initialValue)
    const [isLoaded, setIsLoaded] = useState(false)

    // Cargar valor inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          setValue(JSON.parse(item))
        } catch {
          setValue(initialValue)
        }
      }
      setIsLoaded(true)
    }, [initialValue])

    // Suscribir a cambios de otras tabs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      return subscribeToStorageChanges((changedKey, newValue) => {
        if (changedKey === key) {
          setValue(newValue as StorageDataMap[K])
        }
      })
    }, [])

    // Función para actualizar
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateValue = useCallback((newValue: StorageDataMap[K] | ((prev: StorageDataMap[K]) => StorageDataMap[K])) => {
      setValue(prev => {
        const valueToStore = newValue instanceof Function ? newValue(prev) : newValue
        localStorage.setItem(key, JSON.stringify(valueToStore))
        return valueToStore
      })
    }, [])

    return { value, setValue: updateValue, isLoaded }
  }
}
