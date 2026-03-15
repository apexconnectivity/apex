"use client"

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { MiniStat } from '@/components/ui/mini-stat'
import { ProyectoArchivado, ProyectoCerrado, ConfigArchivado, Clasificacion, getClasificacionColor } from '@/types/archivado'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import {
  Archive, Settings, Folder, FolderOpen, Trash2, RotateCcw,
  Download, ExternalLink, Search, Filter, Calendar, Clock,
  CheckCircle, AlertTriangle, Building2, FileText, Database,
  AlertCircle, ChevronRight, Save, X
} from 'lucide-react'

const DEMO_CONFIG: ConfigArchivado = {
  archivado_automatico: false,
  dias_antes_notificacion: 30,
  incluir_tickets: false,
  generar_pdf: true,
  eliminar_tareas: true,
  eliminar_reuniones: true,
  eliminar_archivos: true,
  carpeta_raiz: '/Archivo Histórico',
}

const DEMO_PROYECTOS_CERRADOS: ProyectoCerrado[] = [
  { id: 'c1', nombre: 'Implementación WiFi Corporativo', empresa_nombre: 'RetailMax', fase_actual: 5, fase_nombre: 'CIERRE', fecha_cierre: '2026-02-15', dias_cerrado: 28, motivo_cierre: 'Proyecto completado exitosamente', tareas_fase5_completadas: 5, tareas_fase5_totales: 5 },
  { id: 'c2', nombre: 'Actualización Servidores', empresa_nombre: 'Hospital Regional Norte', fase_actual: 4, fase_nombre: 'IMPLEMENTACIÓN', fecha_cierre: '2026-01-20', dias_cerrado: 54, motivo_cierre: 'Cancelado por el cliente', tareas_fase5_completadas: 2, tareas_fase5_totales: 8 },
]

const DEMO_PROYECTOS_ARCHIVADOS: ProyectoArchivado[] = [
  { id: 'a1', proyecto_original_id: 'p1', empresa_id: '1', empresa_nombre: 'Soluciones Tecnológicas SA', nombre: 'Auditoría de Seguridad 2025', clasificacion: 'completado', fecha_cierre: '2025-12-15', fecha_archivado: '2026-01-15', motivo_cierre: 'Proyecto completado exitosamente', drive_carpeta_id: 'drive123', drive_carpeta_link: '#', archivo_json_link: '#', archivo_pdf_link: '#', tamaño_archivo_mb: 45, archivado_por: 'Carlos Admin', duracion_dias: 90, tareas_completadas: 24, tareas_totales: 24, tickets_count: 5, reuniones_count: 8, archivos_count: 15 },
  { id: 'a2', proyecto_original_id: 'p2', empresa_id: '2', empresa_nombre: 'TechCorp International', nombre: 'Migración a Cloud', clasificacion: 'inconcluso', fecha_cierre: '2025-11-10', fecha_archivado: '2025-12-10', motivo_cierre: 'Cancelado por el cliente', drive_carpeta_id: 'drive456', drive_carpeta_link: '#', archivo_json_link: '#', tamaño_archivo_mb: 120, archivado_por: 'Carlos Admin', duracion_dias: 60, tareas_completadas: 15, tareas_totales: 28, tickets_count: 12, reuniones_count: 4, archivos_count: 8 },
  { id: 'a3', proyecto_original_id: 'p3', empresa_id: '3', empresa_nombre: 'Banco Nacional', nombre: 'Implementación VPN', clasificacion: 'completado', fecha_cierre: '2025-10-20', fecha_archivado: '2025-11-20', motivo_cierre: 'Proyecto completado exitosamente', drive_carpeta_id: 'drive789', drive_carpeta_link: '#', archivo_json_link: '#', archivo_pdf_link: '#', tamaño_archivo_mb: 85, archivado_por: 'Carlos Admin', duracion_dias: 120, tareas_completadas: 32, tareas_totales: 32, tickets_count: 8, reuniones_count: 15, archivos_count: 22 },
]

function ConfiguracionTab({ config, onUpdate }: { config: ConfigArchivado; onUpdate: (c: ConfigArchivado) => void }) {
  const [local, setLocal] = useState(config)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Archivado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Archivado automático</p>
              <p className="text-sm text-muted-foreground">Notificar al admin cuando proyectos estén cerrados por más de X días</p>
            </div>
            <Button variant={local.archivado_automatico ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, archivado_automatico: !local.archivado_automatico })}>
              {local.archivado_automatico ? 'Activado' : 'Desactivado'}
            </Button>
          </div>

          {local.archivado_automatico && (
            <div>
              <Label>Días en estado cerrado antes de notificar</Label>
              <Input type="number" value={local.dias_antes_notificacion} onChange={(e) => setLocal({ ...local, dias_antes_notificacion: parseInt(e.target.value) })} className="bg-background w-32 mt-1" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Qué archivar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Incluir tickets de soporte</p>
              <p className="text-sm text-muted-foreground">Guardar tickets asociados al proyecto</p>
            </div>
            <Button variant={local.incluir_tickets ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, incluir_tickets: !local.incluir_tickets })}>
              {local.incluir_tickets ? 'Sí' : 'No'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Generar resumen PDF</p>
              <p className="text-sm text-muted-foreground">Crear PDF con resumen ejecutivo</p>
            </div>
            <Button variant={local.generar_pdf ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, generar_pdf: !local.generar_pdf })}>
              {local.generar_pdf ? 'Sí' : 'No'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Qué eliminar de la BD operativa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Eliminar tareas</p>
            <Button variant={local.eliminar_tareas ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, eliminar_tareas: !local.eliminar_tareas })}>
              {local.eliminar_tareas ? 'Sí' : 'No'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Eliminar reuniones</p>
            <Button variant={local.eliminar_reuniones ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, eliminar_reuniones: !local.eliminar_reuniones })}>
              {local.eliminar_reuniones ? 'Sí' : 'No'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Eliminar referencias de archivos</p>
            <Button variant={local.eliminar_archivos ? 'default' : 'outline'} size="sm" onClick={() => setLocal({ ...local, eliminar_archivos: !local.eliminar_archivos })}>
              {local.eliminar_archivos ? 'Sí' : 'No'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación en Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Carpeta raíz</Label>
          <Input value={local.carpeta_raiz} onChange={(e) => setLocal({ ...local, carpeta_raiz: e.target.value })} className="bg-background mt-1" />
        </CardContent>
      </Card>

      <Button onClick={() => onUpdate(local)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Guardar Configuración
      </Button>
    </div>
  )
}

function ProyectosCerradosTab({ proyectos, onArchivar }: { proyectos: ProyectoCerrado[]; onArchivar: (p: ProyectoCerrado) => void }) {
  const [search, setSearch] = useState('')

  const filtered = proyectos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.empresa_nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <Input placeholder="Buscar proyectos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-8 bg-background/80 border-border/50" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No hay proyectos cerrados</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => {
            const esCompletado = p.fase_actual === 5 && p.tareas_fase5_completadas === p.tareas_fase5_totales
            return (
              <Card key={p.id} className="card-hover-scale-glow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{p.empresa_nombre}</span>
                      </div>
                      <h3 className="font-semibold">{p.nombre}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><Archive className="h-3 w-3" />{p.dias_cerrado} días cerrado</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Cerrado: {new Date(p.fecha_cierre).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {esCompletado ? (
                          <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>
                        ) : (
                          <Badge className="bg-amber-500/20 text-amber-400"><AlertTriangle className="h-3 w-3 mr-1" />Inconcluso</Badge>
                        )}
                        <Badge variant="outline">Fase {p.fase_actual}: {p.fase_nombre}</Badge>
                      </div>
                    </div>
                    <Button onClick={() => onArchivar(p)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archivar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ArchivadosTab({ proyectos, onVer, onRestaurar, onEliminar }: {
  proyectos: ProyectoArchivado[]
  onVer: (p: ProyectoArchivado) => void
  onRestaurar: (p: ProyectoArchivado) => void
  onEliminar: (p: ProyectoArchivado) => void
}) {
  const [filtro, setFiltro] = useState<'todos' | 'completado' | 'inconcluso'>('todos')
  const [search, setSearch] = useState('')

  const filtered = proyectos.filter(p => {
    if (filtro !== 'todos' && p.clasificacion !== filtro) return false
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase()) && !p.empresa_nombre.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = useMemo(() => ({
    total: proyectos.length,
    completados: proyectos.filter(p => p.clasificacion === 'completado').length,
    inconclusos: proyectos.filter(p => p.clasificacion === 'inconcluso').length,
    espacio: proyectos.reduce((acc, p) => acc + p.tamaño_archivo_mb, 0),
  }), [proyectos])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat value={stats.total} label="Total archivados" />
        <MiniStat value={stats.completados} label="Completados" valueColor="text-emerald-400" />
        <MiniStat value={stats.inconclusos} label="Inconclusos" valueColor="text-amber-400" />
        <MiniStat value={`${stats.espacio} MB`} label="Espacio usado" />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar proyectos archivados..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background" />
        </div>
        <Select value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
          <SelectTrigger className="w-40 bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="completado">Completados</SelectItem>
            <SelectItem value="inconcluso">Inconclusos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No hay proyectos archivados</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <Card key={p.id} className="card-hover-scale-glow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => onVer(p)}>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{p.empresa_nombre}</span>
                    </div>
                    <h3 className="font-semibold">{p.nombre}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.fecha_archivado).toLocaleDateString('es-ES')}</span>
                      <span className="flex items-center gap-1"><Database className="h-3 w-3" />{p.tamaño_archivo_mb} MB</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getClasificacionColor(p.clasificacion)}>{p.clasificacion}</Badge>
                      <Badge variant="outline">{p.tareas_completadas}/{p.tareas_totales} tareas</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onVer(p)}><ExternalLink className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => onRestaurar(p)}><RotateCcw className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => onEliminar(p)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function DetalleArchivadoModal({ proyecto, onClose, onRestaurar, onEliminar }: {
  proyecto: ProyectoArchivado
  onClose: () => void
  onRestaurar: () => void
  onEliminar: () => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Proyecto Archivado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">{proyecto.nombre}</h2>
            <p className="text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Clasificación</p>
              <Badge className={getClasificacionColor(proyecto.clasificacion)}>{proyecto.clasificacion}</Badge>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Duración</p>
              <p className="font-medium">{proyecto.duracion_dias} días</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Fecha de cierre</p>
              <p className="font-medium">{new Date(proyecto.fecha_cierre).toLocaleDateString('es-ES')}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Fecha de archivado</p>
              <p className="font-medium">{new Date(proyecto.fecha_archivado).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Motivo de cierre</p>
            <p className="text-sm bg-muted/50 p-3 rounded-lg">{proyecto.motivo_cierre}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Resumen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Tareas</p><p className="font-medium">{proyecto.tareas_completadas}/{proyecto.tareas_totales}</p></div>
              <div><p className="text-muted-foreground">Tickets</p><p className="font-medium">{proyecto.tickets_count}</p></div>
              <div><p className="text-muted-foreground">Reuniones</p><p className="font-medium">{proyecto.reuniones_count}</p></div>
              <div><p className="text-muted-foreground">Archivos</p><p className="font-medium">{proyecto.archivos_count}</p></div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Archivos generados</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>exportacion_datos.json</span></div>
                <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
              </div>
              {proyecto.archivo_pdf_link && (
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>resumen_ejecutivo.pdf</span></div>
                  <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              )}
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2"><Folder className="h-4 w-4" /><span>Carpeta en Drive</span></div>
                <Button variant="outline" size="sm" asChild><a href={proyecto.drive_carpeta_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a></Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex gap-2">
            <Button className="flex-1" onClick={onRestaurar}><RotateCcw className="h-4 w-4 mr-2" />Restaurar Proyecto</Button>
            <Button variant="destructive" className="flex-1" onClick={onEliminar}><Trash2 className="h-4 w-4 mr-2" />Eliminar Definitivamente</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmArchiveModal({ proyecto, onClose, onConfirm }: {
  proyecto: ProyectoCerrado
  onClose: () => void
  onConfirm: (clasificacion: Clasificacion) => void
}) {
  const esCompletado = proyecto.fase_actual === 5 && proyecto.tareas_fase5_completadas === proyecto.tareas_fase5_totales
  const [clasificacion, setClasificacion] = useState<Clasificacion>(esCompletado ? 'completado' : 'inconcluso')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Archivar Proyecto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-medium">{proyecto.nombre}</p>
            <p className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Clasificación automática sugerida:</p>
            {esCompletado ? (
              <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>
            ) : (
              <Badge className="bg-amber-500/20 text-amber-400"><AlertTriangle className="h-3 w-3 mr-1" />Inconcluso</Badge>
            )}
            <p className="text-xs text-muted-foreground mt-2">Basado en: fase {proyecto.fase_actual}, tareas de cierre {proyecto.tareas_fase5_completadas}/{proyecto.tareas_fase5_totales} completadas</p>
          </div>

          <div>
            <Label>Clasificación (editable)</Label>
            <Select value={clasificacion} onValueChange={(v) => setClasificacion(v as Clasificacion)}>
              <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="inconcluso">Inconcluso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onConfirm(clasificacion)}>Archivar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDeleteModal({ proyecto, onClose, onConfirm }: {
  proyecto: ProyectoArchivado
  onClose: () => void
  onConfirm: () => void
}) {
  const [confirmText, setConfirmText] = useState('')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Eliminación Definitiva
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="font-medium">{proyecto.nombre}</p>
            <p className="text-sm text-muted-foreground">{proyecto.empresa_nombre}</p>
          </div>
          <p className="text-sm">Esto eliminará PERMANENTEMENTE:</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>La carpeta completa en Google Drive</li>
            <li>El registro en proyectos archivados</li>
          </ul>
          <p className="text-sm text-destructive font-medium">Esta acción NO se puede deshacer.</p>
          <div>
            <Label>Escribe "ELIMINAR" para confirmar</Label>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="bg-background mt-1" placeholder="ELIMINAR" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={confirmText !== 'ELIMINAR'}>Eliminar Definitivamente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ArchivadoPage() {
  const { user } = useAuth()
  const [config, setConfig] = useState<ConfigArchivado>(DEMO_CONFIG)
  const [proyectosCerrados] = useState<ProyectoCerrado[]>(DEMO_PROYECTOS_CERRADOS)
  const [proyectosArchivados, setProyectosArchivados] = useState<ProyectoArchivado[]>(DEMO_PROYECTOS_ARCHIVADOS)
  const [vista, setVista] = useState<'cerrados' | 'archivados' | 'config'>('cerrados')
  const [selectedProject, setSelectedProject] = useState<ProyectoArchivado | null>(null)
  const [archiveConfirm, setArchiveConfirm] = useState<ProyectoCerrado | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<ProyectoArchivado | null>(null)

  const isAdmin = user?.roles.includes('admin')

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
    setProyectosArchivados(prev => [nuevo, ...prev])
    setArchiveConfirm(null)
  }

  const handleRestaurar = (proyecto: ProyectoArchivado) => {
    // TODO: Implementar restauración de proyecto
    setSelectedProject(null)
  }

  const handleEliminar = (proyecto: ProyectoArchivado) => {
    setProyectosArchivados(prev => prev.filter(p => p.id !== proyecto.id))
    setDeleteConfirm(null)
    setSelectedProject(null)
  }

  if (!isAdmin) {
    return (
      <AccessDeniedCard
        icon={Archive}
        description="Solo los administradores pueden acceder a este módulo."
      />
    )
  }

  return (
    <ModuleContainer>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8" />
            Archivado de Proyectos
          </h1>
          <p className="text-muted-foreground">Gestión del ciclo de vida de proyectos</p>
        </div>
      </div>

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="cerrados">Proyectos Cerrados ({proyectosCerrados.length})</TabsTrigger>
          <TabsTrigger value="archivados">Archivados ({proyectosArchivados.length})</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="cerrados">
          <ProyectosCerradosTab proyectos={proyectosCerrados} onArchivar={(p) => setArchiveConfirm(p)} />
        </TabsContent>

        <TabsContent value="archivados">
          <ArchivadosTab
            proyectos={proyectosArchivados}
            onVer={setSelectedProject}
            onRestaurar={handleRestaurar}
            onEliminar={setDeleteConfirm}
          />
        </TabsContent>

        <TabsContent value="config">
          <ConfiguracionTab config={config} onUpdate={setConfig} />
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
