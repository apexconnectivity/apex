'use server'

import { revalidatePath } from 'next/cache'
import { type Empresa } from '@/types/crm'

// Validación server-side para empresa
function validateEmpresa(empresa: Partial<Empresa>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!empresa.nombre || empresa.nombre.trim().length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres')
  }
  
  if (!empresa.razon_social) {
    errors.push('La razón social es requerida')
  }
  
  // Validar email si existe (puede estar en diferentes campos según el contexto)
  const emailValue = (empresa as Record<string, unknown>).email
  if (emailValue && typeof emailValue === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    errors.push('Email inválido')
  }
  
  return { valid: errors.length === 0, errors }
}

// Server Action para crear empresa
export async function createEmpresa(empresa: Partial<Empresa>) {
  const validation = validateEmpresa(empresa)
  
  if (!validation.valid) {
    return { success: false, errors: validation.errors }
  }
  
  try {
    // TODO: Implementar guardado en Supabase cuando esté listo
    // Por ahora, return success para demostrar la estructura
    
    revalidatePath('/dashboard/crm')
    return { success: true, data: empresa }
  } catch (error) {
    console.error('Error creating empresa:', error)
    return { success: false, errors: ['Error al crear empresa'] }
  }
}

// Server Action para actualizar empresa
export async function updateEmpresa(id: string, empresa: Partial<Empresa>) {
  const validation = validateEmpresa(empresa)
  
  if (!validation.valid) {
    return { success: false, errors: validation.errors }
  }
  
  try {
    revalidatePath('/dashboard/crm')
    revalidatePath(`/dashboard/crm/${id}`)
    return { success: true, data: empresa }
  } catch (error) {
    console.error('Error updating empresa:', error)
    return { success: false, errors: ['Error al actualizar empresa'] }
  }
}

// Server Action para eliminar empresa
export async function deleteEmpresa(_id: string) {
  try {
    revalidatePath('/dashboard/crm')
    return { success: true }
  } catch (error) {
    console.error('Error deleting empresa:', error)
    return { success: false, errors: ['Error al eliminar empresa'] }
  }
}