import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  errorId?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorId, id, ...props }, ref) => {
    // Always call useId - this ensures hooks are always called in the same order
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorDescriptionId = errorId || `${inputId}-error`

    return (
      <>
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300 ease-out hover:border-primary/50 hover:shadow-sm focus:border-primary/70",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
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
            className="text-sm text-destructive mt-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
