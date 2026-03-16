/**
 * Hook para gestionar contratos de soporte en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { type ContratoSoporte } from '@/types/soporte'

export function useContratos() {
  const key = 'apex_contratos_soporte'
  const initialValue: ContratoSoporte[] = []
  return useLocalStorage<ContratoSoporte[]>(key, initialValue)
}
