import { ReactNode } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { PageAnimation } from '@/components/ui/page-animation'
import { VARIANT_COLORS } from '@/lib/colors'

interface ModuleHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  tabs?: { value: string; label: string; count?: number }[]
  activeTab?: string
  onTabChange?: (value: string) => void
  className?: string
  animate?: boolean  // Por defecto true
  icon?: ReactNode
  iconColor?: string
}

export function ModuleHeader({
  title,
  description,
  actions,
  tabs,
  activeTab,
  onTabChange,
  className = '',
  animate = true,
  icon,
  iconColor = VARIANT_COLORS.primary.iconColor
}: ModuleHeaderProps) {
  // Función para renderizar el icono con color
  const renderIcon = (iconNode: ReactNode) => {
    // Verificar si el icono es un elemento React con props (contains className)
    if (iconNode && typeof iconNode === 'object' && 'props' in iconNode) {
      const iconProps = iconNode.props as { className?: string }
      const hasTextColor = iconProps.className?.includes('text-')
      
      if (hasTextColor) {
        return iconNode
      }
    }
    
    // Envolver en span con el color por defecto
    return (
      <span className={iconColor}>
        {iconNode}
      </span>
    )
  }

  const headerContent = (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/30', className)}>
      <div>
        <h1 className={cn('text-3xl font-bold', icon && 'flex items-center gap-3')}>
          {icon && renderIcon(icon)}
          {title}
        </h1>
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

  if (animate) {
    return <PageAnimation delay={0}>{headerContent}</PageAnimation>
  }

  return headerContent
}
