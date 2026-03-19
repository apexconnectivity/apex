'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook para gestionar datos en localStorage
 * 
 * @param key - Clave única para almacenar en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns Tupla con: [valor actual, función para actualizar, estado de carga]
 * 
 * @example
 * ```typescript
 * const [theme, setTheme, isLoaded] = useLocalStorage('theme', 'dark')
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  // Estado para indicar si ya se cargó desde localStorage
  const [isLoaded, setIsLoaded] = useState(false)

  // Usar ref para mantener el valor inicial sin causar re-renders
  const initialValueRef = useRef(initialValue)
  
  // Ref para guardar el valor anterior y evitar actualizaciones innecesarias
  const prevValueRef = useRef<string | null>(null)

  // Ref para indicar que ESTA instancia está escribiendo, y así ignorar
  // el evento de sincronización que ella misma dispara
  const isWritingRef = useRef(false)

  // ============================================
  // Efecto para escuchar cambios de OTRAS tabs (StorageEvent)
  // y de OTRAS instancias del hook en la misma tab (CustomEvent)
  // ============================================
  useEffect(() => {
    if (typeof window === 'undefined') return

    // StorageEvent solo se dispara desde OTRAS tabs, así que no hay riesgo
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as T
          setStoredValue(parsed)
          prevValueRef.current = event.newValue
        } catch {
          // Ignorar errores de parseo
        }
      }
    }

    // CustomEvent se dispara dentro de la misma tab.
    // Solo reaccionar si NO fue esta instancia la que lo disparó.
    const handleCustomSync = (event: CustomEvent<{ key: string; value: string }>) => {
      if (event.detail.key === key && !isWritingRef.current) {
        try {
          const parsed = JSON.parse(event.detail.value) as T
          setStoredValue(parsed)
          prevValueRef.current = event.detail.value
        } catch {
          // Ignorar errores de parseo
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage-sync', handleCustomSync as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage-sync', handleCustomSync as EventListener)
    }
  }, [key])

  // ============================================
  // Efecto para cargar el valor inicial - solo se ejecuta una vez por key
  // ============================================
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true)
      return
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        try {
          const parsed = JSON.parse(item) as T
          prevValueRef.current = item

          if (parsed !== null && parsed !== undefined) {
            setStoredValue(parsed)
          } else {
            setStoredValue(initialValueRef.current)
          }
        } catch {
          window.localStorage.removeItem(key)
          setStoredValue(initialValueRef.current)
        }
      } else {
        setStoredValue(initialValueRef.current)
      }
    } catch {
      setStoredValue(initialValueRef.current)
    } finally {
      setIsLoaded(true)
    }
  }, [key])

  // ============================================
  // Función para actualizar el valor
  // ============================================
  const setValue = useCallback(
    (value: T | ((prev: T) => T)): void => {
      try {
        setStoredValue(prev => {
          const valueToStore = value instanceof Function ? value(prev) : value

          if (typeof window !== 'undefined') {
            try {
              const newValueStr = JSON.stringify(valueToStore)
              if (newValueStr !== prevValueRef.current) {
                window.localStorage.setItem(key, newValueStr)
                prevValueRef.current = newValueStr
                
                // Marcar que ESTA instancia está escribiendo para que
                // su propio listener ignore el evento
                isWritingRef.current = true
                window.dispatchEvent(
                  new CustomEvent('local-storage-sync', {
                    detail: { key, value: newValueStr }
                  })
                )
                isWritingRef.current = false
              }
            } catch (storageError) {
              console.error(`[useLocalStorage] Error saving to localStorage:`, storageError)
            }
          }

          return valueToStore
        })
      } catch (error) {
        console.error(`[useLocalStorage] Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  return [storedValue, setValue, isLoaded] as const
}
