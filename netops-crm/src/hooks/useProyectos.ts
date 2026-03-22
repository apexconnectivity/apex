/**
 * Hook para gestionar proyectos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Proyecto, type EstadoProyecto } from '@/types/proyectos'

export function useProyectos() {
  const key = STORAGE_KEYS.proyectos
  const initialValue: Proyecto[] = []
  const [proyectos, setProyectos, isLoaded] = useLocalStorage<Proyecto[]>(key, initialValue)

  /**
   * Eliminar permanentemente un proyecto
   */
  const deleteProyecto = (id: string): void => {
    setProyectos(prev => prev.filter(p => p.id !== id))
  }

  /**
   * Archivar permanentemente un proyecto cerrado
   */
  const archiveProyecto = (id: string): void => {
    setProyectos(prev => prev.map(p => 
      p.id === id ? { ...p, estado: 'archivado' as EstadoProyecto } : p
    ))
  }

  return [proyectos, setProyectos, isLoaded, deleteProyecto, archiveProyecto] as const
}
