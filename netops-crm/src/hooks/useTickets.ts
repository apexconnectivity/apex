/**
 * Hook para gestionar tickets de soporte en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type Ticket } from '@/types/soporte'

export function useTickets() {
  const key = STORAGE_KEYS.tickets
  const initialValue: Ticket[] = []
  return useLocalStorage<Ticket[]>(key, initialValue)
}
