/**
 * Hook para gestionar reuniones en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Reunion } from '@/types/calendario'

export function useReuniones() {
  const key = STORAGE_KEYS.reuniones
  const initialValue: Reunion[] = []
  return useLocalStorage<Reunion[]>(key, initialValue)
}
