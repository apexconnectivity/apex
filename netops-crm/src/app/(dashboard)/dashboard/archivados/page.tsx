"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { ModuleContainer, ModuleHeader } from '@/components/module'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { FilterBar } from '@/components/ui/filter-bar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { MiniStat } from '@/components/ui/mini-stat'
import { useArchivadoStorage } from '@/hooks/useArchivadoStorage'
import { ProyectoCerradoCard } from '@/components/module/ProyectoCerradoCard'
import { ProyectoArchivadoCard } from '@/components/module/ProyectoArchivadoCard'
import { DetalleArchivadoModal } from '@/components/module/DetalleArchivadoModal'
import { ConfirmArchiveModal } from '@/components/module/ConfirmArchiveModal'
import { ConfirmDeleteModal } from '@/components/module/ConfirmDeleteModal'
import { ConfiguracionTab } from '@/components/module/ConfiguracionTab'
import { ARCHIVADOS_STATS_COLORS } from '@/lib/colors'
import {
  ARCHIVADO_TITULOS, ARCHIVADO_TABS, ARCHIVADO_STATS, ARCHIVADO_FILTROS,
  ARCHIVADO_EMPTY, ARCHIVADO_ACCESS
} from '@/constants/archivado'
import { type ProyectoCerrado, type ProyectoArchivado, type ConfigArchivado, type Clasificacion } from '@/types/archivado'
import { Archive, CheckSquare, AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'

export default function ArchivadoPage() {
  const { user } = useAuth()
  const {
    proyectosCerrados,
    proyectosArchivados,
    config,
    addProyectoArchivado,
    removeProyectoArchivado,
    restaurarProyecto,
    updateConfig,
    loading
  } = useArchivadoStorage()

  const [vista, setVista] = useState<'cerrados' | 'archivados' | 'config'>('cerrados')
  const [selectedProject, setSelectedProject] = useState<ProyectoArchivado | null>(null)
  const [archiveConfirm, setArchiveConfirm] = useState<ProyectoCerrado | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<ProyectoArchivado | null>(null)

  // Estados locales para filtros
  const [searchCerrados, setSearchCerrados] = useState('')
  const [searchArchivados, setSearchArchivados] = useState('')
  const [filtroArchivados, setFiltroArchivados] = useState<'todos' | 'completado' | 'inconcluso'>('todos')

  const isAdmin = user?.roles.includes('admin')

  // Filtrar proyectos cerrados
  const filteredCerrados = useMemo(() => {
    return proyectosCerrados.filter(p =>
      p.nombre.toLowerCase().includes(searchCerrados.toLowerCase()) ||
      p.empresa_nombre.toLowerCase().includes(searchCerrados.toLowerCase())
    )
  }, [proyectosCerrados, searchCerrados])

  // Filtrar proyectos archivados
  const filteredArchivados = useMemo(() => {
    return proyectosArchivados.filter(p => {
      if (filtroArchivados !== 'todos' && p.clasificacion !== filtroArchivados) return false
      if (searchArchivados && !p.nombre.toLowerCase().includes(searchArchivados.toLowerCase()) && !p.empresa_nombre.toLowerCase().includes(searchArchivados.toLowerCase())) return false
      return true
    })
  }, [proyectosArchivados, filtroArchivados, searchArchivados])

  // Stats para proyectos archivados
  const statsArchivados = useMemo(() => ({
    total: proyectosArchivados.length,
    completados: proyectosArchivados.filter(p => p.clasificacion === 'completado').length,
    inconclusos: proyectosArchivados.filter(p => p.clasificacion === 'inconcluso').length,
    espacio: proyectosArchivados.reduce((acc, p) => acc + p.tamaño_archivo_mb, 0),
  }), [proyectosArchivados])

  const handleArchivar = (proyecto: ProyectoCerrado, clasificacion: Clasificacion) => {
    const nuevo: ProyectoArchivado = {
      id: Date.now().toString(),
      proyecto_original_id: proyecto.id,
      empresa_id: '1',
      empresa_nombre: proyecto.empresa_nombre,
      nombre: proyecto.nombre,
      clasificacion,
      fecha_cierre: proyecto.fecha_cierre,
      fecha_archivado: new Date().toISOString(),
      motivo_cierre: proyecto.motivo_cierre,
      drive_carpeta_id: 'drive' + Date.now(),
      drive_carpeta_link: '#',
      archivo_json_link: '#',
      tamaño_archivo_mb: Math.floor(Math.random() * 100) + 10,
      archivado_por: user?.nombre || 'Admin',
      duracion_dias: Math.floor(Math.random() * 90) + 30,
      tareas_completadas: proyecto.tareas_fase5_completadas,
      tareas_totales: proyecto.tareas_fase5_totales,
      tickets_count: Math.floor(Math.random() * 10),
      reuniones_count: Math.floor(Math.random() * 8),
      archivos_count: Math.floor(Math.random() * 20),
    }
    addProyectoArchivado(nuevo)
    setArchiveConfirm(null)
  }

  const handleRestaurar = (proyecto: ProyectoArchivado) => {
    restaurarProyecto(proyecto.id)
    setSelectedProject(null)
  }

  const handleEliminar = (proyecto: ProyectoArchivado) => {
    removeProyectoArchivado(proyecto.id)
    setDeleteConfirm(null)
    setSelectedProject(null)
  }

  const handleConfigUpdate = (nuevaConfig: ConfigArchivado) => {
    updateConfig(nuevaConfig)
  }

  if (!isAdmin) {
    return (
      <AccessDeniedCard
        icon={Archive}
        description={ARCHIVADO_ACCESS.soloAdmins}
      />
    )
  }

  if (loading) {
    return (
      <ModuleContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando proyectos...</p>
        </div>
      </ModuleContainer>
    )
  }

  return (
    <ModuleContainer>
      <ModuleHeader
        title={ARCHIVADO_TITULOS.titulo}
        description={ARCHIVADO_TITULOS.descripcion}
      />

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="cerrados">{ARCHIVADO_TABS.proyectosCerrados} ({proyectosCerrados.length})</TabsTrigger>
          <TabsTrigger value="archivados">{ARCHIVADO_TABS.archivados} ({proyectosArchivados.length})</TabsTrigger>
          <TabsTrigger value="config">{ARCHIVADO_TABS.configuracion}</TabsTrigger>
        </TabsList>

        <TabsContent value="cerrados">
          <div className="space-y-4">
            <FilterBar
              searchValue={searchCerrados}
              onSearchChange={setSearchCerrados}
              filters={[]}
              values={{}}
              onFilterChange={() => { }}
            />

            {filteredCerrados.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{ARCHIVADO_EMPTY.noHayProyectosCerrados}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredCerrados.map(p => (
                  <ProyectoCerradoCard
                    key={p.id}
                    proyecto={p}
                    onArchivar={(proj) => setArchiveConfirm(proj)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="archivados">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniStat value={statsArchivados.total} label={ARCHIVADO_STATS.totalArchivados} variant="primary" showBorder accentColor={ARCHIVADOS_STATS_COLORS.total} icon={<Archive className="h-5 w-5" />} />
              <MiniStat value={statsArchivados.completados} label={ARCHIVADO_STATS.completados} variant="success" showBorder accentColor={ARCHIVADOS_STATS_COLORS.completados} icon={<CheckSquare className="h-5 w-5" />} />
              <MiniStat value={statsArchivados.inconclusos} label={ARCHIVADO_STATS.inconclusos} variant="warning" showBorder accentColor={ARCHIVADOS_STATS_COLORS.inconclusos} icon={<AlertTriangle className="h-5 w-5" />} />
              <MiniStat value={`${statsArchivados.espacio} MB`} label={ARCHIVADO_STATS.espacioUsado} />
            </div>

            <div className="flex gap-2">
              <FilterBar
                searchValue={searchArchivados}
                onSearchChange={setSearchArchivados}
                filters={[
                  {
                    key: 'clasificacion',
                    label: 'Clasificación',
                    options: [
                      { value: 'todos', label: ARCHIVADO_FILTROS.todos },
                      { value: 'completado', label: ARCHIVADO_FILTROS.completados },
                      { value: 'inconcluso', label: ARCHIVADO_FILTROS.inconcluso }
                    ]
                  }
                ]}
                values={{ clasificacion: filtroArchivados }}
                onFilterChange={(key, value) => {
                  if (key === 'clasificacion') setFiltroArchivados(value as typeof filtroArchivados)
                }}
                hasActiveFilters={filtroArchivados !== 'todos' || searchArchivados !== ''}
                onClearFilters={() => {
                  setFiltroArchivados('todos')
                  setSearchArchivados('')
                }}
              />
            </div>

            {filteredArchivados.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{ARCHIVADO_EMPTY.noHayProyectosArchivados}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredArchivados.map(p => (
                  <ProyectoArchivadoCard
                    key={p.id}
                    proyecto={p}
                    onVer={setSelectedProject}
                    onRestaurar={handleRestaurar}
                    onEliminar={setDeleteConfirm}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="config">
          <ConfiguracionTab
            config={config}
            onUpdate={handleConfigUpdate}
          />
        </TabsContent>
      </Tabs>

      <DetalleArchivadoModal
        proyecto={selectedProject}
        open={selectedProject !== null}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onRestaurar={() => selectedProject && handleRestaurar(selectedProject)}
        onEliminar={() => selectedProject && setDeleteConfirm(selectedProject)}
      />

      <ConfirmArchiveModal
        proyecto={archiveConfirm}
        open={archiveConfirm !== null}
        onOpenChange={(open) => !open && setArchiveConfirm(null)}
        onConfirm={(clasificacion) => archiveConfirm && handleArchivar(archiveConfirm, clasificacion)}
      />

      <ConfirmDeleteModal
        proyecto={deleteConfirm}
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleEliminar(deleteConfirm)}
      />
    </ModuleContainer>
  )
}
