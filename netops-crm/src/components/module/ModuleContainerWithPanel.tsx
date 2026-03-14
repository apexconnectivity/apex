import React from 'react'
import { cn } from '@/lib/utils'

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
    <div className="flex h-[calc(100vh-8rem)] w-full px-6 py-6">
      {/* Contenido - ocupa el espacio restante */}
      <div className="flex-1 min-w-0 overflow-y-auto rounded-xl bg-slate-900/50">
        <div className={cn("space-y-6 p-6", className)}>
          {children}
        </div>
      </div>
      
      {/* Panel - transiciona de w-0 a w-1/5 */}
      <div className={cn(
        "transition-all duration-500 border-l border-border/50 h-full rounded-r-xl overflow-y-auto bg-slate-900/50",
        panelOpen ? "w-1/5" : "w-0"
      )}>
        {panelOpen && panel}
      </div>
    </div>
  )
}
