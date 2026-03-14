import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type StatVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface StatConfig {
  iconBg: string
  iconColor: string
  valueColor: string
  borderColor?: string
}

const STAT_VARIANTS: Record<StatVariant, StatConfig> = {
  default: {
    iconBg: 'bg-muted/50',
    iconColor: 'text-muted-foreground',
    valueColor: 'text-foreground',
  },
  primary: {
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    valueColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
  },
  success: {
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    valueColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  warning: {
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    valueColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  danger: {
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    valueColor: 'text-red-400',
    borderColor: 'border-red-500/20',
  },
  info: {
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    valueColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
}

interface MiniStatProps {
  value: string | number
  label: string
  valueColor?: string
  icon?: ReactNode
  className?: string
  size?: "sm" | "md"
  variant?: StatVariant
  showBorder?: boolean
  iconPosition?: "left" | "right"
}

export function MiniStat({ 
  value, 
  label, 
  valueColor, 
  icon, 
  className, 
  size = "sm",
  variant = "default",
  showBorder = false,
  iconPosition = "right"
}: MiniStatProps) {
  const padding = size === "md" ? "p-6" : "p-4"
  const config = STAT_VARIANTS[variant]
  
  return (
    <Card className={cn(
      "card-hover overflow-hidden",
      showBorder && config.borderColor && `border ${config.borderColor}`,
      className
    )}>
      <CardContent className={cn(padding, "flex items-center justify-between")}>
        <div className="min-w-0">
          <p className={cn("text-2xl font-bold tracking-tight", valueColor || config.valueColor)}>
            {value}
          </p>
          <p className={cn("text-muted-foreground truncate", size === "md" ? "text-sm" : "text-xs")}>
            {label}
          </p>
        </div>
        {icon && (
          <div className={cn(
            "rounded-lg flex items-center justify-center flex-shrink-0",
            config.iconBg,
            config.iconColor,
            size === "md" ? "p-3" : "p-2"
          )}>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatGridProps {
  children: ReactNode
  className?: string
  cols?: 2 | 3 | 4 | 5 | 6
}

export function StatGrid({ children, className, cols = 4 }: StatGridProps) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }
  
  return (
    <div className={cn("gap-4", colClasses[cols], className, "grid")}>
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: StatVariant
  className?: string
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
  onClick
}: StatCardProps) {
  const config = STAT_VARIANTS[variant]
  
  return (
    <Card 
      className={cn(
        "card-hover cursor-pointer",
        config.borderColor && `border ${config.borderColor}`,
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={cn("rounded-lg p-2", config.iconBg)}>
            <span className={cn(config.iconColor)}>
              {icon}
            </span>
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-emerald-500/15 text-emerald-400" 
                : "bg-red-500/15 text-red-400"
            )}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <p className={cn("text-2xl font-bold", config.valueColor)}>{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}