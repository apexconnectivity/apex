/**
 * Hook para gestionar tickets de soporte en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type Ticket } from '@/types/soporte'

export function useTickets() {
  const key = 'apex_soporte_datos'
  const initialValue: Ticket[] = []
  return useLocalStorage<Ticket[]>(key, initialValue)
}
