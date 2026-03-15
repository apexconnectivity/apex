'use client'

import { useLocalStorage } from '@/lib/useLocalStorage'
import type { Empresa, Contacto } from '@/types/crm'
import type { Proyecto } from '@/types/proyectos'
import type { Tarea } from '@/types/tareas'
import type { Ticket, ContratoSoporte } from '@/types/soporte'
import type { OrdenCompra, Proveedor } from '@/types/compras'
import type { Archivo } from '@/types/archivos'
import type { Reunion, SolicitudReunion } from '@/types/calendario'
import type { ProyectoArchivado, ConfigArchivado } from '@/types/archivado'

import {
  INITIAL_EMPRESAS,
  INITIAL_CONTACTOS,
  INITIAL_PROYECTOS,
  INITIAL_TAREAS,
  INITIAL_TICKETS,
  INITIAL_CONTRATOS,
  INITIAL_PROVEEDORES,
  INITIAL_ORDENES,
  INITIAL_ARCHIVOS,
  INITIAL_REUNIONES,
  INITIAL_SOLICITUDES,
  INITIAL_PROYECTOS_ARCHIVADOS,
  INITIAL_CONFIG_ARCHIVADO,
} from './initial-data'

// ============================================================================
// EMPRESAS
// ============================================================================
export function useEmpresas() {
  return useLocalStorage<Empresa[]>('apex_empresas', INITIAL_EMPRESAS)
}

// ============================================================================
// CONTACTOS
// ============================================================================
export function useContactos() {
  return useLocalStorage<Contacto[]>('apex_contactos', INITIAL_CONTACTOS)
}

// ============================================================================
// PROYECTOS
// ============================================================================
export function useProyectos() {
  return useLocalStorage<Proyecto[]>('apex_proyectos', INITIAL_PROYECTOS)
}

// ============================================================================
// TAREAS
// ============================================================================
export function useTareas() {
  return useLocalStorage<Tarea[]>('apex_tareas', INITIAL_TAREAS)
}

// ============================================================================
// TICKETS
// ============================================================================
export function useTickets() {
  return useLocalStorage<Ticket[]>('apex_tickets', INITIAL_TICKETS)
}

// ============================================================================
// CONTRATOS DE SOPORTE
// ============================================================================
export function useContratos() {
  return useLocalStorage<ContratoSoporte[]>('apex_contratos', INITIAL_CONTRATOS)
}

// ============================================================================
// PROVEEDORES
// ============================================================================
export function useProveedores() {
  return useLocalStorage<Proveedor[]>('apex_proveedores', INITIAL_PROVEEDORES)
}

// ============================================================================
// ÓRDENES DE COMPRA
// ============================================================================
export function useOrdenes() {
  return useLocalStorage<OrdenCompra[]>('apex_ordenes', INITIAL_ORDENES)
}

// ============================================================================
// ARCHIVOS
// ============================================================================
export function useArchivos() {
  return useLocalStorage<Archivo[]>('apex_archivos', INITIAL_ARCHIVOS)
}

// ============================================================================
// REUNIONES
// ============================================================================
export function useReuniones() {
  return useLocalStorage<Reunion[]>('apex_reuniones', INITIAL_REUNIONES)
}

// ============================================================================
// SOLICITUDES DE REUNIÓN
// ============================================================================
export function useSolicitudesReunion() {
  return useLocalStorage<SolicitudReunion[]>('apex_solicitudes_reunion', INITIAL_SOLICITUDES)
}

// ============================================================================
// PROYECTOS ARCHIVADOS
// ============================================================================
export function useProyectosArchivados() {
  return useLocalStorage<ProyectoArchivado[]>('apex_proyectos_archivados', INITIAL_PROYECTOS_ARCHIVADOS)
}

// ============================================================================
// CONFIGURACIÓN DE ARCHIVADO
// ============================================================================
export function useConfigArchivado() {
  return useLocalStorage<ConfigArchivado>('apex_config_archivado', INITIAL_CONFIG_ARCHIVADO)
}

// ============================================================================
// HELPER: Obtener empresas por tipo
// ============================================================================
export function useEmpresasPorTipo(tipo: 'cliente' | 'proveedor' | 'ambos') {
  const [empresas] = useEmpresas()
  return empresas.filter(e => e.tipo_entidad === tipo || e.tipo_entidad === 'ambos')
}

// ============================================================================
// HELPER: Obtener contactos por empresa
// ============================================================================
export function useContactosPorEmpresa(empresaId: string) {
  const [contactos] = useContactos()
  return contactos.filter(c => c.empresa_id === empresaId)
}

// ============================================================================
// HELPER: Obtener proyectos por empresa
// ============================================================================
export function useProyectosPorEmpresa(empresaId: string) {
  const [proyectos] = useProyectos()
  return proyectos.filter(p => p.empresa_id === empresaId && p.estado === 'activo')
}

// ============================================================================
// HELPER: Obtener proyectos activos
// ============================================================================
export function useProyectosActivos() {
  const [proyectos] = useProyectos()
  return proyectos.filter(p => p.estado === 'activo')
}

// ============================================================================
// HELPER: Obtener proyectos cerrados
// ============================================================================
export function useProyectosCerrados() {
  const [proyectos] = useProyectos()
  return proyectos.filter(p => p.estado === 'cerrado')
}

// ============================================================================
// HELPER: Obtener tareas por proyecto
// ============================================================================
export function useTareasPorProyecto(proyectoId: string) {
  const [tareas] = useTareas()
  return tareas.filter(t => t.proyecto_id === proyectoId)
}

// ============================================================================
// HELPER: Obtener tickets por empresa
// ============================================================================
export function useTicketsPorEmpresa(empresaId: string) {
  const [tickets] = useTickets()
  return tickets.filter(t => t.empresa_id === empresaId)
}

// ============================================================================
// HELPER: Obtener contratos por empresa
// ============================================================================
export function useContratosPorEmpresa(empresaId: string) {
  const [contratos] = useContratos()
  return contratos.filter(c => c.empresa_id === empresaId)
}

// ============================================================================
// HELPER: Obtener archivos por entidad
// ============================================================================
export function useArchivosPorEntidad(entidadTipo: 'empresa' | 'proyecto' | 'ticket' | 'tarea', entidadId: string) {
  const [archivos] = useArchivos()
  return archivos.filter(a => a.entidad_tipo === entidadTipo && a.entidad_id === entidadId)
}

// ============================================================================
// HELPER: Obtener reuniones por proyecto
// ============================================================================
export function useReunionesPorProyecto(proyectoId: string) {
  const [reuniones] = useReuniones()
  return reuniones.filter(r => r.proyecto_id === proyectoId)
}
