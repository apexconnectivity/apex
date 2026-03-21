'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface InputTextCaseProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  errorId?: string
  onValueChange?: (value: string) => void
}

// ============================================================================
// Utility: Title Case Formatter
// ============================================================================

/**
 * Converts a string to Title Case (Xxxx Xxxxx Xxxx)
 * - First letter of each word capitalized
 * - Rest of letters lowercase
 * - Handles multiple spaces, hyphens, etc.
 */
export function toTitleCase(str: string): string {
  if (!str) return ''
  
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ============================================================================
// Component
// ============================================================================

export const InputTextCase = React.forwardRef<HTMLInputElement, InputTextCaseProps>(
  ({ className, type, error, errorId, id, onChange, onValueChange, value, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorDescriptionId = errorId || `${inputId}-error`

    const [internalValue, setInternalValue] = React.useState('')
    
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = toTitleCase(e.target.value)
      setInternalValue(formatted)
      
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
        }
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
      }
      
      if (onValueChange) {
        onValueChange(formatted)
      }
    }

    return (
      <>
        <input
          id={inputId}
          type={type}
          value={internalValue}
          onChange={handleChange}
          className={cn(
            'flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300 ease-out hover:border-primary/50 hover:shadow-sm focus:border-primary/70',
            error && 'border-destructive focus:border-destructive focus:ring-destructive',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorDescriptionId : undefined}
          {...props}
        />
        {error && (
          <p
            id={errorDescriptionId}
            className='text-sm text-destructive mt-1'
            role='alert'
          >
            {error}
          </p>
        )}
      </>
    )
  }
)
InputTextCase.displayName = 'InputTextCase'
