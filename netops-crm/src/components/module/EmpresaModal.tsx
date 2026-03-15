"use client"

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'
import { SelectWithAdd } from './SelectWithAdd'
import {
  Empresa,
  TipoEntidad,
  INDUSTRIAS,
  TAMAÑOS,
  ORIGENES,
  TIPOS_RELACION,
  METODOS_PAGO,
  MONEDAS,
} from '@/types/crm'

interface EmpresaModalProps {
  open: boolean
  onClose: () => void
  onSave: (empresa: Partial<Empresa>, isNew: boolean) => void
  empresa?: Partial<Empresa> | null
  isSaving?: boolean
  errors?: Record<string, string>
}

const EMPRESA_VACIA: Partial<Empresa> = {
  tipo_entidad: 'cliente',
  nombre: '',
  industria: undefined,
  tamaño: undefined,
  origen: undefined,
  tipo_relacion: 'Cliente',
  telefono_principal: '',
  email_principal: '',
  sitio_web: '',
  direccion: '',
  ciudad: '',
  pais: '',
  razon_social: '',
  rfc: '',
  direccion_fiscal: '',
  regimen_fiscal: '',
  email_facturacion: '',
  metodo_pago: undefined,
  plazo_pago: undefined,
  moneda_preferida: undefined,
}

export function EmpresaModal({
  open,
  onClose,
  onSave,
  empresa,
  isSaving = false,
  errors = {},
}: EmpresaModalProps) {
  const [formData, setFormData] = useState<Partial<Empresa>>(EMPRESA_VACIA)
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const isEditing = !!empresa?.id

  useEffect(() => {
    if (open) {
      if (empresa) {
        setFormData({ ...EMPRESA_VACIA, ...empresa })
      } else {
        setFormData({ ...EMPRESA_VACIA, id: String(Date.now()) })
      }
      setLocalErrors({})
    }
  }, [open, empresa])

  const handleSave = () => {
    setLocalErrors({})

    if (!formData.nombre || formData.nombre.trim().length < 3) {
      setLocalErrors({ nombre: 'El nombre es obligatorio (mínimo 3 caracteres)' })
      return
    }
    if (!formData.tipo_entidad) {
      setLocalErrors({ tipo_entidad: 'Selecciona un tipo' })
      return
    }
    if (formData.email_principal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_principal)) {
      setLocalErrors({ email_principal: 'Ingresa un email válido' })
      return
    }
    if (formData.rfc && formData.rfc.trim().length < 8) {
      setLocalErrors({ rfc: 'El RFC debe tener al menos 8 caracteres' })
      return
    }
    if (formData.telefono_principal && !/^[\d\s\+\-\(\)]+$/.test(formData.telefono_principal)) {
      setLocalErrors({ telefono_principal: 'Teléfono inválido' })
      return
    }
    if (formData.sitio_web && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.sitio_web)) {
      setLocalErrors({ sitio_web: 'URL de sitio web inválida' })
      return
    }
    if (formData.plazo_pago && (formData.plazo_pago < 0 || formData.plazo_pago > 365)) {
      setLocalErrors({ plazo_pago: 'El plazo debe ser entre 0 y 365 días' })
      return
    }

    onSave(formData, !isEditing)
  }

  const allErrors = { ...localErrors, ...errors }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Empresa</DialogTitle>
        </DialogHeader>

        <DialogBody className="p-6 space-y-6">
          {/* Sector */}
          <div className="space-y-2">
            <Label>Sector *</Label>
            <div className="flex gap-4">
              {(['cliente', 'proveedor', 'ambos'] as TipoEntidad[]).map((tipo) => (
                <label
                  key={tipo}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 ${formData.tipo_entidad === tipo
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700'
                    }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={formData.tipo_entidad === tipo}
                    onChange={() => setFormData({ ...formData, tipo_entidad: tipo })}
                    className="sr-only"
                  />
                  <span className="text-sm">
                    {tipo === 'cliente' ? 'Cliente' : tipo === 'proveedor' ? 'Proveedor' : 'Ambos'}
                  </span>
                </label>
              ))}
            </div>
            {allErrors.tipo_entidad && (
              <p className="text-red-500 text-sm">{allErrors.tipo_entidad}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Mi Empresa SA"
              className={allErrors.nombre ? 'border-red-500' : ''}
            />
            {allErrors.nombre && <p className="text-red-500 text-sm">{allErrors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectWithAdd
              label="Industria"
              value={formData.industria || ''}
              onValueChange={(value) => setFormData({ ...formData, industria: value as any })}
              optionsType="industrias"
            />
            <SelectWithAdd
              label="Tamaño"
              value={formData.tamaño || ''}
              onValueChange={(value) => setFormData({ ...formData, tamaño: value as any })}
              optionsType="tamanios"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={formData.telefono_principal || ''}
                onChange={(e) => setFormData({ ...formData, telefono_principal: e.target.value })}
                placeholder="Ej: +54 9 11 1234-5678"
                className={allErrors.telefono_principal ? 'border-red-500' : ''}
              />
              {allErrors.telefono_principal && (
                <p className="text-red-500 text-sm">{allErrors.telefono_principal}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email_principal || ''}
                onChange={(e) => setFormData({ ...formData, email_principal: e.target.value })}
                placeholder="Ej: contacto@empresa.com"
                className={allErrors.email_principal ? 'border-red-500' : ''}
              />
              {allErrors.email_principal && (
                <p className="text-red-500 text-sm">{allErrors.email_principal}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input
                value={formData.ciudad || ''}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>País</Label>
              <Input
                value={formData.pais || ''}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sitio Web</Label>
            <Input
              value={formData.sitio_web || ''}
              onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
              placeholder="Ej: www.empresa.com"
              className={allErrors.sitio_web ? 'border-red-500' : ''}
            />
            {allErrors.sitio_web && <p className="text-red-500 text-sm">{allErrors.sitio_web}</p>}
          </div>

          {/* Datos de facturación */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Datos de Facturación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social</Label>
                <Input
                  value={formData.razon_social || ''}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  placeholder="Razón social oficial"
                />
              </div>
              <div className="space-y-2">
                <Label>RFC</Label>
                <Input
                  value={formData.rfc || ''}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                  placeholder="Ej: ABC123456789"
                  className={allErrors.rfc ? 'border-red-500' : ''}
                />
                {allErrors.rfc && <p className="text-red-500 text-sm">{allErrors.rfc}</p>}
              </div>
              <div className="space-y-2">
                <Label>Dirección Fiscal</Label>
                <Input
                  value={formData.direccion_fiscal || ''}
                  onChange={(e) => setFormData({ ...formData, direccion_fiscal: e.target.value })}
                  placeholder="Dirección para facturación"
                />
              </div>
              <div className="space-y-2">
                <Label>Régimen Fiscal</Label>
                <Input
                  value={formData.regimen_fiscal || ''}
                  onChange={(e) => setFormData({ ...formData, regimen_fiscal: e.target.value })}
                  placeholder="Ej: Persona Moral, Persona Física"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Facturación</Label>
                <Input
                  type="email"
                  value={formData.email_facturacion || ''}
                  onChange={(e) => setFormData({ ...formData, email_facturacion: e.target.value })}
                  placeholder="facturacion@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <select
                  value={formData.metodo_pago || ''}
                  onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Seleccionar método</option>
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Plazo de Pago (días)</Label>
                <Input
                  type="number"
                  value={formData.plazo_pago || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, plazo_pago: parseInt(e.target.value) })
                  }
                  placeholder="Ej: 30"
                  min={0}
                  max={365}
                  className={allErrors.plazo_pago ? 'border-red-500' : ''}
                />
                {allErrors.plazo_pago && (
                  <p className="text-red-500 text-sm">{allErrors.plazo_pago}</p>
                )}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
