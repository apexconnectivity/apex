"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { type User } from '@/types/auth'
import { useEmpresas, useContactos, useProyectos, useTickets, useDocumentos } from '@/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { CreateContactoModal } from '@/components/module/CreateContactoModal'
import { UploadDocumentModal } from '@/components/module/UploadDocumentModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { EmpresaModal } from '@/components/module/EmpresaModal'
import { EmpresaCard } from '@/components/module/EmpresaCard'
import { EmpresaDetailModal } from '@/components/module/EmpresaDetailModal'
import { SelectWithAdd } from '@/components/module/SelectWithAdd'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/module/StatusBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { VARIANT_COLORS, STATUS_COLORS, CRM_STATS_COLORS } from '@/lib/colors'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  Plus,
  Search,
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

  const [searchQuery, setSearchQuery] = useState('')
  const [tipoFilter, setTipoFilter] = useState<TipoEntidad | 'todos'>('todos')
  const [industriaFilter, setIndustriaFilter] = useState<string>('todas')

  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [isModalEmpresa, setIsModalEmpresa] = useState(false)
  const [isModalContacto, setIsModalContacto] = useState(false)
  const [isModalDocumento, setIsModalDocumento] = useState(false)
  const [isModalNewProject, setIsModalNewProject] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Partial<Empresa> | null>(null)
  const [editingContacto, setEditingContacto] = useState<Partial<Contacto> | null>(null)
  const [empresaForContacto, setEmpresaForContacto] = useState<Empresa | null>(null)
  const [empresaForDocumento, setEmpresaForDocumento] = useState<Empresa | null>(null)
  const [newDocumento, setNewDocumento] = useState<{ visibilidad: 'interno' | 'publico', descripcion: string, nombreArchivo: string }>({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })
  const [notaEditando, setNotaEditando] = useState(false)
  const [notaTemporal, setNotaTemporal] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Permisos
  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const isMarketing = user?.roles.includes('marketing')
  const isTecnico = user?.roles.includes('tecnico')

  const canViewClientes = isAdmin || isComercial || isFacturacion || isMarketing || isTecnico
  const canViewProveedores = isAdmin || isCompras || isFacturacion || isMarketing
  const canEdit = isAdmin || isComercial || isCompras
  const canEditFacturacion = isAdmin || isFacturacion
  const canUploadDocuments = isAdmin || isComercial || isCompras

  // Simulación: IDs de empresas asignadas al técnico (en producción vendría de proyectos)
  const empresasAsignadasTecnico = isTecnico ? ['1', '3'] : []

  // Filtrar empresas
  const filteredEmpresas = empresas.filter(e => {
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

  const getContactos = (empresaId: string) => contactos.filter(c => c.empresa_id === empresaId)
  const getDocumentos = (empresaId: string) => documentos.filter(d => d.entidad_tipo === 'empresa' && d.entidad_id === empresaId)
  const getDocumentosInternos = (empresaId: string) => documentos.filter(d => d.entidad_tipo === 'empresa' && d.entidad_id === empresaId && d.visibilidad === 'interno')
  const getDocumentosPublicos = (empresaId: string) => documentos.filter(d => d.entidad_tipo === 'empresa' && d.entidad_id === empresaId && d.visibilidad === 'publico')
  const getProyectos = (empresaId: string) => proyectos.filter(p => p.empresa_id === empresaId)
  const getTickets = (empresaId: string) => {
    const proyectosIds = proyectos.filter(p => p.empresa_id === empresaId).map(p => p.id!).filter(Boolean)
    return tickets.filter(t => t.proyecto_id && proyectosIds.includes(t.proyecto_id))
  }

  // Abrir modal para nueva empresa
  const handleNewEmpresa = () => {
    // NO asignar ID aquí - el modal lo detectará como nueva empresa
    // y handleSaveEmpresa generará el ID al guardarla
    setEditingEmpresa({ ...EMPRESAS_VACIA })
    setErrors({})
    setSelectedEmpresa(null) // Cerrar modal de empresa si está abierto
    setIsModalEmpresa(true)
  }

  // Abrir modal para editar empresa
  const handleEditEmpresa = (empresa: Empresa) => {
    setEditingEmpresa({ ...empresa })
    setErrors({})
    setSelectedEmpresa(null) // Cerrar modal de empresa si está abierto
    setIsModalEmpresa(true)
  }

  // Guardar empresa
  const handleSaveEmpresa = async (empresa: Partial<Empresa>, isNew: boolean) => {
    setErrors({})
    setIsSaving(true)
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

      const success = setEmpresas(prev => {
        const updated = [...prev, newEmpresa]
        return updated
      })

      if (!success) {
        setErrors({ general: 'Error al guardar la empresa en localStorage. Verifica que el navegador permita localStorage (no modo privado)' })
        setIsSaving(false)
        return
      }
    }

    setIsSaving(false)
    setEditingEmpresa(null)
  }

  // Eliminar empresa
  const handleDeleteEmpresa = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      const success = setEmpresas(prev => prev.filter(e => e.id !== id))
      if (!success) {
        return
      }
      setContactos(prev => prev.filter(c => c.empresa_id !== id))
      setSelectedEmpresa(null)
    }
  }

  // Abrir modal para nuevo contacto
  const handleNewContacto = (empresa: Empresa) => {
    setEmpresaForContacto(empresa)
    setEditingContacto({ ...CONTACTO_VACIO, id: String(Date.now()), empresa_id: empresa.id })
    setErrors({})
    setSelectedEmpresa(null) // Cerrar modal de empresa
    setIsModalContacto(true)
  }

  // Editar contacto existente
  const handleEditContacto = (contacto: Contacto) => {
    setEditingContacto({ ...contacto })
    setEmpresaForContacto(empresas.find(e => e.id === contacto.empresa_id) || null)
    setErrors({})
    setIsModalContacto(true)
  }

  // Abrir modal para subir documento
  const handleNewDocumento = (empresa: Empresa) => {
    setEmpresaForDocumento(empresa)
    setNewDocumento({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })
    setSelectedEmpresa(null)
    setIsModalDocumento(true)
  }

  // Guardar documento
  const handleSaveDocumento = async () => {
    if (!empresaForDocumento || !newDocumento.descripcion.trim() || !newDocumento.nombreArchivo.trim()) {
      return
    }
    await handleUploadDocumento(empresaForDocumento.id, newDocumento.visibilidad, newDocumento.descripcion, newDocumento.nombreArchivo)
    setIsModalDocumento(false)
    setEmpresaForDocumento(null)
    setNewDocumento({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })
  }

  // Guardar contacto
  const handleSaveContacto = async () => {
    setErrors({})

    if (!editingContacto?.nombre || editingContacto.nombre.trim().length < 2) {
      setErrors({ nombre: VALIDATION_ERRORS.nombreObligatorio })
      return
    }
    if (!editingContacto?.email) {
      setErrors({ email: VALIDATION_ERRORS.emailObligatorio })
      return
    }
    // Validar formato email
    if (editingContacto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingContacto.email)) {
      setErrors({ email: VALIDATION_ERRORS.emailInvalido })
      return
    }
    // Verificar email único en el sistema
    const emailExists = contactos.some(c => c.email.toLowerCase() === editingContacto?.email?.toLowerCase() && c.id !== editingContacto?.id)
    if (emailExists) {
      setErrors({ email: VALIDATION_ERRORS.emailYaRegistrado })
      return
    }
    if (!editingContacto?.tipo_contacto) {
      setErrors({ tipo_contacto: VALIDATION_ERRORS.tipoContactoRequerido })
      return
    }
    // Validar teléfono si se ingresa
    if (editingContacto.telefono && !/^[\d\s\+\-\(\)]+$/.test(editingContacto.telefono)) {
      setErrors({ telefono: VALIDATION_ERRORS.telefonoInvalido })
      return
    }

    // Si es principal, desmarcar otros
    let updatedContactos = [...contactos]
    if (editingContacto.es_principal) {
      updatedContactos = updatedContactos.map(c =>
        c.empresa_id === editingContacto.empresa_id ? { ...c, es_principal: false } : c
      )
    }

    setIsSaving(true)
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

    setIsSaving(false)
    setIsModalContacto(false)
    setEditingContacto(null)
    setEmpresaForContacto(null)
  }

  // Eliminar contacto
  const handleDeleteContacto = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      setContactos(prev => prev.filter(c => c.id !== id))
    }
  }

  // Documentos
  const handleUploadDocumento = async (empresaId: string, visibilidad: 'interno' | 'publico', descripcion: string, nombreArchivo: string) => {
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
  }

  const handleDeleteDocumento = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      setDocumentos(prev => prev.filter(d => d.id !== id))
    }
  }

  // Notas internas
  const handleSaveNota = (empresaId: string) => {
    const success = setEmpresas(prev => prev.map(e =>
      e.id === empresaId ? { ...e, notas_internas: notaTemporal } : e
    ))
    if (!success) {
      console.error('[CRM] Error al guardar nota')
      return
    }
    setNotaEditando(false)
  }

  // Alertas
  const getAlertas = () => {
    const alertas: { id: string, tipo: 'warning' | 'danger', titulo: string, mensaje: string, empresaId?: string }[] = []

    empresas.forEach(e => {
      // Alerta: Sin contacto principal
      const contactosEmpresa = getContactos(e.id)
      if (contactosEmpresa.length > 0 && !contactosEmpresa.some(c => c.es_principal)) {
        alertas.push({
          id: `sin-principal-${e.id}`,
          tipo: 'warning' as const,
          titulo: ALERT_LABELS.sinContactoPrincipal,
          mensaje: `${e.nombre} ${ALERT_LABELS.sinContactoPrincipalMsg}`,
          empresaId: e.id
        })
      }

      // Alerta: Prospecto inactivo >60 días
      if ((e.tipo_entidad === 'cliente' || e.tipo_entidad === 'ambos') && e.tipo_relacion === 'Prospecto') {
        const fechaCreacion = new Date(e.creado_en)
        const hoy = new Date()
        const diasInactivo = Math.floor((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
        if (diasInactivo > 60) {
          alertas.push({
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
        alertas.push({
          id: `sin-contacto-prov-${e.id}`,
          tipo: 'warning' as const,
          titulo: ALERT_LABELS.proveedorSinContactos,
          mensaje: `${e.nombre} ${ALERT_LABELS.proveedorSinContactosMsg}`,
          empresaId: e.id
        })
      }
    })

    return alertas
  }

  const alertas = getAlertas()

  const handleCancelNota = () => {
    const empresa = empresas.find(e => e.id === selectedEmpresa?.id)
    setNotaTemporal(empresa?.notas_internas || '')
    setNotaEditando(false)
  }

  const openNotaEdit = () => {
    const empresa = empresas.find(e => e.id === selectedEmpresa?.id)
    setNotaTemporal(empresa?.notas_internas || '')
    setNotaEditando(true)
  }

  // Guardar nuevo proyecto desde el modal de empresa
  const handleSaveNewProject = async (proyecto: Partial<Proyecto>) => {
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
  }

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{PAGE_TITLE}</h1>
          <p className="text-muted-foreground">{PAGE_DESCRIPTION}</p>
        </div>
        {canEdit && (
          <Button onClick={handleNewEmpresa}>
            <Plus className="h-4 w-4 mr-2" />
            {BUTTON_LABELS.nuevaEmpresa}
          </Button>
        )}
      </div>

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
        onSearchChange={setSearchQuery}
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
        onFilterChange={(key, value) => {
          if (key === 'tipo') {
            setTipoFilter(value as TipoEntidad | 'todos')
          } else if (key === 'industria') {
            setIndustriaFilter(value)
          }
        }}
        hasActiveFilters={tipoFilter !== 'todos' || industriaFilter !== 'todas'}
        onClearFilters={() => {
          setSearchQuery('')
          setTipoFilter('todos')
          setIndustriaFilter('todas')
        }}
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
          value={empresas.filter(e => e.tipo_entidad === 'cliente').length}
          icon={<Users className="h-5 w-5" />}
          variant="info"
          showBorder
          accentColor={CRM_STATS_COLORS.contactos}
        />
        <MiniStat
          label="Proveedores"
          value={empresas.filter(e => e.tipo_entidad === 'proveedor').length}
          icon={<Building2 className="h-5 w-5" />}
          variant="warning"
          showBorder
          accentColor={CRM_STATS_COLORS.oportunidades}
        />
        <MiniStat
          label="Contactos"
          value={contactos.length}
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
      <EmpresaModal
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
