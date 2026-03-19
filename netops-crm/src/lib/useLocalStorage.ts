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
  initialValueRef.current = initialValue

  // ============================================
  // Efecto para cargar el valor inicial
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
  }, [key, initialValue])

  // ============================================
  // Función para actualizar el valor
  // ============================================
  const setValue = useCallback(
    (value: T | ((prev: T) => T)): void => {
      try {
        setStoredValue(prev => {
          // Permitir pasar una función para actualizar el valor anterior
          const valueToStore =
            value instanceof Function ? value(prev) : value

          // Persistir en localStorage solo si estamos en el navegador
          if (typeof window !== 'undefined') {
            try {
              window.localStorage.setItem(key, JSON.stringify(valueToStore))
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
