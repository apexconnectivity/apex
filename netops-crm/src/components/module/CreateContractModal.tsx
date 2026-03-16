"use client"

import { useState, useEffect, useRef } from 'react'
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, FileCheck } from 'lucide-react'
import { ContratoSoporte as ContratoType, TipoContrato, EstadoContrato, CONTRATOS_TIPOS, CONTRATOS_ESTADOS } from '@/types/soporte'
import { Empresa } from '@/types/crm'
import { CREATE_CONTRACT_MODAL } from '@/constants/soporte'

interface CreateContractModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  empresas: Empresa[]
  usuarios: { id: string; nombre: string; rol: string }[]
  contrato?: ContratoType | null
  onSave: (data: CreateContractData) => void
  onDelete?: () => void
}

export interface CreateContractData {
  mode: 'create' | 'edit'
  contrato: Omit<ContratoType, 'id' | 'creado_en'>
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

function ContractFormFields({
  contrato,
  setContrato,
  empresas,
  usuarios,
  disabled
}: {
  contrato: Omit<ContratoType, 'id' | 'creado_en'>
  setContrato: React.Dispatch<React.SetStateAction<Omit<ContratoType, 'id' | 'creado_en'>>>
  empresas: Empresa[]
  usuarios: { id: string; nombre: string; rol: string }[]
  disabled?: boolean
}) {
  const clientEmpresas = empresas.filter(e => e.tipo_entidad === 'cliente')
  const tecnicos = usuarios.filter(u => u.rol === 'tecnico' || u.rol === 'admin')

  return (
    <div className="space-y-4">
      <div>
        <Label>{CREATE_CONTRACT_MODAL.labels.empresa}</Label>
        <Select value={contrato.empresa_id} onValueChange={(v) => {
          const empresa = empresas.find(e => e.id === v)
          setContrato({ 
            ...contrato, 
            empresa_id: v,
            empresa_nombre: empresa?.nombre || '',
          })
        }} disabled={disabled}>
          <SelectTrigger className="bg-background"><SelectValue placeholder={CREATE_CONTRACT_MODAL.placeholders.seleccionarEmpresa} /></SelectTrigger>
          <SelectContent>
            {clientEmpresas.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{CREATE_CONTRACT_MODAL.labels.nombre}</Label>
        <Input 
          value={contrato.nombre} 
          onChange={(e) => setContrato({ ...contrato, nombre: e.target.value })} 
          placeholder={CREATE_CONTRACT_MODAL.placeholders.ejemploNombre}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.tipo}</Label>
          <Select value={contrato.tipo} onValueChange={(v) => setContrato({ ...contrato, tipo: v as TipoContrato })} disabled={disabled}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CONTRATOS_TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.estado}</Label>
          <Select value={contrato.estado} onValueChange={(v) => setContrato({ ...contrato, estado: v as EstadoContrato })} disabled={disabled}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CONTRATOS_ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.fechaInicio}</Label>
          <Input 
            type="date" 
            value={contrato.fecha_inicio} 
            onChange={(e) => setContrato({ ...contrato, fecha_inicio: e.target.value })} 
            disabled={disabled}
          />
        </div>
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.fechaFin}</Label>
          <Input 
            type="date" 
            value={contrato.fecha_fin} 
            onChange={(e) => setContrato({ ...contrato, fecha_fin: e.target.value })} 
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.montoMensual}</Label>
          <Input 
            type="number" 
            value={contrato.monto_mensual} 
            onChange={(e) => setContrato({ ...contrato, monto_mensual: parseFloat(e.target.value) || 0 })} 
            disabled={disabled}
          />
        </div>
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.horasIncluidas}</Label>
          <Input 
            type="number" 
            value={contrato.horas_incluidas_mes} 
            onChange={(e) => setContrato({ ...contrato, horas_incluidas_mes: parseInt(e.target.value) || 0 })} 
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.moneda}</Label>
          <Select value={contrato.moneda} onValueChange={(v) => setContrato({ ...contrato, moneda: v as 'USD' | 'MXN' })} disabled={disabled}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">{CREATE_CONTRACT_MODAL.opciones.moneda.usd}</SelectItem>
              <SelectItem value="MXN">{CREATE_CONTRACT_MODAL.opciones.moneda.mxn}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{CREATE_CONTRACT_MODAL.labels.tecnicoAsignado}</Label>
          <Select value={contrato.tecnico_asignado_id || ''} onValueChange={(v) => setContrato({ 
            ...contrato, 
            tecnico_asignado_id: v,
            tecnico_asignado_nombre: tecnicos.find(t => t.id === v)?.nombre
          })} disabled={disabled}>
            <SelectTrigger className="bg-background"><SelectValue placeholder={CREATE_CONTRACT_MODAL.placeholders.seleccionarTecnico} /></SelectTrigger>
            <SelectContent>
              {tecnicos.map(t => <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>{CREATE_CONTRACT_MODAL.labels.notas}</Label>
        <Textarea 
          value={contrato.notas || ''} 
          onChange={(e) => setContrato({ ...contrato, notas: e.target.value })} 
          placeholder={CREATE_CONTRACT_MODAL.placeholders.notasAdicionales}
          rows={2}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="renovacion" 
          checked={contrato.renovacion_automatica} 
          onChange={(e) => setContrato({ ...contrato, renovacion_automatica: e.target.checked })} 
          className="rounded"
          disabled={disabled}
        />
        <Label htmlFor="renovacion" className="text-sm">{CREATE_CONTRACT_MODAL.labels.renovacionAutomatica}</Label>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * CreateContractModal - Componente migrado a BaseModal
 * 
 * Antes: usaba Dialog de @/components/ui/dialog
 * Ahora: usa BaseModal + ModalHeader/Body/Footer
 */
export function CreateContractModal({
  open,
  onOpenChange,
  empresas,
  usuarios,
  contrato,
  onSave,
  onDelete
}: CreateContractModalProps) {
  const isEditMode = !!contrato

  const [contratoData, setContratoData] = useState<Omit<ContratoType, 'id' | 'creado_en'>>({
    empresa_id: '',
    empresa_nombre: '',
    nombre: '',
    tipo: 'Premium',
    fecha_inicio: '',
    fecha_fin: '',
    renovacion_automatica: true,
    estado: 'Activo',
    moneda: 'USD',
    monto_mensual: 0,
    horas_incluidas_mes: 10,
    horas_consumidas_mes: 0,
    tecnico_asignado_id: '',
    tecnico_asignado_nombre: '',
    notas: '',
  })

  const initializedRef = useRef(false)

  useEffect(() => {
    if (!open) {
      initializedRef.current = false
      return
    }

    if (initializedRef.current && contrato?.id) {
      return
    }

    initializedRef.current = true

    if (contrato && isEditMode) {
      setContratoData({
        empresa_id: contrato.empresa_id,
        empresa_nombre: contrato.empresa_nombre,
        nombre: contrato.nombre,
        tipo: contrato.tipo,
        fecha_inicio: contrato.fecha_inicio,
        fecha_fin: contrato.fecha_fin,
        renovacion_automatica: contrato.renovacion_automatica,
        estado: contrato.estado,
        moneda: contrato.moneda,
        monto_mensual: contrato.monto_mensual,
        horas_incluidas_mes: contrato.horas_incluidas_mes,
        horas_consumidas_mes: contrato.horas_consumidas_mes,
        tecnico_asignado_id: contrato.tecnico_asignado_id || '',
        tecnico_asignado_nombre: contrato.tecnico_asignado_nombre || '',
        notas: contrato.notas || '',
      })
    } else {
      setContratoData({
        empresa_id: '',
        empresa_nombre: '',
        nombre: '',
        tipo: 'Premium',
        fecha_inicio: '',
        fecha_fin: '',
        renovacion_automatica: true,
        estado: 'Activo',
        moneda: 'USD',
        monto_mensual: 0,
        horas_incluidas_mes: 10,
        horas_consumidas_mes: 0,
        tecnico_asignado_id: '',
        tecnico_asignado_nombre: '',
        notas: '',
      })
    }
  }, [open])

  const handleSave = () => {
    if (!contratoData.empresa_id || !contratoData.nombre || !contratoData.fecha_inicio || !contratoData.fecha_fin) return

    const data: CreateContractData = {
      mode: isEditMode ? 'edit' : 'create',
      contrato: contratoData,
    }

    onSave(data)
    onOpenChange(false)
  }

  const hasEmpresas = empresas.filter(e => e.tipo_entidad === 'cliente').length > 0
  const canSave = contratoData.empresa_id && contratoData.nombre && contratoData.fecha_inicio && contratoData.fecha_fin && hasEmpresas

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
    >
      {/* ✅ ModalHeader */}
      <ModalHeader
        title={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-green-400" />
            </div>
            {isEditMode ? CREATE_CONTRACT_MODAL.tituloEditar : CREATE_CONTRACT_MODAL.tituloCrear}
          </div>
        }
      />
      
      {/* ✅ ModalBody */}
      <ModalBody>
        {!hasEmpresas ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{CREATE_CONTRACT_MODAL.alertas.sinEmpresas}</p>
            <p className="text-sm text-muted-foreground">{CREATE_CONTRACT_MODAL.alertas.crearEmpresaPrimero}</p>
          </div>
        ) : (
          <ContractFormFields
            contrato={contratoData}
            setContrato={setContratoData}
            empresas={empresas}
            usuarios={usuarios}
          />
        )}
      </ModalBody>
      
      {/* ✅ ModalFooter */}
      <ModalFooter layout="inline-between">
        {isEditMode && onDelete && (
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> {CREATE_CONTRACT_MODAL.botones.eliminar}
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="outline" onClick={() => onOpenChange(false)}>{CREATE_CONTRACT_MODAL.botones.cancelar}</Button>
        <Button onClick={handleSave} disabled={!canSave}>
          {isEditMode ? CREATE_CONTRACT_MODAL.botones.guardar : CREATE_CONTRACT_MODAL.botones.crear}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
