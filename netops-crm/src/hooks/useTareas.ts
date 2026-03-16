/**
 * Hook para gestionar tareas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Tarea } from '@/types/tareas'

export function useTareas() {
  const key = 'apex_tareas_datos'
  const initialValue: Tarea[] = []
  return useLocalStorage<Tarea[]>(key, initialValue)
}
