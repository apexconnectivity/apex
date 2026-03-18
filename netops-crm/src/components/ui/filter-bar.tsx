"use client"

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker, type DateRange } from '@/components/ui/date-range-picker'
import { cn } from '@/lib/utils'

// ============================================
// Types
// ============================================

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  label?: string
  placeholder?: string
  options?: FilterOption[]
  width?: string
  type?: 'select' | 'date'
  dateRange?: {
    placeholder?: string
  }
}

export interface FilterBarProps {
  // Search
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string

  // Filters
  filters: FilterConfig[]
  values: Record<string, string>
  onFilterChange: (key: string, value: string) => void

  // Date filter (for date range picker)
  dateValue?: DateRange
  onDateChange?: (range: DateRange) => void

  // Clear filters
  onClearFilters?: () => void
  hasActiveFilters?: boolean

  // Customization
  className?: string
}

// ============================================
// Component
// ============================================

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters,
  values,
  onFilterChange,
  dateValue,
  onDateChange,
  onClearFilters,
  hasActiveFilters = false,
  className,
}: FilterBarProps) {
  // Separate date filter from select filters
  const dateFilter = filters.find(f => f.type === 'date')
  const selectFilters = filters.filter(f => f.type !== 'date')

  return (
    <div className={cn('flex flex-wrap gap-4 items-center', className)}>
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-300" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-8"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600 transition-all duration-300 hover:scale-110"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Selects (non-date filters) */}
      {selectFilters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-1">
          {filter.label && (
            <span className="text-xs text-muted-foreground whitespace-nowrap transition-colors">{filter.label}:</span>
          )}
          <Select
            key={filter.key}
            value={values[filter.key] || ''}
            onValueChange={(value) => onFilterChange(filter.key, value)}
          >
            <SelectTrigger
              className={cn(
                'h-8 bg-input border-border transition-all duration-300',
                filter.width || 'w-40'
              )}
            >
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {/* Date Range Filter */}
      {dateFilter && (
        <div className="flex items-center gap-1">
          {dateFilter.label && (
            <span className="text-xs text-muted-foreground whitespace-nowrap transition-colors">{dateFilter.label}:</span>
          )}
          <DateRangePicker
            value={dateValue}
            onChange={onDateChange}
            placeholder={dateFilter.placeholder || 'Seleccionar fechas'}
            className={cn('w-64', dateFilter.width)}
          />
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="h-8 text-xs font-medium text-muted-foreground border-dashed hover:text-foreground hover:border-solid hover:bg-accent transition-all duration-300 hover:scale-[1.02]"
        >
          <X className="h-3 w-3 mr-1.5 transition-transform duration-300" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
