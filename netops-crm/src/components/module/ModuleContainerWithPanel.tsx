import React, { useCallback } from 'react'
import { cn } from '@/lib/utils'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  panelOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  panelTitle,
  onClosePanel,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  panelWidth = "w-1/5",
  className 
}: ModuleContainerWithPanelProps) {
  // Usar useCallback para estabilidad de la función de cierre
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClose = useCallback(() => {
    if (onClosePanel) {
      onClosePanel()
    } else if (onClose) {
      onClose()
    }
  }, [onClosePanel, onClose])

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full px-6 py-6 overflow-hidden">
      {/* Contenido principal */}
      <div className="flex-1 min-w-0 overflow-y-auto rounded-xl bg-slate-900/50">
        <div className={cn("space-y-6 p-6", className)}>
          {children}
        </div>
      </div>
      
      {/* Renderizar el panel directamente (ya viene envuelto en BaseSidePanel) */}
      {panel}
    </div>
  )
})
