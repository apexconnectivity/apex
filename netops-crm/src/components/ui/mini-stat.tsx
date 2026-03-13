import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MiniStatProps {
  value: string | number
  label: string
  valueColor?: string
  icon?: ReactNode
  className?: string
  size?: "sm" | "md"
}

export function MiniStat({ value, label, valueColor, icon, className, size = "sm" }: MiniStatProps) {
  const padding = size === "md" ? "p-6" : "p-4"
  
  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className={cn(padding, "flex items-center justify-between")}>
        <div>
          <p className={cn("text-2xl font-bold tracking-tight", valueColor)}>
            {value}
          </p>
          <p className={cn("text-muted-foreground", size === "md" ? "text-sm" : "text-xs")}>{label}</p>
        </div>
        {icon && (
          <div className={cn("rounded-lg bg-muted/50", size === "md" ? "p-3" : "p-2")}>
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
}

export function StatGrid({ children, className }: StatGridProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", className)}>
      {children}
    </div>
  )
}
