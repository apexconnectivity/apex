/**
 * Hook para gestionar archivos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Archivo } from '@/types/archivos'

export function useArchivos() {
  const key = 'apex_archivos'
  const initialValue: Archivo[] = []
  return useLocalStorage<Archivo[]>(key, initialValue)
}
