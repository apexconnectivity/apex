"use client"

import * as React from "react"
import { Input, type InputProps } from "./input"
import { cn } from "@/lib/utils"

interface InputPhoneProps extends Omit<InputProps, "onChange"> {
  label?: string
  error?: string
  onChange?: (value: string) => void
}

/**
 * InputPhone - Componente para ingresar números de teléfono con formato automático
 * 
 * Formato: xx xxxx xxxx (2 dígitos, espacio, 4 dígitos, espacio, 4 dígitos)
 * Solo acepta números y espacios
 * 
 * @example
 * ```tsx
 * <InputPhone
 *   label="Teléfono"
 *   value={phone}
 *   onChange={(value) => setPhone(value)}
 *   placeholder="55 1234 5678"
 * />
 * ```
 */
export function InputPhone({
  label,
  error,
  className,
  value,
  onChange,
  placeholder = "55 1234 5678",
  ...props
}: InputPhoneProps) {
  const inputId = React.useId()

  // Función para formatear el teléfono
  const formatPhone = (input: string): string => {
    // Solo permitir números y espacios
    const cleaned = input.replace(/[^\d\s]/g, "")

    // Limitar a 10 dígitos (sin contar espacios)
    const digits = cleaned.replace(/\s/g, "").slice(0, 10)

    // Aplicar formato: xx xxxx xxxx
    let formatted = ""
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 6) {
        formatted += " "
      }
      formatted += digits[i]
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    onChange?.(formatted)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Input
        id={inputId}
        type="tel"
        value={value as string || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          error && "border-destructive focus:border-destructive focus:ring-destructive"
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
