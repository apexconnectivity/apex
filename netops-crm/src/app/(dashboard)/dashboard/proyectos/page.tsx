"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Plus, FolderKanban, Rocket, MoreHorizontal, Archive, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModuleHeader, ModuleCard, ProjectCard, ModuleContainerWithPanel } from '@/components/module'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ProjectDetailPanel = dynamic(
  () => import('@/components/module/ProjectDetailPanel').then(mod => mod.ProjectDetailPanel),
  { loading: () => <div className="p-4"><Skeleton className="h-64 w-full" /></div>, ssr: false }
)
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { CreateProjectModal } from '@/components/module/CreateProjectModal'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Proyecto, FASES, FaseProyecto, HistorialProyecto } from '@/types/proyectos'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tarea, EstadoTarea, PLANTILLAS_POR_FASE } from '@/types/tareas'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Empresa } from '@/types/crm'
import { User } from '@/types/auth'
import { useEmpresas, useProyectos, useTareas, useHistorialProyectos } from '@/hooks'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VARIANT_COLORS, STATUS_COLORS, ARCHIVE_CLASSES } from '@/lib/colors'

// Importar constantes
// eslint-disable-next-line @typescript-eslint/no-unused-vars


// USUARIOS_INTERNOS removidos para usar datos reales del módulo de usuarios

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
  const [proyectos, setProyectos, , deleteProyecto, archiveProyecto] = useProyectos()
  const tareasHook = useTareas()
  const tareas = tareasHook.tasks
  const createTarea = tareasHook.createTask
  const deleteTasksByProject = tareasHook.deleteTasksByProject
  const [empresas] = useEmpresas()

  // Usuarios reales
  const [usuarios] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])

  const [view, setView] = useState<'pipeline' | 'cerrados' | 'archivados'>('pipeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Modal nuevo proyecto (reusable)
  const [isModalNuevo, setIsModalNuevo] = useState(false)
  const [proyectoEditando, setProyectoEditando] = useState<Partial<Proyecto> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Modal cerrar proyecto
  const [isModalCerrar, setIsModalCerrar] = useState(false)
  const [proyectoACerrar, setProyectoACerrar] = useState<Proyecto | null>(null)
  const [motivoCierre, setMotivoCierre] = useState('')
  const [notasCierre, setNotasCierre] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars
  const [errorsCierre, setErrorsCierre] = useState<Record<string, string>>({}) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isClosing, setIsClosing] = useState(false) // eslint-disable-line @typescript-eslint/no-unused-vars

  // Fases del pipeline (usando constante, no editable)
  const fases = FASES

  // Modal archivar proyecto
  const [isModalArchivar, setIsModalArchivar] = useState(false)
  const [proyectoAArchivar, setProyectoAArchivar] = useState<Proyecto | null>(null)
  const [clasificacionArchivo, setClasificacionArchivo] = useState<'completado' | 'inconcluso'>('completado')
  const [isArchiving, setIsArchiving] = useState(false) // eslint-disable-line @typescript-eslint/no-unused-vars

  // Modal eliminar proyecto (solo admins)
  const [isModalEliminar, setIsModalEliminar] = useState(false)
  const [proyectoAEliminar, setProyectoAEliminar] = useState<Proyecto | null>(null)

  // Historial de proyectos
  const [historialProyectos, setHistorialProyectos] = useHistorialProyectos()

  // Modal nueva empresa
  const [isModalNuevaEmpresa, setIsModalNuevaEmpresa] = useState(false) // eslint-disable-line @typescript-eslint/no-unused-vars

  // Modal nuevo usuario
  const [isModalNuevoUsuario, setIsModalNuevoUsuario] = useState(false) // eslint-disable-line @typescript-eslint/no-unused-vars

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
      usuario_nombre: user?.nombre || 'Usuario Actual',
      datos_anteriores: datosAnteriores,
      datos_nuevos: datosNuevos,
    }

    setHistorialProyectos(prev => ({
      ...prev,
      [proyectoId]: [nuevoEvento, ...(prev[proyectoId] || [])]
    }))
  }, [user, setHistorialProyectos])

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsModalNuevo(true)
    }
  }, [searchParams])

  const isAdmin = user?.roles.includes('admin')
  const isComercial = user?.roles.includes('comercial')
  const isTecnico = user?.roles.includes('especialista')
  const canMovePhases = isAdmin || isComercial || isTecnico

  // Efecto para avance automático de fase cuando todas las tareas de la fase actual están completadas
  useEffect(() => {
    // Solo admins pueden controlar el avance automático de fase
    if (!isAdmin) return
    
    const timer = setTimeout(() => {
      proyectos.forEach(p => {
        // Solo proyectos activos que no estén en la última fase
        if (p.estado !== 'activo' || p.fase_actual >= 5) return
        
        // Obtener tareas de la fase actual del proyecto
        const tareasFaseActual = tareas.filter(t => 
          t.proyecto_id === p.id && 
          t.fase_origen === p.fase_actual
        )
        
        // Verificar si hay tareas en esta fase y si todas están completadas
        if (tareasFaseActual.length > 0) {
          const todasCompletadas = tareasFaseActual.every(t => t.estado === 'Completada')
          
          if (todasCompletadas) {
            // Avanzar automáticamente a la siguiente fase
            const faseAnterior = p.fase_actual
            const faseNueva = faseAnterior + 1
            const faseNuevaNombre = fases.find(f => f.id === faseNueva)?.nombre
            const faseAnteriorNombre = fases.find(f => f.id === faseAnterior)?.nombre
            
            if (faseAnteriorNombre && faseNuevaNombre) {
              agregarHistorial(p.id, 'cambio_fase', `Cambió de fase a "${faseNuevaNombre}"`)
            }
            
            // Actualizar el proyecto
            setProyectos(prev => prev.map(proj => 
              proj.id === p.id ? { ...proj, fase_actual: faseNueva as FaseProyecto } : proj
            ))
            
            // Crear tareas de la nueva fase SOLO si no existen ya para esa fase
            const plantillas = PLANTILLAS_POR_FASE.filter(pl => pl.fase_id === faseNueva)
            if (plantillas.length > 0) {
              // VERIFICAR SI YA EXISTEN TAREAS PARA ESTA FASE
              const tareasExistentes = tareas.filter(t => 
                t.proyecto_id === p.id && 
                t.fase_origen === faseNueva
              )
              
              if (tareasExistentes.length === 0) {
                // Crear tareas solo si no existen
                plantillas.forEach(pl => {
                  const v = new Date()
                  v.setDate(v.getDate() + pl.dias_vencimiento)
                  createTarea({
                    proyecto_id: p.id,
                    proyecto_nombre: p.nombre,
                    fase_origen: faseNueva,
                    fase_nombre: faseNuevaNombre || '',
                    categoria: pl.categoria,
                    nombre: pl.nombre,
                    descripcion: pl.descripcion,
                    prioridad: pl.prioridad,
                    estado: 'Pendiente' as EstadoTarea,
                    fecha_vencimiento: v.toISOString().split('T')[0],
                    orden: plantillas.indexOf(pl) + 1,
                    creado_por: 'Sistema',
                    asignado_a_cliente: pl.requiere_cliente,
                  })
                })
              }
            }
          }
        }
      })
    }, 1000) // Delay para evitar múltiples actualizaciones simultáneas

    return () => clearTimeout(timer)
  }, [tareas, proyectos, isAdmin, fases, setProyectos, createTarea, agregarHistorial])

  const proyectosPorFase = useMemo(() => {
    const r: Record<number, Proyecto[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }
    const filtered = proyectos.filter(p => {
      if (p.estado !== 'activo') return false

      // Filtro por empresa para clientes
      if (user?.roles.includes('cliente')) {
        return p.empresa_id === user.empresa_id
      }

      if (isAdmin) return true
      if (isComercial) return p.fase_actual <= 3
      if (isTecnico) return p.fase_actual >= 4
      return true
    })
    filtered.forEach(p => { if (r[p.fase_actual]) r[p.fase_actual].push(p) })
    return r
  }, [proyectos, isAdmin, isComercial, isTecnico, user])

  const proyectosCerrados = useMemo(() => {
    return proyectos.filter(p => {
      if (p.estado !== 'cerrado') return false
      if (user?.roles.includes('cliente')) {
        return p.empresa_id === user.empresa_id
      }
      return true
    })
  }, [proyectos, user])

  const proyectosArchivados = useMemo(() => {
    return proyectos.filter(p => {
      if (p.estado !== 'archivado') return false
      if (user?.roles.includes('cliente')) {
        return p.empresa_id === user.empresa_id
      }
      return true
    })
  }, [proyectos, user])

  const infoTareasPorProyecto = useMemo(() => {
    type InfoTareasProyecto = {
      total: number
      completadas: number
      progreso: number
      enProgreso: number
      bloqueadas: number
      proximaVence: string | null
    }
    const r: Record<string, InfoTareasProyecto> = {}
    proyectos.forEach(p => {
      const pTareas = tareas.filter(t => t.proyecto_id === p.id)
      const total = pTareas.length
      const completadas = pTareas.filter(t => t.estado === 'Completada').length
      r[p.id] = {
        total,
        completadas,
        progreso: total === 0 ? 0 : Math.round((completadas / total) * 100),
        enProgreso: pTareas.filter(t => t.estado === 'En progreso').length,
        bloqueadas: pTareas.filter(t => t.estado === 'Bloqueada').length,
        proximaVence: null,
      }
    })
    return r
  }, [proyectos, tareas])

  const handleCerrar = useCallback((proyecto: Proyecto) => {
    setProyectoACerrar(proyecto); setMotivoCierre(''); setNotasCierre(''); setIsModalCerrar(true)
  }, [])

  const confirmarCerrar = useCallback(() => {
    if (!proyectoACerrar || !motivoCierre) return
    setIsClosing(true)
    setProyectos(prev => prev.map(p => p.id === proyectoACerrar.id ? { ...p, estado: 'cerrado', fecha_cierre: new Date().toISOString().split('T')[0], motivo_cierre: motivoCierre } : p))
    agregarHistorial(proyectoACerrar.id, 'cierre', `Proyecto cerrado. Motivo: ${motivoCierre}`)
    setIsClosing(false); setIsModalCerrar(false); setProyectoACerrar(null)
  }, [proyectoACerrar, motivoCierre, setProyectos, agregarHistorial])

  const handleReabrir = useCallback((id: string) => {
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, estado: 'activo', motivo_cierre: undefined, fecha_cierre: undefined } : p))
    agregarHistorial(id, 'reapertura', 'Proyecto reabierto')
  }, [setProyectos, agregarHistorial])

  // Handler para archivar permanentemente (solo proyectos cerrados, solo admins)
  const handleArchivarPermanente = useCallback((proyecto: Proyecto) => {
    archiveProyecto(proyecto.id)
    agregarHistorial(proyecto.id, 'archivado', 'Archivado permanentemente')
  }, [archiveProyecto, agregarHistorial])

  // Handler para eliminar permanentemente (solo proyectos cerrados, solo admins)
  const handleEliminarPermanente = useCallback((proyecto: Proyecto) => {
    setProyectoAEliminar(proyecto)
    setIsModalEliminar(true)
  }, [])

  const confirmarEliminar = useCallback(async () => {
    if (!proyectoAEliminar) return
    
    // Eliminar todas las tareas asociadas al proyecto
    await deleteTasksByProject(proyectoAEliminar.id)
    
    // Eliminar el proyecto
    deleteProyecto(proyectoAEliminar.id)
    agregarHistorial(proyectoAEliminar.id, 'archivado', 'Proyecto eliminado permanentemente con todas sus tareas')
    setIsModalEliminar(false)
    setProyectoAEliminar(null)
  }, [proyectoAEliminar, deleteProyecto, deleteTasksByProject, agregarHistorial])

  const handleArchivar = useCallback((proyecto: Proyecto) => {
    setProyectoAArchivar(proyecto)
    const tFase5 = tareas.filter(t => t.proyecto_id === proyecto.id && t.fase_origen === 5)
    setClasificacionArchivo(tFase5.length > 0 && tFase5.every(t => t.estado === 'Completada') ? 'completado' : 'inconcluso')
    setIsModalArchivar(true)
  }, [tareas])

  // Handler para retroceder fase manualmente
  const handleRetrocederFase = useCallback((proyecto: Proyecto) => {
    if (proyecto.fase_actual <= 1) return
    const faseAnterior = (proyecto.fase_actual - 1) as FaseProyecto
    const faseAnteriorNombre = ['Prospecto', 'Diagnóstico', 'Propuesta', 'Implementación', 'Cierre'][faseAnterior - 1]
    
    setProyectos(prev => prev.map(p => 
      p.id === proyecto.id 
        ? { ...p, fase_actual: faseAnterior, fase_nombre: faseAnteriorNombre }
        : p
    ))
    agregarHistorial(proyecto.id, 'cambio_fase', `Fase retrocedida manualmente a ${faseAnteriorNombre}`)
  }, [setProyectos, agregarHistorial])

  const confirmarArchivar = useCallback(() => {
    if (!proyectoAArchivar) return
    setIsArchiving(true)
    setProyectos(prev => prev.filter(p => p.id !== proyectoAArchivar.id))
    agregarHistorial(proyectoAArchivar.id, 'archivado', `Archivado como ${clasificacionArchivo}`)
    setTimeout(() => { setIsArchiving(false); setIsModalArchivar(false); setProyectoAArchivar(null) }, 100)
  }, [proyectoAArchivar, clasificacionArchivo, setProyectos, agregarHistorial])

  const handleNewProyecto = useCallback(() => {
    setProyectoEditando(null)
    setIsModalNuevo(true)
  }, [])

  const handleEditProyecto = useCallback((proyecto: Proyecto) => {
    setProyectoEditando(proyecto)
    setIsModalNuevo(true)
  }, [])

  const handleSaveProyecto = useCallback(async (data: Partial<Proyecto>, isNew: boolean) => {
    setIsSaving(true)
    const proyectoId = data.id || crypto.randomUUID()
    const now = new Date().toISOString().split('T')[0]

    // Buscar info adicional necesaria
    const empresa = empresas.find(e => e.id === data.empresa_id)
    const responsable = usuarios.find(u => u.id === data.responsable_id)

    const nuevoProyectoData: Proyecto = {
      ...PROYECTO_VACIO,
      ...data,
      id: proyectoId,
      cliente_nombre: empresa?.nombre || data.cliente_nombre,
      responsable_nombre: responsable?.nombre || data.responsable_nombre,
      creado_en: now,
    } as Proyecto

    if (isNew) {
      setProyectos(prev => [...prev, nuevoProyectoData])
      agregarHistorial(proyectoId, 'creacion', 'Proyecto creado')

      // Generar tareas automáticas para la fase inicial
      const fase = nuevoProyectoData.fase_actual || 1
      const plantillas = PLANTILLAS_POR_FASE.filter(p => p.fase_id === fase)

      if (plantillas.length > 0) {
        // Crear tareas usando el servicio
        await Promise.all(plantillas.map(async (pl, i) => {
          const v = new Date()
          v.setDate(v.getDate() + pl.dias_vencimiento)
          await createTarea({
            proyecto_id: proyectoId,
            proyecto_nombre: nuevoProyectoData.nombre,
            fase_origen: fase,
            fase_nombre: fases.find(f => f.id === fase)?.nombre || '',
            categoria: pl.categoria,
            nombre: pl.nombre,
            descripcion: pl.descripcion,
            prioridad: pl.prioridad,
            estado: 'Pendiente' as EstadoTarea,
            fecha_vencimiento: v.toISOString().split('T')[0],
            orden: i + 1,
            creado_por: 'Sistema',
            asignado_a_cliente: pl.requiere_cliente,
          })
        }))
      }
    } else {
      setProyectos(prev => prev.map(p => p.id === proyectoId ? { ...p, ...nuevoProyectoData } : p))
      agregarHistorial(proyectoId, 'edicion', 'Datos del proyecto actualizados')
    }

    setIsSaving(false)
    setIsModalNuevo(false)
  }, [empresas, usuarios, fases, setProyectos, createTarea, agregarHistorial])

  // Handlers para creación inline quitados de aquí ya que el ModalReusable los maneja interna o se inyectan como props si es necesario.
  // Pero como CreateProjectModal ya importa CreateEmpresaModal y CreateUserModal, solo necesitamos pasarle las listas base.


  if (!isAdmin && !isComercial && !isTecnico && !user?.roles.includes('cliente')) return <AccessDeniedCard icon={FolderKanban} />

  const selected = proyectos.find(p => p.id === selectedId)

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
              historial={historialProyectos[selected.id] || []}
              onCerrar={isAdmin ? handleCerrar : undefined}
              onArchivar={isAdmin ? handleArchivar : undefined}
              onRetrocederFase={canMovePhases ? handleRetrocederFase : undefined}
              canClose={isAdmin}
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
            ...(!user?.roles.includes('cliente') ? [
              { value: 'cerrados', label: 'Cerrados', count: proyectosCerrados.length },
              ...(isAdmin ? [{ value: 'archivados', label: 'Archivados', count: proyectosArchivados.length }] : [])
            ] : [])
          ]}
          activeTab={view}
          onTabChange={(v) => setView(v as 'pipeline' | 'cerrados' | 'archivados')}
        />

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar proyectos..."
          filters={[]}
          values={{}}
          onFilterChange={() => { }}
        />

        <StatGrid cols={5}>
          {fases.map(fase => (
            <MiniStat
              key={fase.id}
              value={proyectosPorFase[fase.id]?.length || 0}
              label={fase.nombre}
              accentColor={fase.color}
              icon={<Rocket className="h-5 w-5" />}
            />
          ))}
        </StatGrid>

        {view === 'pipeline' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[1400px]">
              {fases.map(fase => (
                <div key={fase.id} className="flex-1 min-w-[280px]">
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
                        fase={p.fase_actual}
                        assignee={{ name: p.responsable_nombre || '' }}
                        tasksInfo={infoTareasPorProyecto[p.id]}
                        onClick={() => setSelectedId(p.id)}
                        onMenuClick={isAdmin ? () => handleEditProyecto(p) : undefined}
                      />
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
              <ModuleCard key={p.id} onClick={() => setSelectedId(p.id)}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="font-semibold">{p.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{p.cliente_nombre}</p>
                    {p.motivo_cierre && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Motivo: {p.motivo_cierre}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleReabrir(p.id) }}>
                      Reabrir
                    </Button>
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleArchivarPermanente(p) }}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archivar permanentemente
                          </DropdownMenuItem>
                          <DropdownMenuItem destructive onClick={(e) => { e.stopPropagation(); handleEliminarPermanente(p) }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar permanentemente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </ModuleCard>
            ))}
          </div>
        )}

        {view === 'archivados' && isAdmin && (
          <div className="space-y-3">
            {proyectosArchivados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay proyectos archivados
              </div>
            ) : (
              proyectosArchivados.map(p => (
                <ModuleCard key={p.id} onClick={() => setSelectedId(p.id)}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h3 className="font-semibold">{p.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{p.cliente_nombre}</p>
                    </div>
                    <Badge variant="secondary">Archivado</Badge>
                  </div>
                </ModuleCard>
              ))
            )}
          </div>
        )}
      </ModuleContainerWithPanel>

      {isModalNuevo && (
        <CreateProjectModal
          open={isModalNuevo}
          onOpenChange={setIsModalNuevo}
          onSave={handleSaveProyecto}
          proyecto={proyectoEditando}
          empresas={empresas}
          usuarios={usuarios}
          proyectos={proyectos}
          isSaving={isSaving}
        />
      )}

      {/* Otros modales simplificados */}
      <BaseModal open={isModalCerrar} onOpenChange={setIsModalCerrar}>
        <ModalHeader title="Cerrar Proyecto" />
        <ModalBody><Input placeholder="Motivo" value={motivoCierre} onChange={e => setMotivoCierre(e.target.value)} /></ModalBody>
        <ModalFooter><Button onClick={confirmarCerrar}>Cerrar</Button></ModalFooter>
      </BaseModal>

      <BaseModal open={isModalArchivar} onOpenChange={setIsModalArchivar}>
        <ModalHeader title="Archivar Proyecto" />
        <ModalFooter><Button onClick={confirmarArchivar}>Archivar</Button></ModalFooter>
      </BaseModal>

      {/* Modal eliminar proyecto */}
      <BaseModal open={isModalEliminar} onOpenChange={setIsModalEliminar}>
        <ModalHeader title="Eliminar Proyecto" />
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar permanentemente el proyecto{' '}
            <strong>&ldquo;{proyectoAEliminar?.nombre}&rdquo;</strong>?
          </p>
          <p className="text-sm text-destructive mt-2">
            Esta acción no se puede deshacer. El proyecto y todos sus datos asociados serán eliminados permanentemente.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirmarEliminar}>
            Eliminar permanentemente
          </Button>
        </ModalFooter>
      </BaseModal>
    </>
  )
}
