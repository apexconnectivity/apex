"use client"

import { Building2, Edit, Trash2, Plus, Mail, Phone, FileText, Check, X, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import type { Empresa, Contacto, Documento } from '@/types/crm'
import type { Proyecto } from '@/types/proyectos'
import type { Ticket } from '@/types/soporte'

const TIPO_COLORS = {
  cliente: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    label: 'Cliente',
  },
  proveedor: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    label: 'Proveedor',
  },
  ambos: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    label: 'Ambos',
  },
}

interface EmpresaDetailModalProps {
  open: boolean
  onClose: () => void
  empresa: Empresa | null
  contactos: Contacto[]
  documentos: Documento[]
  proyectos: Partial<Proyecto>[]
  tickets?: Partial<Ticket>[]
  canEdit: boolean
  canUploadDocuments: boolean
  onEdit: () => void
  onDelete: () => void
  onNewContacto: () => void
  onEditContacto?: (contacto: Contacto) => void  // Agregar esta línea
  onDeleteContacto: (id: string) => void
  onNewDocumento: () => void
  onDeleteDocumento: (id: string) => void
  notaEditando: boolean
  notaTemporal: string
  onOpenNotaEdit: () => void
  onNotaChange: (value: string) => void
  onSaveNota: () => void
  onCancelNota: () => void
}

export function EmpresaDetailModal({
  open,
  onClose,
  empresa,
  contactos,
  documentos,
  proyectos,
  tickets = [],
  canEdit,
  canUploadDocuments,
  onEdit,
  onDelete,
  onNewContacto,
  onEditContacto,
  onDeleteContacto,
  onNewDocumento,
  onDeleteDocumento,
  notaEditando,
  notaTemporal,
  onOpenNotaEdit,
  onNotaChange,
  onSaveNota,
  onCancelNota,
}: EmpresaDetailModalProps) {
  if (!empresa) return null

  const colors = TIPO_COLORS[empresa.tipo_entidad]

  const getContactosByEmpresa = (empresaId: string) => contactos.filter(c => c.empresa_id === empresaId)
  const getDocumentosByEmpresa = (empresaId: string) => documentos.filter(d => d.empresa_id === empresaId)
  const getProyectosByEmpresa = (empresaId: string) => proyectos.filter(p => p.empresa_id === empresaId)

  const empresaContactos = getContactosByEmpresa(empresa.id)
  const empresaDocumentos = getDocumentosByEmpresa(empresa.id)
  const empresaProyectos = getProyectosByEmpresa(empresa.id)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center', colors.bg)}>
              <Building2 className={cn('h-6 w-6', colors.text)} />
            </div>
            <div>
              <DialogTitle className="text-xl">{empresa.nombre}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {empresa.industria} {empresa.tamaño && `• ${empresa.tamaño}`}
              </p>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="p-0">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mx-6 mt-2">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="contactos">
                Contactos ({empresaContactos.length})
              </TabsTrigger>
              <TabsTrigger value="proyectos">
                Proyectos ({empresaProyectos.length})
              </TabsTrigger>
              <TabsTrigger value="documentos">
                Documentos ({empresaDocumentos.length})
              </TabsTrigger>
              <TabsTrigger value="notas">Notas</TabsTrigger>
            </TabsList>

            <div className="px-6 pb-6">
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Tipo</Label>
                    <p className="font-medium">{colors.label}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Relación</Label>
                    <p className="font-medium">{empresa.tipo_relacion || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{empresa.email_principal || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Teléfono</Label>
                    <p className="font-medium">{empresa.telefono_principal || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sitio Web</Label>
                    <p className="font-medium">{empresa.sitio_web || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Dirección</Label>
                    <p className="font-medium">{empresa.direccion || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ciudad</Label>
                    <p className="font-medium">
                      {empresa.ciudad || '-'} {empresa.pais && `, ${empresa.pais}`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">RFC</Label>
                    <p className="font-medium">{empresa.rfc || '-'}</p>
                  </div>
                  {empresa.razon_social && (
                    <div>
                      <Label className="text-muted-foreground">Razón Social</Label>
                      <p className="font-medium">{empresa.razon_social}</p>
                    </div>
                  )}
                  {empresa.email_facturacion && (
                    <div>
                      <Label className="text-muted-foreground">Email Facturación</Label>
                      <p className="font-medium">{empresa.email_facturacion}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  {canEdit && (
                    <Button variant="outline" onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  {canEdit && (
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-500"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contactos" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Contactos</h3>
                  {canEdit && (
                    <Button size="sm" onClick={onNewContacto}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Contacto
                    </Button>
                  )}
                </div>
                {empresaContactos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay contactos registrados
                  </p>
                ) : (
                  <div className="space-y-2">
                    {empresaContactos.map((contacto) => (
                      <div
                        key={contacto.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <span className="text-sm">{contacto.nombre.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{contacto.nombre}</p>
                              {contacto.es_principal && (
                                <Badge variant="secondary" className="text-xs">
                                  Principal
                                </Badge>
                              )}
                              {contacto.activo === false && (
                                <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                                  Inactivo
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {contacto.cargo} • {contacto.tipo_contacto}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {contacto.email}
                          </p>
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditContacto?.(contacto)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteContacto(contacto.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="proyectos" className="mt-4">
                {empresaProyectos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay proyectos asociados
                  </p>
                ) : (
                  <div className="space-y-2">
                    {empresaProyectos.map((proyecto) => (
                      <div
                        key={proyecto.id}
                        className="p-3 rounded-lg border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{proyecto.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {proyecto.descripcion}
                            </p>
                          </div>
                          <StatusBadge
                            status={
                              proyecto.estado === 'activo'
                                ? 'active'
                                : proyecto.estado === 'cerrado'
                                  ? 'completed'
                                  : 'pending'
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documentos" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Documentos</h3>
                  {canUploadDocuments && (
                    <Button size="sm" onClick={onNewDocumento}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Documento
                    </Button>
                  )}
                </div>
                {empresaDocumentos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay documentos
                  </p>
                ) : (
                  <div className="space-y-2">
                    {empresaDocumentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.nombre_archivo}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.descripcion}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{doc.visibilidad}</Badge>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteDocumento(doc.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notas" className="mt-4">
                {notaEditando ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notaTemporal}
                      onChange={(e) => onNotaChange(e.target.value)}
                      placeholder="Escribe notas internas..."
                      rows={6}
                    />
                    <div className="flex gap-2">
                      <Button onClick={onSaveNota}>
                        <Check className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" onClick={onCancelNota}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-4">
                      {empresa.notas_internas || 'Sin notas'}
                    </p>
                    <Button variant="outline" onClick={onOpenNotaEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      {empresa.notas_internas ? 'Editar Notas' : 'Agregar Notas'}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}