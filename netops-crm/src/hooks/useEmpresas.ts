/**
 * Hook para gestionar empresas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Empresa } from '@/types/crm'

export function useEmpresas() {
  const key = 'apex_crm_datos'
  const initialValue: Empresa[] = []
  return useLocalStorage<Empresa[]>(key, initialValue)
}
