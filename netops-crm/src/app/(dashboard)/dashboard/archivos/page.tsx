"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { MiniStat } from '@/components/ui/mini-stat'
import { Folder, FolderOpen, FileText, Image, Download, ExternalLink, Trash2, Upload, Eye, Link2, X, ChevronRight, Building2, Briefcase, Ticket, CheckSquare, Lock, Globe } from 'lucide-react'
import { Archivo, CarpetaDrive, EntidadTipo, Visibilidad, formatBytes, getFileIcon, TAMAÑO_MAXIMO, TIPOS_ARCHIVO_PERMITIDOS } from '@/types/archivos'

const DEMO_EMPRESAS = [
  { id: '1', nombre: 'Soluciones Tecnológicas SA', tipo_entidad: 'cliente' },
  { id: '2', nombre: 'Hospital Regional Norte', tipo_entidad: 'cliente' },
  { id: '3', nombre: 'TechCorp International', tipo_entidad: 'cliente' },
  { id: '4', nombre: 'Distribuidor Mayorista SA', tipo_entidad: 'proveedor' },
]

const DEMO_PROYECTOS = [
  { id: '1', nombre: 'Implementación Firewall Corp', empresa_nombre: 'Soluciones Tecnológicas SA' },
  { id: '2', nombre: 'Migración Cloud Tech', empresa_nombre: 'Hospital Regional Norte' },
  { id: '3', nombre: 'Auditoría Seguridad Tech', empresa_nombre: 'TechCorp International' },
]

const DEMO_ARCHIVOS: Archivo[] = [
  { id: '1', drive_file_id: 'abc123', nombre_original: 'contrato_marco.pdf', nombre_guardado: '2026-01-15_contrato_marco.pdf', mime_type: 'application/pdf', tamaño_bytes: 2450000, drive_view_link: '#', drive_download_link: '#', ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Corporativo/Interno/', entidad_tipo: 'empresa', entidad_id: '1', visibilidad: 'interno', subido_por: '1', subido_por_nombre: 'Carlos Admin', fecha_subida: '2026-01-15T10:30:00' },
  { id: '2', drive_file_id: 'def456', nombre_original: 'diagrama_red.pdf', nombre_guardado: '2026-02-01_diagrama_red.pdf', mime_type: 'application/pdf', tamaño_bytes: 850000, drive_view_link: '#', drive_download_link: '#', ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Entregables Cliente/', entidad_tipo: 'proyecto', entidad_id: '1', visibilidad: 'interno', subido_por: '2', subido_por_nombre: 'Laura Pérez', fecha_subida: '2026-02-01T14:20:00' },
  { id: '3', drive_file_id: 'ghi789', nombre_original: 'config_firewall.conf', nombre_guardado: '2026-02-10_config_firewall.conf', mime_type: 'application/octet-stream', tamaño_bytes: 15000, drive_view_link: '#', drive_download_link: '#', ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Internos/', entidad_tipo: 'proyecto', entidad_id: '1', visibilidad: 'interno', subido_por: '3', subido_por_nombre: 'Juan Técnico', fecha_subida: '2026-02-10T09:15:00' },
  { id: '4', drive_file_id: 'jkl012', nombre_original: 'factura_2026-02.pdf', nombre_guardado: '2026-02-28_factura_2026-02.pdf', mime_type: 'application/pdf', tamaño_bytes: 125000, drive_view_link: '#', drive_download_link: '#', ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Facturas/', entidad_tipo: 'proyecto', entidad_id: '1', visibilidad: 'interno', subido_por: '1', subido_por_nombre: 'Carlos Admin', fecha_subida: '2026-02-28T16:00:00' },
  { id: '5', drive_file_id: 'mno345', nombre_original: 'catalogo_equipos.pdf', nombre_guardado: '2026-01-20_catalogo_equipos.pdf', mime_type: 'application/pdf', tamaño_bytes: 5600000, drive_view_link: '#', drive_download_link: '#', ruta_completa: '/Proveedores/Distribuidor Mayorista SA/Corporativo/Interno/', entidad_tipo: 'empresa', entidad_id: '4', visibilidad: 'interno', subido_por: '4', subido_por_nombre: 'María Compras', fecha_subida: '2026-01-20T11:00:00' },
  { id: '6', drive_file_id: 'pqr678', nombre_original: 'requisitos_usuarios.docx', nombre_guardado: '2026-03-01_requisitos_usuarios.docx', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', tamaño_bytes: 45000, drive_view_link: '#', drive_download_link: '#', ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Entregables Cliente/', entidad_tipo: 'proyecto', entidad_id: '1', visibilidad: 'publico', subido_por: '2', subido_por_nombre: 'Laura Pérez', fecha_subida: '2026-03-01T08:30:00' },
]

function ArchivoCard({ archivo, onVer, onEliminar }: { archivo: Archivo; onVer: () => void; onEliminar: () => void }) {
  const isImage = archivo.mime_type.includes('image')

  return (
    <Card className="card-hover-scale-glow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{getFileIcon(archivo.mime_type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{archivo.nombre_original}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{formatBytes(archivo.tamaño_bytes)}</span>
              <span>•</span>
              <span>{new Date(archivo.fecha_subida).toLocaleDateString('es-ES')}</span>
              <span>•</span>
              <span>{archivo.subido_por_nombre}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {archivo.visibilidad === 'publico' && (
                <Badge variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-1" />Público</Badge>
              )}
              {archivo.visibilidad === 'interno' && (
                <Badge variant="outline" className="text-xs"><Lock className="h-3 w-3 mr-1" />Interno</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onVer} title="Ver en Drive">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(archivo.drive_view_link)} title="Copiar enlace">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onEliminar} title="Eliminar">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FolderSection({ titulo, icon: Icon, archivos, onVer, onEliminar, defaultOpen = false }: {
  titulo: string
  icon: any
  archivos: Archivo[]
  onVer: (archivo: Archivo) => void
  onEliminar: (archivo: Archivo) => void
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-2 p-4 bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FolderOpen className="h-5 w-5 text-amber-500" /> : <Folder className="h-5 w-5 text-amber-500" />}
        <span className="font-medium flex-1 text-left">{titulo}</span>
        <Badge variant="secondary" className="mr-2">{archivos.length}</Badge>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 space-y-2">
          {archivos.length > 0 ? (
            archivos.map(archivo => (
              <ArchivoCard
                key={archivo.id}
                archivo={archivo}
                onVer={() => onVer(archivo)}
                onEliminar={() => onEliminar(archivo)}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay archivos en esta carpeta</p>
          )}
        </div>
      )}
    </div>
  )
}

function UploadModal({ isOpen, onClose, onUpload }: {
  isOpen: boolean
  onClose: () => void
  onUpload: (archivo: Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'ruta_completa' | 'fecha_subida'>) => void
}) {
  const [archivo, setArchivo] = useState({
    nombre_original: '',
    mime_type: '',
    tamaño_bytes: 0,
    entidad_tipo: '' as EntidadTipo | '',
    entidad_id: '',
    visibilidad: 'interno' as Visibilidad,
  })
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setArchivo({ ...archivo, nombre_original: f.name, mime_type: f.type, tamaño_bytes: f.size })
    }
  }

  const handleUpload = () => {
    if (!file || !archivo.entidad_tipo || !archivo.entidad_id) return
    onUpload({
      ...archivo,
      entidad_tipo: archivo.entidad_tipo as EntidadTipo,
      subido_por: '1',
      subido_por_nombre: 'Carlos Admin',
    })
    onClose()
    setFile(null)
    setArchivo({ nombre_original: '', mime_type: '', tamaño_bytes: 0, entidad_tipo: '', entidad_id: '', visibilidad: 'interno' })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Subir Archivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Destino</Label>
            <Select value={archivo.entidad_tipo} onValueChange={(v) => setArchivo({ ...archivo, entidad_tipo: v as EntidadTipo, entidad_id: '' })}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar tipo..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="empresa">Empresa</SelectItem>
                <SelectItem value="proyecto">Proyecto</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="tarea">Tarea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {archivo.entidad_tipo === 'empresa' && (
            <div>
              <Label>Empresa</Label>
              <Select value={archivo.entidad_id} onValueChange={(v) => setArchivo({ ...archivo, entidad_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {DEMO_EMPRESAS.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {archivo.entidad_tipo === 'proyecto' && (
            <div>
              <Label>Proyecto</Label>
              <Select value={archivo.entidad_id} onValueChange={(v) => setArchivo({ ...archivo, entidad_id: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {DEMO_PROYECTOS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {archivo.entidad_tipo === 'empresa' && (
            <div>
              <Label>Visibilidad</Label>
              <Select value={archivo.visibilidad} onValueChange={(v) => setArchivo({ ...archivo, visibilidad: v as Visibilidad })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno (solo equipo)</SelectItem>
                  <SelectItem value="publico">Público (visible para cliente)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Archivo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : 'Click para seleccionar archivo'}
                </p>
                {file && <p className="text-xs text-muted-foreground mt-1">{formatBytes(file.size)}</p>}
              </label>
            </div>
            {file && file.size > TAMAÑO_MAXIMO && (
              <p className="text-sm text-destructive mt-1">El archivo excede el tamaño máximo de 25 MB</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpload} disabled={!file || !archivo.entidad_tipo || !archivo.entidad_id || file.size > TAMAÑO_MAXIMO}>
            <Upload className="h-4 w-4 mr-2" />Subir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ArchivosPage() {
  const { user } = useAuth()
  const [archivos, setArchivos] = useState<Archivo[]>(DEMO_ARCHIVOS)
  const [view, setView] = useState<'todos' | 'empresas' | 'proyectos'>('todos')
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('todas')
  const [showUpload, setShowUpload] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['corporativo', 'entregables', 'internos', 'facturas'])

  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('tecnico')
  const isComercial = user?.roles.includes('comercial')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')
  const canUpload = isAdmin || isTecnico || isComercial || isCompras || isFacturacion

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

  const stats = useMemo(() => ({
    total: archivos.length,
    empresas: archivos.filter(a => a.entidad_tipo === 'empresa').length,
    proyectos: archivos.filter(a => a.entidad_tipo === 'proyecto').length,
    tickets: archivos.filter(a => a.entidad_tipo === 'ticket').length,
    tamañoTotal: archivos.reduce((acc, a) => acc + a.tamaño_bytes, 0),
  }), [archivos])

  const handleUpload = (archivo: Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'ruta_completa' | 'fecha_subida'>) => {
    const ruta = getRuta(archivo.entidad_tipo, archivo.entidad_id, archivo.visibilidad)
    const nuevo: Archivo = {
      ...archivo,
      id: Date.now().toString(),
      drive_file_id: Math.random().toString(36).substr(2, 9),
      nombre_guardado: `${new Date().toISOString().split('T')[0]}_${archivo.nombre_original}`,
      drive_view_link: '#',
      drive_download_link: '#',
      ruta_completa: ruta,
      fecha_subida: new Date().toISOString(),
    }
    setArchivos(prev => [...prev, nuevo])
  }

  const getRuta = (entidad: EntidadTipo, id: string, visibilidad: Visibilidad): string => {
    if (entidad === 'empresa') {
      const empresa = DEMO_EMPRESAS.find(e => e.id === id)
      const tipoCarpeta = empresa?.tipo_entidad === 'proveedor' ? 'Proveedores' : 'Clientes Activos'
      return `/${tipoCarpeta}/${empresa?.nombre}/Corporativo/${visibilidad}/`
    }
    if (entidad === 'proyecto') {
      const proyecto = DEMO_PROYECTOS.find(p => p.id === id)
      return `/Clientes Activos/${proyecto?.empresa_nombre}/${proyecto?.nombre}/`
    }
    return '/'
  }

  const handleEliminar = (archivo: Archivo) => {
    if (confirm('¿Estás seguro de eliminar este archivo?')) {
      setArchivos(prev => prev.filter(a => a.id !== archivo.id))
    }
  }

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev =>
      prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]
    )
  }

  if (!canUpload && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Folder className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Acceso Restringido</h2>
            <p className="text-muted-foreground mt-2">No tienes permiso para acceder a este módulo</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="h-8 w-8" />
            Archivos
          </h1>
          <p className="text-muted-foreground">Gestión de archivos en Google Drive</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
            </TabsList>
          </Tabs>
          {canUpload && (
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Subir
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <MiniStat value={stats.total} label="Total archivos" />
        <MiniStat value={stats.empresas} label="Empresas" />
        <MiniStat value={stats.proyectos} label="Proyectos" />
        <MiniStat value={stats.tickets} label="Tickets" />
        <MiniStat value={formatBytes(stats.tamañoTotal)} label="Espacio usado" />
      </div>

      {view === 'empresas' && (
        <div className="flex gap-4">
          <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
            <SelectTrigger className="w-64 bg-background"><SelectValue placeholder="Filtrar por empresa" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las empresas</SelectItem>
              {DEMO_EMPRESAS.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4">
        {view === 'todos' && (
          <>
            <div className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-2 p-4 bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => toggleFolder('empresas')}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-semibold flex-1 text-left">Documentos de Empresas</span>
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
                    <p className="text-sm text-muted-foreground text-center py-4">No hay documentos de empresas</p>
                  )}
                </div>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-2 p-4 bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => toggleFolder('proyectos')}
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-semibold flex-1 text-left">Archivos de Proyectos</span>
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
                    <p className="text-sm text-muted-foreground text-center py-4">No hay archivos de proyectos</p>
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

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />
    </div>
  )
}
