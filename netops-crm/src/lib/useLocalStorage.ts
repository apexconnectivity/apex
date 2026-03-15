'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personalizado para gestionar datos en localStorage
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

  // Función para obtener el valor inicial desde localStorage
  const getInitialValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  // Efecto para cargar el valor inicial
  useEffect(() => {
    const value = getInitialValue()
    setStoredValue(value)
    setIsLoaded(true)
  }, [getInitialValue])

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: T | ((prev: T) => T)): void => {
      try {
        // Permitir pasar una función para actualizar el valor anterior
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        // Actualizar el estado
        setStoredValue(valueToStore)

        // Persistir en localStorage solo si estamos en el navegador
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue, isLoaded] as const
}
