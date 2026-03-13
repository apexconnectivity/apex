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

      {/* Listado */}
      {selectedEmpresa && (
        <Dialog open={!!selectedEmpresa} onOpenChange={() => setSelectedEmpresa(null)}>
          <DialogContent size="xl">
            <DialogHeader>
              <DialogTitle>{selectedEmpresa.nombre}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="info">
              <TabsList className="w-full">
                <TabsTrigger value="info" className="flex-1">Información</TabsTrigger>
                <TabsTrigger value="contactos" className="flex-1">Contactos ({getContactos(selectedEmpresa.id).length})</TabsTrigger>
                <TabsTrigger value="facturacion" className="flex-1">Facturación</TabsTrigger>
                <TabsTrigger value="documentos" className="flex-1">Documentos ({getDocumentos(selectedEmpresa.id).length})</TabsTrigger>
                <TabsTrigger value="notas" className="flex-1">Notas</TabsTrigger>
                {selectedEmpresa.tipo_entidad === 'cliente' && (
                  <TabsTrigger value="proyectos" className="flex-1">Proyectos ({getProyectos(selectedEmpresa.id).length})</TabsTrigger>
                )}
                <TabsTrigger value="tickets" className="flex-1">Tickets ({getTickets(selectedEmpresa.id).length})</TabsTrigger>
              </TabsList>

              <TabsContent value="facturacion" className="mt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Datos Fiscales</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Razón social:</span> {selectedEmpresa.razon_social || '-'}</p>
                      <p><span className="text-muted-foreground">RFC:</span> {selectedEmpresa.rfc || '-'}</p>
                      <p><span className="text-muted-foreground">Régimen:</span> {selectedEmpresa.regimen_fiscal || '-'}</p>
                      <p><span className="text-muted-foreground">Dirección fiscal:</span> {selectedEmpresa.direccion_fiscal || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Datos de Pago</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Email facturación:</span> {selectedEmpresa.email_facturacion || '-'}</p>
                      <p><span className="text-muted-foreground">Método pago:</span> {selectedEmpresa.metodo_pago || '-'}</p>
                      <p><span className="text-muted-foreground">Plazo:</span> {selectedEmpresa.plazo_pago ? `${selectedEmpresa.plazo_pago} días` : '-'}</p>
                      <p><span className="text-muted-foreground">Moneda:</span> {selectedEmpresa.moneda_preferida || '-'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

                <TabsContent value="documentos" className="mt-4">
                  <div className="space-y-4">
                    {canUploadDocuments && (
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleNewDocumento(selectedEmpresa)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Documento
                        </Button>
                      </div>
                    )}
                    
                    {getDocumentos(selectedEmpresa.id).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No hay documentos asociados a esta empresa</p>
                        {canEdit && <p className="text-sm mt-1">点击 "Subir Documento" para agregar</p>}
                      </div>
                    ) : (
                      <>
                        {getDocumentosInternos(selectedEmpresa.id).length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Lock className="h-4 w-4 text-amber-400" />
                              <span className="text-sm font-medium">Documentos Internos</span>
                              <Badge variant="secondary" className="text-xs">{getDocumentosInternos(selectedEmpresa.id).length}</Badge>
                            </div>
                            <div className="space-y-2">
                              {getDocumentosInternos(selectedEmpresa.id).map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{doc.descripcion}</p>
                                      <p className="text-xs text-muted-foreground">{doc.nombre_archivo} • {doc.fecha_subida} • {doc.subido_por}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver documento">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    {canEdit && (
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDeleteDocumento(doc.id)} title="Eliminar">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {getDocumentosPublicos(selectedEmpresa.id).length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3 mt-4">
                              <Globe2 className="h-4 w-4 text-green-400" />
                              <span className="text-sm font-medium">Documentos Públicos</span>
                              <Badge variant="secondary" className="text-xs">{getDocumentosPublicos(selectedEmpresa.id).length}</Badge>
                              <Badge variant="outline" className="text-xs ml-2">Visibles para cliente</Badge>
                            </div>
                            <div className="space-y-2">
                              {getDocumentosPublicos(selectedEmpresa.id).map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{doc.descripcion}</p>
                                      <p className="text-xs text-muted-foreground">{doc.nombre_archivo} • {doc.fecha_subida} • {doc.subido_por}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver documento">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    {canEdit && (
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDeleteDocumento(doc.id)} title="Eliminar">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notas" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium">Notas Internas</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Solo visible para el equipo</Badge>
                    </div>
                    
                    {notaEditando ? (
                      <div className="space-y-3">
                        <Textarea
                          value={notaTemporal}
                          onChange={e => setNotaTemporal(e.target.value)}
                          placeholder="Agrega notas internas sobre esta empresa... (solo visible para el equipo)"
                          className="min-h-[150px]"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={handleCancelNota}>
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={() => handleSaveNota(selectedEmpresa.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Guardar Nota
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedEmpresa.notas_internas ? (
                          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <p className="text-sm whitespace-pre-wrap">{selectedEmpresa.notas_internas}</p>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No hay notas internas</p>
                          </div>
                        )}
                        {canEdit && (
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={openNotaEdit}>
                              <Edit className="h-4 w-4 mr-2" />
                              {selectedEmpresa.notas_internas ? 'Editar Nota' : 'Agregar Nota'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {selectedEmpresa.tipo_entidad === 'cliente' && (
                  <TabsContent value="proyectos" className="mt-4">
                    <div className="space-y-3">
                      {getProyectos(selectedEmpresa.id).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>No hay proyectos asociados</p>
                        </div>
                      ) : (
                        getProyectos(selectedEmpresa.id).map(proyecto => {
                          const fase = FASES.find(f => f.id === proyecto.fase_actual)
                          return (
                            <Link 
                              key={proyecto.id}
                              href={`/dashboard/proyectos?id=${proyecto.id}`}
                              onClick={() => setSelectedEmpresa(null)}
                              className="block"
                            >
                              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-800/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${fase?.color}20` }}>
                                    <FileText className="h-5 w-5" style={{ color: fase?.color }} />
                                  </div>
                                  <div>
                                    <p className="font-medium">{proyecto.nombre}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {fase?.nombre} • {proyecto.estado === 'activo' ? 'Activo' : 'Cerrado'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">{proyecto.estado === 'activo' ? 'En curso' : 'Finalizado'}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {proyecto.fecha_inicio} - {proyecto.fecha_estimada_fin || proyecto.fecha_real_fin}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          )
                        })
                      )}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="tickets" className="mt-4">
                  <div className="space-y-3">
                    {getTickets(selectedEmpresa.id).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No hay tickets asociados</p>
                      </div>
                    ) : (
                      getTickets(selectedEmpresa.id).map(ticket => (
                        <Link 
                          key={ticket.id}
                          href={`/dashboard/soporte?id=${ticket.id}`}
                          onClick={() => setSelectedEmpresa(null)}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                ticket.prioridad === 'Urgente' ? 'bg-red-500/20' :
                                ticket.prioridad === 'Alta' ? 'bg-orange-500/20' :
                                ticket.prioridad === 'Media' ? 'bg-yellow-500/20' :
                                'bg-slate-700'
                              }`}>
                                <AlertCircle className={`h-5 w-5 ${
                                  ticket.prioridad === 'Urgente' ? 'text-red-400' :
                                  ticket.prioridad === 'Alta' ? 'text-orange-400' :
                                  ticket.prioridad === 'Media' ? 'text-yellow-400' :
                                  'text-slate-400'
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium">{ticket.numero_ticket}: {ticket.titulo}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ticket.estado} • {ticket.prioridad} • {ticket.categoria}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                ticket.estado === 'Abierto' ? 'destructive' :
                                ticket.estado === 'En progreso' ? 'default' :
                                ticket.estado === 'Resuelto' ? 'secondary' :
                                'outline'
                              }>
                                {ticket.estado}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">{ticket.fecha_apertura}</p>
                            </div>
                          </div>
                        </Link>
                      )}
                    }
                  </div>
                </TabsContent>
              </Tabs>
            </DialogBody>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
