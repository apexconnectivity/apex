/**
 * Hook para gestionar tareas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Tarea } from '@/types/tareas'

export function useTareas() {
  const key = STORAGE_KEYS.tareas
  const initialValue: Tarea[] = []
  return useLocalStorage<Tarea[]>(key, initialValue)
}
