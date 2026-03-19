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
import { ARCHIVADOS_STATS_COLORS } from '@/lib/colors'
import {
  ARCHIVADO_TITULOS, ARCHIVADO_TABS, ARCHIVADO_STATS, ARCHIVADO_FILTROS,
  ARCHIVADO_EMPTY, ARCHIVADO_ACCESS
} from '@/constants/archivado'
import { Archive, CheckSquare, AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'

export default function ArchivadoPage() {
  const { user } = useAuth()
  const {
    proyectosCerrados,
    proyectosArchivados,
    config: _config,
    updateConfig: _updateConfig,
    loading
  } = useArchivadoStorage()

  const [vista, setVista] = useState<'cerrados' | 'archivados'>('cerrados')
  const [searchCerrados, setSearchCerrados] = useState('')
  const [searchArchivados, setSearchArchivados] = useState('')
  const [filtroArchivados, setFiltroArchivados] = useState<'todos' | 'completado' | 'inconcluso'>('todos')

  const isAdmin = user?.roles.includes('admin')

  const filteredCerrados = useMemo(() => {
    return proyectosCerrados.filter(p =>
      p.nombre.toLowerCase().includes(searchCerrados.toLowerCase()) ||
      p.empresa_nombre.toLowerCase().includes(searchCerrados.toLowerCase())
    )
  }, [proyectosCerrados, searchCerrados])

  const filteredArchivados = useMemo(() => {
    return proyectosArchivados.filter(p => {
      if (filtroArchivados !== 'todos' && p.clasificacion !== filtroArchivados) return false
      if (searchArchivados && !p.nombre.toLowerCase().includes(searchArchivados.toLowerCase()) && !p.empresa_nombre.toLowerCase().includes(searchArchivados.toLowerCase())) return false
      return true
    })
  }, [proyectosArchivados, filtroArchivados, searchArchivados])

  const statsArchivados = useMemo(() => ({
    total: proyectosArchivados.length,
    completados: proyectosArchivados.filter(p => p.clasificacion === 'completado').length,
    inconclusos: proyectosArchivados.filter(p => p.clasificacion === 'inconcluso').length,
    espacio: proyectosArchivados.reduce((acc, p) => acc + p.tamaño_archivo_mb, 0),
  }), [proyectosArchivados])

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
                  <Card key={p.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{p.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{p.empresa_nombre}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{p.fecha_cierre}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                  <Card key={p.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{p.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{p.empresa_nombre}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 text-xs rounded bg-muted">{p.clasificacion}</span>
                          <p className="text-sm text-muted-foreground">{p.fecha_archivado}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </ModuleContainer>
  )
}
