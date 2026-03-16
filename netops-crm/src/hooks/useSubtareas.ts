/**
 * Hook para gestionar subtareas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Subtarea } from '@/types/tareas'

export function useSubtareas() {
  const key = STORAGE_KEYS.subtareas
  const initialValue: Record<string, Subtarea[]> = {}
  return useLocalStorage<Record<string, Subtarea[]>>(key, initialValue)
}
