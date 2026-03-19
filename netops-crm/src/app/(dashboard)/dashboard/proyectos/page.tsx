"use client"

import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { InlineAddButton } from '@/components/ui/inline-add-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { InputNumber } from '@/components/ui/input-number'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FilterBar } from '@/components/ui/filter-bar'
import { RotateCcw, Plus, Building2, Layers, Lightbulb, PenTool, Bug, Rocket, User as UserIcon, XCircle, Archive, Settings, ChevronLeft, ChevronRight, FolderKanban, Loader2 } from 'lucide-react'
import { ModuleHeader, ModuleCard, ProjectCard, StatusBadge, ProjectDetailPanel, ModuleContainerWithPanel } from '@/components/module'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading para modales grandes
const CreateEmpresaModal = dynamic(
  () => import('@/components/module/CreateEmpresaModal').then(mod => mod.CreateEmpresaModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
const CreateUserModal = dynamic(
  () => import('@/components/module/CreateUserModal').then(mod => mod.CreateUserModal),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Proyecto, FASES, FaseProyecto, Fase, MONEDAS, HistorialProyecto } from '@/types/proyectos'
import { Tarea, EstadoTarea, PLANTILLAS_POR_FASE } from '@/types/tareas'
import { Empresa } from '@/types/crm'
import { User } from '@/types/auth'
import { useEmpresas, useContactos, useProyectos, useTareas, useHistorialProyectos } from '@/hooks'
import { VARIANT_COLORS, STATUS_COLORS, ARCHIVE_CLASSES } from '@/lib/colors'

// Importar constantes
import {
  VALIDATION_ERRORS,
} from '@/constants/proyectos'

// Lista de usuarios internos (se填充ará con datos del módulo de usuarios)
const USUARIOS_INTERNOS: User[] = []

// Constante para formulario de nuevo proyecto
const PROYECTO_VACIO: Partial<Proyecto> = {
  nombre: '',
  descripcion: '',
  fase_actual: 1,
  estado: 'activo',
  moneda: 'USD',
  monto_estimado: 0,
  probabilidad_cierre: 20,
  requiere_compras: false,
  responsable_id: '',
  responsable_nombre: '',
  contacto_tecnico_id: '',
  contacto_tecnico_nombre: '',
}

export default function ProyectosPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()

  // Hooks del store centralizado
  const [proyectos, setProyectos] = useProyectos()
  const [tareas, setTareas] = useTareas()
  const [empresas, setEmpresas] = useEmpresas()
  const [contactos] = useContactos()

  // Usuarios internos (se填充ará con datos del módulo de usuarios)
  const [usuarios, setUsuarios] = useState<User[]>(USUARIOS_INTERNOS)

  const [view, setView] = useState<'pipeline' | 'cerrados'>('pipeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Modal nuevo proyecto
  const [isModalNuevo, setIsModalNuevo] = useState(false)
  const [nuevoProyecto, setNuevoProyecto] = useState<Partial<Proyecto>>(PROYECTO_VACIO)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Modal cerrar proyecto
  const [isModalCerrar, setIsModalCerrar] = useState(false)
  const [proyectoACerrar, setProyectoACerrar] = useState<Proyecto | null>(null)
  const [motivoCierre, setMotivoCierre] = useState('')
  const [notasCierre, setNotasCierre] = useState('')
  const [errorsCierre, setErrorsCierre] = useState<Record<string, string>>({})
  const [isClosing, setIsClosing] = useState(false)

  // Modal configurar fases
  const [isModalConfigFases, setIsModalConfigFases] = useState(false)
  const [fasesEditando, setFasesEditando] = useState<Fase[]>([...FASES])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isSavingFases, setIsSavingFases] = useState(false)

  // Modal archivar proyecto
  const [isModalArchivar, setIsModalArchivar] = useState(false)
  const [proyectoAArchivar, setProyectoAArchivar] = useState<Proyecto | null>(null)
  const [clasificacionArchivo, setClasificacionArchivo] = useState<'completado' | 'inconcluso'>('completado')
  const [isArchiving, setIsArchiving] = useState(false)

  // Historial de proyectos - persistido en localStorage
  const [historialProyectos, setHistorialProyectos] = useHistorialProyectos()

  // Función para agregar evento al historial
  const agregarHistorial = useCallback((
    proyectoId: string,
    tipo: HistorialProyecto['tipo_evento'],
    descripcion: string,
    datosAnteriores?: Record<string, unknown>,
    datosNuevos?: Record<string, unknown>
  ) => {
    const nuevoEvento: HistorialProyecto = {
      id: crypto.randomUUID(),
      proyecto_id: proyectoId,
      tipo_evento: tipo,
      descripcion,
      fecha: new Date().toISOString(),
      usuario_nombre: 'Usuario Actual', // TODO: obtener del contexto de auth
      datos_anteriores: datosAnteriores,
      datos_nuevos: datosNuevos,
    }

    setHistorialProyectos(prev => ({
      ...prev,
      [proyectoId]: [nuevoEvento, ...(prev[proyectoId] || [])]
    }))
  }, [setHistorialProyectos])

  // Modal nueva empresa
  const [isModalNuevaEmpresa, setIsModalNuevaEmpresa] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_nuevaEmpresa, setNuevaEmpresa] = useState<Partial<Empresa>>({
    tipo_entidad: 'cliente',
    tipo_relacion: 'Cliente',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_errorsEmpresa, setErrorsEmpresa] = useState<Record<string, string>>({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isSavingEmpresa, setIsSavingEmpresa] = useState(false)

  // Modal nuevo usuario (para responsable)
  const [isModalNuevoUsuario, setIsModalNuevoUsuario] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_nuevoUsuario, setNuevoUsuario] = useState<Partial<User>>({
    roles: ['tecnico'],
    activo: true,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isSavingUsuario, setIsSavingUsuario] = useState(false)

  // Check if we should open the new project modal from URL param
  useMemo(() => {
    if (searchParams.get('new') === 'true') {
      setIsModalNuevo(true)
    }
  }, [searchParams])

  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isTecnico = user?.roles.includes('tecnico')
  const canMovePhases = isAdmin || isComercial || isTecnico
  const canClose = isAdmin

  // Filtrar usuarios internos (admin y técnico) para selector de responsable
  const responsablesPosibles = usuarios.filter(u =>
    u.activo && (u.roles.includes('admin') || u.roles.includes('tecnico'))
  )

  // Filtrar contactos de la empresa seleccionada para el selector de contacto técnico
  const contactosDeEmpresa = nuevoProyecto?.empresa_id
    ? contactos.filter(c => c.empresa_id === nuevoProyecto.empresa_id && c.activo)
    : []

  // Filtrar contactos técnicos de la empresa
  const contactosTecnicos = contactosDeEmpresa.filter(c => c.tipo_contacto === 'Técnico')

  const proyectosPorFase = useMemo(() => {
    const r: Record<FaseProyecto, Proyecto[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }

    // Filtrar proyectos según el rol del usuario
    const proyectosFiltrados = proyectos.filter(p => {
      if (p.estado !== 'activo') return false

      // Admin ve todos los proyectos
      if (isAdmin) return true

      // Comercial solo ve fases 1-3
      if (isComercial) return p.fase_actual <= 3

      // Técnico solo ve fases 4-5
      if (isTecnico) return p.fase_actual >= 4

      return true
    })

    proyectosFiltrados.forEach((p: Proyecto) => { if (p.fase_actual && r[p.fase_actual]) r[p.fase_actual].push(p) })
    return r
  }, [proyectos, isAdmin, isComercial, isTecnico])

  const proyectosCerrados = useMemo(() => proyectos.filter(p => p.estado === 'cerrado'), [proyectos])

  const infoTareasPorProyecto = useMemo(() => {
    const r: Record<string, {
      total: number
      completadas: number
      enProgreso: number
      bloqueadas: number
      proximaVence: string | null
      progreso: number
    }> = {}

    proyectos.forEach(p => {
      const tareasDelProyecto = tareas.filter(t => t.proyecto_id === p.id)
      const total = tareasDelProyecto.length
      const completadas = tareasDelProyecto.filter(t => t.estado === 'Completada').length
      const enProgreso = tareasDelProyecto.filter(t => t.estado === 'En progreso').length
      const bloqueadas = tareasDelProyecto.filter(t => t.estado === 'Bloqueada').length

      const pendientes = tareasDelProyecto
        .filter(t => t.estado !== 'Completada' && t.fecha_vencimiento)
        .sort((a, b) => new Date(a.fecha_vencimiento!).getTime() - new Date(b.fecha_vencimiento!).getTime())
      const proximaVence = pendientes[0]?.fecha_vencimiento || null

      r[p.id] = {
        total,
        completadas,
        enProgreso,
        bloqueadas,
        proximaVence,
        progreso: total === 0 ? 0 : Math.round((completadas / total) * 100)
      }
    })
    return r
  }, [proyectos, tareas])

  const handleFase = useCallback((id: string, fase: number) => {
    const proyecto = proyectos.find(p => p.id === id)
    if (!proyecto) return

    // Verificar permisos de movimiento de fases según rol
    if (isComercial && fase > 3) {
      alert('Como comercial solo puedes mover proyectos hasta la fase 3 (Propuesta)')
      return
    }
    if (isTecnico && fase < 4) {
      alert('Como técnico solo puedes mover proyectos a partir de la fase 4 (Implementación)')
      return
    }

    const faseAnterior = proyecto?.fase_actual
    const faseAnteriorNombre = fasesEditando.find(f => f.id === faseAnterior)?.nombre
    const faseNuevaNombre = fasesEditando.find(f => f.id === fase)?.nombre

    setProyectos(prev => prev.map(p => p.id === id ? { ...p, fase_actual: fase as FaseProyecto } : p))

    // Registrar en historial
    if (proyecto && faseAnteriorNombre && faseNuevaNombre) {
      agregarHistorial(
        id,
        'cambio_fase',
        `Cambió de fase "${faseAnteriorNombre}" a "${faseNuevaNombre}"`,
        { fase_actual: faseAnterior },
        { fase_actual: fase }
      )
    }

    // Crear tareas desde plantilla al entrar a una nueva fase
    if (proyecto && fase > (faseAnterior || 0)) {
      const plantillas = PLANTILLAS_POR_FASE.filter(p => p.fase_id === fase)
      if (plantillas.length > 0) {
        // Primero,收集 todas las tareas nuevas para obtener sus IDs
        const tareasCreadas: Tarea[] = []

        plantillas.forEach((plantilla, index) => {
          const fechaVencimiento = new Date()
          fechaVencimiento.setDate(fechaVencimiento.getDate() + plantilla.dias_vencimiento)

          // Crear la tarea
          const tareaId = crypto.randomUUID()
          const nuevaTarea: Tarea = {
            id: tareaId,
            proyecto_id: proyecto.id,
            proyecto_nombre: proyecto.nombre,
            fase_origen: fase,
            fase_nombre: faseNuevaNombre || `Fase ${fase}`,
            categoria: plantilla.categoria,
            nombre: plantilla.nombre,
            descripcion: plantilla.descripcion,
            prioridad: plantilla.prioridad,
            estado: 'Pendiente' as EstadoTarea,
            fecha_creacion: new Date().toISOString().split('T')[0],
            fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
            orden: index + 1,
            creado_por: 'Sistema',
            asignado_a_cliente: plantilla.requiere_cliente,
            subtareas: plantilla.subtareas.map((sub, subIndex) => ({
              id: crypto.randomUUID(),
              tarea_id: tareaId,
              nombre: sub.nombre,
              completada: false,
              orden: subIndex + 1,
            })),
          }
          tareasCreadas.push(nuevaTarea)
        })

        setTareas(prev => [...prev, ...tareasCreadas])
      }
    }
  }, [proyectos, isComercial, isTecnico, fasesEditando, setProyectos, setTareas, agregarHistorial])

  const handleCerrar = useCallback((proyecto: Proyecto) => {
    setProyectoACerrar(proyecto)
    setMotivoCierre('')
    setNotasCierre('')
    setErrorsCierre({})
    setIsModalCerrar(true)
  }, [setProyectoACerrar, setMotivoCierre, setNotasCierre, setErrorsCierre, setIsModalCerrar])

  const confirmarCerrar = useCallback(() => {
    setErrorsCierre({})

    // Validar motivo obligatorio
    if (!motivoCierre || motivoCierre.trim().length < 5) {
      setErrorsCierre({ motivo_cierre: VALIDATION_ERRORS.motivoCierre })
      return
    }

    if (!proyectoACerrar) return

    setIsClosing(true)

    // Cerrar el proyecto
    const faseActualNombre = fasesEditando.find(f => f.id === proyectoACerrar.fase_actual)?.nombre
    setProyectos(prev => prev.map(p => p.id === proyectoACerrar.id ? {
      ...p,
      estado: 'cerrado',
      fecha_cierre: new Date().toISOString().split('T')[0],
      motivo_cierre: motivoCierre
    } : p))

    // Registrar en historial
    agregarHistorial(
      proyectoACerrar.id,
      'cierre',
      `Proyecto cerrado en fase "${faseActualNombre}". Motivo: ${motivoCierre}`,
      { estado: 'activo' },
      { estado: 'cerrado', motivo_cierre: motivoCierre }
    )

    setIsClosing(false)
    setIsModalCerrar(false)
    setProyectoACerrar(null)
  }, [motivoCierre, proyectoACerrar, fasesEditando, setProyectos, agregarHistorial, setIsClosing, setIsModalCerrar, setProyectoACerrar])

  const handleReabrir = useCallback((id: string) => {
    const proyecto = proyectos.find(p => p.id === id)
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, estado: 'activo', motivo_cierre: undefined, fecha_cierre: undefined } : p))

    // Registrar en historial
    if (proyecto) {
      const faseNombre = fasesEditando.find(f => f.id === proyecto.fase_actual)?.nombre
      agregarHistorial(
        id,
        'reapertura',
        `Proyecto reabierto en fase "${faseNombre}"`,
        { estado: 'cerrado' },
        { estado: 'activo' }
      )
    }
  }, [proyectos, fasesEditando, setProyectos, agregarHistorial])

  const handleArchivar = useCallback((proyecto: Proyecto) => {
    setProyectoAArchivar(proyecto)
    // Clasificación automática según RN-PRO-16
    // Si está en fase 5 y todas las tareas de fase 5 completadas -> completado
    const tareasFase5 = tareas.filter(t => t.proyecto_id === proyecto.id && t.fase_origen === 5)
    const todasCompletadas = tareasFase5.length > 0 && tareasFase5.every(t => t.estado === 'Completada')
    setClasificacionArchivo(todasCompletadas ? 'completado' : 'inconcluso')
    setIsModalArchivar(true)
  }, [tareas, setProyectoAArchivar, setClasificacionArchivo, setIsModalArchivar])

  const confirmarArchivar = useCallback(() => {
    if (!proyectoAArchivar) return

    setIsArchiving(true)

    // Simular archivado: eliminar el proyecto de la lista
    setProyectos(prev => prev.filter(p => p.id !== proyectoAArchivar.id))

    // Registrar en historial
    agregarHistorial(
      proyectoAArchivar.id,
      'archivado',
      `Proyecto archivado como "${clasificacionArchivo}"`,
      { estado: 'cerrado' },
      { estado: 'archivado', clasificacion: clasificacionArchivo }
    )

    setIsArchiving(false)
    setIsModalArchivar(false)
    setProyectoAArchivar(null)
  }, [proyectoAArchivar, clasificacionArchivo, setProyectos, agregarHistorial, setIsArchiving, setIsModalArchivar, setProyectoAArchivar])

  // Abrir modal para nuevo proyecto
  const handleNewProyecto = useCallback(() => {
    setNuevoProyecto({ ...PROYECTO_VACIO, id: String(Date.now()) })
    setErrors({})
    setIsModalNuevo(true)
  }, [setNuevoProyecto, setErrors, setIsModalNuevo])

  // Guardar nuevo proyecto
  const handleSaveProyecto = useCallback(async () => {
    setErrors({})

    // Validaciones
    if (!nuevoProyecto?.nombre || nuevoProyecto.nombre.trim().length < 3) {
      setErrors({ nombre: VALIDATION_ERRORS.nombreProyecto })
      return
    }
    if (!nuevoProyecto?.empresa_id) {
      setErrors({ empresa_id: VALIDATION_ERRORS.empresaRequerida })
      return
    }
    if (!nuevoProyecto?.responsable_id) {
      setErrors({ responsable_id: VALIDATION_ERRORS.responsableRequerido })
      return
    }
    if (!nuevoProyecto?.contacto_tecnico_id) {
      setErrors({ contacto_tecnico_id: VALIDATION_ERRORS.contactoTecnicoRequerido })
      return
    }
    if (!nuevoProyecto?.moneda) {
      setErrors({ moneda: VALIDATION_ERRORS.monedaRequerida })
      return
    }
    if (nuevoProyecto.monto_estimado && nuevoProyecto.monto_estimado < 0) {
      setErrors({ monto_estimado: VALIDATION_ERRORS.montoNegativo })
      return
    }
    if (nuevoProyecto.probabilidad_cierre && (nuevoProyecto.probabilidad_cierre < 0 || nuevoProyecto.probabilidad_cierre > 100)) {
      setErrors({ probabilidad_cierre: VALIDATION_ERRORS.probabilidadInvalida })
      return
    }

    setIsSaving(true)
    try {
      await new Promise(r => setTimeout(r, 500))

      const empresa = empresas.find(e => e.id === nuevoProyecto.empresa_id)
      const responsable = usuarios.find(u => u.id === nuevoProyecto.responsable_id)
      const contactoTecnico = contactos.find(c => c.id === nuevoProyecto.contacto_tecnico_id)
      const now = new Date().toISOString().split('T')[0]

      setProyectos(prev => [...prev, {
        ...nuevoProyecto,
        id: String(Date.now()),
        cliente_nombre: empresa?.nombre,
        responsable_nombre: responsable?.nombre,
        contacto_tecnico_nombre: contactoTecnico?.nombre,
        creado_en: now,
      } as Proyecto])

      // Crear tareas desde plantilla para la fase inicial del proyecto
      const faseInicial = nuevoProyecto.fase_actual || 1
      const faseNombre = fasesEditando.find(f => f.id === faseInicial)?.nombre || `Fase ${faseInicial}`
      const plantillas = PLANTILLAS_POR_FASE.filter(p => p.fase_id === faseInicial)

      if (plantillas.length > 0) {
        const nuevasTareas: Tarea[] = plantillas.map((plantilla, index) => {
          const fechaVencimiento = new Date()
          fechaVencimiento.setDate(fechaVencimiento.getDate() + plantilla.dias_vencimiento)

          const tareaId = crypto.randomUUID()
          return {
            id: tareaId,
            proyecto_id: String(Date.now()),
            proyecto_nombre: nuevoProyecto.nombre || 'Nuevo Proyecto',
            fase_origen: faseInicial,
            fase_nombre: faseNombre,
            categoria: plantilla.categoria,
            nombre: plantilla.nombre,
            descripcion: plantilla.descripcion,
            prioridad: plantilla.prioridad,
            estado: 'Pendiente' as EstadoTarea,
            fecha_creacion: now,
            fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
            orden: index + 1,
            creado_por: 'Sistema',
            asignado_a_cliente: plantilla.requiere_cliente,
            subtareas: plantilla.subtareas.map((sub, subIndex) => ({
              id: crypto.randomUUID(),
              tarea_id: tareaId,
              nombre: sub.nombre,
              completada: false,
              orden: subIndex + 1,
            })),
          }
        })
        setTareas(prev => [...prev, ...nuevasTareas])
      }

      setIsModalNuevo(false)
      setNuevoProyecto(PROYECTO_VACIO)
    } catch (error) {
      console.error('[Proyectos] Error al guardar proyecto:', error)
    } finally {
      setIsSaving(false)
    }
  }, [nuevoProyecto, empresas, usuarios, contactos, fasesEditando, setProyectos, setTareas, setErrors, setIsSaving, setIsModalNuevo, setNuevoProyecto])

  // Guardar nueva empresa (compatible con CreateEmpresaModal)
  const handleSaveEmpresa = useCallback(async (empresa: Partial<Empresa>, isNew: boolean) => {
    if (!isNew) return // Solo manejamos creación desde proyectos

    const empresaId = String(Date.now())
    const now = new Date().toISOString().split('T')[0]

    const empresaCreada: Empresa = {
      ...empresa,
      id: empresaId,
      creado_en: now,
    } as Empresa

    const success = setEmpresas(prev => [...prev, empresaCreada])
    if (!success) {
      console.error('[Proyectos] Error al guardar empresa en localStorage')
      return
    }

    setNuevoProyecto({ ...nuevoProyecto, empresa_id: empresaId })

    setIsModalNuevaEmpresa(false)
  }, [setEmpresas, setNuevoProyecto, nuevoProyecto, setIsModalNuevaEmpresa])

  // Guardar nuevo usuario (compatible con CreateUserModal)
  const handleSaveUsuario = useCallback(async (user: Partial<User>, isNew: boolean) => {
    if (!isNew) return // Solo manejamos creación desde proyectos

    const usuarioId = String(Date.now())
    const now = new Date().toISOString().split('T')[0]

    const usuarioCreado: User = {
      ...user,
      id: usuarioId,
      nombre: user.nombre || '',
      email: user.email || '',
      roles: user.roles || ['tecnico'],
      activo: true,
      creado_en: now,
      cambiar_password_proximo_login: true,
    } as User

    setUsuarios(prev => [...prev, usuarioCreado])
    // Seleccionar automáticamente el nuevo usuario como responsable
    setNuevoProyecto({
      ...nuevoProyecto,
      responsable_id: usuarioId,
      responsable_nombre: usuarioCreado.nombre
    })

    setIsModalNuevoUsuario(false)
  }, [setUsuarios, setNuevoProyecto, nuevoProyecto, setIsModalNuevoUsuario])

  if (!isAdmin && !isComercial && !isTecnico) {
    return (
      <AccessDeniedCard icon={FolderKanban} />
    )
  }

  const selected = proyectos.find(p => p.id === selectedId)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _faseActual = fasesEditando.find(f => f.id === selected?.fase_actual)

  return (
    <>
      <ModuleContainerWithPanel
        panel={
          selected ? (
            <ProjectDetailPanel
              isOpen={!!selected}
              onClose={() => setSelectedId(null)}
              proyecto={selected}
              tareas={tareas}
              historial={selected ? historialProyectos[selected.id] || [] : []}
              onCerrar={handleCerrar}
              onArchivar={handleArchivar}
              canClose={canClose}
            />
          ) : null
        }
        panelOpen={!!selectedId}
      >
        <ModuleHeader
          title="Proyectos"
          description="Pipeline de proyectos"
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalConfigFases(true)}
                title="Configurar fases"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar Fases
              </Button>
              {canMovePhases && (
                <Button onClick={handleNewProyecto}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proyecto
                </Button>
              )}
            </>
          }
          tabs={[
            { value: 'pipeline', label: 'Pipeline' },
            { value: 'cerrados', label: 'Cerrados', count: proyectosCerrados.length }
          ]}
          activeTab={view}
          onTabChange={(v) => setView(v as 'pipeline' | 'cerrados')}
        />

        {/* Filtros */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar proyectos..."
          filters={[]}
          values={{}}
          onFilterChange={() => { }}
        />

        <StatGrid cols={5}>
          {fasesEditando.map(fase => (
            <MiniStat
              key={fase.id}
              value={proyectosPorFase[fase.id]?.length || 0}
              label={fase.nombre}
              variant="default"
              showBorder
              accentColor={fase.color}
              icon={
                fase.id === 1 ? <Lightbulb className="h-5 w-5" /> :
                  fase.id === 2 ? <PenTool className="h-5 w-5" /> :
                    fase.id === 3 ? <Layers className="h-5 w-5" /> :
                      fase.id === 4 ? <Bug className="h-5 w-5" /> :
                        <Rocket className="h-5 w-5" />
              }
            />
          ))}
        </StatGrid>

        {view === 'pipeline' && (
          <div className="-mx-6 px-6 overflow-x-auto">
            <div className="grid grid-cols-5 gap-4 min-w-[1400px] pb-2">
              {fasesEditando.map(fase => (
                <div key={fase.id} className="min-w-[280px]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: fase.color }} />
                    <h3 className="font-semibold">{fase.nombre}</h3>
                    <Badge variant="secondary" className="ml-auto">{proyectosPorFase[fase.id]?.length || 0}</Badge>
                  </div>
                  <div className="space-y-3">
                    {proyectosPorFase[fase.id]?.map(p => (
                      <ProjectCard
                        key={p.id}
                        title={p.nombre}
                        subtitle={p.cliente_nombre}
                        progress={infoTareasPorProyecto[p.id]?.progreso}
                        progressLabel="Progreso"
                        value={p.monto_estimado ? `${p.moneda} ${p.monto_estimado.toLocaleString()}` : undefined}
                        assignee={{ name: p.responsable_nombre || '' }}
                        tags={(p.tags || []).map(tag => ({ label: tag }))}
                        tasksInfo={infoTareasPorProyecto[p.id]}
                        onClick={() => setSelectedId(p.id)}
                      >
                        {canMovePhases && (
                          <div className="flex gap-1 mt-3 pt-2 border-t border-border/50">
                            {fase.id > 1 && (
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-700/50" onClick={(e) => { e.stopPropagation(); handleFase(p.id, (fase.id - 1)) }}>
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                            )}
                            {fase.id < 5 && (
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-700/50" onClick={(e) => { e.stopPropagation(); handleFase(p.id, (fase.id + 1)) }}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </ProjectCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cerrados' && (
          <div className="space-y-3">
            {proyectosCerrados.map(p => (
              <ModuleCard key={p.id} onClick={() => setSelectedId(p.id)} className="card-hover-scale bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.nombre}</h3>
                      <StatusBadge status="Cerrado" />
                    </div>
                    <p className="text-sm text-muted-foreground">{p.cliente_nombre}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cerrado: {p.fecha_cierre}</p>
                  </div>
                  {canClose && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleReabrir(p.id) }}>
                      <RotateCcw className="h-4 w-4 mr-1" /> Reabrir
                    </Button>
                  )}
                </div>
              </ModuleCard>
            ))}
          </div>
        )}
      </ModuleContainerWithPanel>

      {/* Modal Nuevo Proyecto */}
      <BaseModal open={isModalNuevo} onOpenChange={setIsModalNuevo} size="lg">
        <ModalHeader title="Nuevo Proyecto" />

        <ModalBody className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Proyecto *</Label>
            <Input
              id="nombre"
              value={nuevoProyecto.nombre || ''}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })}
              placeholder="Ej: Implementación de Red"
              className={errors.nombre ? VARIANT_COLORS.danger.borderColor : ''}
            />
            {errors.nombre && <p className={`text-xs ${VARIANT_COLORS.danger.valueColor} mt-1`}>{errors.nombre}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="empresa">Cliente *</Label>
              <InlineAddButton
                onClick={() => setIsModalNuevaEmpresa(true)}
                icon={Building2}
                label="Nueva empresa"
              />
            </div>
            <Select
              value={nuevoProyecto.empresa_id || ''}
              onValueChange={(value) => setNuevoProyecto({ ...nuevoProyecto, empresa_id: value, contacto_tecnico_id: '', contacto_tecnico_nombre: '' })}
            >
              <SelectTrigger className={errors.empresa_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.filter(e => e.tipo_entidad === 'cliente').map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>{empresa.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.empresa_id && <p className={`text-xs ${VARIANT_COLORS.danger.valueColor} mt-1`}>{errors.empresa_id}</p>}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="responsable">Responsable *</Label>
              <InlineAddButton
                onClick={() => setIsModalNuevoUsuario(true)}
                icon={UserIcon}
                label="Nuevo usuario"
              />
            </div>
            <Select
              value={nuevoProyecto.responsable_id || ''}
              onValueChange={(value) => {
                const responsable = usuarios.find(u => u.id === value)
                setNuevoProyecto({
                  ...nuevoProyecto,
                  responsable_id: value,
                  responsable_nombre: responsable?.nombre || ''
                })
              }}
            >
              <SelectTrigger className={errors.responsable_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un responsable" />
              </SelectTrigger>
              <SelectContent>
                {responsablesPosibles.map((usuario) => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    <div className="flex items-center gap-2">
                      <span>{usuario.nombre}</span>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {usuario.roles.includes('admin') ? 'Admin' : 'Técnico'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.responsable_id && <p className={`text-xs ${VARIANT_COLORS.danger.valueColor} mt-1`}>{errors.responsable_id}</p>}
          </div>

          <div>
            <Label htmlFor="contacto_tecnico">Contacto Técnico del Cliente *</Label>
            <Select
              value={nuevoProyecto.contacto_tecnico_id || ''}
              onValueChange={(value) => {
                const contacto = contactos.find(c => c.id === value)
                setNuevoProyecto({
                  ...nuevoProyecto,
                  contacto_tecnico_id: value,
                  contacto_tecnico_nombre: contacto?.nombre || ''
                })
              }}
              disabled={!nuevoProyecto.empresa_id}
            >
              <SelectTrigger className={errors.contacto_tecnico_id ? 'border-red-500' : ''}>
                <SelectValue placeholder={nuevoProyecto.empresa_id ? "Selecciona un contacto" : "Selecciona primero un cliente"} />
              </SelectTrigger>
              <SelectContent>
                {contactosTecnicos.map((contacto) => (
                  <SelectItem key={contacto.id} value={contacto.id}>
                    <div className="flex flex-col">
                      <span>{contacto.nombre}</span>
                      <span className="text-xs text-muted-foreground">{contacto.cargo}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contacto_tecnico_id && <p className={`text-xs ${VARIANT_COLORS.danger.valueColor} mt-1`}>{errors.contacto_tecnico_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputNumber
              label="Monto Estimado"
              value={nuevoProyecto.monto_estimado || ''}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, monto_estimado: Number(e.target.value) })}
              placeholder="0"
              showCurrency
              currency={nuevoProyecto.moneda || 'USD'}
              currencies={MONEDAS}
              onCurrencyChange={(value) => setNuevoProyecto({ ...nuevoProyecto, moneda: value as 'USD' | 'MXN' | 'EUR' })}
              error={errors.monto_estimado}
              className={errors.monto_estimado ? 'border-red-500' : ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="probabilidad">Probabilidad de Cierre (%)</Label>
              <Input
                id="probabilidad"
                type="number"
                min={0}
                max={100}
                value={nuevoProyecto.probabilidad_cierre || ''}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, probabilidad_cierre: Number(e.target.value) })}
                placeholder="20"
                className={errors.probabilidad_cierre ? 'border-red-500' : ''}
              />
              {errors.probabilidad_cierre && <p className={`text-xs ${VARIANT_COLORS.danger.valueColor} mt-1`}>{errors.probabilidad_cierre}</p>}
            </div>
            <div>
              <Label htmlFor="fecha">Fecha Estimada de Fin</Label>
              <Input
                id="fecha"
                type="date"
                value={nuevoProyecto.fecha_estimada_fin || ''}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fecha_estimada_fin: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="requiere_compras"
                checked={nuevoProyecto.requiere_compras || false}
                onCheckedChange={(checked) => setNuevoProyecto({ ...nuevoProyecto, requiere_compras: checked === true })}
              />
              <Label htmlFor="requiere_compras" className="text-sm font-normal cursor-pointer">
                Requiere compras
              </Label>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalNuevo(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveProyecto} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Crear Proyecto'
            )}
          </Button>
        </ModalFooter>
      </BaseModal>

      {/* Modal Nueva Empresa - usa el mismo componente que CRM */}
      <CreateEmpresaModal
        open={isModalNuevaEmpresa}
        onOpenChange={setIsModalNuevaEmpresa}
        onSave={handleSaveEmpresa}
        empresa={null}
        isSaving={false}
        userRoles={user?.roles || []}
      />

      {/* Modal Nuevo Usuario - para crear responsable */}
      <CreateUserModal
        open={isModalNuevoUsuario}
        onOpenChange={setIsModalNuevoUsuario}
        onSave={handleSaveUsuario}
        user={null}
        isSaving={false}
      />

      {/* Modal Cerrar Proyecto */}
      <BaseModal open={isModalCerrar} onOpenChange={setIsModalCerrar} size="md">
        <ModalHeader
          title={
            <span className="flex items-center gap-2">
              <XCircle className={`h-5 w-5 ${STATUS_COLORS.error.text}`} />
              Cerrar Proyecto
            </span>
          }
        />

        <ModalBody className="space-y-4">
          <p className="text-sm text-muted-foreground">
            El proyecto <span className="font-semibold text-foreground">{proyectoACerrar?.nombre}</span> pasar&aacute; a estado &quot;Cerrado&quot; y desaparecer&aacute; del pipeline.
          </p>

          <div>
            <Label htmlFor="motivo_cierre">Motivo del cierre *</Label>
            <Select
              value={motivoCierre}
              onValueChange={(value) => setMotivoCierre(value)}
            >
              <SelectTrigger className={errorsCierre.motivo_cierre ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Proyecto completado">Proyecto completado</SelectItem>
                <SelectItem value="Cancelado por el cliente">Cancelado por el cliente</SelectItem>
                <SelectItem value="Pérdida de interés">Pérdida de interés</SelectItem>
                <SelectItem value="Presupuesto insuficiente">Presupuesto insuficiente</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errorsCierre.motivo_cierre && <p className={`text-xs ${VARIANT_COLORS.danger.valueColor} mt-1`}>{errorsCierre.motivo_cierre}</p>}
          </div>

          <div>
            <Label htmlFor="notas_cierre">Notas adicionales (opcional)</Label>
            <Textarea
              id="notas_cierre"
              value={notasCierre}
              onChange={(e) => setNotasCierre(e.target.value)}
              placeholder="Agrega cualquier nota adicional sobre el cierre del proyecto..."
              rows={3}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalCerrar(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={confirmarCerrar}
            disabled={isClosing}
          >
            {isClosing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cerrando...
              </>
            ) : (
              'Cerrar Proyecto'
            )}
          </Button>
        </ModalFooter>
      </BaseModal>

      {/* Modal Archivar Proyecto */}
      <BaseModal open={isModalArchivar} onOpenChange={setIsModalArchivar} size="md">
        <ModalHeader
          title={
            <span className="flex items-center gap-2">
              <Archive className={`h-5 w-5 ${STATUS_COLORS.warning.text}`} />
              Archivar Proyecto
            </span>
          }
        />

        <ModalBody className="space-y-4">
          <p className="text-sm text-muted-foreground">
            El proyecto <span className="font-semibold text-foreground">{proyectoAArchivar?.nombre}</span> será archivado y movido a Google Drive.
          </p>

          <div className={`${ARCHIVE_CLASSES.container.bg} border ${ARCHIVE_CLASSES.container.border} rounded-lg p-4`}>
            <p className={`text-sm ${ARCHIVE_CLASSES.inconclusive.text} mb-2`}>
              Clasificación automática:
            </p>
            <div className="flex items-center gap-2">
              <Badge variant={clasificacionArchivo === 'completado' ? 'default' : 'secondary'} className={clasificacionArchivo === 'completado' ? ARCHIVE_CLASSES.completado.badge : ''}>
                {clasificacionArchivo === 'completado' ? '✓ Completado' : '⚠ Inconcluso'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {clasificacionArchivo === 'completado'
                ? 'El proyecto se cerró desde fase 5 con todas las tareas completadas.'
                : 'El proyecto no cumple los criterios de completado.'}
            </p>
          </div>

          <div>
            <Label>Clasificación (puedes cambiarla)</Label>
            <div className="flex gap-4 mt-2">
              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 ${clasificacionArchivo === 'completado' ? `${STATUS_COLORS.success.border} ${STATUS_COLORS.success.bg}` : 'border-slate-700'
                }`}>
                <input
                  type="radio"
                  name="clasificacion"
                  checked={clasificacionArchivo === 'completado'}
                  onChange={() => setClasificacionArchivo('completado')}
                  className="sr-only"
                />
                <span className="text-sm">Completado</span>
              </label>
              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 ${clasificacionArchivo === 'inconcluso' ? `${STATUS_COLORS.warning.border} ${STATUS_COLORS.warning.bg}` : 'border-slate-700'
                }`}>
                <input
                  type="radio"
                  name="clasificacion"
                  checked={clasificacionArchivo === 'inconcluso'}
                  onChange={() => setClasificacionArchivo('inconcluso')}
                  className="sr-only"
                />
                <span className="text-sm">Inconcluso</span>
              </label>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Destino en Drive:</p>
            <p className="text-xs mt-1 font-mono">
              {clasificacionArchivo === 'completado'
                ? '/Archivo Historico/Completados/2026/proyecto'
                : '/Archivo Historico/Inconclusos/2026/proyecto'}
            </p>
          </div>
        </ModalBody >

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalArchivar(false)}>
            Cancelar
          </Button>
          <Button
            variant="default"
            className={`${STATUS_COLORS.warning.bg} hover:${STATUS_COLORS.warning.bg.replace('/15', '/25')}`}
            onClick={confirmarArchivar}
            disabled={isArchiving}
          >
            {isArchiving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Archivando...
              </>
            ) : (
              'Archivar Proyecto'
            )}
          </Button>
        </ModalFooter>
      </BaseModal >

      {/* Modal Configurar Fases */}
      < BaseModal open={isModalConfigFases} onOpenChange={setIsModalConfigFases} size="lg" >
        <ModalHeader
          title={
            <span className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurar Fases del Pipeline
            </span>
          }
        />

        <ModalBody className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Personaliza los nombres, colores y probabilidades de cada fase del pipeline.
          </p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {fasesEditando.map((fase, index) => (
              <div
                key={fase.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                    <Input
                      value={fase.nombre}
                      onChange={(e) => {
                        const nuevasFases = [...fasesEditando]
                        nuevasFases[index] = { ...fase, nombre: e.target.value }
                        setFasesEditando(nuevasFases)
                      }}
                      placeholder="Nombre de la fase"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={fase.color}
                        onChange={(e) => {
                          const nuevasFases = [...fasesEditando]
                          nuevasFases[index] = { ...fase, color: e.target.value }
                          setFasesEditando(nuevasFases)
                        }}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={fase.color}
                        onChange={(e) => {
                          const nuevasFases = [...fasesEditando]
                          nuevasFases[index] = { ...fase, color: e.target.value }
                          setFasesEditando(nuevasFases)
                        }}
                        placeholder="#Hex"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Probabilidad (%)</label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={fase.probabilidad_default}
                      onChange={(e) => {
                        const nuevasFases = [...fasesEditando]
                        nuevasFases[index] = { ...fase, probabilidad_default: parseInt(e.target.value) || 0 }
                        setFasesEditando(nuevasFases)
                      }}
                      placeholder="0-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFasesEditando([...FASES])}
            >
              Restaurar Valores Predeterminados
            </Button>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalConfigFases(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setIsModalConfigFases(false)
              // Aquí se guardaría en Supabase
              alert('Configuración guardada (solo en memoria)')
            }}
            disabled={false}
          >
            Guardar Configuración
          </Button>
        </ModalFooter>
      </BaseModal >
    </>
  )
}
