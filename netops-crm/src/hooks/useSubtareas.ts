/**
 * Hook para gestionar subtareas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Subtarea } from '@/types/tareas'

export function useSubtareas() {
  const key = 'apex_tareas_subtareas'
  const initialValue: Record<string, Subtarea[]> = {}
  return useLocalStorage<Record<string, Subtarea[]>>(key, initialValue)
}
