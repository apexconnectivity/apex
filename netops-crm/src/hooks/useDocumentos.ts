/**
 * Hook para gestionar documentos CRM en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Archivo } from '@/types/archivos'

export function useDocumentos() {
  const key = 'apex_crm_documentos'
  const initialValue: Archivo[] = []
  return useLocalStorage<Archivo[]>(key, initialValue)
}
