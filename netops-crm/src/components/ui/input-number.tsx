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

export interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
}

/**
 * InputNumber - Input numérico con soporte de moneda
 * 
 * @example
 * ```tsx
 * <InputNumber
 *   label="Monto estimado"
 *   value={monto}
 *   onChange={(e) => setMonto(Number(e.target.value))}
 *   showCurrency
 *   currency={moneda}
 *   currencies={['USD', 'MXN', 'EUR']}
 *   onCurrencyChange={setMoneda}
 * />
 * ```
 */
export function InputNumber({
  label,
  error,
  showCurrency = false,
  currency = 'USD',
  currencies = ['USD', 'MXN', 'EUR', 'GBP'],
  onCurrencyChange,
  containerClassName,
  className,
  id,
  ...props
}: InputNumberProps) {
  const inputId = id || React.useId()

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={inputId}
            type="number"
            className={cn(
              showCurrency && "pr-20",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />
          {showCurrency && (
            <Select
              value={currency}
              onValueChange={onCurrencyChange}
            >
              <SelectTrigger className="absolute right-0 top-0 bottom-0 w-16 border-l border-input bg-transparent rounded-l-none hover:bg-accent">
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
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
