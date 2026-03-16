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
  return useLocalStorage<Empresa[]>(key, initialValue)
}
