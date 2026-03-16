/**
 * Hook para gestionar proyectos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Proyecto } from '@/types/proyectos'

export function useProyectos() {
  const key = 'apex_proyectos_datos'
  const initialValue: Proyecto[] = []
  return useLocalStorage<Proyecto[]>(key, initialValue)
}
