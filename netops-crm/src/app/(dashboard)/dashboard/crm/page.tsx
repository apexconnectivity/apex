"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { type User } from '@/types/auth'
import { useEmpresas, useContactos, useProyectos, useTickets, useDocumentos } from '@/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { CreateContactoModal } from '@/components/module/CreateContactoModal'
import { UploadDocumentModal } from '@/components/module/UploadDocumentModal'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/ui/filter-bar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CreateEmpresaModal } from '@/components/module/CreateEmpresaModal'
import { EmpresaCard } from '@/components/module/EmpresaCard'
import { EmpresaDetailModal } from '@/components/module/EmpresaDetailModal'
import { SelectWithAdd } from '@/components/module/SelectWithAdd'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/module/StatusBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { VARIANT_COLORS, STATUS_COLORS, CRM_STATS_COLORS } from '@/lib/colors'
import {
  Building2,
  Plus,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  X,
  Check,
  Loader2,
  AlertCircle,
  Upload,
  Eye,
  Lock,
  Globe2,
  Bell,
  AlertTriangle,
  Clock
} from 'lucide-react'
import {
  Empresa,
  Contacto,
  Documento,
  INDUSTRIAS,
  TAMAÑOS,
  ORIGENES,
  TIPOS_RELACION,
  TIPOS_CONTACTO,
  METODOS_PAGO,
  MONEDAS,
  TipoEntidad,
  TipoContacto
} from '@/types/crm'
import { type Archivo } from '@/types/archivos'
import { Proyecto, FASES } from '@/types/proyectos'
import { Ticket, EstadoTicket } from '@/types/soporte'

// Importar constantes
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  TABS_LABELS,
  BUTTON_LABELS,
  ALERT_LABELS,
  VALIDATION_ERRORS,
  ACCESS_MESSAGES,
  CRM_EMPTY,
  EMPTY_MESSAGES,
  FORM_LABELS,
  STATS_LABELS,
} from '@/constants/crm'

// ============================================
// MAGIC NUMBERS - Constantes de negocio
// ============================================
const DIAS_INACTIVIDAD_PROSPECTO = 60

const EMPRESAS_VACIA: Partial<Empresa> = {
  tipo_entidad: 'cliente',
  nombre: '',
  industria: undefined,
  tamaño: undefined,
  origen: undefined,
  tipo_relacion: 'Cliente',
  telefono_principal: '',
  email_principal: '',
  sitio_web: '',
  direccion: '',
  ciudad: '',
  pais: '',
  razon_social: '',
  rfc: '',
  direccion_fiscal: '',
  regimen_fiscal: '',
  email_facturacion: '',
  metodo_pago: undefined,
  plazo_pago: undefined,
  moneda_preferida: undefined,
}

const CONTACTO_VACIO: Partial<Contacto> = {
  nombre: '',
  cargo: '',
  tipo_contacto: 'Técnico',
  email: '',
  telefono: '',
  es_principal: false,
  recibe_facturas: false,
  activo: true,
}

export default function CRMPage() {
  const { user } = useAuth()

  const [empresas, setEmpresas] = useEmpresas()
  const [contactos, setContactos] = useContactos()
  const [documentos, setDocumentos] = useDocumentos()
  const [proyectos, setProyectos] = useProyectos()
  const [tickets, setTickets] = useTickets()

  // Usuarios internos para proyectos
  const [usuarios, setUsuarios] = useState<User[]>([])

  // ============================================
  // ESTADOS DE BÚSQUEDA Y FILTROS (agrupados)
  // ============================================
  const [searchState, setSearchState] = useState({
    query: '',
    tipo: 'todos' as TipoEntidad | 'todos',
    industria: 'todas'
  })

  const searchQuery = searchState.query
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
    editingContacto: null as Partial<Contacto> | null,
    empresaForContacto: null as Empresa | null,
    empresaForDocumento: null as Empresa | null,
    notaEditando: false,
  })

  const {
    selectedEmpresa,
    isModalEmpresa,
    isModalContacto,
    isModalDocumento,
    isModalNewProject,
    editingEmpresa,
    editingContacto,
    empresaForContacto,
    empresaForDocumento,
    notaEditando,
  } = uiState

  // Setters agrupados para UI
  const setSelectedEmpresa = useCallback((empresa: Empresa | null) => {
    setUiState(prev => ({ ...prev, selectedEmpresa: empresa }))
  }, [])

  const setIsModalEmpresa = useCallback((open: boolean) => {
    setUiState(prev => ({ ...prev, isModalEmpresa: open, editingEmpresa: open ? prev.editingEmpresa : null }))
  }, [])

  const setIsModalContacto = useCallback((open: boolean) => {
    setUiState(prev => ({ ...prev, isModalContacto: open, editingContacto: open ? prev.editingContacto : null }))
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

  const setEditingContacto = useCallback((contacto: Partial<Contacto> | null) => {
    setUiState(prev => ({ ...prev, editingContacto: contacto }))
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

  // Estado de nota temporal
  const [notaTemporal, setNotaTemporal] = useState('')

  // Estado de documento nuevo
  const [newDocumento, setNewDocumento] = useState<{ visibilidad: 'interno' | 'publico', descripcion: string, nombreArchivo: string }>({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })

  // Estados de guardado
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handler para actualizar filtros
  const handleFilterChange = useCallback((key: string, value: string) => {
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
    setEditingContacto({ ...CONTACTO_VACIO, id: String(Date.now()), empresa_id: empresa.id })
    setErrors({})
    setSelectedEmpresa(null)
    setIsModalContacto(true)
  }, [setEmpresaForContacto, setEditingContacto, setErrors, setSelectedEmpresa, setIsModalContacto])

  const handleEditContacto = useCallback((contacto: Contacto) => {
    setEditingContacto({ ...contacto })
    setEmpresaForContacto(empresas.find(e => e.id === contacto.empresa_id) || null)
    setErrors({})
    setIsModalContacto(true)
  }, [empresas, setEditingContacto, setEmpresaForContacto, setErrors, setIsModalContacto])

  // Verificar disponibilidad de localStorage al inicio
  useEffect(() => {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
    } catch (e) {
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
  const isTecnico = user?.roles.includes('tecnico')

  const canViewClientes = isAdmin || isComercial || isFacturacion || isMarketing || isTecnico
  const canViewProveedores = isAdmin || isCompras || isFacturacion || isMarketing
  const canEdit = isAdmin || isComercial || isCompras
  const canUploadDocuments = isAdmin || isComercial || isCompras

  // Simulación: IDs de empresas asignadas al técnico (en producción vendría de proyectos)
  const empresasAsignadasTecnico = isTecnico ? ['1', '3'] : []

  // ============================================
  // MEMOIZACIÓN: Filtrado de empresas
  // ============================================
  const filteredEmpresas = useMemo(() => {
    return empresas.filter(e => {
      // Restricción de técnicos: solo ven clientes de proyectos asignados
      if (isTecnico && e.tipo_entidad === 'cliente') {
        if (!empresasAsignadasTecnico.includes(e.id)) return false
      }

      if (!canViewClientes && e.tipo_entidad === 'cliente') return false
      if (!canViewProveedores && (e.tipo_entidad === 'proveedor' || e.tipo_entidad === 'ambos')) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!e.nombre.toLowerCase().includes(q) &&
          !e.email_principal?.toLowerCase().includes(q) &&
          !e.ciudad?.toLowerCase().includes(q)) return false
      }
      if (tipoFilter !== 'todos' && e.tipo_entidad !== tipoFilter) return false
      if (industriaFilter !== 'todas' && e.industria !== industriaFilter) return false
      return true
    })
  }, [empresas, isTecnico, empresasAsignadasTecnico, canViewClientes, canViewProveedores, searchQuery, tipoFilter, industriaFilter])

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

  const documentosByEmpresa = useMemo(() => {
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

  const getDocumentos = useCallback((empresaId: string) => {
    return documentosByEmpresa.get(empresaId) || []
  }, [documentosByEmpresa])

  const getDocumentosInternos = useCallback((empresaId: string) => {
    return (documentosByEmpresa.get(empresaId) || []).filter(d => d.visibilidad === 'interno')
  }, [documentosByEmpresa])

  const getDocumentosPublicos = useCallback((empresaId: string) => {
    return (documentosByEmpresa.get(empresaId) || []).filter(d => d.visibilidad === 'publico')
  }, [documentosByEmpresa])

  const getProyectos = useCallback((empresaId: string) => {
    return proyectosByEmpresa.get(empresaId) || []
  }, [proyectosByEmpresa])

  const getTickets = useCallback((empresaId: string) => {
    const empresaProyectos = proyectosByEmpresa.get(empresaId) || []
    const proyectosIds = empresaProyectos.map(p => p.id!).filter(Boolean)
    return tickets.filter(t => t.proyecto_id && proyectosIds.includes(t.proyecto_id))
  }, [proyectosByEmpresa, tickets])

  // ============================================
  // MEMOIZACIÓN: Estadísticas
  // ============================================
  const empresaStats = useMemo(() => ({
    total: empresas.length,
    clientes: empresas.filter(e => e.tipo_entidad === 'cliente').length,
    proveedores: empresas.filter(e => e.tipo_entidad === 'proveedor').length,
    contactosTotal: contactos.length,
  }), [empresas, contactos])

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
        const diasInactivo = Math.floor((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
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
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      const success = setEmpresas(prev => prev.filter(e => e.id !== id))
      if (!success) {
        return
      }
      setContactos(prev => prev.filter(c => c.empresa_id !== id))
      setSelectedEmpresa(null)
    }
  }, [setEmpresas, setContactos, setSelectedEmpresa])

  const handleSaveEmpresa = useCallback(async (empresa: Partial<Empresa>, isNew: boolean) => {
    setErrors({})
    setIsSaving(true)

    try {
      await new Promise(r => setTimeout(r, 500))
      const now = new Date().toISOString().split('T')[0]

      if (!isNew) {
        const success = setEmpresas(prev => prev.map(e =>
          e.id === empresa.id ? { ...e, ...empresa } as Empresa : e
        ))
        if (!success) {
          setErrors({ general: 'Error al actualizar la empresa en localStorage' })
          setIsSaving(false)
          return
        }
      } else {
        const newEmpresa = {
          ...empresa,
          id: String(Date.now()),
          creado_en: now
        } as Empresa

        const success = setEmpresas(prev => [...prev, newEmpresa])
        if (!success) {
          setErrors({ general: 'Error al guardar la empresa en localStorage. Verifica que el navegador permita localStorage (no modo privado)' })
          setIsSaving(false)
          return
        }
      }

      setEditingEmpresa(null)
    } catch (error) {
      console.error('[CRM] Error al guardar empresa:', error)
      setErrors({ general: 'Error al guardar la empresa. Intenta de nuevo.' })
    } finally {
      setIsSaving(false)
    }
  }, [setEmpresas, setEditingEmpresa, setErrors, setIsSaving])

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
        id: String(Date.now()),
        empresa_id: empresaId,
        archivo_id: `arch${Date.now()}`,
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

  const handleSaveContacto = useCallback(async () => {
    setErrors({})

    if (!editingContacto?.nombre || editingContacto.nombre.trim().length < 2) {
      setErrors({ nombre: VALIDATION_ERRORS.nombreObligatorio })
      return
    }
    if (!editingContacto?.email) {
      setErrors({ email: VALIDATION_ERRORS.emailObligatorio })
      return
    }
    if (editingContacto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingContacto.email)) {
      setErrors({ email: VALIDATION_ERRORS.emailInvalido })
      return
    }
    const emailExists = contactos.some(c => c.email.toLowerCase() === editingContacto?.email?.toLowerCase() && c.id !== editingContacto?.id)
    if (emailExists) {
      setErrors({ email: VALIDATION_ERRORS.emailYaRegistrado })
      return
    }
    if (!editingContacto?.tipo_contacto) {
      setErrors({ tipo_contacto: VALIDATION_ERRORS.tipoContactoRequerido })
      return
    }
    if (editingContacto.telefono && !/^[\d\s\+\-\(\)]+$/.test(editingContacto.telefono)) {
      setErrors({ telefono: VALIDATION_ERRORS.telefonoInvalido })
      return
    }

    let updatedContactos = [...contactos]
    if (editingContacto.es_principal) {
      updatedContactos = updatedContactos.map(c =>
        c.empresa_id === editingContacto.empresa_id ? { ...c, es_principal: false } : c
      )
    }

    setIsSaving(true)
    try {
      await new Promise(r => setTimeout(r, 500))

      if (contactos.find(c => c.id === editingContacto?.id)) {
        setContactos(prev => prev.map(c =>
          c.id === editingContacto?.id ? { ...c, ...editingContacto } as Contacto : c
        ))
      } else {
        setContactos(prev => [...prev, {
          ...editingContacto,
          id: String(Date.now()),
          creado_en: new Date().toISOString().split('T')[0]
        } as Contacto])
      }

      setIsModalContacto(false)
      setEditingContacto(null)
      setEmpresaForContacto(null)
    } catch (error) {
      console.error('[CRM] Error al guardar contacto:', error)
    } finally {
      setIsSaving(false)
    }
  }, [editingContacto, contactos, setErrors, setIsSaving, setContactos, setIsModalContacto, setEditingContacto, setEmpresaForContacto])

  // Notas internas
  const handleSaveNota = useCallback((empresaId: string) => {
    const success = setEmpresas(prev => prev.map(e =>
      e.id === empresaId ? { ...e, notas_internas: notaTemporal } : e
    ))
    if (!success) {
      console.error('[CRM] Error al guardar nota')
      return
    }
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

    const nuevoProyecto: Proyecto = {
      id: crypto.randomUUID(),
      empresa_id: selectedEmpresa.id,
      nombre: proyecto.nombre || 'Nuevo Proyecto',
      descripcion: proyecto.descripcion,
      fase_actual: proyecto.fase_actual || 1,
      estado: proyecto.estado || 'activo',
      fecha_inicio: proyecto.fecha_inicio,
      fecha_estimada_fin: proyecto.fecha_estimada_fin,
      moneda: proyecto.moneda || 'MXN',
      probabilidad_cierre: proyecto.probabilidad_cierre || 20,
      responsable_id: proyecto.responsable_id || user?.id || '',
      responsable_nombre: proyecto.responsable_nombre || user?.nombre || '',
      contacto_tecnico_id: proyecto.contacto_tecnico_id || '',
      requiere_compras: proyecto.requiere_compras || false,
      creado_en: new Date().toISOString(),
      creado_por: user?.id,
      cliente_nombre: selectedEmpresa.nombre,
    }

    setProyectos(prev => [...prev, nuevoProyecto])
    setIsModalNewProject(false)
  }, [selectedEmpresa, user, setProyectos, setIsModalNewProject])

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
              { value: 'todos', label: 'Todos los tipos' },
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
              { value: 'todas', label: 'Todas las industrias' },
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
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

      {/* Modal de Contacto */}
      <CreateContactoModal
        open={isModalContacto}
        onOpenChange={(open) => { if (!open) { setIsModalContacto(false); setEditingContacto(null) } }}
        onSave={handleSaveContacto}
        contacto={editingContacto}
        empresaId={empresaForContacto?.id || ''}
        isSaving={isSaving}
        errors={errors}
      />

      {/* Modal de Documento */}
      <UploadDocumentModal
        open={isModalDocumento}
        onOpenChange={(open) => { if (!open) { setIsModalDocumento(false); setEmpresaForDocumento(null) } }}
        onSave={handleSaveDocumento}
        entidadId={empresaForDocumento?.id || ''}
        entidadTipo="empresa"
      />
    </ModuleContainer>
  )
}
