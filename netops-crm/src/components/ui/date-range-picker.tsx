"use client"

import * as React from "react"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Opciones de selección rápida
const quickOptions = [
  { label: "Hoy", getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: "Ayer", getValue: () => { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); return { from: yesterday, to: yesterday } } },
  { label: "Esta semana", getValue: () => { const today = new Date(); const dayOfWeek = today.getDay(); const start = new Date(today); start.setDate(today.getDate() - dayOfWeek); return { from: start, to: today } } },
  { label: "Semana pasada", getValue: () => { const today = new Date(); const dayOfWeek = today.getDay(); const startOfThisWeek = new Date(today); startOfThisWeek.setDate(today.getDate() - dayOfWeek); const endOfLastWeek = new Date(startOfThisWeek); endOfLastWeek.setDate(startOfThisWeek.getDate() - 1); const startOfLastWeek = new Date(endOfLastWeek); startOfLastWeek.setDate(endOfLastWeek.getDate() - 6); return { from: startOfLastWeek, to: endOfLastWeek } } },
  { label: "Este mes", getValue: () => { const today = new Date(); const start = new Date(today.getFullYear(), today.getMonth(), 1); return { from: start, to: today } } },
  { label: "Mes pasado", getValue: () => { const today = new Date(); const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1); const endOfLastMonth = new Date(startOfThisMonth); endOfLastMonth.setDate(endOfLastMonth.getDate() - 1); const startOfLastMonth = new Date(endOfLastMonth.getFullYear(), endOfLastMonth.getMonth(), 1); return { from: startOfLastMonth, to: endOfLastMonth } } },
  { label: "Últimos 7 días", getValue: () => { const today = new Date(); const start = new Date(today); start.setDate(today.getDate() - 6); return { from: start, to: today } } },
  { label: "Últimos 30 días", getValue: () => { const today = new Date(); const start = new Date(today); start.setDate(today.getDate() - 29); return { from: start, to: today } } },
]

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

function isDateInRange(date: Date, from: Date | undefined, to: Date | undefined): boolean {
  if (!from || !to) return false
  const time = date.getTime()
  return time >= from.getTime() && time <= to.getTime()
}

function formatDate(date: Date | undefined): string {
  if (!date) return ""
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Seleccionar rango de fechas",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectingFrom, setSelectingFrom] = React.useState(true)
  const [tempRange, setTempRange] = React.useState<DateRange>(value || { from: undefined, to: undefined })

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
    if (selectingFrom) {
      setTempRange({ from: date, to: undefined })
      setSelectingFrom(false)
    } else {
      // Si la fecha seleccionada es anterior a from, la intercambiamos
      if (tempRange.from && date < tempRange.from) {
        setTempRange({ from: date, to: tempRange.from })
      } else {
        setTempRange({ ...tempRange, to: date })
      }
      setSelectingFrom(true)
    }
  }

  const handleQuickOption = (getValue: () => DateRange) => {
    const range = getValue()
    setTempRange(range)
    setSelectingFrom(true)
    onChange?.(range)
    setIsOpen(false)
  }

  const handleApply = () => {
    onChange?.(tempRange)
    setIsOpen(false)
    setSelectingFrom(true)
  }

  const handleClear = () => {
    setTempRange({ from: undefined, to: undefined })
    onChange?.({ from: undefined, to: undefined })
    setSelectingFrom(true)
  }

  const displayValue = React.useMemo(() => {
    if (value?.from && value?.to) {
      return `${formatDate(value.from)} - ${formatDate(value.to)}`
    }
    if (value?.from) {
      return `Desde: ${formatDate(value.from)}`
    }
    return placeholder
  }, [value, placeholder])

  const getDayClassName = (date: Date | null): string => {
    if (!date) return "invisible"

    const isSelected = isSameDay(date, tempRange.from) || isSameDay(date, tempRange.to)
    const isInRange = isDateInRange(date, tempRange.from, tempRange.to)
    const isToday = isSameDay(date, new Date())
    const isSelectingStart = !selectingFrom && !tempRange.to && tempRange.from && date > tempRange.from

    return cn(
      "w-8 h-8 rounded-md text-sm transition-all duration-200 ease-out hover:scale-110 hover:z-10",
      isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 scale-105",
      isInRange && !isSelected && "bg-primary/20 text-foreground",
      isSelectingStart && "bg-primary/20 text-foreground",
      !isSelected && !isInRange && "hover:bg-accent text-foreground",
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
        <span className={cn("flex-1 text-left truncate transition-colors", !value?.from && "text-muted-foreground")}>
          {displayValue}
        </span>
        {value?.from && (
          <X
            className="h-3 w-3 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
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
          <div className="absolute top-full left-0 z-50 mt-2 w-80 bg-background rounded-xl shadow-xl border border-border/50 animate-in fade-in zoom-in-95 duration-300">
            {/* Quick Options */}
            <div className="p-3 border-b border-border/50">
              <div className="flex flex-wrap gap-1">
                {quickOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleQuickOption(option.getValue)}
                    className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

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

            {/* Selection indicator */}
            <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
              {selectingFrom ? "Selecciona fecha de inicio" : "Selecciona fecha de fin"}
              {tempRange.from && !selectingFrom && (
                <span className="ml-2 font-medium text-foreground">
                  (Desde: {formatDate(tempRange.from)})
                </span>
              )}
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
                onClick={handleApply}
                disabled={!tempRange.from}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DateRangePicker
