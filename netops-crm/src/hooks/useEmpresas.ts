/**
 * Hook para gestionar empresas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useCallback } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Empresa } from '@/types/crm'

export function useEmpresas() {
  const key = STORAGE_KEYS.empresas
  const initialValue: Empresa[] = []
  const [empresas, setEmpresas, isLoaded] = useLocalStorage<Empresa[]>(key, initialValue)

  // Función wrapper con manejo de errores mejorado
  const setEmpresasWithLogging = useCallback((
    value: Empresa[] | ((prev: Empresa[]) => Empresa[])
  ): void => {
    try {
      setEmpresas(prev => {
        // Verificar si es una función o un valor directo usando el prev fresco
        const newValue = typeof value === 'function' ? value(prev) : value

        // Verificar que el valor sea válido antes de guardar
        if (!Array.isArray(newValue)) {
          console.error('[useEmpresas] Valor inválido: no es un array', newValue)
          return prev
        }
        
        return newValue
      })
    } catch (error) {
      console.error('[useEmpresas] Error al guardar:', error)
    }
  }, [setEmpresas])

  return [empresas, setEmpresasWithLogging, isLoaded] as const
}

