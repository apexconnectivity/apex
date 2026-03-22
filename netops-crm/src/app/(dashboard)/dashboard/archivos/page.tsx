"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { useArchivosStorage } from '@/hooks/useArchivosStorage'
import { Folder, Building2, Briefcase, Ticket, Files, HardDrive } from 'lucide-react'
import { FilterBar } from '@/components/ui/filter-bar'
import {
  PAGE_TITLE, PAGE_DESCRIPTION, TABS_LABELS, STATS_LABELS,
  EMPTY_MESSAGES,
  STAT_COLORS, ACCESS_DENIED
} from '@/constants/archivos'
import { useEmpresas, useProyectos } from '@/hooks'

export default function ArchivosPage() {
  const { user } = useAuth()

  const { archivos, loading } = useArchivosStorage()
  const [empresas] = useEmpresas()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_proyectos] = useProyectos()

  const [view, setView] = useState<'todos' | 'empresas' | 'proyectos'>('todos')
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('todas')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('especialista')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const canUpload = isAdmin || isTecnico || isComercial || isCompras || isFacturacion

  const archivosFiltrados = useMemo(() => {
    return archivos.filter(a => {
      if (searchQuery && !a.nombre_guardado.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (view === 'empresas' && a.entidad_tipo !== 'empresa') return false
      if (view === 'proyectos' && a.entidad_tipo !== 'proyecto') return false
      if (selectedEmpresa !== 'todas') {
        const empresaId = a.entidad_tipo === 'empresa' ? a.entidad_id : undefined
        if (empresaId !== selectedEmpresa) return false
      }
      return true
    })
  }, [archivos, searchQuery, view, selectedEmpresa])

  const stats = useMemo(() => {
    // Optimizado: una sola iteración para contar por tipo
    let empresasCount = 0
    let proyectosCount = 0
    let ticketsCount = 0
    let tamañoTotal = 0
    for (const a of archivos) {
      tamañoTotal += a.tamaño_bytes
      if (a.entidad_tipo === 'empresa') empresasCount++
      else if (a.entidad_tipo === 'proyecto') proyectosCount++
      else if (a.entidad_tipo === 'ticket') ticketsCount++
    }
    return {
      total: archivos.length,
      empresas: empresasCount,
      proyectos: proyectosCount,
      tickets: ticketsCount,
      tamañoTotal,
    }
  }, [archivos])

  if (loading) {
    return (
      <ModuleContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{EMPTY_MESSAGES.cargandoArchivos}</p>
        </div>
      </ModuleContainer>
    )
  }

  if (!canUpload && !isAdmin) {
    return (
      <Card className="m-4 p-8 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Folder className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">{ACCESS_DENIED.mensaje}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ModuleContainer>
      <ModuleHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        tabs={[
          { value: 'todos', label: TABS_LABELS.todos },
          { value: 'empresas', label: TABS_LABELS.empresas },
          { value: 'proyectos', label: TABS_LABELS.proyectos }
        ]}
        activeTab={view}
        onTabChange={(v) => setView(v as typeof view)}
      />

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar archivos..."
        filters={[
          {
            key: 'empresa',
            label: 'Empresa',
            placeholder: 'Empresa',
            options: [
              { value: 'todas', label: 'Todas' },
              ...empresas.map(e => ({ value: e.id, label: e.nombre })),
            ],
            width: 'w-48',
          },
        ]}
        values={{
          empresa: selectedEmpresa,
        }}
        onFilterChange={(key, value) => {
          if (key === 'empresa') setSelectedEmpresa(value)
        }}
        hasActiveFilters={selectedEmpresa !== 'todas' || !!searchQuery}
        onClearFilters={() => {
          setSearchQuery('')
          setSelectedEmpresa('todas')
        }}
      />

      <StatGrid cols={5}>
        <MiniStat value={stats.total} label={STATS_LABELS.totalArchivos} variant="primary" showBorder accentColor={STAT_COLORS.total} icon={<Files className="h-5 w-5" />} />
        <MiniStat value={stats.empresas} label={STATS_LABELS.empresas} variant="info" showBorder accentColor={STAT_COLORS.empresas} icon={<Building2 className="h-5 w-5" />} />
        <MiniStat value={stats.proyectos} label={STATS_LABELS.proyectos} variant="warning" showBorder accentColor={STAT_COLORS.proyectos} icon={<Briefcase className="h-5 w-5" />} />
        <MiniStat value={stats.tickets} label={STATS_LABELS.tickets} variant="success" showBorder accentColor={STAT_COLORS.tickets} icon={<Ticket className="h-5 w-5" />} />
        <MiniStat value={formatBytes(stats.tamañoTotal)} label={STATS_LABELS.espacioUsado} variant="default" showBorder accentColor={STAT_COLORS.espacio} icon={<HardDrive className="h-5 w-5" />} />
      </StatGrid>

      <div className="grid gap-4">
        {archivosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {view === 'empresas'
                  ? EMPTY_MESSAGES.noDocumentosEmpresas
                  : EMPTY_MESSAGES.noArchivosProyectos}
              </p>
            </CardContent>
          </Card>
        ) : (
          archivosFiltrados.map(archivo => (
            <Card key={archivo.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{archivo.nombre_original}</h4>
                      <p className="text-sm text-muted-foreground">{archivo.entidad_tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{archivo.visibilidad}</Badge>
                    <span className="text-xs text-muted-foreground">{formatBytes(archivo.tamaño_bytes)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ModuleContainer>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
