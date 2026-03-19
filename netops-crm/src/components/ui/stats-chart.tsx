/**
 * Componentes de visualización para estadísticas
 * Gráficos reutilizables usando CSS puro (sin dependencias externas)
 */

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { CHART_COLORS } from "@/lib/colors"

// ============================================================================
// TIPOS
// ============================================================================

export interface ChartDataItem {
  label: string
  value: number
  color: string
}

// ============================================================================
// BAR CHART
// ============================================================================

interface BarChartProps {
  data: ChartDataItem[]
  title?: string
  className?: string
}

export function BarChart({ data, title, className }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate max-w-[60%]">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((item.value / maxValue) * 100)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Sin datos disponibles</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PIE CHART
// ============================================================================

interface PieChartProps {
  data: ChartDataItem[]
  title?: string
  className?: string
  showLegend?: boolean
}

export function PieChart({ data, title, className, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Create conic gradient for pie chart
  let currentAngle = 0
  const gradientParts = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const part = `${item.color} ${currentAngle}deg ${currentAngle + angle}deg`
    currentAngle += angle
    return part
  })

  const hasData = data.length > 0 && data.some(d => d.value > 0)

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-cyan-400" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className={cn("flex items-center gap-6", !showLegend && "justify-center")}>
          {/* Pie Chart */}
          <div
            className="relative rounded-full flex-shrink-0"
            style={{
              width: 120,
              height: 120,
              background: hasData ? `conic-gradient(${gradientParts.join(', ')})` : CHART_EMPTY_COLOR,
            }}
          >
            <div className="absolute inset-4 rounded-full bg-slate-950" />
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="space-y-2 flex-1">
              {hasData ? data.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground truncate">{item.label}</span>
                  </div>
                  <span className="font-medium shrink-0 ml-2">
                    {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const CHART_EMPTY_COLOR = CHART_COLORS.empty

// ============================================================================
// PROGRESS RING
// ============================================================================

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label: string
  sublabel?: string
  className?: string
}

export function ProgressRing({
  value,
  max,
  size = 80,
  strokeWidth = 8,
  color = CHART_COLORS.default,
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{percentage}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-center">{label}</span>
      {sublabel && <span className="text-xs text-muted-foreground text-center">{sublabel}</span>}
    </div>
  )
}

// ============================================================================
// STATS LIST (Lista de estadísticas con progress bars)
// ============================================================================

interface StatsListItem {
  label: string
  value: number
  color?: string
}

interface StatsListProps {
  data: StatsListItem[]
  title?: string
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showProgress?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StatsList({ data, title, className, showProgress = true }: StatsListProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
              <span className="text-sm truncate">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Sin datos disponibles</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// METRIC CARD (Card con métrica destacada)
// ============================================================================

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  iconBg?: string
  iconColor?: string
  className?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  children?: ReactNode
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-cyan-500/15',
  iconColor = 'text-cyan-400',
  className,
  trend,
  children,
}: MetricCardProps) {
  return (
    <Card className={cn("bg-gradient-to-br from-slate-900 to-slate-800", className)}>
      <CardContent className="p-4">
        {children ? (
          <div className="flex flex-col items-center">
            {children}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn("p-3 rounded-lg", iconBg)}>
                <span className={cn(iconColor)}>{icon}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              {trend && (
                <p className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-emerald-400" : "text-red-400"
                )}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// GRID LAYOUTS
// ============================================================================

interface ChartGridProps {
  children: ReactNode
  cols?: 2 | 3 | 4
  className?: string
}

export function ChartGrid({ children, cols = 2, className }: ChartGridProps) {
  const colClasses = {
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn("grid gap-6", colClasses[cols], className)}>
      {children}
    </div>
  )
}
