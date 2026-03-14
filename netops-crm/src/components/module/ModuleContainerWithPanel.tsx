import React from 'react'
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
    <div className="flex h-full w-full">
      {/* Contenido - ocupa el espacio restante */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <ModuleContainer className={className}>
          {children}
        </ModuleContainer>
      </div>
      
      {/* Panel - transiciona de w-0 a w-1/5 */}
      <div className={cn(
        "transition-all duration-500 border-l border-border/50 h-full rounded-l-xl overflow-hidden",
        panelOpen ? "w-1/5" : "w-0"
      )}>
        {panelOpen && panel}
      </div>
    </div>
  )
}
