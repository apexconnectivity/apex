"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Plus, ChevronLeft, ChevronRight, FolderKanban, Rocket } from 'lucide-react'
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
  const [proyectos, setProyectos] = useProyectos()
  const [tareas, setTareas] = useTareas()
  const [empresas] = useEmpresas()

  // Usuarios reales
  const [usuarios] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])

  const [view, setView] = useState<'pipeline' | 'cerrados'>('pipeline')
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
  const isTecnico = user?.roles.includes('tecnico')
  const canMovePhases = isAdmin || isComercial || isTecnico

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

  const infoTareasPorProyecto = useMemo(() => {
    const r: Record<string, any> = {}
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
      }
    })
    return r
  }, [proyectos, tareas])

  const handleFase = useCallback((id: string, fase: number) => {
    setProyectos(prev => {
      const proyecto = prev.find(p => p.id === id)
      if (!proyecto) return prev
      if (isComercial && fase > 3) return prev
      if (isTecnico && fase < 4) return prev

      const faseAnterior = proyecto.fase_actual
      const faseAnteriorNombre = fases.find(f => f.id === faseAnterior)?.nombre
      const faseNuevaNombre = fases.find(f => f.id === fase)?.nombre

      if (faseAnteriorNombre && faseNuevaNombre) {
        agregarHistorial(id, 'cambio_fase', `Cambió de fase a "${faseNuevaNombre}"`)
      }

      if (fase > (faseAnterior || 0)) {
        const plantillas = PLANTILLAS_POR_FASE.filter(p => p.fase_id === fase)
        if (plantillas.length > 0) {
          const nuevas = plantillas.map((pl, i) => {
            const v = new Date(); v.setDate(v.getDate() + pl.dias_vencimiento)
            const tid = crypto.randomUUID()
            return {
              id: tid,
              proyecto_id: id,
              proyecto_nombre: proyecto.nombre,
              fase_origen: fase,
              fase_nombre: faseNuevaNombre || '',
              categoria: pl.categoria,
              nombre: pl.nombre,
              descripcion: pl.descripcion,
              prioridad: pl.prioridad,
              estado: 'Pendiente' as EstadoTarea,
              fecha_creacion: new Date().toISOString().split('T')[0],
              fecha_vencimiento: v.toISOString().split('T')[0],
              orden: i + 1,
              creado_por: 'Sistema',
              asignado_a_cliente: pl.requiere_cliente,
              subtareas: pl.subtareas.map((s, si) => ({ id: crypto.randomUUID(), tarea_id: tid, nombre: s.nombre, completada: false, orden: si + 1 }))
            }
          })
          setTimeout(() => setTareas(tPrev => [...tPrev, ...nuevas]), 0)
        }
      }
      return prev.map(p => p.id === id ? { ...p, fase_actual: fase as FaseProyecto } : p)
    })
  }, [isComercial, isTecnico, fases, setProyectos, setTareas, agregarHistorial])

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

  const handleArchivar = useCallback((proyecto: Proyecto) => {
    setProyectoAArchivar(proyecto)
    const tFase5 = tareas.filter(t => t.proyecto_id === proyecto.id && t.fase_origen === 5)
    setClasificacionArchivo(tFase5.length > 0 && tFase5.every(t => t.estado === 'Completada') ? 'completado' : 'inconcluso')
    setIsModalArchivar(true)
  }, [tareas])

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
        const nuevasTareas = plantillas.map((pl, i) => {
          const v = new Date(); v.setDate(v.getDate() + pl.dias_vencimiento)
          const tid = crypto.randomUUID()
          return {
            id: tid,
            proyecto_id: proyectoId,
            proyecto_nombre: nuevoProyectoData.nombre,
            fase_origen: fase,
            fase_nombre: fases.find(f => f.id === fase)?.nombre || '',
            categoria: pl.categoria,
            nombre: pl.nombre,
            descripcion: pl.descripcion,
            prioridad: pl.prioridad,
            estado: 'Pendiente' as EstadoTarea,
            fecha_creacion: now,
            fecha_vencimiento: v.toISOString().split('T')[0],
            orden: i + 1,
            creado_por: 'Sistema',
            asignado_a_cliente: pl.requiere_cliente,
            subtareas: pl.subtareas.map((s, si) => ({ id: crypto.randomUUID(), tarea_id: tid, nombre: s.nombre, completada: false, orden: si + 1 }))
          }
        })
        setTareas(prev => [...prev, ...nuevasTareas])
      }
    } else {
      setProyectos(prev => prev.map(p => p.id === proyectoId ? { ...p, ...nuevoProyectoData } : p))
      agregarHistorial(proyectoId, 'edicion', 'Datos del proyecto actualizados')
    }

    setIsSaving(false)
    setIsModalNuevo(false)
  }, [empresas, usuarios, fases, setProyectos, setTareas, agregarHistorial])

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
            ...(!user?.roles.includes('cliente') ? [{ value: 'cerrados', label: 'Cerrados', count: proyectosCerrados.length }] : [])
          ]}
          activeTab={view}
          onTabChange={(v) => setView(v as 'pipeline' | 'cerrados')}
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
                        assignee={{ name: p.responsable_nombre || '' }}
                        tasksInfo={infoTareasPorProyecto[p.id]}
                        onClick={() => setSelectedId(p.id)}
                      >
                        {canMovePhases && (
                          <div className="flex gap-1 mt-3 pt-2 border-t border-border/50">
                            {fase.id > 1 && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleFase(p.id, fase.id - 1) }}><ChevronLeft className="h-4 w-4" /></Button>}
                            {fase.id < 5 && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleFase(p.id, fase.id + 1) }}><ChevronRight className="h-4 w-4" /></Button>}
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
              <ModuleCard key={p.id} onClick={() => setSelectedId(p.id)}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="font-semibold">{p.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{p.cliente_nombre}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleReabrir(p.id) }}>Reabrir</Button>
                </div>
              </ModuleCard>
            ))}
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
    </>
  )
}
