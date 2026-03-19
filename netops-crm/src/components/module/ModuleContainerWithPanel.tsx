import React, { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { BaseSidePanel } from '@/components/base'

interface ModuleContainerWithPanelProps {
  children: React.ReactNode
  panel: React.ReactNode
  panelOpen: boolean
  panelTitle?: string
  onClosePanel?: () => void  // Nueva prop (opcional para compatibilidad)
  onClose?: () => void        // Prop alternativa
  panelWidth?: string
  className?: string
}

/**
 * ModuleContainerWithPanel - Contenedor con panel lateral
 * 
 * Usa BaseSidePanel para el panel lateral.
 * Usa React.memo para evitar re-renders innecesarios.
 */
export const ModuleContainerWithPanel = React.memo(function ModuleContainerWithPanel({ 
  children, 
  panel, 
  panelOpen,
  panelTitle,
  onClosePanel,
  onClose,
  panelWidth = "w-1/5",
  className 
}: ModuleContainerWithPanelProps) {
  // Usar useCallback para estabilidad de la función de cierre
  const handleClose = useCallback(() => {
    if (onClosePanel) {
      onClosePanel()
    } else if (onClose) {
      onClose()
    }
  }, [onClosePanel, onClose])

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full px-6 py-6">
      {/* Contenido principal */}
      <div className="flex-1 min-w-0 overflow-y-auto rounded-xl bg-slate-900/50">
        <div className={cn("space-y-6 p-6", className)}>
          {children}
        </div>
      </div>
      
      {/* Panel lateral usando BaseSidePanel */}
      <BaseSidePanel
        isOpen={panelOpen}
        onClose={handleClose}
        title={panelTitle}
        position="right"
        width={panelWidth}
        showCloseButton={true}
      >
        {panel}
      </BaseSidePanel>
    </div>
  )
})
