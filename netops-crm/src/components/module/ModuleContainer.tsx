import { cn } from '@/lib/utils'

interface ModuleContainerProps {
  children: React.ReactNode
  className?: string
}

export function ModuleContainer({ children, className }: ModuleContainerProps) {
  return (
    <div className={cn("space-y-6 w-full px-6 py-6 rounded-xl bg-slate-900/50", className)}>
      {children}
    </div>
  )
}
