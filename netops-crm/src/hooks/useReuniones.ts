/**
 * Hook para gestionar reuniones en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Reunion } from '@/types/calendario'

export function useReuniones() {
  const key = 'apex_calendario_datos'
  const initialValue: Reunion[] = []
  return useLocalStorage<Reunion[]>(key, initialValue)
}
