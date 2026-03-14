"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { EmpresaModal } from '@/components/module/EmpresaModal'
import { EmpresaCard } from '@/components/module/EmpresaCard'
import { EmpresaDetailModal } from '@/components/module/EmpresaDetailModal'
import { SelectWithAdd } from '@/components/module/SelectWithAdd'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/module/StatusBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MiniStat } from '@/components/ui/mini-stat'
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
import { Proyecto, FASES } from '@/types/proyectos'
import { Ticket, EstadoTicket } from '@/types/soporte'

// Demo data
const DEMO_EMPRESAS_INICIAL: Empresa[] = [
  {
    id: '1',
    tipo_entidad: 'cliente',
    nombre: 'Soluciones Tecnológicas SA',
    industria: 'Tecnología',
    tamaño: 'PYME',
    origen: 'Referencia',
    tipo_relacion: 'Cliente',
    telefono_principal: '+54 9 11 4321-5678',
    email_principal: 'contacto@solucionestec.com',
    sitio_web: 'www.solucionestec.com',
    direccion: 'Av. Corrientes 1234, CABA',
    ciudad: 'Buenos Aires',
    pais: 'Argentina',
    razon_social: 'Soluciones Tecnológicas SA',
    rfc: 'SAT123456789',
    email_facturacion: 'facturas@solucionestec.com',
    plazo_pago: 30,
    moneda_preferida: 'USD',
    creado_en: '2024-01-15',
  },
  {
    id: '2',
    tipo_entidad: 'proveedor',
    nombre: 'Distribuidor Mayorista SA',
    industria: 'Comercio',
    tamaño: 'Gran empresa',
    telefono_principal: '+54 9 11 5555-1234',
    email_principal: 'ventas@distmayorista.com',
    sitio_web: 'www.distmayorista.com',
    direccion: 'Av. Independencia 456, CABA',
    ciudad: 'Buenos Aires',
    pais: 'Argentina',
    razon_social: 'Distribuidor Mayorista SA',
    rfc: 'DIST123456XYZ',
    email_facturacion: 'cobros@distmayorista.com',
    plazo_pago: 30,
    moneda_preferida: 'USD',
    creado_en: '2024-02-20',
  },
  {
    id: '3',
    tipo_entidad: 'cliente',
    nombre: 'Hospital Regional Norte',
    industria: 'Salud',
    tamaño: 'Gran empresa',
    origen: 'Llamada en frío',
    tipo_relacion: 'Cliente',
    telefono_principal: '+54 9 11 4789-1234',
    email_principal: 'compras@hospitalnorte.com',
    sitio_web: 'www.hospitalnorte.com',
    direccion: 'Av. Rivadavia 10000, CABA',
    ciudad: 'Buenos Aires',
    pais: 'Argentina',
    creado_en: '2024-03-10',
  },
]

const DEMO_CONTACTOS_INICIAL: Contacto[] = [
  { id: '1', empresa_id: '1', nombre: 'Juan Pérez', cargo: 'CTO', tipo_contacto: 'Técnico', email: 'juan@solucionestec.com', telefono: '+54 9 11 1234-5678', es_principal: true, recibe_facturas: false, activo: true, creado_en: '2024-01-15' },
  { id: '2', empresa_id: '1', nombre: 'María García', cargo: 'Gerente Comercial', tipo_contacto: 'Comercial', email: 'maria@solucionestec.com', telefono: '+54 9 11 2345-6789', es_principal: false, recibe_facturas: true, activo: true, creado_en: '2024-01-15' },
  { id: '3', empresa_id: '2', nombre: 'Carlos López', cargo: 'Vendedor', tipo_contacto: 'Comercial', email: 'carlos@distmayorista.com', telefono: '+54 9 11 3456-7890', es_principal: true, recibe_facturas: false, activo: true, creado_en: '2024-02-20' },
  { id: '4', empresa_id: '3', nombre: 'Dr. Roberto Silva', cargo: 'Director', tipo_contacto: 'Administrativo', email: 'director@hospitalnorte.com', telefono: '+54 9 11 4567-8901', es_principal: true, recibe_facturas: true, activo: true, creado_en: '2024-03-10' },
]

const DEMO_DOCUMENTOS: Documento[] = [
  { id: 'd1', empresa_id: '1', archivo_id: 'arch1', visibilidad: 'interno', descripcion: 'Contrato de servicios 2024', subido_por: 'Carlos Admin', fecha_subida: '2024-01-20', nombre_archivo: 'contrato_servicios_2024.pdf' },
  { id: 'd2', empresa_id: '1', archivo_id: 'arch2', visibilidad: 'publico', descripcion: 'Brochure corporativo', subido_por: 'Carlos Admin', fecha_subida: '2024-02-15', nombre_archivo: 'brochure_corporativo.pdf' },
  { id: 'd3', empresa_id: '1', archivo_id: 'arch3', visibilidad: 'interno', descripcion: 'Acuerdo de confidencialidad NDA', subido_por: 'Carlos Admin', fecha_subida: '2024-03-01', nombre_archivo: 'nda_soluciones.pdf' },
  { id: 'd4', empresa_id: '2', archivo_id: 'arch4', visibilidad: 'interno', descripcion: 'Contrato de proveedor', subido_por: 'Carlos Admin', fecha_subida: '2024-02-25', nombre_archivo: 'contrato_proveedor.pdf' },
]

const DEMO_PROYECTOS: Partial<Proyecto>[] = [
  { id: 'p1', empresa_id: '1', nombre: 'Migración a Cloud', descripcion: 'Migración de infraestructura local a AWS', fase_actual: 4, estado: 'activo', fecha_inicio: '2024-01-15', fecha_estimada_fin: '2024-06-30', moneda: 'USD', monto_estimado: 25000, probabilidad_cierre: 90, responsable_id: 'u1', contacto_tecnico_id: 'c1', requiere_compras: false, creado_en: '2024-01-15', creado_por: 'Carlos Admin' },
  { id: 'p2', empresa_id: '1', nombre: 'Auditoría de Seguridad', descripcion: 'Auditoría completa de seguridad informática', fase_actual: 5, estado: 'cerrado', fecha_inicio: '2023-10-01', fecha_real_fin: '2023-12-15', moneda: 'USD', monto_estimado: 8000, probabilidad_cierre: 100, responsable_id: 'u1', contacto_tecnico_id: 'c1', requiere_compras: false, creado_en: '2023-10-01', creado_por: 'Carlos Admin' },
  { id: 'p3', empresa_id: '3', nombre: 'Implementación VPN', descripcion: 'Red VPN corporativa', fase_actual: 2, estado: 'activo', fecha_inicio: '2024-03-01', fecha_estimada_fin: '2024-05-30', moneda: 'USD', monto_estimado: 12000, probabilidad_cierre: 70, responsable_id: 'u1', contacto_tecnico_id: 'c1', requiere_compras: false, creado_en: '2024-03-01', creado_por: 'Carlos Admin' },
]

const DEMO_TICKETS: Partial<Ticket>[] = [
  { id: 't1', proyecto_id: 'p1', numero_ticket: 'TKT-001', titulo: 'No se puede acceder al servidor de producción', descripcion: 'El servidor PROD-01 no responde', estado: 'Abierto', prioridad: 'Urgente', categoria: 'Soporte técnico', tipo_origen: 'proyecto', creado_por: 'u1', creado_por_nombre: 'Juan Pérez', creado_por_cliente: true, fecha_apertura: '2024-03-10', tiempo_invertido_minutos: 0 },
  { id: 't2', proyecto_id: 'p1', numero_ticket: 'TKT-002', titulo: 'Solicitud de nuevo usuario', descripcion: 'Agregar usuario para nuevo empleado', estado: 'En progreso', prioridad: 'Media', categoria: 'Soporte técnico', tipo_origen: 'proyecto', creado_por: 'u1', creado_por_nombre: 'María García', creado_por_cliente: true, fecha_apertura: '2024-03-08', tiempo_invertido_minutos: 30 },
  { id: 't3', proyecto_id: 'p3', numero_ticket: 'TKT-003', titulo: 'Configuración de firewall', descripcion: 'Revisar reglas de firewall para VPN', estado: 'Abierto', prioridad: 'Alta', categoria: 'Soporte técnico', tipo_origen: 'proyecto', creado_por: 'u1', creado_por_nombre: 'Dr. Roberto Silva', creado_por_cliente: true, fecha_apertura: '2024-03-11', tiempo_invertido_minutos: 0 },
]

const getTipoBadge = (tipo: TipoEntidad) => {
  return { type: tipo }
}

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

  const [empresas, setEmpresas] = useState<Empresa[]>(DEMO_EMPRESAS_INICIAL)
  const [contactos, setContactos] = useState<Contacto[]>(DEMO_CONTACTOS_INICIAL)
  const [documentos, setDocumentos] = useState<Documento[]>(DEMO_DOCUMENTOS)
  const [proyectos, setProyectos] = useState<Proyecto[]>(DEMO_PROYECTOS as Proyecto[])
  const [tickets, setTickets] = useState<Ticket[]>(DEMO_TICKETS as Ticket[])

  const [searchQuery, setSearchQuery] = useState('')
  const [tipoFilter, setTipoFilter] = useState<TipoEntidad | 'todos'>('todos')
  const [industriaFilter, setIndustriaFilter] = useState<string>('todas')

  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [isModalEmpresa, setIsModalEmpresa] = useState(false)
  const [isModalContacto, setIsModalContacto] = useState(false)
  const [isModalDocumento, setIsModalDocumento] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Partial<Empresa> | null>(null)
  const [editingContacto, setEditingContacto] = useState<Partial<Contacto> | null>(null)
  const [empresaForContacto, setEmpresaForContacto] = useState<Empresa | null>(null)
  const [empresaForDocumento, setEmpresaForDocumento] = useState<Empresa | null>(null)
  const [newDocumento, setNewDocumento] = useState<{ visibilidad: 'interno' | 'publico', descripcion: string, nombreArchivo: string }>({ visibilidad: 'interno', descripcion: '', nombreArchivo: '' })
  const [notaEditando, setNotaEditando] = useState(false)
  const [notaTemporal, setNotaTemporal] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
  const getDocumentos = (empresaId: string) => documentos.filter(d => d.empresa_id === empresaId)
  const getDocumentosInternos = (empresaId: string) => documentos.filter(d => d.empresa_id === empresaId && d.visibilidad === 'interno')
  const getDocumentosPublicos = (empresaId: string) => documentos.filter(d => d.empresa_id === empresaId && d.visibilidad === 'publico')
  const getProyectos = (empresaId: string) => proyectos.filter(p => p.empresa_id === empresaId)
  const getTickets = (empresaId: string) => {
    const proyectosIds = proyectos.filter(p => p.empresa_id === empresaId).map(p => p.id!).filter(Boolean)
    return tickets.filter(t => t.proyecto_id && proyectosIds.includes(t.proyecto_id))
  }

  // Abrir modal para nueva empresa
  const handleNewEmpresa = () => {
    setEditingEmpresa({ ...EMPRESAS_VACIA, id: String(Date.now()) })
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
      setEmpresas(prev => prev.map(e =>
        e.id === empresa.id ? { ...e, ...empresa } as Empresa : e
      ))
    } else {
      setEmpresas(prev => [...prev, {
        ...empresa,
        id: String(Date.now()),
        creado_en: now
      } as Empresa])
    }

    setIsSaving(false)
    setIsModalEmpresa(false)
    setEditingEmpresa(null)
  }

  // Eliminar empresa
  const handleDeleteEmpresa = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      setEmpresas(prev => prev.filter(e => e.id !== id))
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
      setErrors({ nombre: 'El nombre es obligatorio (mínimo 2 caracteres)' })
      return
    }
    if (!editingContacto?.email) {
      setErrors({ email: 'El email es obligatorio' })
      return
    }
    // Validar formato email
    if (editingContacto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingContacto.email)) {
      setErrors({ email: 'Ingresa un email válido' })
      return
    }
    // Verificar email único en el sistema
    const emailExists = contactos.some(c => c.email.toLowerCase() === editingContacto?.email?.toLowerCase() && c.id !== editingContacto?.id)
    if (emailExists) {
      setErrors({ email: 'Este email ya está registrado para otro contacto' })
      return
    }
    if (!editingContacto?.tipo_contacto) {
      setErrors({ tipo_contacto: 'Selecciona un tipo de contacto' })
      return
    }
    // Validar teléfono si se ingresa
    if (editingContacto.telefono && !/^[\d\s\+\-\(\)]+$/.test(editingContacto.telefono)) {
      setErrors({ telefono: 'Teléfono inválido' })
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
    const nuevoDoc: Documento = {
      id: String(Date.now()),
      empresa_id: empresaId,
      archivo_id: `arch${Date.now()}`,
      visibilidad,
      descripcion,
      subido_por: user?.nombre || 'Usuario',
      fecha_subida: new Date().toISOString().split('T')[0],
      nombre_archivo: nombreArchivo
    }
    setDocumentos(prev => [...prev, nuevoDoc])
  }

  const handleDeleteDocumento = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      setDocumentos(prev => prev.filter(d => d.id !== id))
    }
  }

  // Notas internas
  const handleSaveNota = (empresaId: string) => {
    setEmpresas(prev => prev.map(e => 
      e.id === empresaId ? { ...e, notas_internas: notaTemporal } : e
    ))
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
          tipo: 'warning',
          titulo: 'Sin contacto principal',
          mensaje: `${e.nombre} no tiene un contacto principal designado.`,
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
            tipo: 'danger',
            titulo: 'Prospecto inactivo',
            mensaje: `${e.nombre} no ha tenido actividad en ${diasInactivo} días.`,
            empresaId: e.id
          })
        }
      }

      // Alerta: Proveedor sin contacto
      if (e.tipo_entidad === 'proveedor' && contactosEmpresa.length === 0) {
        alertas.push({
          id: `sin-contacto-prov-${e.id}`,
          tipo: 'warning',
          titulo: 'Proveedor sin contactos',
          mensaje: `${e.nombre} no tiene contactos asociados.`,
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

  if (!canViewClientes && !canViewProveedores) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Building2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground">
              {isTecnico 
                ? 'No tienes empresas asignadas en tus proyectos.' 
                : 'No tienes permisos para acceder al CRM.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM</h1>
          <p className="text-muted-foreground">Gestión de empresas, clientes y proveedores</p>
        </div>
        {canEdit && (
          <Button onClick={handleNewEmpresa}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
          </Button>
        )}
      </div>

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
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  alerta.tipo === 'danger' 
                    ? 'border-red-500/30 bg-red-500/5' 
                    : 'border-amber-500/30 bg-amber-500/5'
                }`}
              >
                {alerta.tipo === 'danger' ? (
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${alerta.tipo === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>
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
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar empresas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tipoFilter} onValueChange={(v) => setTipoFilter(v as TipoEntidad | 'todos')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="cliente">Clientes</SelectItem>
            <SelectItem value="proveedor">Proveedores</SelectItem>
            <SelectItem value="ambos">Ambos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={industriaFilter} onValueChange={setIndustriaFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las industrias</SelectItem>
            {INDUSTRIAS.map(ind => (
              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat
          label="Total Empresas"
          value={filteredEmpresas.length}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MiniStat
          label="Clientes"
          value={empresas.filter(e => e.tipo_entidad === 'cliente').length}
          icon={<Users className="h-5 w-5" />}
        />
        <MiniStat
          label="Proveedores"
          value={empresas.filter(e => e.tipo_entidad === 'proveedor').length}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MiniStat
          label="Contactos"
          value={contactos.length}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

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
                Nueva Empresa
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
        onClose={() => { setIsModalEmpresa(false); setEditingEmpresa(null) }}
        onSave={handleSaveEmpresa}
        empresa={editingEmpresa}
        isSaving={isSaving}
        errors={errors}
      />

      {/* Vista Detallada de Empresa */}
      <EmpresaDetailModal
        open={!!selectedEmpresa && !isModalEmpresa && !isModalContacto && !isModalDocumento}
        onClose={() => setSelectedEmpresa(null)}
        empresa={selectedEmpresa}
        contactos={contactos}
        documentos={documentos}
        proyectos={proyectos}
        canEdit={!!canEdit}
        canUploadDocuments={!!canUploadDocuments}
        onEdit={() => selectedEmpresa && handleEditEmpresa(selectedEmpresa)}
        onDelete={() => selectedEmpresa && handleDeleteEmpresa(selectedEmpresa.id)}
        onNewContacto={() => selectedEmpresa && handleNewContacto(selectedEmpresa)}
        onDeleteContacto={handleDeleteContacto}
        onNewDocumento={() => selectedEmpresa && handleNewDocumento(selectedEmpresa)}
        onDeleteDocumento={handleDeleteDocumento}
        notaEditando={notaEditando}
        notaTemporal={notaTemporal}
        onOpenNotaEdit={openNotaEdit}
        onNotaChange={setNotaTemporal}
        onSaveNota={() => selectedEmpresa && handleSaveNota(selectedEmpresa.id)}
        onCancelNota={handleCancelNota}
      />

      {/* Modal de Contacto */}
      <Dialog open={isModalContacto} onOpenChange={(open) => { if (!open) { setIsModalContacto(false); setEditingContacto(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContacto?.id ? 'Editar' : 'Nuevo'} Contacto</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                value={editingContacto?.nombre || ''}
                onChange={(e) => setEditingContacto({ ...editingContacto, nombre: e.target.value })}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input
                value={editingContacto?.cargo || ''}
                onChange={(e) => setEditingContacto({ ...editingContacto, cargo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Contacto *</Label>
              <Select
                value={editingContacto?.tipo_contacto || ''}
                onValueChange={(v) => setEditingContacto({ ...editingContacto, tipo_contacto: v as TipoContacto })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_CONTACTO.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={editingContacto?.email || ''}
                onChange={(e) => setEditingContacto({ ...editingContacto, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={editingContacto?.telefono || ''}
                onChange={(e) => setEditingContacto({ ...editingContacto, telefono: e.target.value })}
                className={errors.telefono ? 'border-red-500' : ''}
              />
              {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingContacto?.es_principal || false}
                onChange={(e) => setEditingContacto({ ...editingContacto, es_principal: e.target.checked })}
              />
              <span className="text-sm">Contacto principal</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingContacto?.recibe_facturas || false}
                onChange={(e) => setEditingContacto({ ...editingContacto, recibe_facturas: e.target.checked })}
              />
              <span className="text-sm">Recibe facturas</span>
            </label>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalContacto(false); setEditingContacto(null) }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveContacto} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Documento */}
      <Dialog open={isModalDocumento} onOpenChange={(open) => { if (!open) { setIsModalDocumento(false); setEmpresaForDocumento(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label>Visibilidad</Label>
              <Select
                value={newDocumento.visibilidad}
                onValueChange={(v: 'interno' | 'publico') => setNewDocumento({ ...newDocumento, visibilidad: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="publico">Público</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={newDocumento.descripcion}
                onChange={(e) => setNewDocumento({ ...newDocumento, descripcion: e.target.value })}
                placeholder="Descripción del documento"
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre del Archivo</Label>
              <Input
                value={newDocumento.nombreArchivo}
                onChange={(e) => setNewDocumento({ ...newDocumento, nombreArchivo: e.target.value })}
                placeholder="ej: contrato_2024.pdf"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalDocumento(false); setEmpresaForDocumento(null) }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDocumento}>
              <Upload className="h-4 w-4 mr-2" />
              Subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
