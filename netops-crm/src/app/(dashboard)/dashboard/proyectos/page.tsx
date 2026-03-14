"use client"

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RotateCcw, Plus, Building2, LayoutGrid, Layers, Lightbulb, PenTool, Bug, Rocket } from 'lucide-react'
import { ModuleHeader, ModuleCard, ProjectCard, StatusBadge, Modal, ProjectDetailPanel, ModuleContainerWithPanel } from '@/components/module'
import { MiniStat, StatGrid } from '@/components/ui/mini-stat'
import { Proyecto, FASES, FaseProyecto, MONEDAS } from '@/types/proyectos'
import { Tarea, EstadoTarea } from '@/types/tareas'
import { Empresa, INDUSTRIAS, TAMAÑOS, ORIGENES, TIPOS_RELACION, TipoEntidad, Industria, Origen, TipoRelacion } from '@/types/crm'

const DEMO_PROYECTOS: Proyecto[] = [
  { id: '1', empresa_id: '1', nombre: 'Implementación Firewall Corp', fase_actual: 4, estado: 'activo', fecha_inicio: '2026-01-15', fecha_estimada_fin: '2026-04-15', moneda: 'USD', monto_estimado: 25000, probabilidad_cierre: 90, responsable_id: '1', responsable_nombre: 'Carlos Admin', contacto_tecnico_id: '1', contacto_tecnico_nombre: 'Juan Pérez', tags: ['seguridad'], requiere_compras: true, creado_en: '2026-01-15', cliente_nombre: 'Soluciones Tecnológicas SA' },
  { id: '2', empresa_id: '2', nombre: 'Migración Cloud Tech', fase_actual: 2, estado: 'activo', fecha_inicio: '2026-02-01', fecha_estimada_fin: '2026-06-01', moneda: 'USD', monto_estimado: 45000, probabilidad_cierre: 40, responsable_id: '2', responsable_nombre: 'Laura Pérez', contacto_tecnico_id: '4', tags: ['cloud'], requiere_compras: false, creado_en: '2026-02-01', cliente_nombre: 'Hospital Regional Norte' },
  { id: '3', empresa_id: '3', nombre: 'Auditoría Seguridad Tech', fase_actual: 5, estado: 'activo', fecha_inicio: '2026-01-01', fecha_estimada_fin: '2026-03-01', moneda: 'USD', monto_estimado: 12000, probabilidad_cierre: 100, responsable_id: '1', responsable_nombre: 'Carlos Admin', contacto_tecnico_id: '5', tags: ['auditoría'], requiere_compras: false, creado_en: '2026-01-01', cliente_nombre: 'TechCorp International' },
  { id: '4', empresa_id: '4', nombre: 'Upgrade Switches Retail', fase_actual: 4, estado: 'activo', fecha_inicio: '2026-03-01', fecha_estimada_fin: '2026-05-15', moneda: 'USD', monto_estimado: 35000, probabilidad_cierre: 90, responsable_id: '3', responsable_nombre: 'Juan Técnico', contacto_tecnico_id: '1', tags: ['infra'], requiere_compras: true, creado_en: '2026-03-01', cliente_nombre: 'RetailMax' },
  { id: '5', empresa_id: '1', nombre: 'Proyecto Cancelado', fase_actual: 2, estado: 'cerrado', fecha_inicio: '2025-11-01', fecha_cierre: '2025-12-15', motivo_cierre: 'Cancelado', moneda: 'USD', monto_estimado: 15000, probabilidad_cierre: 0, responsable_id: '1', responsable_nombre: 'Carlos Admin', contacto_tecnico_id: '1', tags: [], requiere_compras: false, creado_en: '2025-11-01', cliente_nombre: 'Soluciones Tecnológicas SA' },
]

// Tareas de demo para los proyectos
const DEMO_TAREAS: Tarea[] = [
  { id: 't1', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Técnica', nombre: 'Configurar reglas de firewall', descripcion: 'Crear reglas de seguridad básicas', responsable_id: '1', responsable_nombre: 'Carlos Admin', asignado_a_cliente: false, fecha_creacion: '2026-01-15', fecha_vencimiento: '2026-02-15', prioridad: 'Alta', estado: 'Completada', orden: 1, creado_por: '1' },
  { id: 't2', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Técnica', nombre: 'Instalar certificado SSL', descripcion: 'Obtener e instalar certificados', responsable_id: '1', responsable_nombre: 'Carlos Admin', asignado_a_cliente: false, fecha_creacion: '2026-01-20', fecha_vencimiento: '2026-02-28', prioridad: 'Media', estado: 'En progreso', orden: 2, creado_por: '1' },
  { id: 't3', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Compras', nombre: 'Adquirir equipo de red', descripcion: 'Comprar switches adicionales', responsable_id: '2', responsable_nombre: 'Laura Pérez', asignado_a_cliente: false, fecha_creacion: '2026-01-25', fecha_vencimiento: '2026-03-15', prioridad: 'Alta', estado: 'Pendiente', orden: 3, creado_por: '1' },
  { id: 't4', proyecto_id: '1', proyecto_nombre: 'Implementación Firewall Corp', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Técnica', nombre: 'Pruebas de penetración', descripcion: 'Realizar pruebas de seguridad', responsable_id: '3', responsable_nombre: 'Juan Técnico', asignado_a_cliente: false, fecha_creacion: '2026-02-01', fecha_vencimiento: '2026-04-01', prioridad: 'Urgente', estado: 'Bloqueada', orden: 4, dependencias: [{ tarea_id: 't1', tipo: 'bloqueante' }], creado_por: '1' },
  { id: 't5', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', fase_origen: 2, fase_nombre: 'Diagnóstico', categoria: 'Técnica', nombre: 'Inventario de servicios', descripcion: 'Listar todos los servicios actuales', responsable_id: '2', responsable_nombre: 'Laura Pérez', asignado_a_cliente: false, fecha_creacion: '2026-02-01', prioridad: 'Alta', estado: 'Completada', orden: 1, creado_por: '2' },
  { id: 't6', proyecto_id: '2', proyecto_nombre: 'Migración Cloud Tech', fase_origen: 2, fase_nombre: 'Diagnóstico', categoria: 'Técnica', nombre: 'Diseño de arquitectura', descripcion: 'Crear diseño de infraestructura cloud', responsable_id: '3', responsable_nombre: 'Juan Técnico', asignado_a_cliente: false, fecha_creacion: '2026-02-05', prioridad: 'Alta', estado: 'En progreso', orden: 2, creado_por: '2' },
  { id: 't7', proyecto_id: '3', proyecto_nombre: 'Auditoría Seguridad Tech', fase_origen: 5, fase_nombre: 'Cierre', categoria: 'Técnica', nombre: 'Entrega de informe final', descripcion: 'Documentar hallazgos y recomendaciones', responsable_id: '1', responsable_nombre: 'Carlos Admin', asignado_a_cliente: false, fecha_creacion: '2026-01-15', fecha_vencimiento: '2026-03-01', prioridad: 'Alta', estado: 'Completada', orden: 1, creado_por: '1' },
  { id: 't8', proyecto_id: '4', proyecto_nombre: 'Upgrade Switches Retail', fase_origen: 4, fase_nombre: 'Implementación', categoria: 'Técnica', nombre: 'Reemplazar switches antiguos', descripcion: 'Instalar nuevos switches', responsable_id: '3', responsable_nombre: 'Juan Técnico', asignado_a_cliente: false, fecha_creacion: '2026-03-01', prioridad: 'Alta', estado: 'En progreso', orden: 1, creado_por: '3' },
]

// Empresas para selector
const DEMO_EMPRESAS: Empresa[] = [
  { id: '1', tipo_entidad: 'cliente', nombre: 'Soluciones Tecnológicas SA', industria: 'Tecnología', tamaño: 'PYME', origen: 'Referencia', tipo_relacion: 'Cliente', telefono_principal: '+54 9 11 4321-5678', email_principal: 'contacto@solucionestec.com', sitio_web: 'www.solucionestec.com', direccion: 'Av. Corrientes 1234, CABA', ciudad: 'Buenos Aires', pais: 'Argentina', razon_social: 'Soluciones Tecnológicas SA', rfc: 'SAT123456789', email_facturacion: 'facturas@solucionestec.com', plazo_pago: 30, moneda_preferida: 'USD', creado_en: '2024-01-15' },
  { id: '2', tipo_entidad: 'cliente', nombre: 'Hospital Regional Norte', industria: 'Salud', tamaño: 'Gran empresa', origen: 'Llamada en frío', tipo_relacion: 'Cliente', telefono_principal: '+54 9 11 4789-1234', email_principal: 'compras@hospitalnorte.com', sitio_web: 'www.hospitalnorte.com', direccion: 'Av. Rivadavia 10000, CABA', ciudad: 'Buenos Aires', pais: 'Argentina', creado_en: '2024-03-10' },
  { id: '3', tipo_entidad: 'cliente', nombre: 'TechCorp International', industria: 'Tecnología', tamaño: 'Gran empresa', origen: 'Web', tipo_relacion: 'Cliente', telefono_principal: '+1 555-123-4567', email_principal: 'info@techcorp.com', sitio_web: 'www.techcorp.com', ciudad: 'Miami', pais: 'EE.UU', creado_en: '2024-04-01' },
  { id: '4', tipo_entidad: 'cliente', nombre: 'RetailMax', industria: 'Comercio', tamaño: 'Gran empresa', origen: 'Referencia', tipo_relacion: 'Cliente', telefono_principal: '+54 9 11 5555-9999', email_principal: 'contacto@retailmax.com', sitio_web: 'www.retailmax.com', ciudad: 'Córdoba', pais: 'Argentina', creado_en: '2024-05-15' },
]

const PROYECTO_VACIO: Partial<Proyecto> = {
  nombre: '',
  descripcion: '',
  fase_actual: 1,
  estado: 'activo',
  moneda: 'USD',
  monto_estimado: 0,
  probabilidad_cierre: 20,
  requiere_compras: false,
}

export default function ProyectosPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [proyectos, setProyectos] = useState<Proyecto[]>(DEMO_PROYECTOS)
  const [tareas, setTareas] = useState<Tarea[]>(DEMO_TAREAS)
  const [empresas, setEmpresas] = useState<Empresa[]>(DEMO_EMPRESAS)
  const [view, setView] = useState<'pipeline' | 'cerrados'>('pipeline')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Modal nuevo proyecto
  const [isModalNuevo, setIsModalNuevo] = useState(false)
  const [nuevoProyecto, setNuevoProyecto] = useState<Partial<Proyecto>>(PROYECTO_VACIO)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Modal nueva empresa
  const [isModalNuevaEmpresa, setIsModalNuevaEmpresa] = useState(false)
  const [nuevaEmpresa, setNuevaEmpresa] = useState<Partial<Empresa>>({
    tipo_entidad: 'cliente',
    tipo_relacion: 'Cliente',
  })
  const [errorsEmpresa, setErrorsEmpresa] = useState<Record<string, string>>({})
  const [isSavingEmpresa, setIsSavingEmpresa] = useState(false)

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

  const proyectosPorFase = useMemo(() => {
    const r: Record<FaseProyecto, Proyecto[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }
    proyectos.filter(p => p.estado === 'activo').forEach(p => { if (r[p.fase_actual]) r[p.fase_actual].push(p) })
    return r
  }, [proyectos])

  const proyectosCerrados = useMemo(() => proyectos.filter(p => p.estado === 'cerrado'), [proyectos])

  const handleFase = (id: string, fase: number) => {
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, fase_actual: fase as FaseProyecto } : p))
  }

  const handleCerrar = (id: string) => {
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, estado: 'cerrado', fecha_cierre: new Date().toISOString().split('T')[0], motivo_cierre: 'Completado' } : p))
  }

  const handleReabrir = (id: string) => {
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, estado: 'activo', motivo_cierre: undefined, fecha_cierre: undefined } : p))
  }

  // Abrir modal para nuevo proyecto
  const handleNewProyecto = () => {
    setNuevoProyecto({ ...PROYECTO_VACIO, id: String(Date.now()) })
    setErrors({})
    setIsModalNuevo(true)
  }

  // Guardar nuevo proyecto
  const handleSaveProyecto = async () => {
    setErrors({})

    // Validaciones
    if (!nuevoProyecto?.nombre || nuevoProyecto.nombre.trim().length < 3) {
      setErrors({ nombre: 'El nombre es obligatorio (mínimo 3 caracteres)' })
      return
    }
    if (!nuevoProyecto?.empresa_id) {
      setErrors({ empresa_id: 'Selecciona una empresa cliente' })
      return
    }
    if (!nuevoProyecto?.moneda) {
      setErrors({ moneda: 'Selecciona una moneda' })
      return
    }
    if (nuevoProyecto.monto_estimado && nuevoProyecto.monto_estimado < 0) {
      setErrors({ monto_estimado: 'El monto no puede ser negativo' })
      return
    }
    if (nuevoProyecto.probabilidad_cierre && (nuevoProyecto.probabilidad_cierre < 0 || nuevoProyecto.probabilidad_cierre > 100)) {
      setErrors({ probabilidad_cierre: 'La probabilidad debe estar entre 0 y 100' })
      return
    }

    setIsSaving(true)
    await new Promise(r => setTimeout(r, 500))

    const empresa = empresas.find(e => e.id === nuevoProyecto.empresa_id)
    const now = new Date().toISOString().split('T')[0]

    setProyectos(prev => [...prev, {
      ...nuevoProyecto,
      id: String(Date.now()),
      cliente_nombre: empresa?.nombre,
      creado_en: now,
    } as Proyecto])

    setIsSaving(false)
    setIsModalNuevo(false)
    setNuevoProyecto(PROYECTO_VACIO)
  }

  // Guardar nueva empresa
  const handleSaveEmpresa = async () => {
    setErrorsEmpresa({})

    if (!nuevaEmpresa?.nombre || nuevaEmpresa.nombre.trim().length < 2) {
      setErrorsEmpresa({ nombre: 'El nombre es obligatorio' })
      return
    }

    setIsSavingEmpresa(true)
    await new Promise(r => setTimeout(r, 500))

    const empresaId = String(Date.now())
    const now = new Date().toISOString().split('T')[0]

    const empresaCreada: Empresa = {
      ...nuevaEmpresa,
      id: empresaId,
      creado_en: now,
    } as Empresa

    setEmpresas(prev => [...prev, empresaCreada])
    setNuevoProyecto({ ...nuevoProyecto, empresa_id: empresaId })

    setIsSavingEmpresa(false)
    setIsModalNuevaEmpresa(false)
    setNuevaEmpresa({ tipo_entidad: 'cliente', tipo_relacion: 'Cliente' })
  }

  if (!isAdmin && !isComercial && !isTecnico) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold">Acceso Restringido</h2>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selected = proyectos.find(p => p.id === selectedId)
  const faseActual = FASES.find(f => f.id === selected?.fase_actual)

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
              onAddTarea={() => {}}
            />
          ) : null
        }
        panelOpen={!!selectedId}
      >
        <ModuleHeader
          title="Proyectos"
          description="Pipeline de proyectos"
          actions={
            canMovePhases && (
              <Button onClick={handleNewProyecto}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            )
          }
          tabs={[
            { value: 'pipeline', label: 'Pipeline' },
            { value: 'cerrados', label: 'Cerrados', count: proyectosCerrados.length }
          ]}
          activeTab={view}
          onTabChange={(v) => setView(v as 'pipeline' | 'cerrados')}
        />

          <StatGrid cols={5}>
            {FASES.map(fase => (
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
                {FASES.map(fase => (
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
                          progress={p.probabilidad_cierre}
                          progressLabel="Probabilidad"
                          value={`${p.moneda} ${p.monto_estimado?.toLocaleString()}`}
                          assignee={{ name: p.responsable_nombre || '' }}
                          tags={(p.tags || []).map(tag => ({ label: tag }))}
                          onClick={() => setSelectedId(p.id)}
                        >
                          {canMovePhases && (
                            <div className="flex gap-1 mt-3 pt-2 border-t border-border/50">
                              {fase.id > 1 && (
                                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={(e) => { e.stopPropagation(); handleFase(p.id, fase.id - 1) }}>←</Button>
                              )}
                              {fase.id < 5 && (
                                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={(e) => { e.stopPropagation(); handleFase(p.id, fase.id + 1) }}>→</Button>
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
      <Modal
        open={isModalNuevo}
        onClose={() => setIsModalNuevo(false)}
        title="Nuevo Proyecto"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Proyecto *</Label>
            <Input
              id="nombre"
              value={nuevoProyecto.nombre || ''}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })}
              placeholder="Ej: Implementación de Red"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="empresa">Cliente *</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsModalNuevaEmpresa(true)}
              >
                <Building2 className="h-3 w-3 mr-1" />
                Nueva empresa
              </Button>
            </div>
            <Select
              value={nuevoProyecto.empresa_id || ''}
              onValueChange={(value) => setNuevoProyecto({ ...nuevoProyecto, empresa_id: value })}
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
            {errors.empresa_id && <p className="text-xs text-red-500 mt-1">{errors.empresa_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="moneda">Moneda *</Label>
              <Select
                value={nuevoProyecto.moneda || 'USD'}
                onValueChange={(value: "USD" | "MXN" | "EUR") => setNuevoProyecto({ ...nuevoProyecto, moneda: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONEDAS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.moneda && <p className="text-xs text-red-500 mt-1">{errors.moneda}</p>}
            </div>
            <div>
              <Label htmlFor="monto">Monto Estimado</Label>
              <Input
                id="monto"
                type="number"
                value={nuevoProyecto.monto_estimado || ''}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, monto_estimado: Number(e.target.value) })}
                placeholder="0"
                className={errors.monto_estimado ? 'border-red-500' : ''}
              />
              {errors.monto_estimado && <p className="text-xs text-red-500 mt-1">{errors.monto_estimado}</p>}
            </div>
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
              {errors.probabilidad_cierre && <p className="text-xs text-red-500 mt-1">{errors.probabilidad_cierre}</p>}
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
            <input
              id="requiere_compras"
              type="checkbox"
              checked={nuevoProyecto.requiere_compras || false}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, requiere_compras: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="requiere_compras" className="text-sm font-normal">
              Requiere compras
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalNuevo(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProyecto} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Crear Proyecto'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Nueva Empresa */}
      <Modal
        open={isModalNuevaEmpresa}
        onClose={() => setIsModalNuevaEmpresa(false)}
        title="Nueva Empresa"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emp_nombre">Nombre *</Label>
              <Input
                id="emp_nombre"
                value={nuevaEmpresa.nombre || ''}
                onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, nombre: e.target.value })}
                placeholder="Razón social"
                className={errorsEmpresa.nombre ? 'border-red-500' : ''}
              />
              {errorsEmpresa.nombre && <p className="text-xs text-red-500 mt-1">{errorsEmpresa.nombre}</p>}
            </div>
            <div>
              <Label htmlFor="emp_tipo">Tipo</Label>
              <Select
                value={nuevaEmpresa.tipo_entidad || 'cliente'}
                onValueChange={(value) => setNuevaEmpresa({ ...nuevaEmpresa, tipo_entidad: value as TipoEntidad })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="proveedor">Proveedor</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emp_industria">Industria</Label>
              <Select
                value={nuevaEmpresa.industria || ''}
                onValueChange={(value: Industria) => setNuevaEmpresa({ ...nuevaEmpresa, industria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIAS.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emp_tamano">Tamaño</Label>
              <Select
                value={nuevaEmpresa.tamaño || ''}
                onValueChange={(value: "Micro" | "PYME" | "Gran empresa") => setNuevaEmpresa({ ...nuevaEmpresa, tamaño: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {TAMAÑOS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emp_email">Email</Label>
              <Input
                id="emp_email"
                type="email"
                value={nuevaEmpresa.email_principal || ''}
                onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, email_principal: e.target.value })}
                placeholder="contacto@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="emp_telefono">Teléfono</Label>
              <Input
                id="emp_telefono"
                value={nuevaEmpresa.telefono_principal || ''}
                onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, telefono_principal: e.target.value })}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emp_direccion">Dirección</Label>
            <Input
              id="emp_direccion"
              value={nuevaEmpresa.direccion || ''}
              onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, direccion: e.target.value })}
              placeholder="Dirección completa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emp_origen">Origen</Label>
              <Select
                value={nuevaEmpresa.origen || ''}
                onValueChange={(value: Origen) => setNuevaEmpresa({ ...nuevaEmpresa, origen: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {ORIGENES.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emp_relacion">Relación</Label>
              <Select
                value={nuevaEmpresa.tipo_relacion || 'Cliente'}
                onValueChange={(value: TipoRelacion) => setNuevaEmpresa({ ...nuevaEmpresa, tipo_relacion: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_RELACION.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalNuevaEmpresa(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEmpresa} disabled={isSavingEmpresa}>
              {isSavingEmpresa ? 'Guardando...' : 'Crear Empresa'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
