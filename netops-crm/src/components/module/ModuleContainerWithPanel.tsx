import { cn } from '@/lib/utils'
import { ModuleContainer } from './ModuleContainer'

interface ModuleContainerWithPanelProps {
  children: React.ReactNode
  panel: React.ReactNode
  panelOpen: boolean
  className?: string
}

export function ModuleContainerWithPanel({ 
  children, 
  panel, 
  panelOpen,
  className 
}: ModuleContainerWithPanelProps) {
  return (
    <div className="flex relative w-full h-full min-h-screen overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ModuleContainer className={className}>
          {children}
        </ModuleContainer>
      </div>
      <div className={cn(
        "transition-all duration-500 ease-out overflow-hidden border-l border-border/50 h-full rounded-l-xl",
        panelOpen ? 'w-1/5' : 'w-0'
      )}>
        {panelOpen && panel}
      </div>
    </div>
  )
}
