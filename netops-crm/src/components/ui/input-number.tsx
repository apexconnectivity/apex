"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"

export interface InputNumberProps {
  label?: string
  error?: string
  containerClassName?: string
  /** Mostrar selector de moneda */
  showCurrency?: boolean
  /** Moneda actual */
  currency?: string
  /** Lista de monedas disponibles */
  currencies?: string[]
  /** Callback cuando cambia la moneda */
  onCurrencyChange?: (currency: string) => void
  /** Mostrar botones de incremento/decremento */
  showStepper?: boolean
  /** Valor del paso para incrementar/decrementar */
  step?: number
  /** Valor mínimo */
  min?: number
  /** Valor máximo */
  max?: number
  /** Valor del input */
  value?: number | string
  /** Callback cuando cambia el valor */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Placeholder */
  placeholder?: string
  /** Clases adicionales */
  className?: string
  /** ID */
  id?: string
  /** Props adicionales */
  [key: string]: unknown
}

/**
 * InputNumber - Input numérico con soporte de moneda y botones de incremento/decremento
 */
export function InputNumber({
  label,
  error,
  showCurrency = false,
  currency = 'USD',
  currencies = ['USD', 'MXN', 'EUR', 'GBP'],
  onCurrencyChange,
  showStepper = false,
  step = 1,
  min = 0,
  max = 100,
  containerClassName,
  className,
  id,
  value,
  onChange,
  ...props
}: InputNumberProps) {
  const inputId = React.useId()

  // Convert value to number for calculations
  const numericValue = value === '' || value === undefined || value === null
    ? 0
    : Number(value)

  // Handle increment
  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const newValue = Math.min(numericValue + step, max)
    const syntheticEvent = {
      target: { value: newValue.toString() }
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }

  // Handle decrement
  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const newValue = Math.max(numericValue - step, min)
    const syntheticEvent = {
      target: { value: newValue.toString() }
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }

  // Determine if buttons should be disabled
  const isIncrementDisabled = numericValue >= max
  const isDecrementDisabled = numericValue <= min

  // Build input classes - hide native spinners
  const inputClasses = cn(
    className,
    showCurrency && "pr-20",
    showStepper && "rounded-r-none",
    error && "border-red-500 focus-visible:ring-red-500",
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  )

  // Stepper button styles - matching Input height
  const stepperButtonClass = cn(
    "flex items-center justify-center h-10 px-2.5 border border-l-0 border-input bg-background hover:bg-accent transition-colors duration-200",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background",
    "first:rounded-l-none first:border-l-0 last:rounded-r-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
  )

  // Currency select styles
  const currencySelectClasses = cn(
    "w-16 h-10 rounded-l-none border-l-0 border-input bg-transparent hover:bg-accent",
    showStepper && "rounded-l-none border-l-0"
  )

  // Main container layout
  const showCurrencyValue = showCurrency
  const showStepperValue = showStepper

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      {/* Flex container for input + controls */}
      <div className="flex">
        {/* Input field */}
        <Input
          id={id || inputId}
          type="number"
          className={inputClasses}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          {...props}
        />

        {/* Currency selector (if no stepper, appears to the right) */}
        {showCurrencyValue && !showStepperValue && (
          <Select
            value={currency}
            onValueChange={onCurrencyChange}
          >
            <SelectTrigger className={currencySelectClasses}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {currencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Stepper buttons - always to the right of input */}
        {showStepperValue && (
          <div className="flex -ml-px">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isDecrementDisabled}
              className={cn(stepperButtonClass, "rounded-l-md")}
              aria-label="Decrementar"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isIncrementDisabled}
              className={cn(stepperButtonClass, "rounded-r-md")}
              aria-label="Incrementar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Currency selector (if stepper exists, appears after stepper buttons) */}
        {showCurrencyValue && showStepperValue && (
          <Select
            value={currency}
            onValueChange={onCurrencyChange}
          >
            <SelectTrigger className="w-16 h-10 rounded-l-none border-l border-input bg-transparent hover:bg-accent -ml-px">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {currencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
