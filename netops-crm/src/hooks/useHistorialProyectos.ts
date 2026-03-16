/**
 * Hook para gestionar historial de proyectos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type HistorialProyecto } from '@/types/proyectos'

export function useHistorialProyectos() {
  const key = STORAGE_KEYS.historialProyectos
  const initialValue: Record<string, HistorialProyecto[]> = {}
  return useLocalStorage<Record<string, HistorialProyecto[]>>(key, initialValue)
}
