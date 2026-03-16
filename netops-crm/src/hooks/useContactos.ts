/**
 * Hook para gestionar contactos en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Contacto } from '@/types/crm'

export function useContactos() {
  const key = STORAGE_KEYS.contactos
  const initialValue: Contacto[] = []
  return useLocalStorage<Contacto[]>(key, initialValue)
}
