'use client'

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
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'

type OptionType = 'industrias' | 'tamanios' | 'tipos' | 'tipos_contacto' | 'origenes' | 'tipos_relacion' | 'regimenes_fiscales' | 'tipos_contrato' | 'metodos_pago'

interface SelectWithAddProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  optionsType: OptionType
  placeholder?: string
  showAllOption?: { label: string; value: string }
}

const OPTIONS_BY_TYPE: Record<OptionType, { label: string; value: string }[]> = {
  industrias: [
    { label: 'Tecnología', value: 'Tecnología' },
    { label: 'Finanzas', value: 'Finanzas' },
    { label: 'Salud', value: 'Salud' },
    { label: 'Educación', value: 'Educación' },
    { label: 'Retail', value: 'Retail' },
    { label: 'Manufactura', value: 'Manufactura' },
    { label: 'Servicios', value: 'Servicios' },
    { label: 'Construcción', value: 'Construcción' },
    { label: 'Transporte', value: 'Transporte' },
    { label: 'Agricultura', value: 'Agricultura' },
    { label: 'Otro', value: 'Otro' },
  ],
  tamanios: [
    { label: 'Micro (1-10 empleados)', value: 'Micro' },
    { label: 'Pequeña (11-50 empleados)', value: 'Pequeña' },
    { label: 'Mediana (51-200 empleados)', value: 'Mediana' },
    { label: 'Grande (201-500 empleados)', value: 'Grande' },
    { label: 'Enterprise (500+ empleados)', value: 'Enterprise' },
  ],
  tipos: [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Proveedor', value: 'proveedor' },
    { label: 'Ambos', value: 'ambos' },
  ],
  tipos_contacto: [
    { label: 'Especialista', value: 'Técnico' },
    { label: 'Comercial', value: 'Comercial' },
    { label: 'Administrativo', value: 'Administrativo' },
    { label: 'Gerencial', value: 'Gerencial' },
    { label: 'Directivo', value: 'Directivo' },
    { label: 'Otro', value: 'Otro' },
  ],
  origenes: [
    { label: 'Web', value: 'Web' },
    { label: 'Referencia', value: 'Referencia' },
    { label: 'Llamada en frío', value: 'Llamada en frío' },
    { label: 'Evento', value: 'Evento' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'Redes sociales', value: 'Redes sociales' },
    { label: 'Publicidad', value: 'Publicidad' },
    { label: 'Otro', value: 'Otro' },
  ],
  tipos_relacion: [
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Prospecto', value: 'Prospecto' },
    { label: 'Ex-cliente', value: 'Ex-cliente' },
  ],
  regimenes_fiscales: [
    { label: 'Persona Moral (Régimen General)', value: 'Régimen General de Ley Personas Morales' },
    { label: 'Persona Física (Actividad Empresarial)', value: 'Actividad Empresarial' },
    { label: 'Persona Física (Servicios Profesionales)', value: 'Servicios Profesionales' },
    { label: 'Persona Física (Arrendamiento)', value: 'Arrendamiento' },
    { label: 'Régimen Simplificado de Confianza', value: 'Régimen Simplificado de Confianza' },
    { label: 'Otro', value: 'Otro' },
  ],
  tipos_contrato: [
    { label: 'Ninguno', value: 'Ninguno' },
    { label: 'Proyecto', value: 'Proyecto' },
    { label: 'Soporte', value: 'Soporte' },
    { label: 'Ambos', value: 'Ambos' },
  ],
  metodos_pago: [
    { label: 'Transferencia', value: 'Transferencia' },
    { label: 'Tarjeta', value: 'Tarjeta' },
    { label: 'Efectivo', value: 'Efectivo' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Otro', value: 'Otro' },
  ],
}

/**
 * SelectWithAdd - Componente migrado a BaseModal
 * 
 * Select con opción de agregar nuevas opciones
 */
export function SelectWithAdd({
  label,
  value,
  onValueChange,
  optionsType,
  placeholder = 'Seleccionar...',
  showAllOption,
}: SelectWithAddProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newOption, setNewOption] = useState('')
  const [customOptions, setCustomOptions] = useState<{ label: string; value: string }[]>([])

  // Cargar opciones personalizadas desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`custom_options_${optionsType}`)
    if (stored) {
      setCustomOptions(JSON.parse(stored))
    }
  }, [optionsType])

  const allOptions = [...OPTIONS_BY_TYPE[optionsType], ...customOptions]

  const handleAddOption = () => {
    if (!newOption.trim()) return

    const newValue = newOption.trim()
    const newOptionObj = { label: newValue, value: newValue }

    const updated = [...customOptions, newOptionObj]
    setCustomOptions(updated)
    localStorage.setItem(`custom_options_${optionsType}`, JSON.stringify(updated))

    onValueChange(newValue)
    setNewOption('')
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setNewOption('')
  }

  return (
    <>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* Contenedor con scroll solo para las opciones */}
          <div className="max-h-60 overflow-y-auto overflow-x-hidden">
            {showAllOption && (
              <SelectItem value={showAllOption.value}>{showAllOption.label}</SelectItem>
            )}
            {allOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </div>
          {/* Botón siempre visible, fuera del scroll */}
          <div className="border-t my-1" />
          <div
            className="px-2 py-1.5 text-sm text-cyan-400 cursor-pointer hover:bg-accent rounded"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
            }}
          >
            + Agregar nueva opción
          </div>
        </SelectContent>
      </Select>

      {/* Modal para agregar nueva opción */}
      <BaseModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        size="sm"
        variant="create"
        showAccentBar
      >
        <ModalHeader
          title={`Agregar ${label}`}
          variant="create"
          showIcon
        />
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>Nueva {label}</Label>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder={`Ej: Nueva ${label.toLowerCase()}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddOption()
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter variant="create" layout="inline-between">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddOption} disabled={!newOption.trim()}>
            Agregar
          </Button>
        </ModalFooter>
      </BaseModal>
    </>
  )
}
