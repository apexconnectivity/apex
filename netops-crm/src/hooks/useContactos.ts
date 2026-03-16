/**
 * Hook para gestionar contactos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Contacto } from '@/types/crm'

export function useContactos() {
  const key = 'apex_crm_contactos'
  const initialValue: Contacto[] = []
  return useLocalStorage<Contacto[]>(key, initialValue)
}
