"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { MiniStat } from '@/components/ui/mini-stat'
import { useArchivadoStorage } from '@/hooks/useArchivadoStorage'
import { ProyectoCerradoCard } from '@/components/module/ProyectoCerradoCard'
import { ProyectoArchivadoCard } from '@/components/module/ProyectoArchivadoCard'
import { DetalleArchivadoModal } from '@/components/module/DetalleArchivadoModal'
import { ConfirmArchiveModal } from '@/components/module/ConfirmArchiveModal'
import { ConfirmDeleteModal } from '@/components/module/ConfirmDeleteModal'
import { ConfiguracionTab } from '@/components/module/ConfiguracionTab'
import { 
  ARCHIVADO_TITULOS, ARCHIVADO_TABS, ARCHIVADO_STATS, ARCHIVADO_FILTROS,
  ARCHIVADO_EMPTY, ARCHIVADO_ACCESS
} from '@/constants/archivado'
import { type ProyectoCerrado, type ProyectoArchivado, type ConfigArchivado, type Clasificacion } from '@/types/archivado'
import { Archive, Search, CheckSquare, AlertTriangle } from 'lucide-react'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8" />
            {ARCHIVADO_TITULOS.titulo}
          </h1>
          <p className="text-muted-foreground">{ARCHIVADO_TITULOS.descripcion}</p>
        </div>
      </div>

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="cerrados">{ARCHIVADO_TABS.proyectosCerrados} ({proyectosCerrados.length})</TabsTrigger>
          <TabsTrigger value="archivados">{ARCHIVADO_TABS.archivados} ({proyectosArchivados.length})</TabsTrigger>
          <TabsTrigger value="config">{ARCHIVADO_TABS.configuracion}</TabsTrigger>
        </TabsList>

        <TabsContent value="cerrados">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <Input 
                  placeholder={ARCHIVADO_FILTROS.buscarProyectos} 
                  value={searchCerrados} 
                  onChange={(e) => setSearchCerrados(e.target.value)} 
                  className="pl-9 pr-8 bg-background/80 border-border/50" 
                />
              </div>
            </div>

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
              <MiniStat value={statsArchivados.total} label={ARCHIVADO_STATS.totalArchivados} variant="primary" showBorder accentColor="#06b6d4" icon={<Archive className="h-5 w-5" />} />
              <MiniStat value={statsArchivados.completados} label={ARCHIVADO_STATS.completados} variant="success" showBorder accentColor="#10b981" icon={<CheckSquare className="h-5 w-5" />} />
              <MiniStat value={statsArchivados.inconclusos} label={ARCHIVADO_STATS.inconclusos} variant="warning" showBorder accentColor="#f59e0b" icon={<AlertTriangle className="h-5 w-5" />} />
              <MiniStat value={`${statsArchivados.espacio} MB`} label={ARCHIVADO_STATS.espacioUsado} />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder={ARCHIVADO_FILTROS.buscarProyectosArchivados} 
                  value={searchArchivados} 
                  onChange={(e) => setSearchArchivados(e.target.value)} 
                  className="pl-9 pr-8 bg-background/80 border-border/50" 
                />
              </div>
              <Select value={filtroArchivados} onValueChange={(v) => setFiltroArchivados(v as typeof filtroArchivados)}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">{ARCHIVADO_FILTROS.todos}</SelectItem>
                  <SelectItem value="completado">{ARCHIVADO_FILTROS.completados}</SelectItem>
                  <SelectItem value="inconcluso">{ARCHIVADO_FILTROS.inconcluso}</SelectItem>
                </SelectContent>
              </Select>
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

      {selectedProject && (
        <DetalleArchivadoModal
          proyecto={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRestaurar={() => handleRestaurar(selectedProject)}
          onEliminar={() => setDeleteConfirm(selectedProject)}
        />
      )}

      {archiveConfirm && (
        <ConfirmArchiveModal
          proyecto={archiveConfirm}
          onClose={() => setArchiveConfirm(null)}
          onConfirm={(clasificacion) => handleArchivar(archiveConfirm, clasificacion)}
        />
      )}

      {deleteConfirm && (
        <ConfirmDeleteModal
          proyecto={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleEliminar(deleteConfirm)}
        />
      )}
    </ModuleContainer>
  )
}
