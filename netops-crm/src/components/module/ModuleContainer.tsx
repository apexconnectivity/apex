import { cn } from '@/lib/utils'
import { BackgroundPattern } from '@/components/ui/background-pattern'

interface ModuleContainerProps {
  children: React.ReactNode
  className?: string
  showBackground?: boolean
}

export function ModuleContainer({ 
  children, 
  className,
  showBackground = true
}: ModuleContainerProps) {
  return (
    <div className="h-[calc(100vh-8rem)] w-full overflow-x-hidden px-6 py-6">
      <div className={cn("h-full w-full overflow-y-auto space-y-6 rounded-xl bg-slate-900/50 p-6 relative", className)}>
        {showBackground && <BackgroundPattern variant="grid-noise" opacity={0.05} />}
        {children}
      </div>
    </div>
  )
}
