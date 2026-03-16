"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useEmpresas, useProyectos, useTareas, useTickets, useContactos, useArchivos, useReuniones, useContratos } from "@/lib/data"
import { ModuleContainer } from "@/components/module/ModuleContainer"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MiniStat, StatGrid } from "@/components/ui/mini-stat"
import { BarChart, PieChart, ProgressRing, MetricCard, ChartGrid } from "@/components/ui/stats-chart"
import {
  Building2,
  FolderKanban,
  CheckSquare,
  Headphones,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Activity,
  Zap,
  DollarSign,
  Target,
} from "lucide-react"

// Importar constantes
import {
  CHART_COLORS,
  STATS_LABELS,
  ENTITY_TYPE_COLORS,
  PROJECT_STATUS_COLORS,
  TASK_STATUS_COLORS_MAP,
  PRIORITY_COLORS_MAP,
  TICKET_STATUS_COLORS_MAP,
  getChartColorByIndex,
  getVariantByStatus,
} from "@/constants/estadisticas"

// Importar constantes de colores centralizados
import { VARIANT_COLORS } from "@/lib/colors"

// Importar constantes de tareas para fechas
import { DATE_LABELS } from "@/constants/tareas"

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getPorcentajeValue(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return DATE_LABELS.hoy
  if (diffInDays === 1) return DATE_LABELS.ayer
  if (diffInDays < 7) return DATE_LABELS.proximaSemana.replace('Próxima ', '')
  if (diffInDays < 30) return DATE_LABELS.estaSemana.replace('Esta ', '')
  return DATE_LABELS.sinFecha
}

// ============================================================================
// CRM STATS COMPONENT
// ============================================================================

interface CRMStatsProps {
  empresas: ReturnType<typeof useEmpresas>[0]
  contactos: ReturnType<typeof useContactos>[0]
}

function CRMStats({ empresas, contactos }: CRMStatsProps) {
  const clientes = empresas.filter(e => e.tipo_entidad === 'cliente')
  const proveedores = empresas.filter(e => e.tipo_entidad === 'proveedor')
  const ambos = empresas.filter(e => e.tipo_entidad === 'ambos')

  // Empresas por industria
  const industriasCount = React.useMemo(() => {
    const count: Record<string, number> = {}
    empresas.forEach(e => {
      if (e.industria) {
        count[e.industria] = (count[e.industria] || 0) + 1
      }
    })
    return Object.entries(count)
      .map(([label, value], index) => ({
        label,
        value,
        color: getChartColorByIndex(index)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [empresas])

  // Empresas por tipo de relación
  const relacionesCount = React.useMemo(() => {
    const count: Record<string, number> = {}
    empresas.forEach(e => {
      const relacion = e.tipo_relacion || STATS_LABELS.sinRelacion
      count[relacion] = (count[relacion] || 0) + 1
    })
    return Object.entries(count)
      .map(([label, value], index) => ({
        label,
        value,
        color: getChartColorByIndex(index)
      }))
      .sort((a, b) => b.value - a.value)
  }, [empresas])

  // Contactos por tipo
  const contactosPorTipo = React.useMemo(() => {
    const count: Record<string, number> = {}
    contactos.forEach(c => {
      count[c.tipo_contacto] = (count[c.tipo_contacto] || 0) + 1
    })
    return Object.entries(count)
      .map(([label, value], index) => ({
        label,
        value,
        color: getChartColorByIndex(index)
      }))
      .sort((a, b) => b.value - a.value)
  }, [contactos])

  // Datos para gráfico de tipo de entidad
  const tipoEntityData = [
    { label: ENTITY_TYPE_COLORS.cliente.label, value: clientes.length, color: ENTITY_TYPE_COLORS.cliente.color },
    { label: ENTITY_TYPE_COLORS.proveedor.label, value: proveedores.length, color: ENTITY_TYPE_COLORS.proveedor.color },
    { label: ENTITY_TYPE_COLORS.ambos.label, value: ambos.length, color: ENTITY_TYPE_COLORS.ambos.color },
  ].filter(d => d.value > 0)

  if (tipoEntityData.length === 0) {
    tipoEntityData.push({ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate })
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <StatGrid cols={4}>
        <MiniStat
          value={empresas.length}
          label={STATS_LABELS.empresas}
          icon={<Building2 className="h-5 w-5" />}
          variant="primary"
          showBorder
          accentColor={CHART_COLORS.primary}
        />
        <MiniStat
          value={clientes.length}
          label={STATS_LABELS.clientes}
          icon={<Users className="h-5 w-5" />}
          variant="info"
          showBorder
          accentColor={CHART_COLORS.info}
        />
        <MiniStat
          value={proveedores.length}
          label={STATS_LABELS.proveedores}
          icon={<Building2 className="h-5 w-5" />}
          variant="warning"
          showBorder
          accentColor={CHART_COLORS.warning}
        />
        <MiniStat
          value={contactos.length}
          label={STATS_LABELS.contactos}
          icon={<Users className="h-5 w-5" />}
          variant="success"
          showBorder
          accentColor={CHART_COLORS.success}
        />
      </StatGrid>

      {/* Charts Row */}
      <ChartGrid>
        <PieChart
          title={STATS_LABELS.porTipo}
          data={tipoEntityData}
        />
        <BarChart
          title={STATS_LABELS.porIndustria}
          data={industriasCount.length > 0 ? industriasCount : [{ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate }]}
        />
      </ChartGrid>

      {/* Additional Stats */}
      <ChartGrid>
        <BarChart
          title={STATS_LABELS.porRelacion}
          data={relacionesCount.length > 0 ? relacionesCount : [{ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate }]}
        />
        <BarChart
          title={`${STATS_LABELS.contactos} ${STATS_LABELS.porCategoria}`}
          data={contactosPorTipo.length > 0 ? contactosPorTipo : [{ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate }]}
        />
      </ChartGrid>
    </div>
  )
}

// ============================================================================
// PROYECTOS STATS COMPONENT
// ============================================================================

interface ProyectosStatsProps {
  proyectos: ReturnType<typeof useProyectos>[0]
}

function ProyectosStats({ proyectos }: ProyectosStatsProps) {
  const proyectosActivos = proyectos.filter(p => p.estado === 'activo')
  const proyectosCerrados = proyectos.filter(p => p.estado === 'cerrado')

  // Proyectos por fase
  const fasesCount = React.useMemo(() => {
    const fases = ['DIAGNÓSTICO', 'PROPUESTA', 'PLANIFICACIÓN', 'IMPLEMENTACIÓN', 'CIERRE']
    const faseColors = [CHART_COLORS.primary, CHART_COLORS.info, CHART_COLORS.purple, CHART_COLORS.warning, CHART_COLORS.success]
    const count: Record<string, number> = {}

    proyectosActivos.forEach(p => {
      const fase = fases[p.fase_actual - 1] || `Fase ${p.fase_actual}`
      count[fase] = (count[fase] || 0) + 1
    })

    return Object.entries(count)
      .map(([label, value], index) => ({
        label,
        value,
        color: faseColors[index % faseColors.length]
      }))
      .sort((a, b) => b.value - a.value)
  }, [proyectosActivos])

  // Valor total de proyectos
  const valorTotal = React.useMemo(() => {
    return proyectos.reduce((sum, p) => sum + (p.monto_estimado || 0), 0)
  }, [proyectos])

  const valorCerrado = React.useMemo(() => {
    return proyectosCerrados.reduce((sum, p) => sum + (p.monto_real || p.monto_estimado || 0), 0)
  }, [proyectosCerrados])

  // Tasa de éxito
  const tasaExito = proyectos.length > 0
    ? Math.round((proyectosCerrados.length / proyectos.length) * 100)
    : 0

  // Datos para gráfico de estado
  const estadoData = [
    { label: PROJECT_STATUS_COLORS.activo.label, value: proyectosActivos.length, color: PROJECT_STATUS_COLORS.activo.color },
    { label: PROJECT_STATUS_COLORS.cerrado.label, value: proyectosCerrados.length, color: PROJECT_STATUS_COLORS.cerrado.color },
  ].filter(d => d.value > 0)

  if (estadoData.length === 0) {
    estadoData.push({ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate })
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <StatGrid cols={4}>
        <MiniStat
          value={proyectos.length}
          label={STATS_LABELS.proyectos}
          icon={<FolderKanban className="h-5 w-5" />}
          variant="primary"
          showBorder
          accentColor={CHART_COLORS.primary}
        />
        <MiniStat
          value={proyectosActivos.length}
          label={STATS_LABELS.activos}
          icon={<Activity className="h-5 w-5" />}
          variant="success"
          showBorder
          accentColor={CHART_COLORS.success}
        />
        <MiniStat
          value={formatCurrency(valorTotal)}
          label={STATS_LABELS.valorTotal}
          icon={<DollarSign className="h-5 w-5" />}
          variant="info"
          showBorder
          accentColor={CHART_COLORS.info}
        />
        <MiniStat
          value={`${tasaExito}%`}
          label={STATS_LABELS.tasaExito}
          icon={<Target className="h-5 w-5" />}
          variant={getVariantByStatus(tasaExito >= 70 ? 'success' : tasaExito >= 50 ? 'warning' : 'danger')}
          showBorder
          accentColor={tasaExito >= 70 ? CHART_COLORS.success : tasaExito >= 50 ? CHART_COLORS.warning : CHART_COLORS.danger}
        />
      </StatGrid>

      {/* Charts Row */}
      <ChartGrid>
        <PieChart
          title={STATS_LABELS.porEstado}
          data={estadoData}
        />
        <BarChart
          title={STATS_LABELS.porFase}
          data={fasesCount.length > 0 ? fasesCount : [{ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate }]}
        />
      </ChartGrid>

      {/* Progress Cards */}
      <ChartGrid cols={3}>
        <MetricCard
          title={STATS_LABELS.activos}
          value={`${proyectosActivos.length} / ${proyectos.length}`}
          icon={<Activity className="h-5 w-5" />}
          iconBg={VARIANT_COLORS.success.iconBg}
          iconColor={VARIANT_COLORS.success.iconColor}
        >
          <ProgressRing
            value={proyectosActivos.length}
            max={proyectos.length || 1}
            color={CHART_COLORS.success}
            label={STATS_LABELS.activos}
          />
        </MetricCard>
        <MetricCard
          title={STATS_LABELS.cerrados}
          value={`${proyectosCerrados.length} / ${proyectos.length}`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg={VARIANT_COLORS.info.iconBg}
          iconColor={VARIANT_COLORS.info.iconColor}
        >
          <ProgressRing
            value={proyectosCerrados.length}
            max={proyectos.length || 1}
            color={CHART_COLORS.info}
            label={STATS_LABELS.cerrados}
          />
        </MetricCard>
        <MetricCard
          title={STATS_LABELS.valorTotal}
          value={formatCurrency(valorCerrado)}
          subtitle={`${STATS_LABELS.cerrados}: ${formatCurrency(valorCerrado)}`}
          icon={<DollarSign className="h-5 w-5" />}
          iconBg={VARIANT_COLORS.purple.iconBg}
          iconColor={VARIANT_COLORS.purple.iconColor}
        >
          <ProgressRing
            value={valorCerrado}
            max={valorTotal || 1}
            color={CHART_COLORS.purple}
            label={STATS_LABELS.cerrados}
          />
        </MetricCard>
      </ChartGrid>
    </div>
  )
}

// ============================================================================
// TAREAS STATS COMPONENT
// ============================================================================

interface TareasStatsProps {
  tareas: ReturnType<typeof useTareas>[0]
}

function TareasStats({ tareas }: TareasStatsProps) {
  const tareasCompletadas = tareas.filter(t => t.estado === 'Completada')
  const tareasEnProgreso = tareas.filter(t => t.estado === 'En progreso')
  const tareasPendientes = tareas.filter(t => t.estado === 'Pendiente')
  const tareasVencidas = tareas.filter(t => {
    if (t.estado === 'Completada' || !t.fecha_vencimiento) return false
    return new Date(t.fecha_vencimiento) < new Date()
  })

  // Tareas por prioridad
  const prioridadCount = React.useMemo(() => {
    const count: Record<string, number> = {}
    tareas.forEach(t => {
      count[t.prioridad] = (count[t.prioridad] || 0) + 1
    })

    return Object.entries(count)
      .map(([label, value]) => ({
        label: PRIORITY_COLORS_MAP[label]?.label || label,
        value,
        color: PRIORITY_COLORS_MAP[label]?.color || CHART_COLORS.neutral
      }))
  }, [tareas])

  // Tasa de completación
  const tasaCompletacion = tareas.length > 0
    ? Math.round((tareasCompletadas.length / tareas.length) * 100)
    : 0

  // Datos para gráfico de estado
  const estadoData = [
    { label: TASK_STATUS_COLORS_MAP['Completada'].label, value: tareasCompletadas.length, color: TASK_STATUS_COLORS_MAP['Completada'].color },
    { label: TASK_STATUS_COLORS_MAP['En progreso'].label, value: tareasEnProgreso.length, color: TASK_STATUS_COLORS_MAP['En progreso'].color },
    { label: TASK_STATUS_COLORS_MAP['Pendiente'].label, value: tareasPendientes.length, color: TASK_STATUS_COLORS_MAP['Pendiente'].color },
    { label: STATS_LABELS.vencidoPlural, value: tareasVencidas.length, color: CHART_COLORS.danger },
  ].filter(d => d.value > 0)

  if (estadoData.length === 0) {
    estadoData.push({ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate })
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <StatGrid cols={4}>
        <MiniStat
          value={tareas.length}
          label={STATS_LABELS.tareas}
          icon={<CheckSquare className="h-5 w-5" />}
          variant="primary"
          showBorder
          accentColor={CHART_COLORS.primary}
        />
        <MiniStat
          value={tareasCompletadas.length}
          label={STATS_LABELS.completados}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="success"
          showBorder
          accentColor={CHART_COLORS.success}
        />
        <MiniStat
          value={tareasPendientes.length + tareasEnProgreso.length}
          label={STATS_LABELS.pendientes}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
          showBorder
          accentColor={CHART_COLORS.warning}
        />
        <MiniStat
          value={tareasVencidas.length}
          label={STATS_LABELS.vencidos}
          icon={<AlertCircle className="h-5 w-5" />}
          variant="danger"
          showBorder
          accentColor={CHART_COLORS.danger}
        />
      </StatGrid>

      {/* Charts Row */}
      <ChartGrid>
        <PieChart
          title={STATS_LABELS.porEstado}
          data={estadoData}
        />
        <BarChart
          title={STATS_LABELS.porPrioridad}
          data={prioridadCount.filter(d => d.value > 0).length > 0 ? prioridadCount : [{ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate }]}
        />
      </ChartGrid>

      {/* Progress Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800">
          <CardContent className="p-6 flex flex-col items-center">
            <ProgressRing
              value={tareasCompletadas.length}
              max={tareas.length || 1}
              size={140}
              strokeWidth={14}
              color={CHART_COLORS.success}
              label={STATS_LABELS.tasaCompletacion}
              sublabel={`${tareasCompletadas.length} de ${tareas.length}`}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">{STATS_LABELS.porEstado}</h4>
            {[
              { label: STATS_LABELS.completados, value: tareasCompletadas.length, color: CHART_COLORS.success },
              { label: STATS_LABELS.enProgreso, value: tareasEnProgreso.length, color: CHART_COLORS.info },
              { label: STATS_LABELS.pendientes, value: tareasPendientes.length, color: CHART_COLORS.warning },
              { label: STATS_LABELS.vencidos, value: tareasVencidas.length, color: CHART_COLORS.danger },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium" style={{ color: item.color }}>{item.value}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${getPorcentajeValue(item.value, tareas.length)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Necesitamos importar CardTitle y CardHeader
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ============================================================================
// TICKETS STATS COMPONENT
// ============================================================================

interface TicketsStatsProps {
  tickets: ReturnType<typeof useTickets>[0]
}

function TicketsStats({ tickets }: TicketsStatsProps) {
  const ticketsAbiertos = tickets.filter(t => t.estado === 'Abierto')
  const ticketsEnProgreso = tickets.filter(t => t.estado === 'En progreso')
  const ticketsResueltos = tickets.filter(t => t.estado === 'Resuelto' || t.estado === 'Cerrado')

  // Tickets por prioridad
  const prioridadCount = React.useMemo(() => {
    const count: Record<string, number> = {}
    tickets.forEach(t => {
      count[t.prioridad] = (count[t.prioridad] || 0) + 1
    })

    return Object.entries(count)
      .map(([label, value]) => ({
        label: PRIORITY_COLORS_MAP[label]?.label || label,
        value,
        color: PRIORITY_COLORS_MAP[label]?.color || CHART_COLORS.neutral
      }))
  }, [tickets])

  // Tiempo promedio de respuesta
  const tiempoPromedioRespuesta = React.useMemo(() => {
    const ticketsConRespuesta = tickets.filter(t => t.tiempo_respuesta_minutos && t.tiempo_respuesta_minutos > 0)
    if (ticketsConRespuesta.length === 0) return 0
    const total = ticketsConRespuesta.reduce((sum, t) => sum + (t.tiempo_respuesta_minutos || 0), 0)
    return Math.round(total / ticketsConRespuesta.length)
  }, [tickets])

  // Tickets de hoy
  const ticketsHoy = React.useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return tickets.filter(t => t.fecha_apertura.startsWith(hoy)).length
  }, [tickets])

  // Satisfacción promedio
  const satisfaccionPromedio = React.useMemo(() => {
    const ticketsConSatisfaccion = tickets.filter(t => t.satisfaccion_cliente && t.satisfaccion_cliente > 0)
    if (ticketsConSatisfaccion.length === 0) return 'N/A'
    const total = ticketsConSatisfaccion.reduce((sum, t) => sum + (t.satisfaccion_cliente || 0), 0)
    return (total / ticketsConSatisfaccion.length).toFixed(1)
  }, [tickets])

  // Datos para gráfico de estado
  const estadoData = [
    { label: TICKET_STATUS_COLORS_MAP['Abierto'].label, value: ticketsAbiertos.length, color: TICKET_STATUS_COLORS_MAP['Abierto'].color },
    { label: TICKET_STATUS_COLORS_MAP['En progreso'].label, value: ticketsEnProgreso.length, color: TICKET_STATUS_COLORS_MAP['En progreso'].color },
    { label: TICKET_STATUS_COLORS_MAP['Resuelto'].label, value: ticketsResueltos.length, color: TICKET_STATUS_COLORS_MAP['Resuelto'].color },
  ].filter(d => d.value > 0)

  if (estadoData.length === 0) {
    estadoData.push({ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate })
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <StatGrid cols={4}>
        <MiniStat
          value={tickets.length}
          label={STATS_LABELS.tickets}
          icon={<Headphones className="h-5 w-5" />}
          variant="primary"
          showBorder
          accentColor={CHART_COLORS.primary}
        />
        <MiniStat
          value={ticketsAbiertos.length}
          label={STATS_LABELS.abierto}
          icon={<AlertCircle className="h-5 w-5" />}
          variant="danger"
          showBorder
          accentColor={CHART_COLORS.danger}
        />
        <MiniStat
          value={ticketsHoy}
          label={STATS_LABELS.ticketsHoy}
          icon={<Clock className="h-5 w-5" />}
          variant="info"
          showBorder
          accentColor={CHART_COLORS.info}
        />
        <MiniStat
          value={satisfaccionPromedio !== 'N/A' ? `${satisfaccionPromedio}/5` : 'N/A'}
          label={STATS_LABELS.satisfaccion}
          icon={<TrendingUp className="h-5 w-5" />}
          variant={satisfaccionPromedio !== 'N/A' && Number(satisfaccionPromedio) >= 4 ? 'success' : satisfaccionPromedio !== 'N/A' && Number(satisfaccionPromedio) >= 3 ? 'warning' : 'danger'}
          showBorder
          accentColor={satisfaccionPromedio !== 'N/A' && Number(satisfaccionPromedio) >= 4 ? CHART_COLORS.success : satisfaccionPromedio !== 'N/A' && Number(satisfaccionPromedio) >= 3 ? CHART_COLORS.warning : CHART_COLORS.danger}
        />
      </StatGrid>

      {/* Charts Row */}
      <ChartGrid>
        <PieChart
          title={STATS_LABELS.porEstado}
          data={estadoData}
        />
        <BarChart
          title={STATS_LABELS.porPrioridad}
          data={prioridadCount.filter(d => d.value > 0).length > 0 ? prioridadCount : [{ label: STATS_LABELS.sinDatos, value: 1, color: CHART_COLORS.slate }]}
        />
      </ChartGrid>

      {/* Additional Stats */}
      <ChartGrid cols={3}>
        <MetricCard
          title={STATS_LABELS.tiempoPromedio}
          value={tiempoPromedioRespuesta > 0
            ? `${Math.round(tiempoPromedioRespuesta / 60)}h ${tiempoPromedioRespuesta % 60}m`
            : STATS_LABELS.sinDatos
          }
          icon={<Clock className="h-5 w-5" />}
          iconBg={VARIANT_COLORS.info.iconBg}
          iconColor={VARIANT_COLORS.info.iconColor}
        />
        <MetricCard
          title={STATS_LABELS.resuelto}
          value={ticketsResueltos.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg={VARIANT_COLORS.success.iconBg}
          iconColor={VARIANT_COLORS.success.iconColor}
        />
        <MetricCard
          title={STATS_LABELS.enProgreso}
          value={ticketsEnProgreso.length}
          icon={<Activity className="h-5 w-5" />}
          iconBg={VARIANT_COLORS.warning.iconBg}
          iconColor={VARIANT_COLORS.warning.iconColor}
        />
      </ChartGrid>
    </div>
  )
}

// ============================================================================
// RESUMEN GENERAL COMPONENT
// ============================================================================

interface ResumenGeneralProps {
  empresas: ReturnType<typeof useEmpresas>[0]
  proyectos: ReturnType<typeof useProyectos>[0]
  tareas: ReturnType<typeof useTareas>[0]
  tickets: ReturnType<typeof useTickets>[0]
  archivos: ReturnType<typeof useArchivos>[0]
  reuniones: ReturnType<typeof useReuniones>[0]
  contratos: ReturnType<typeof useContratos>[0]
}

function ResumenGeneral({
  empresas,
  proyectos,
  tareas,
  tickets,
  archivos,
  reuniones,
  contratos,
}: ResumenGeneralProps) {
  // Calcular valor total de contratos activos
  const valorContratosActivos = React.useMemo(() => {
    return contratos
      .filter(c => c.estado === 'Activo')
      .reduce((sum, c) => sum + (c.monto_mensual || 0), 0)
  }, [contratos])

  // Reuniones próximas
  const proximasReuniones = React.useMemo(() => {
    const ahora = new Date()
    return reuniones
      .filter(r => new Date(r.fecha_hora_inicio) >= ahora)
      .sort((a, b) => new Date(a.fecha_hora_inicio).getTime() - new Date(b.fecha_hora_inicio).getTime())
      .slice(0, 5)
  }, [reuniones])

  // Actividad reciente (empresas creadas/modificadas)
  const ultimasEmpresas = React.useMemo(() => {
    return [...empresas]
      .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
      .slice(0, 5)
  }, [empresas])

  // Tareas próximas
  const tareasProximas = React.useMemo(() => {
    return tareas
      .filter(t => t.estado !== 'Completada' && t.fecha_vencimiento)
      .sort((a, b) => new Date(a.fecha_vencimiento!).getTime() - new Date(b.fecha_vencimiento!).getTime())
      .slice(0, 5)
  }, [tareas])

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <StatGrid cols={6}>
        <MiniStat
          value={empresas.length}
          label={STATS_LABELS.empresas}
          icon={<Building2 className="h-4 w-4" />}
          variant="primary"
        />
        <MiniStat
          value={proyectos.length}
          label={STATS_LABELS.proyectos}
          icon={<FolderKanban className="h-4 w-4" />}
          variant="info"
        />
        <MiniStat
          value={tareas.length}
          label={STATS_LABELS.tareas}
          icon={<CheckSquare className="h-4 w-4" />}
          variant="warning"
        />
        <MiniStat
          value={tickets.length}
          label={STATS_LABELS.tickets}
          icon={<Headphones className="h-4 w-4" />}
          variant="danger"
        />
        <MiniStat
          value={archivos.length}
          label={STATS_LABELS.archivos}
          icon={<FileText className="h-4 w-4" />}
          variant="success"
        />
        <MiniStat
          value={reuniones.length}
          label={STATS_LABELS.reuniones}
          icon={<Calendar className="h-4 w-4" />}
          variant="default"
        />
      </StatGrid>

      {/* Charts Row */}
      <ChartGrid>
        {/* Contratos Activos */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              {STATS_LABELS.ingresosMensuales}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-400 mb-4">
              {formatCurrency(valorContratosActivos)}
              <span className="text-lg text-muted-foreground font-normal ml-2">{STATS_LABELS.porMes}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{STATS_LABELS.contratos} Activos</span>
                <span className="font-medium">{contratos.filter(c => c.estado === 'Activo').length}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${getPorcentajeValue(contratos.filter(c => c.estado === 'Activo').length, contratos.length)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              {STATS_LABELS.sinActividadReciente}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ultimasEmpresas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm truncate">{empresa.nombre}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{getRelativeTime(empresa.creado_en)}</span>
                </div>
              ))}
              {ultimasEmpresas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{STATS_LABELS.sinActividadReciente}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </ChartGrid>

      {/* Tareas Próximas y Reuniones */}
      <ChartGrid>
        {/* Tareas Próximas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-amber-400" />
              {STATS_LABELS.proximas} {STATS_LABELS.tareas}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tareasProximas.map((tarea) => (
                <div key={tarea.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant={
                        tarea.prioridad === 'Alta' || tarea.prioridad === 'Urgente'
                          ? 'destructive'
                          : tarea.prioridad === 'Media'
                            ? 'warning'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {tarea.prioridad}
                    </Badge>
                    <span className="text-sm truncate">{tarea.nombre}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {tarea.fecha_vencimiento}
                  </span>
                </div>
              ))}
              {tareasProximas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{STATS_LABELS.noHayTareasProximas}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reuniones Próximas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              {STATS_LABELS.proximas} {STATS_LABELS.reuniones}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {proximasReuniones.map((reunion) => (
                <div key={reunion.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{reunion.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">{reunion.proyecto_nombre}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs">
                      {new Date(reunion.fecha_hora_inicio).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reunion.fecha_hora_inicio).toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {proximasReuniones.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{STATS_LABELS.noHayReunionesProximas}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </ChartGrid>
    </div>
  )
}



// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function EstadisticasPage() {
  const { user } = useAuth()

  // Data hooks
  const [empresas] = useEmpresas()
  const [proyectos] = useProyectos()
  const [tareas] = useTareas()
  const [tickets] = useTickets()
  const [contactos] = useContactos()
  const [archivos] = useArchivos()
  const [reuniones] = useReuniones()
  const [contratos] = useContratos()

  // Check if user has access
  const isAdmin = user?.roles.includes('admin')
  const canView = isAdmin || user?.roles.includes('comercial') || user?.roles.includes('tecnico') || user?.roles.includes('facturacion')

  if (!canView) {
    return (
      <ModuleContainer>
        <Card className="p-12 text-center">
          <Zap className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{STATS_LABELS.sinAcceso}</h3>
          <p className="text-muted-foreground">
            {STATS_LABELS.noTienesPermisos}
          </p>
        </Card>
      </ModuleContainer>
    )
  }

  return (
    <ModuleContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="h-8 w-8 text-cyan-400" />
            {STATS_LABELS.tituloPagina}
          </h1>
          <p className="text-muted-foreground">
            {STATS_LABELS.descripcionPagina}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="resumen" className="gap-2">
            <Activity className="h-4 w-4" />
            {STATS_LABELS.tabResumen}
          </TabsTrigger>
          <TabsTrigger value="crm" className="gap-2">
            <Building2 className="h-4 w-4" />
            {STATS_LABELS.tabCrm}
          </TabsTrigger>
          <TabsTrigger value="proyectos" className="gap-2">
            <FolderKanban className="h-4 w-4" />
            {STATS_LABELS.proyectos}
          </TabsTrigger>
          <TabsTrigger value="tareas" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            {STATS_LABELS.tareas}
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Headphones className="h-4 w-4" />
            {STATS_LABELS.tickets}
          </TabsTrigger>
        </TabsList>

        {/* Resumen Tab */}
        <TabsContent value="resumen">
          <ResumenGeneral
            empresas={empresas}
            proyectos={proyectos}
            tareas={tareas}
            tickets={tickets}
            archivos={archivos}
            reuniones={reuniones}
            contratos={contratos}
          />
        </TabsContent>

        {/* CRM Tab */}
        <TabsContent value="crm">
          <CRMStats empresas={empresas} contactos={contactos} />
        </TabsContent>

        {/* Proyectos Tab */}
        <TabsContent value="proyectos">
          <ProyectosStats proyectos={proyectos} />
        </TabsContent>

        {/* Tareas Tab */}
        <TabsContent value="tareas">
          <TareasStats tareas={tareas} />
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <TicketsStats tickets={tickets} />
        </TabsContent>
      </Tabs>
    </ModuleContainer>
  )
}
