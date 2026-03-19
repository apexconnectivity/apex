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
  // Estado para almacenar el valor con inicialización perezosa (lazy)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item) as T
        // prevValueRef.current will be set below, but we can set it here too for consistency
        // with the initial read.
        // However, prevValueRef is a ref, so it's not available yet at this point of declaration.
        // It will be initialized after this useState call.
        // For now, we'll rely on the explicit initialization below.
        return parsed ?? initialValue
      }
      return initialValue
    } catch (error) {
      console.error(`[useLocalStorage] Error reading key "${key}":`, error)
      return initialValue
    }
  })

  // Estado para indicar si ya se cargó (útil para SSR)
  const [isLoaded, setIsLoaded] = useState(false)

  // Ref para guardar el valor anterior y evitar actualizaciones innecesarias
  const prevValueRef = useRef<string | null>(null)
  // Initialize prevValueRef based on the initial read
  if (typeof window !== 'undefined' && !prevValueRef.current) {
    prevValueRef.current = window.localStorage.getItem(key)
  }

  // Ref para indicar que ESTA instancia está escribiendo
  const isWritingRef = useRef(false)

  // ============================================
  // Efectos de sincronización y carga inicial (SSR support)
  // ============================================
  useEffect(() => {
    setIsLoaded(true)
    
    if (typeof window === 'undefined') return

    const handleCustomSync = (event: CustomEvent<{ key: string; value: string }>) => {
      if (event.detail.key === key && !isWritingRef.current) {
        try {
          const parsed = JSON.parse(event.detail.value) as T
          // Usar setTimeout para evitar el error "Cannot update a component while rendering a different component"
          // cuando varias instancias del hook reaccionan al mismo evento.
          setTimeout(() => {
            setStoredValue(parsed)
            prevValueRef.current = event.detail.value
          }, 0)
        } catch {
          // Ignorar errores de parseo
        }
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as T
          setTimeout(() => {
            setStoredValue(parsed)
            prevValueRef.current = event.newValue
          }, 0)
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
