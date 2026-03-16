/**
 * Hook para gestionar proyectos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Proyecto } from '@/types/proyectos'

export function useProyectos() {
  const key = STORAGE_KEYS.proyectos
  const initialValue: Proyecto[] = []
  return useLocalStorage<Proyecto[]>(key, initialValue)
}
