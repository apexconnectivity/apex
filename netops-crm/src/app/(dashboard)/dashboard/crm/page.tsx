"use client"

import { Suspense, useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { useAuth } from '@/contexts/auth-context'
import { type User } from '@/types/auth'
import { useEmpresas, useContactos, useProyectos, useTareas, useDocumentos } from '@/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { UploadDocumentModal } from '@/components/module/UploadDocumentModal'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/ui/filter-bar'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { EmpresaCard } from '@/components/module/EmpresaCard'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { StaggeredList } from '@/components/ui/page-animation'
import { STATUS_COLORS, CRM_STATS_COLORS } from '@/lib/colors'
import dynamic from 'next/dynamic'

// Lazy loading para modales grandes
const CreateEmpresaModal = dynamic(
  () => import('@/components/module/CreateEmpresaModal').then(mod => ({ default: mod.CreateEmpresaModal })),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const ManageContactsModal = dynamic(
  () => import('@/components/module/ManageContactsModal').then(mod => ({ default: mod.ManageContactsModal })),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const EmpresaDetailModal = dynamic(
  () => import('@/components/module/EmpresaDetailModal').then(mod => ({ default: mod.EmpresaDetailModal })),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
import {
  Building2,
  Plus,
  Users,
  AlertCircle,
  Bell,
  AlertTriangle,
  Clock
} from 'lucide-react'
import {
  Empresa,
  Contacto,
  Documento,
  TipoEntidad,
  INDUSTRIAS,
} from '@/types/crm'
import { type Archivo } from '@/types/archivos'
import { Proyecto } from '@/types/proyectos'

// Importar constantes
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  BUTTON_LABELS,
  ALERT_LABELS,
  ACCESS_MESSAGES,
  DIAS_INACTIVIDAD_PROSPECTO,
  EMPRESAS_ASIGNADAS_TECNICO,
} from '@/constants/crm'
import { STORAGE_KEYS } from '@/constants/storage'
import { MS_PER_DAY } from '@/constants/timing'

// ============================================
// MAGIC NUMBERS - Constantes de negocio
// ============================================
const EMPRESAS_VACIA: Partial<Empresa> = {
  nombre: '',
  tipo_entidad: 'cliente',
  industria: undefined,
  telefono_principal: '',
}


export default function CRMPage() {
  return (
    <Suspense fallback={<CRMLoading />}>
      <CRMPageContent />
    </Suspense>
  )
}

function CRMLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  )
}

function CRMPageContent() {
  const { user } = useAuth()

  // Hooks individuales para cada tipo de dato
  const [empresas, setEmpresas] = useEmpresas()
  const [contactos, setContactos] = useContactos()
  const [documentos, setDocumentos] = useDocumentos()
  const [proyectos, setProyectos] = useProyectos()
  useTareas()

  // Usuarios
  const [usuarios] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])

  // ============================================
  // ESTADOS DE BÚSQUEDA Y FILTROS (agrupados)
  // ============================================
  const [searchState, setSearchState] = useState({
    query: '',
    tipo: 'todos' as TipoEntidad | 'todos',
    industria: 'todas'
  })

  const searchQuery = searchState.query
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const tipoFilter = searchState.tipo
  const industriaFilter = searchState.industria

  // ============================================
  // ESTADOS DE MODALES Y UI (agrupados)
  // ============================================
  const [uiState, setUiState] = useState({
    selectedEmpresa: null as Empresa | null,
    isModalEmpresa: false,
    isModalContacto: false,
    isModalDocumento: false,
    isModalNewProject: false,
    editingEmpresa: null as Partial<Empresa> | null,

    empresaForContacto: null as Empresa | null,
    empresaForDocumento: null as Empresa | null,
    notaEditando: false,
    empresaToDelete: null as string | null,
  })

  const {
    selectedEmpresa,
    isModalEmpresa,
    isModalContacto,
    isModalDocumento,
    isModalNewProject,
    editingEmpresa,
    empresaForContacto,
    empresaForDocumento,
    notaEditando,
    empresaToDelete,
  } = uiState

  // Setters agrupados para UI
  const setSelectedEmpresa = useCallback((empresa: Empresa | null) => {
    setUiState(prev => ({ ...prev, selectedEmpresa: empresa }))
  }, [])

  const setIsModalEmpresa = useCallback((open: boolean) => {
    setUiState(prev => ({ ...prev, isModalEmpresa: open, editingEmpresa: open ? prev.editingEmpresa : null }))
  }, [])

  const setIsModalContacto = useCallback((open: boolean) => {
    setUiState(prev => ({ ...prev, isModalContacto: open }))
  }, [])

  const setIsModalDocumento = useCallback((open: boolean) => {
    setUiState(prev => ({ ...prev, isModalDocumento: open, empresaForDocumento: open ? prev.empresaForDocumento : null }))
  }, [])

  const setIsModalNewProject = useCallback((open: boolean) => {
    setUiState(prev => ({ ...prev, isModalNewProject: open }))
  }, [])

  const setEditingEmpresa = useCallback((empresa: Partial<Empresa> | null) => {
    setUiState(prev => ({ ...prev, editingEmpresa: empresa }))
  }, [])


  const setEmpresaForContacto = useCallback((empresa: Empresa | null) => {
    setUiState(prev => ({ ...prev, empresaForContacto: empresa }))
  }, [])

  const setEmpresaForDocumento = useCallback((empresa: Empresa | null) => {
    setUiState(prev => ({ ...prev, empresaForDocumento: empresa }))
  }, [])

  const setNotaEditando = useCallback((editando: boolean) => {
    setUiState(prev => ({ ...prev, notaEditando: editando }))
  }, [])

  const setEmpresaToDelete = useCallback((id: string | null) => {
    setUiState(prev => ({ ...prev, empresaToDelete: id }))
  }, [])

  // Estado de nota temporal
  const [notaTemporal, setNotaTemporal] = useState('')

  // Estado de documento nuevo
  const [newDocumento, setNewDocumento] = useState<{ visibilidad: 'interno' | 'publico', descripcion: string, nombreArchivo: string }>({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })

  // Estados de guardado
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handler para actualizar filtros
  const handleFilterChange = useCallback((key: string, value: string) => {
    // Actualización inmediata del input
    setSearchState(prev => {
      if (key === 'tipo') return { ...prev, tipo: value as TipoEntidad | 'todos' }
      if (key === 'industria') return { ...prev, industria: value }
      if (key === 'query') return { ...prev, query: value }
      return prev
    })
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchState({ query: '', tipo: 'todos', industria: 'todas' })
  }, [])

  // Handlers para modales que actualizan múltiples estados
  const handleNewEmpresa = useCallback(() => {
    setEditingEmpresa({ ...EMPRESAS_VACIA })
    setErrors({})
    setSelectedEmpresa(null)
    setIsModalEmpresa(true)
  }, [setEditingEmpresa, setErrors, setSelectedEmpresa, setIsModalEmpresa])

  const handleEditEmpresa = useCallback((empresa: Empresa) => {
    setEditingEmpresa({ ...empresa })
    setErrors({})
    setSelectedEmpresa(null)
    setIsModalEmpresa(true)
  }, [setEditingEmpresa, setErrors, setSelectedEmpresa, setIsModalEmpresa])

  const handleNewContacto = useCallback((empresa: Empresa) => {
    setEmpresaForContacto(empresa)
    setErrors({})
    setSelectedEmpresa(null)
    setIsModalContacto(true)
  }, [setEmpresaForContacto, setErrors, setSelectedEmpresa, setIsModalContacto])

  const handleEditContacto = useCallback((contacto: Contacto) => {
    const empresa = empresas.find(e => e.id === contacto.empresa_id) || null
    setEmpresaForContacto(empresa)
    setErrors({})
    setIsModalContacto(true)
  }, [empresas, setEmpresaForContacto, setErrors, setIsModalContacto])

  // Verificar disponibilidad de localStorage al inicio
  useEffect(() => {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
    } catch {
      setErrors({
        general: 'Tu navegador no permite guardar datos en localStorage. Esto puede ser porque estás usando el modo privado o has deshabilitado las cookies. Los datos no se persistirán entre sesiones.'
      })
    }
  }, [])

  // Permisos computados
  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const isMarketing = user?.roles.includes('marketing')
  const isTecnico = user?.roles.includes('especialista')

  const canViewClientes = isAdmin || isComercial || isFacturacion || isMarketing || isTecnico
  const canViewProveedores = isAdmin || isCompras || isFacturacion || isMarketing
  const canEdit = isAdmin || isComercial || isCompras
  const canUploadDocuments = isAdmin || isComercial || isCompras

  // ============================================
  // MEMOIZACIÓN: Filtrado de empresas
  // ============================================
  const filteredEmpresas = useMemo(() => {
    // IDs de empresas asignadas al técnico (usando constante centralizada)
    const empresasAsignadasTecnico = isTecnico ? [...EMPRESAS_ASIGNADAS_TECNICO] : []

    return empresas.filter(e => {
      // Restricción de técnicos: solo ven clientes de proyectos asignados
      if (isTecnico && e.tipo_entidad === 'cliente') {
        if (!empresasAsignadasTecnico.includes(e.id)) return false
      }

      if (!canViewClientes && e.tipo_entidad === 'cliente') return false
      if (!canViewProveedores && (e.tipo_entidad === 'proveedor' || e.tipo_entidad === 'ambos')) return false

      // Filtrado con valor diferido para mantener input responsivo
      if (deferredSearchQuery) {
        const q = deferredSearchQuery.toLowerCase()
        if (!e.nombre.toLowerCase().includes(q) &&
          !e.sitio_web?.toLowerCase().includes(q) &&
          !e.ciudad?.toLowerCase().includes(q)) return false
      }
      if (tipoFilter !== 'todos' && e.tipo_entidad !== tipoFilter) return false
      if (industriaFilter !== 'todas' && e.industria !== industriaFilter) return false
      return true
    })
  }, [empresas, isTecnico, canViewClientes, canViewProveedores, deferredSearchQuery, tipoFilter, industriaFilter])

  // ============================================
  // MEMOIZACIÓN: Índices para getters rápidos
  // ============================================
  const contactosByEmpresa = useMemo(() => {
    const map = new Map<string, Contacto[]>()
    contactos.forEach(c => {
      const existing = map.get(c.empresa_id) || []
      map.set(c.empresa_id, [...existing, c])
    })
    return map
  }, [contactos])

  const _documentosByEmpresa = useMemo(() => {
    const map = new Map<string, (Documento | Archivo)[]>()
    documentos.forEach(d => {
      if (d.entidad_tipo === 'empresa') {
        const existing = map.get(d.entidad_id) || []
        map.set(d.entidad_id, [...existing, d])
      }
    })
    return map
  }, [documentos])

  const proyectosByEmpresa = useMemo(() => {
    const map = new Map<string, Proyecto[]>()
    proyectos.forEach(p => {
      const existing = map.get(p.empresa_id) || []
      map.set(p.empresa_id, [...existing, p])
    })
    return map
  }, [proyectos])

  // ============================================
  // MEMOIZACIÓN: Getters memoizados
  // ============================================
  const getContactos = useCallback((empresaId: string) => {
    return contactosByEmpresa.get(empresaId) || []
  }, [contactosByEmpresa])

  const getProyectos = useCallback((empresaId: string) => {
    return proyectosByEmpresa.get(empresaId) || []
  }, [proyectosByEmpresa])

  // ============================================
  // MEMOIZACIÓN: Estadísticas
  // ============================================
  const empresaStats = useMemo(() => {
    // Optimizado: una sola iteración para contar clientes y proveedores
    let clientesCount = 0
    let proveedoresCount = 0
    for (const e of empresas) {
      if (e.tipo_entidad === 'cliente') clientesCount++
      else if (e.tipo_entidad === 'proveedor') proveedoresCount++
    }
    return {
      total: empresas.length,
      clientes: clientesCount,
      proveedores: proveedoresCount,
      contactosTotal: contactos.length,
    }
  }, [empresas, contactos])

  // ============================================
  // MEMOIZACIÓN: Alertas
  // ============================================
  const alertas = useMemo(() => {
    const resultado: { id: string, tipo: 'warning' | 'danger', titulo: string, mensaje: string, empresaId?: string }[] = []

    empresas.forEach(e => {
      const contactosEmpresa = getContactos(e.id)

      // Alerta: Sin contacto principal
      if (contactosEmpresa.length > 0 && !contactosEmpresa.some(c => c.es_principal)) {
        resultado.push({
          id: `sin-principal-${e.id}`,
          tipo: 'warning' as const,
          titulo: ALERT_LABELS.sinContactoPrincipal,
          mensaje: `${e.nombre} ${ALERT_LABELS.sinContactoPrincipalMsg}`,
          empresaId: e.id
        })
      }

      // Alerta: Prospecto inactivo > DIAS_INACTIVIDAD_PROSPECTO días
      if ((e.tipo_entidad === 'cliente' || e.tipo_entidad === 'ambos') && e.tipo_relacion === 'Prospecto') {
        const fechaCreacion = new Date(e.creado_en)
        const hoy = new Date()
        const diasInactivo = Math.floor((hoy.getTime() - fechaCreacion.getTime()) / MS_PER_DAY)
        if (diasInactivo > DIAS_INACTIVIDAD_PROSPECTO) {
          resultado.push({
            id: `inactivo-${e.id}`,
            tipo: 'danger' as const,
            titulo: ALERT_LABELS.prospectoInactivo,
            mensaje: `${e.nombre} ${ALERT_LABELS.prospectoInactivoMsg} ${diasInactivo} ${ALERT_LABELS.dias}.`,
            empresaId: e.id
          })
        }
      }

      // Alerta: Proveedor sin contacto
      if (e.tipo_entidad === 'proveedor' && contactosEmpresa.length === 0) {
        resultado.push({
          id: `sin-contacto-prov-${e.id}`,
          tipo: 'warning' as const,
          titulo: ALERT_LABELS.proveedorSinContactos,
          mensaje: `${e.nombre} ${ALERT_LABELS.proveedorSinContactosMsg}`,
          empresaId: e.id
        })
      }
    })

    return resultado
  }, [empresas, getContactos])

  // ============================================
  // HANDLERS DE ACCIONES
  // ============================================

  const handleDeleteEmpresa = useCallback((id: string) => {
    setEmpresaToDelete(id)
  }, [setEmpresaToDelete])

  const confirmDeleteEmpresa = useCallback(() => {
    if (empresaToDelete) {
      setEmpresas(prev => prev.filter(e => e.id !== empresaToDelete))
      setContactos(prev => prev.filter(c => c.empresa_id !== empresaToDelete))
      setSelectedEmpresa(null)
      setEmpresaToDelete(null)
    }
  }, [empresaToDelete, setEmpresas, setContactos, setSelectedEmpresa, setEmpresaToDelete])

  const handleSaveEmpresa = useCallback(async (empresa: Partial<Empresa>, isNew: boolean) => {
    setErrors({})

    // Validación de duplicados
    const newErrors: Record<string, string> = {}

    const nombre = (empresa.nombre || '').trim().toLowerCase()
    if (empresas.some(e => e.id !== empresa.id && e.nombre?.trim().toLowerCase() === nombre)) {
      newErrors.nombre = 'Ya existe una empresa con este nombre'
    }

    const rfc = (empresa.rfc || '').trim().toUpperCase()
    if (rfc && empresas.some(e => e.id !== empresa.id && e.rfc?.trim().toUpperCase() === rfc)) {
      newErrors.rfc = 'Ya existe una empresa con este RFC'
    }

    const razonSocial = (empresa.razon_social || '').trim().toLowerCase()
    if (razonSocial && empresas.some(e => e.id !== empresa.id && e.razon_social?.trim().toLowerCase() === razonSocial)) {
      newErrors.razon_social = 'Ya existe una empresa con esta razón social'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      throw new Error('Validación de duplicados fallida')
    }

    setIsSaving(true)

    try {
      await new Promise(r => setTimeout(r, 500))
      const now = new Date().toISOString().split('T')[0]

      if (!isNew) {
        setEmpresas(prev => prev.map(e =>
          e.id === empresa.id ? { ...e, ...empresa } as Empresa : e
        ))
      } else {
        const id = crypto.randomUUID()
        const newEmpresa = {
          ...empresa,
          id,
          creado_en: now
        } as Empresa

        setEmpresas(prev => [...prev, newEmpresa])
      }

      setEditingEmpresa(null)
      setIsModalEmpresa(false)
      console.log('[CRM] Empresa guardada correctamente')
    } catch (error) {
      console.error('[CRM] Error al guardar empresa:', error)
      setErrors({ general: 'Error al guardar la empresa. Intenta de nuevo.' })
    } finally {
      setIsSaving(false)
    }
  }, [empresas, setEmpresas, setEditingEmpresa, setIsModalEmpresa, setErrors])

  const handleDeleteContacto = useCallback((id: string) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      setContactos(prev => prev.filter(c => c.id !== id))
    }
  }, [setContactos])

  const handleUploadDocumento = useCallback(async (
    empresaId: string,
    visibilidad: 'interno' | 'publico',
    descripcion: string,
    nombreArchivo: string
  ) => {
    try {
      await new Promise(r => setTimeout(r, 500))
      const nuevoDoc = {
        id: crypto.randomUUID(),
        empresa_id: empresaId,
        archivo_id: `arch_${crypto.randomUUID()}`,
        visibilidad,
        descripcion,
        subido_por: user?.nombre || 'Usuario',
        fecha_subida: new Date().toISOString().split('T')[0],
        nombre_archivo: nombreArchivo
      } as unknown as Archivo
      setDocumentos(prev => [...prev, nuevoDoc])
    } catch (error) {
      console.error('[CRM] Error al subir documento:', error)
    }
  }, [user?.nombre, setDocumentos])

  const handleDeleteDocumento = useCallback((id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      setDocumentos(prev => prev.filter(d => d.id !== id))
    }
  }, [setDocumentos])

  const handleNewDocumento = useCallback((empresa: Empresa) => {
    setEmpresaForDocumento(empresa)
    setNewDocumento({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })
    setSelectedEmpresa(null)
    setIsModalDocumento(true)
  }, [setEmpresaForDocumento, setNewDocumento, setSelectedEmpresa, setIsModalDocumento])

  const handleSaveDocumento = useCallback(async () => {
    if (!empresaForDocumento || !newDocumento.descripcion.trim() || !newDocumento.nombreArchivo.trim()) {
      return
    }
    try {
      await handleUploadDocumento(empresaForDocumento.id, newDocumento.visibilidad, newDocumento.descripcion, newDocumento.nombreArchivo)
      setIsModalDocumento(false)
      setEmpresaForDocumento(null)
      setNewDocumento({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })
    } catch (error) {
      console.error('[CRM] Error al guardar documento:', error)
    }
  }, [empresaForDocumento, newDocumento, handleUploadDocumento, setIsModalDocumento, setEmpresaForDocumento, setNewDocumento])

  // Notas internas
  const handleSaveNota = useCallback((empresaId: string) => {
    const currentNotaTemporal = notaTemporal
    setEmpresas(prev => prev.map(e =>
      e.id === empresaId ? { ...e, notas_internas: currentNotaTemporal } : e
    ))
    setNotaEditando(false)
  }, [notaTemporal, setEmpresas, setNotaEditando])

  const handleCancelNota = useCallback(() => {
    const empresa = empresas.find(e => e.id === selectedEmpresa?.id)
    setNotaTemporal(empresa?.notas_internas || '')
    setNotaEditando(false)
  }, [empresas, selectedEmpresa?.id, setNotaTemporal, setNotaEditando])

  const openNotaEdit = useCallback(() => {
    const empresa = empresas.find(e => e.id === selectedEmpresa?.id)
    setNotaTemporal(empresa?.notas_internas || '')
    setNotaEditando(true)
  }, [empresas, selectedEmpresa?.id, setNotaTemporal, setNotaEditando])

  // Guardar nuevo proyecto
  const handleSaveNewProject = useCallback(async (proyecto: Partial<Proyecto>) => {
    if (!selectedEmpresa) return

    const currentSelectedEmpresa = selectedEmpresa
    const currentUser = user

    const nuevoProyecto: Proyecto = {
      id: crypto.randomUUID(),
      empresa_id: currentSelectedEmpresa.id,
      nombre: proyecto.nombre || 'Nuevo Proyecto',
      descripcion: proyecto.descripcion,
      fase_actual: proyecto.fase_actual || 1,
      estado: proyecto.estado || 'activo',
      fecha_inicio: proyecto.fecha_inicio,
      fecha_estimada_fin: proyecto.fecha_estimada_fin,
      moneda: proyecto.moneda || 'MXN',
      probabilidad_cierre: proyecto.probabilidad_cierre || 20,
      responsable_id: proyecto.responsable_id || currentUser?.id || '',
      responsable_nombre: proyecto.responsable_nombre || currentUser?.nombre || '',
      contacto_tecnico_id: proyecto.contacto_tecnico_id || '',
      requiere_compras: proyecto.requiere_compras || false,
      creado_en: new Date().toISOString(),
      creado_por: currentUser?.id,
      cliente_nombre: currentSelectedEmpresa.nombre,
    }

    setProyectos(prev => [...prev, nuevoProyecto])
    setIsModalNewProject(false)
  }, [user, selectedEmpresa, setProyectos, setIsModalNewProject])

  if (!canViewClientes && !canViewProveedores) {
    return (
      <AccessDeniedCard
        icon={Building2}
        description={
          isTecnico
            ? ACCESS_MESSAGES.noTieneEmpresas
            : ACCESS_MESSAGES.noTienePermisos
        }
      />
    )
  }

  return (
    <ModuleContainer>
      <ModuleHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          canEdit && (
            <Button onClick={handleNewEmpresa}>
              <Plus className="h-4 w-4 mr-2" />
              {BUTTON_LABELS.nuevaEmpresa}
            </Button>
          )
        }
      />

      {/* Error general (localStorage) */}
      {errors.general && (
        <div className="p-4 rounded-lg border bg-red-500/10 border-red-500/50 text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bell className="h-4 w-4" />
            <span>Alertas ({alertas.length})</span>
          </div>
          <div className="grid gap-2">
            {alertas.slice(0, 3).map(alerta => (
              <div
                key={alerta.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${alerta.tipo === 'danger'
                  ? `${STATUS_COLORS.error.border} ${STATUS_COLORS.error.bg}`
                  : `${STATUS_COLORS.warning.border} ${STATUS_COLORS.warning.bg}`
                  }`}
              >
                {alerta.tipo === 'danger' ? (
                  <AlertTriangle className={`h-5 w-5 ${STATUS_COLORS.error.text} flex-shrink-0`} />
                ) : (
                  <Clock className={`h-5 w-5 ${STATUS_COLORS.warning.text} flex-shrink-0`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${alerta.tipo === 'danger' ? STATUS_COLORS.error.text : STATUS_COLORS.warning.text}`}>
                    {alerta.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{alerta.mensaje}</p>
                </div>
                {alerta.empresaId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const emp = empresas.find(e => e.id === alerta.empresaId)
                      if (emp) setSelectedEmpresa(emp)
                    }}
                  >
                    Ver
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={(value) => handleFilterChange('query', value)}
        searchPlaceholder="Buscar empresas..."
        filters={[
          {
            key: 'tipo',
            label: 'Tipo',
            placeholder: 'Tipo',
            options: [
              { value: 'todos', label: 'Todos' },
              { value: 'cliente', label: 'Clientes' },
              { value: 'proveedor', label: 'Proveedores' },
              { value: 'ambos', label: 'Ambos' },
            ],
            width: 'w-40',
          },
          {
            key: 'industria',
            label: 'Industria',
            placeholder: 'Industria',
            options: [
              { value: 'todas', label: 'Todas' },
              ...INDUSTRIAS.map(ind => ({ value: ind, label: ind })),
            ],
            width: 'w-48',
          },
        ]}
        values={{ tipo: tipoFilter, industria: industriaFilter }}
        onFilterChange={handleFilterChange}
        hasActiveFilters={tipoFilter !== 'todos' || industriaFilter !== 'todas' || !!searchQuery}
        onClearFilters={handleClearFilters}
      />

      {/* Stats */}
      <StatGrid cols={4}>
        <MiniStat
          label="Total Empresas"
          value={filteredEmpresas.length}
          icon={<Building2 className="h-5 w-5" />}
          variant="primary"
          showBorder
          accentColor={CRM_STATS_COLORS.empresas}
        />
        <MiniStat
          label="Clientes"
          value={empresaStats.clientes}
          icon={<Users className="h-5 w-5" />}
          variant="info"
          showBorder
          accentColor={CRM_STATS_COLORS.contactos}
        />
        <MiniStat
          label="Proveedores"
          value={empresaStats.proveedores}
          icon={<Building2 className="h-5 w-5" />}
          variant="warning"
          showBorder
          accentColor={CRM_STATS_COLORS.oportunidades}
        />
        <MiniStat
          label="Contactos"
          value={empresaStats.contactosTotal}
          icon={<Users className="h-5 w-5" />}
          variant="success"
          showBorder
          accentColor={CRM_STATS_COLORS.ganancias}
        />
      </StatGrid>

      {/* Listado de Empresas */}
      {filteredEmpresas.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron empresas</h3>
            <p className="text-muted-foreground mb-4">
              {canEdit ? 'Crea tu primera empresa haciendo clic en el botón de arriba.' : 'No hay empresas que coincidan con los filtros aplicados.'}
            </p>
            {canEdit && (
              <Button onClick={handleNewEmpresa}>
                <Plus className="h-4 w-4 mr-2" />
                {BUTTON_LABELS.nuevaEmpresa}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <StaggeredList stagger={30}>
          {filteredEmpresas.map(empresa => (
            <EmpresaCard
              key={empresa.id}
              empresa={empresa}
              stats={{
                contactos: getContactos(empresa.id).length,
                proyectos: getProyectos(empresa.id).length
              }}
              onClick={() => setSelectedEmpresa(empresa)}
            />
          ))}
        </StaggeredList>
      )}

      {/* Modal de Empresa */}
      <CreateEmpresaModal
        open={isModalEmpresa}
        onOpenChange={(open) => { if (!open) { setIsModalEmpresa(false); setEditingEmpresa(null) } }}
        onSave={handleSaveEmpresa}
        empresa={editingEmpresa}
        isSaving={isSaving}
        errors={errors}
        userRoles={user?.roles || []}
      />

      {/* Vista Detallada de Empresa */}
      <EmpresaDetailModal
        open={!!selectedEmpresa && !isModalEmpresa && !isModalContacto && !isModalDocumento}
        onOpenChange={(open) => !open && setSelectedEmpresa(null)}
        empresa={selectedEmpresa}
        contactos={contactos}
        documentos={documentos as unknown as Documento[]}
        proyectos={proyectos}
        canEdit={!!canEdit}
        canUploadDocuments={!!canUploadDocuments}
        onEdit={() => selectedEmpresa && handleEditEmpresa(selectedEmpresa)}
        onDelete={() => selectedEmpresa && handleDeleteEmpresa(selectedEmpresa.id)}
        onNewContacto={() => selectedEmpresa && handleNewContacto(selectedEmpresa)}
        onEditContacto={handleEditContacto}
        onDeleteContacto={handleDeleteContacto}
        onNewDocumento={() => selectedEmpresa && handleNewDocumento(selectedEmpresa)}
        onDeleteDocumento={handleDeleteDocumento}
        notaEditando={notaEditando}
        notaTemporal={notaTemporal}
        onOpenNotaEdit={openNotaEdit}
        onNotaChange={setNotaTemporal}
        onSaveNota={() => selectedEmpresa && handleSaveNota(selectedEmpresa.id)}
        onCancelNota={handleCancelNota}
        showNewProjectModal={isModalNewProject}
        onNewProject={() => setIsModalNewProject(true)}
        onCloseNewProject={() => setIsModalNewProject(false)}
        onSaveNewProject={handleSaveNewProject}
        usuarios={usuarios}
        contactosTecnicos={contactos}
        isSavingProject={isSaving}
      />

      {/* Modal de Contactos */}
      <ManageContactsModal
        isOpen={isModalContacto}
        onClose={() => { setIsModalContacto(false) }}
        empresaId={empresaForContacto?.id || ''}
      />

      {/* Modal de Documento */}
      <UploadDocumentModal
        open={isModalDocumento}
        onOpenChange={(open) => { if (!open) { setIsModalDocumento(false); setEmpresaForDocumento(null) } }}
        onSave={handleSaveDocumento}
        entidadId={empresaForDocumento?.id || ''}
        entidadTipo="empresa"
      />

      {/* Custom Modal Delete Confirmation */}
      <BaseModal
        open={!!empresaToDelete}
        onOpenChange={(open) => !open && setEmpresaToDelete(null)}
        size="md"
        description="Esta acción elminará la empresa y todos sus contactos asociados permanentemente."
        variant="danger"
        showAccentBar
      >
        <ModalHeader title="Eliminar Empresa" variant="danger" showIcon />
        <ModalBody>
          <p>
            ¿Estás seguro de que deseas eliminar esta empresa? Los contactos vinculados a la misma también serán desvinculados o eliminados. Esta operación no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter variant="danger" layout="inline-between">
          <Button variant="outline" className="flex-1" onClick={() => setEmpresaToDelete(null)}>
            Cancelar
          </Button>
          <Button variant="destructive" className="flex-1" onClick={confirmDeleteEmpresa}>
            Eliminar
          </Button>
        </ModalFooter>
      </BaseModal>
    </ModuleContainer>
  )
}
