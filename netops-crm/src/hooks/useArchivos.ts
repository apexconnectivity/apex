/**
 * Hook para gestionar archivos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Archivo } from '@/types/archivos'

export function useArchivos() {
  const key = STORAGE_KEYS.archivos
  const initialValue: Archivo[] = []
  return useLocalStorage<Archivo[]>(key, initialValue)
}
