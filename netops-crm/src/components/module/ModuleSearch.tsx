import { ReactNode } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModuleSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  filters?: ReactNode
  className?: string
}

export function ModuleSearch({
  value,
  onChange,
  placeholder = 'Buscar...',
  filters,
  className = ''
}: ModuleSearchProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-3 items-center', className)}>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 pr-8 bg-background/80 border-border/50 focus:border-cyan-500/50 focus:ring-cyan-500/20"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      {filters && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground/60" />
          {filters}
        </div>
      )}
    </div>
  )
}

interface FilterChipProps {
  label: string
  value: string
  active?: boolean
  onClick: () => void
}

export function FilterChip({ label, value, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200",
        active
          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
          : "bg-background/50 border-border/50 text-muted-foreground hover:border-cyan-500/30 hover:text-foreground"
      )}
    >
      {label}
      {value && <span className="ml-1 opacity-60">({value})</span>}
    </button>
  )
}

interface FilterGroupProps {
  label?: string
  children: ReactNode
  className?: string
}

export function FilterGroup({ label, children, className = '' }: FilterGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {label && <span className="text-xs text-muted-foreground/60 mr-1">{label}</span>}
      {children}
    </div>
  )
}
