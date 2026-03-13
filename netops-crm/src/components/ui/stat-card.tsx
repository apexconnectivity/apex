import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: ReactNode
  iconBg?: string
  className?: string
}

const defaultIconBg = "bg-gradient-to-br from-cyan-500 to-cyan-600"

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  iconBg = defaultIconBg,
  className 
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "positive" && (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                )}
                {changeType === "negative" && (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    changeType === "positive" && "text-emerald-600 dark:text-emerald-400",
                    changeType === "negative" && "text-red-600 dark:text-red-400",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl shadow-lg", iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-current/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
    </Card>
  )
}
