import { ReactNode } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface ModuleHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  tabs?: { value: string; label: string; count?: number }[]
  activeTab?: string
  onTabChange?: (value: string) => void
  className?: string
}

export function ModuleHeader({
  title,
  description,
  actions,
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: ModuleHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/30', className)}>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {tabs && tabs.length > 0 && (
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full sm:w-auto"
          >
            <TabsList className="h-9 bg-muted/50">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-sm px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1.5 text-xs opacity-60">
                      ({tab.count})
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
