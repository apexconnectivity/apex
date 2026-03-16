"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CardVariant = 
  | "default" 
  | "bordered" 
  | "elevated" 
  | "ghost"
  | "gradient"

export type CardSize = "sm" | "md" | "lg" | "xl"

export interface BaseCardProps {
  children: React.ReactNode
  className?: string
  
  // Comportamiento
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  
  // Visual
  variant?: CardVariant
  padding?: CardSize | "none"
  
  // Border
  showBorder?: boolean
  borderColor?: string
  
  // Efectos
  glowOnHover?: boolean
  glowColor?: string
}

// Configuraciones de variantes
const VARIANT_STYLES: Record<CardVariant, string> = {
  default: "bg-card border-border/50 shadow-sm",
  bordered: "bg-transparent border-2 border-border",
  elevated: "bg-card shadow-xl border-transparent",
  ghost: "bg-transparent border-transparent shadow-none",
  gradient: "bg-gradient-to-br from-card to-card/80 border-border/30"
}

const PADDING_STYLES: Record<CardSize | "none", string> = {
  sm: "p-3",
  md: "p-4", 
  lg: "p-6",
  xl: "p-8",
  none: "p-0"
}

export function BaseCard({
  children,
  className,
  hoverable = false,
  clickable = false,
  onClick,
  variant = "default",
  padding = "md",
  showBorder = true,
  borderColor,
  glowOnHover = false,
  glowColor = "cyan"
}: BaseCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  
  const variantClasses = VARIANT_STYLES[variant]
  const paddingClasses = PADDING_STYLES[padding]
  
  // Determinar si es interactivo
  const isInteractive = clickable || !!onClick
  
  // Estilos de hover
  const hoverEffect = hoverable 
    ? (glowOnHover 
        ? "transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/30"
        : "transition-all duration-200 hover:shadow-md hover:border-border")
    : ""

  // Estilos de border
  const borderStyle = borderColor 
    ? { borderColor } 
    : undefined

  return (
    <div
      className={cn(
        "rounded-xl w-full max-w-full overflow-hidden",
        showBorder && "border",
        !showBorder && "border-none",
        variantClasses,
        paddingClasses,
        hoverEffect,
        isInteractive && "cursor-pointer",
        glowOnHover && isHovered && "ring-1 ring-cyan-500/30",
        className
      )}
      style={borderStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
  ...props
}: CardHeaderProps) {
  // Si no hay título, icono ni subtítulo, renderizar solo los hijos
  if (!title && !icon && !subtitle) {
    return (
      <div className={cn("p-6 pb-0", className)} {...props}>
        {props.children}
      </div>
    )
  }

  return (
    <div 
      className={cn("flex items-start justify-between mb-4", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          {title && <h3 className="font-semibold text-foreground">{title}</h3>}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("", className)} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "between"
}

export function CardFooter({ 
  align = "start",
  className, 
  ...props 
}: CardFooterProps) {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between"
  }
  
  return (
    <div 
      className={cn("flex items-center gap-2 mt-4 pt-4 border-t border-border/50", alignClasses[align], className)}
      {...props}
    />
  )
}

// ============================================================================
// SKELETONS
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
}

function Skeleton({ className, width, height, ...props }: SkeletonProps) {
  return (
    <div 
      className={cn("animate-pulse bg-muted/60 rounded", className)}
      style={{ width, height }}
      {...props}
    />
  )
}

export const CardSkeletons = {
  Line: ({ width = "100%", height = "1rem" }: { width?: string, height?: string }) => (
    <Skeleton width={width} height={height} />
  ),
  
  Card: () => (
    <BaseCard>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </BaseCard>
  ),
  
  List: ({ items = 3 }: { items?: number }) => (
    <div className="space-y-2">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  ),
  
  StatsGrid: ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <BaseCard key={i} padding="md">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </BaseCard>
      ))}
    </div>
  )
}
