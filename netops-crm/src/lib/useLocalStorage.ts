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
  
  // Ref para evitar actualizaciones en cadena
  const isUpdatingRef = useRef(false)
  
  // Ref para guardar el valor anterior y evitar actualizaciones innecesarias
  const prevValueRef = useRef<string | null>(null)

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

          // Validar que los datos parseados sean válidos
          if (parsed === null || parsed === undefined) {
            setStoredValue(initialValueRef.current)
          } else if (Array.isArray(parsed) || typeof parsed === 'object') {
            setStoredValue(parsed)
          } else {
            setStoredValue(initialValueRef.current)
          }
        } catch {
          // Limpiar datos corruptos
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
      // Evitar actualizaciones si ya estamos en medio de una actualización
      if (isUpdatingRef.current) return
      
      isUpdatingRef.current = true
      
      try {
        setStoredValue(prev => {
          // Permitir pasar una función para actualizar el valor anterior
          const valueToStore =
            value instanceof Function ? value(prev) : value

          // Persistir en localStorage solo si estamos en el navegador
          if (typeof window !== 'undefined') {
            try {
              // Solo guardar si el valor realmente cambió
              const newValueStr = JSON.stringify(valueToStore)
              if (newValueStr !== prevValueRef.current) {
                window.localStorage.setItem(key, newValueStr)
                prevValueRef.current = newValueStr
              }
            } catch (storageError) {
              console.error(`[useLocalStorage] Error saving to localStorage:`, storageError)
            }
          }

          return valueToStore
        })
      } catch (error) {
        console.error(`[useLocalStorage] Error setting localStorage key "${key}":`, error)
      } finally {
        // Resetear el flag en el siguiente tick para permitir nuevas actualizaciones
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 0)
      }
    },
    [key]
  )

  return [storedValue, setValue, isLoaded] as const
}
