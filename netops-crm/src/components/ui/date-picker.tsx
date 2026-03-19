"use client"

import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Días de la semana en español
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function getDaysInMonth(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days: (Date | null)[] = []

  // Días del mes anterior
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  return days
}

function isSameDay(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
  if (!date1 || !date2) return false
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
}

function formatDate(date: Date | undefined): string {
  if (!date) return ""
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const currentYear = currentMonth.getFullYear()
  const currentMonthIndex = currentMonth.getMonth()

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIndex - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIndex + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    onChange?.(date)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange?.(undefined)
    setIsOpen(false)
  }

  // Go to current month if no value
  useEffect(() => {
    if (value && !isSameDay(value, currentMonth)) {
      setCurrentMonth(new Date(value.getFullYear(), value.getMonth(), 1))
    }
  }, [value, currentMonth])

  const displayValue = value ? formatDate(value) : placeholder

  const getDayClassName = (date: Date | null): string => {
    if (!date) return "invisible"

    const isSelected = isSameDay(date, value)
    const isToday = isSameDay(date, new Date())

    return cn(
      "w-8 h-8 rounded-md text-sm transition-all duration-200 ease-out hover:scale-110 hover:z-10",
      isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 scale-105",
      !isSelected && "hover:bg-accent text-foreground",
      isToday && !isSelected && "font-bold border border-primary"
    )
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 w-full h-9 px-3 py-2 text-sm rounded-lg border-2 border-input bg-background shadow-sm transition-all duration-300 ease-out",
          "hover:border-primary/50 hover:shadow-md hover:scale-[1.01]",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-primary ring-offset-2 border-primary/70"
        )}
      >
        <Calendar className="h-4 w-4 text-muted-foreground transition-transform duration-300" />
        <span className={cn("flex-1 text-left truncate transition-colors", !value && "text-muted-foreground")}>
          {displayValue}
        </span>
        {value && (
          <X
            className="h-3 w-3 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation()
              onChange?.(undefined)
            }}
          />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover Content */}
          <div className="absolute top-full left-0 z-50 mt-2 w-72 bg-background rounded-xl shadow-xl border border-border/50 animate-in fade-in zoom-in-95 duration-300">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-md hover:bg-accent transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">
                {MONTHS[currentMonthIndex]} {currentYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-md hover:bg-accent transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-3">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={!date}
                    onClick={() => date && handleDateClick(date)}
                    className={getDayClassName(date)}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                Limpiar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DatePicker
