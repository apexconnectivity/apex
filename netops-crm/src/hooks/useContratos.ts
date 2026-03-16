/**
 * Hook para gestionar contratos de soporte en localStorage
 * No hay datos demo - los datos vienen del usuario
 */
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage'
import { type ContratoSoporte } from '@/types/soporte'

export function useContratos() {
  const key = STORAGE_KEYS.contratos
  const initialValue: ContratoSoporte[] = []
  return useLocalStorage<ContratoSoporte[]>(key, initialValue)
}
