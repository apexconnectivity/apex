"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

type OptionType = 'industrias' | 'tamanios' | 'tipos' | 'tipos_contacto'

interface SelectWithAddProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  optionsType: OptionType
  placeholder?: string
  showAllOption?: { label: string; value: string }
  hideLabel?: boolean
}

const STORAGE_KEY = 'apex_crm_opciones'

const DEFAULT_OPTIONS: Record<OptionType, string[]> = {
  industrias: ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Comercio', 'Industria', 'Gobierno', 'Otro'],
  tamanios: ['Micro', 'PYME', 'Gran empresa'],
  tipos: ['Cliente', 'Proveedor', 'Ambos'],
  tipos_contacto: ['Técnico', 'Administrativo', 'Financiero', 'Compras', 'Comercial', 'Soporte', 'Otro'],
}

function getStoredOptions(): Record<OptionType, string[]> {
  if (typeof window === 'undefined') return DEFAULT_OPTIONS
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return DEFAULT_OPTIONS
    }
  }
  return DEFAULT_OPTIONS
}

function saveOptions(options: Record<OptionType, string[]>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
}

export function SelectWithAdd({
  label,
  value,
  onValueChange,
  optionsType,
  placeholder = 'Seleccionar...',
  showAllOption,
  hideLabel = false,
}: SelectWithAddProps) {
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS[optionsType])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newValue, setNewValue] = useState('')

  useEffect(() => {
    setOptions(getStoredOptions()[optionsType])
  }, [optionsType, isModalOpen])

  const handleAdd = () => {
    if (!newValue.trim()) return
    
    const currentOptions = getStoredOptions()
    if (!currentOptions[optionsType].includes(newValue.trim())) {
      currentOptions[optionsType] = [...currentOptions[optionsType], newValue.trim()]
      saveOptions(currentOptions)
      setOptions(currentOptions[optionsType])
      onValueChange(newValue.trim())
    }
    
    setNewValue('')
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-2">
      {!hideLabel && <Label>{label}</Label>}
      <Select value={value} onValueChange={(val) => {
        if (val === '__new__') {
          setIsModalOpen(true)
        } else {
          onValueChange(val)
        }
      }}>
        <SelectTrigger className={hideLabel ? "w-[140px]" : "w-full"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value={showAllOption.value}>
              {showAllOption.label}
            </SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
          <SelectItem value="__new__" className="text-muted-foreground font-medium">
            + Nueva {label}
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Nueva {label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-option">Nombre</Label>
              <Input
                id="new-option"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Ej: ${optionsType === 'industrias' ? 'Telecomunicaciones' : 'Startup'}`}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!newValue.trim()}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
