/**
 * Hook para gestionar comentarios de tareas en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Comentario } from '@/types/tareas'

export function useComentarios() {
  const key = 'apex_tareas_comentarios'
  const initialValue: Record<string, Comentario[]> = {}
  return useLocalStorage<Record<string, Comentario[]>>(key, initialValue)
}
