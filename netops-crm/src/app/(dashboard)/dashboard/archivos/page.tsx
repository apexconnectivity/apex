"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '@/components/ui/dialog'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { ArchivoCard, FolderSection, UploadModal } from '@/components/module'
import { useArchivosStorage } from '@/hooks/useArchivosStorage'
import { Folder, Building2, Briefcase, Ticket, CheckSquare, Lock, Globe, Files, Database, HardDrive, Trash2, Upload } from 'lucide-react'
import { Archivo, EntidadTipo, Visibilidad } from '@/types/archivos'
import {
  PAGE_TITLE, PAGE_DESCRIPTION, TABS_LABELS, STATS_LABELS, BUTTON_LABELS,
  FILTER_LABELS, EMPTY_MESSAGES, SECTION_TITLES, UPLOAD_MODAL,
  STAT_COLORS, BADGE_LABELS, ERROR_MESSAGES, ACCESS_DENIED
} from '@/constants/archivos'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { useEmpresas, useProyectos } from '@/hooks'

export default function ArchivosPage() {
  const { user } = useAuth()

  // ============================================================================
  // Usar hook de localStorage para gestionar archivos
  // ============================================================================
  const { archivos, addArchivo, removeArchivo, loading } = useArchivosStorage()
  const [empresas] = useEmpresas()
  const [proyectos] = useProyectos()

  const [view, setView] = useState<'todos' | 'empresas' | 'proyectos'>('todos')
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('todas')
  const [showUpload, setShowUpload] = useState(false)
  const [archivoAEliminar, setArchivoAEliminar] = useState<Archivo | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['corporativo', 'entregables', 'internos', 'facturas'])

  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('tecnico')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const canUpload = isAdmin || isTecnico || isComercial || isCompras || isFacturacion

  // ============================================================================
  // Memoized: archivos filtrados por vista y empresa seleccionada
  // ============================================================================
  const archivosPorEntidad = useMemo(() => {
    return archivos.filter(a => {
      if (view === 'empresas' && a.entidad_tipo !== 'empresa') return false
      if (view === 'proyectos' && a.entidad_tipo !== 'proyecto') return false
      if (selectedEmpresa !== 'todas') {
        const empresaId = a.entidad_tipo === 'empresa' ? a.entidad_id : undefined
        if (empresaId !== selectedEmpresa) return false
      }
      return true
    })
  }, [archivos, view, selectedEmpresa])

  // ============================================================================
  // Memoized: archivos agrupados por carpeta
  // ============================================================================
  const archivosPorCarpeta = useMemo(() => {
    const result: Record<string, Archivo[]> = {
      'Empresas': [],
      'Proyectos': [],
    }
    archivosPorEntidad.forEach(a => {
      if (a.entidad_tipo === 'empresa') result['Empresas'].push(a)
      else if (a.entidad_tipo === 'proyecto') result['Proyectos'].push(a)
    })
    return result
  }, [archivosPorEntidad])

  // ============================================================================
  // Memoized: estadísticas de archivos
  // ============================================================================
  const stats = useMemo(() => ({
    total: archivos.length,
    empresas: archivos.filter(a => a.entidad_tipo === 'empresa').length,
    proyectos: archivos.filter(a => a.entidad_tipo === 'proyecto').length,
    tickets: archivos.filter(a => a.entidad_tipo === 'ticket').length,
    tamañoTotal: archivos.reduce((acc, a) => acc + a.tamaño_bytes, 0),
  }), [archivos])

  // ============================================================================
  // Handler: generar ruta para el archivo
  // ============================================================================
  const getRuta = (entidad: EntidadTipo, id: string, visibilidad: Visibilidad): string => {
    if (entidad === 'empresa') {
      const empresa = empresas.find(e => e.id === id)
      const tipoCarpeta = empresa?.tipo_entidad === 'proveedor' ? 'Proveedores' : 'Clientes Activos'
      return `/${tipoCarpeta}/${empresa?.nombre}/Corporativo/${visibilidad}/`
    }
    if (entidad === 'proyecto') {
      const proyecto = proyectos.find(p => p.id === id)
      return `/Clientes Activos/${proyecto?.empresa_id}/${proyecto?.nombre}/`
    }
    return '/'
  }

  // ============================================================================
  // Handler: preparar upload - pasa los datos al hook que genera el ID
  // ============================================================================
  const handleUpload = (archivo: Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'ruta_completa' | 'fecha_subida'>) => {
    // El hook addArchivo se encarga de generar el ID, fechas y enlaces
    // Solo necesitamos pasar la ruta calculada
    const archivoConRuta = {
      ...archivo,
      ruta_completa: getRuta(archivo.entidad_tipo, archivo.entidad_id, archivo.visibilidad)
    }
    addArchivo(archivoConRuta)
  }

  // ============================================================================
  // Handler: abrir diálogo de confirmación de eliminación
  // ============================================================================
  const handleEliminar = (archivo: Archivo) => {
    setArchivoAEliminar(archivo)
  }

  // ============================================================================
  // Handler: confirmar eliminación usando el hook
  // ============================================================================
  const confirmarEliminar = () => {
    if (archivoAEliminar) {
      removeArchivo(archivoAEliminar.id)
      setArchivoAEliminar(null)
    }
  }

  // ============================================================================
  // Handler: toggle carpeta expandida
  // ============================================================================
  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev =>
      prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]
    )
  }

  // ============================================================================
  // Estado de carga
  // ============================================================================
  if (loading) {
    return (
      <ModuleContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{EMPTY_MESSAGES.cargandoArchivos}</p>
        </div>
      </ModuleContainer>
    )
  }

  // ============================================================================
  // Control de acceso
  // ============================================================================
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
      {/* ====================================================================== */}
      {/* Header */}
      {/* ====================================================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="h-8 w-8" />
            {PAGE_TITLE}
          </h1>
          <p className="text-muted-foreground">{PAGE_DESCRIPTION}</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="todos">{TABS_LABELS.todos}</TabsTrigger>
              <TabsTrigger value="empresas">{TABS_LABELS.empresas}</TabsTrigger>
              <TabsTrigger value="proyectos">{TABS_LABELS.proyectos}</TabsTrigger>
            </TabsList>
          </Tabs>
          {canUpload && (
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              {BUTTON_LABELS.subir}
            </Button>
          )}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* Stats */}
      {/* ====================================================================== */}
      <StatGrid cols={5}>
        <MiniStat value={stats.total} label={STATS_LABELS.totalArchivos} variant="primary" showBorder accentColor={STAT_COLORS.total} icon={<Files className="h-5 w-5" />} />
        <MiniStat value={stats.empresas} label={STATS_LABELS.empresas} variant="info" showBorder accentColor={STAT_COLORS.empresas} icon={<Building2 className="h-5 w-5" />} />
        <MiniStat value={stats.proyectos} label={STATS_LABELS.proyectos} variant="warning" showBorder accentColor={STAT_COLORS.proyectos} icon={<Briefcase className="h-5 w-5" />} />
        <MiniStat value={stats.tickets} label={STATS_LABELS.tickets} variant="success" showBorder accentColor={STAT_COLORS.tickets} icon={<Ticket className="h-5 w-5" />} />
        <MiniStat value={formatBytes(stats.tamañoTotal)} label={STATS_LABELS.espacioUsado} variant="default" showBorder accentColor={STAT_COLORS.espacio} icon={<HardDrive className="h-5 w-5" />} />
      </StatGrid>

      {/* ====================================================================== */}
      {/* Filtro por empresa */}
      {/* ====================================================================== */}
      {view === 'empresas' && (
        <div className="flex gap-4">
          <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
            <SelectTrigger className="w-64 bg-background"><SelectValue placeholder={FILTER_LABELS.filtrarPorEmpresa} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">{FILTER_LABELS.todasLasEmpresas}</SelectItem>
              {empresas.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ====================================================================== */}
      {/* Lista de archivos por vista */}
      {/* ====================================================================== */}
      <div className="grid gap-4">
        {view === 'todos' && (
          <>
            {/* Empresas Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-2 p-4 bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => toggleFolder('empresas')}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-semibold flex-1 text-left">{SECTION_TITLES.documentosEmpresas}</span>
                <Badge variant="secondary">{archivosPorCarpeta['Empresas'].length}</Badge>
              </button>
              {expandedFolders.includes('empresas') && (
                <div className="p-4 space-y-2">
                  {archivosPorCarpeta['Empresas'].length > 0 ? (
                    archivosPorCarpeta['Empresas'].map(archivo => (
                      <ArchivoCard
                        key={archivo.id}
                        archivo={archivo}
                        onVer={() => window.open(archivo.drive_view_link, '_blank')}
                        onEliminar={() => handleEliminar(archivo)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">{EMPTY_MESSAGES.noDocumentosEmpresas}</p>
                  )}
                </div>
              )}
            </div>

            {/* Proyectos Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-2 p-4 bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => toggleFolder('proyectos')}
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-semibold flex-1 text-left">{SECTION_TITLES.archivosProyectos}</span>
                <Badge variant="secondary">{archivosPorCarpeta['Proyectos'].length}</Badge>
              </button>
              {expandedFolders.includes('proyectos') && (
                <div className="p-4 space-y-2">
                  {archivosPorCarpeta['Proyectos'].length > 0 ? (
                    archivosPorCarpeta['Proyectos'].map(archivo => (
                      <ArchivoCard
                        key={archivo.id}
                        archivo={archivo}
                        onVer={() => window.open(archivo.drive_view_link, '_blank')}
                        onEliminar={() => handleEliminar(archivo)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">{EMPTY_MESSAGES.noArchivosProyectos}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {view === 'empresas' && archivosPorEntidad.map(archivo => (
          <ArchivoCard
            key={archivo.id}
            archivo={archivo}
            onVer={() => window.open(archivo.drive_view_link, '_blank')}
            onEliminar={() => handleEliminar(archivo)}
          />
        ))}

        {view === 'proyectos' && archivosPorEntidad.map(archivo => (
          <ArchivoCard
            key={archivo.id}
            archivo={archivo}
            onVer={() => window.open(archivo.drive_view_link, '_blank')}
            onEliminar={() => handleEliminar(archivo)}
          />
        ))}
      </div>

      {/* ====================================================================== */}
      {/* Diálogo de confirmación de eliminación */}
      {/* ====================================================================== */}
      <Dialog open={!!archivoAEliminar} onOpenChange={() => setArchivoAEliminar(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              {ERROR_MESSAGES.confirmEliminacionTitulo}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-muted-foreground">{ERROR_MESSAGES.confirmEliminacion}</p>
            {archivoAEliminar && (
              <p className="mt-2 font-medium text-foreground">{archivoAEliminar.nombre_original}</p>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchivoAEliminar(null)}>{BUTTON_LABELS.cancelar}</Button>
            <Button variant="destructive" onClick={confirmarEliminar}>{BUTTON_LABELS.eliminar}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====================================================================== */}
      {/* Modal de upload */}
      {/* ====================================================================== */}
      <UploadModal
        open={showUpload}
        onOpenChange={(open) => !open && setShowUpload(false)}
        onUpload={handleUpload}
        empresas={empresas.map(e => ({ id: e.id, nombre: e.nombre }))}
        proyectos={proyectos.map(p => ({ id: p.id, nombre: p.nombre }))}
      />
    </ModuleContainer>
  )
}

// ========================================================================
// Utilidad para formatear bytes (copiada para mantener compatibilidad)
// ========================================================================
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
