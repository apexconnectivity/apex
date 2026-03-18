/**
 * Hook para gestionar empresas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Empresa } from '@/types/crm'

export function useEmpresas() {
  const key = STORAGE_KEYS.empresas
  const initialValue: Empresa[] = []
  const [empresas, setEmpresas, isLoaded] = useLocalStorage<Empresa[]>(key, initialValue)

  // Función wrapper con manejo de errores mejorado
  const setEmpresasWithLogging = (
    value: Empresa[] | ((prev: Empresa[]) => Empresa[])
  ): boolean => {
    try {
      // Verificar si es una función o un valor directo
      const newValue = typeof value === 'function'
        ? value(empresas)
        : value

      // Verificar que el valor sea válido antes de guardar
      if (!Array.isArray(newValue)) {
        console.error('[useEmpresas] Valor inválido: no es un array', newValue)
        return false
      }

      setEmpresas(value)
      return true
    } catch (error) {
      console.error('[useEmpresas] Error al guardar:', error)
      return false
    }
  }

  return [empresas, setEmpresasWithLogging, isLoaded] as const
}
