import { z } from 'zod'

// ============================================================================
// Tipos base importados de los tipos existentes
// ============================================================================

// Moneda - de src/types/compartidos.ts
const MonedaSchema = z.enum(['USD', 'MXN', 'EUR'])

// TipoEntidad - de src/types/crm.ts
const TipoEntidadSchema = z.enum(['cliente', 'proveedor', 'ambos'])

// Industria - de src/types/crm.ts
const IndustriaSchema = z.enum([
  'Tecnología',
  'Salud',
  'Educación',
  'Finanzas',
  'Comercio',
  'Industria',
  'Gobierno',
  'Otro',
])

// Tamaño - de src/types/crm.ts
const TamañoSchema = z.enum(['Micro', 'PYME', 'Gran empresa'])

// Origen - de src/types/crm.ts
const OrigenSchema = z.enum(['Web', 'Referencia', 'Llamada en frío', 'Evento', 'LinkedIn', 'Otro'])

// TipoRelacion - de src/types/crm.ts
const TipoRelacionSchema = z.enum(['Cliente', 'Prospecto', 'Ex-cliente'])

// TipoContacto - de src/types/crm.ts
const TipoContactoSchema = z.enum([
  'Técnico',
  'Administrativo',
  'Financiero',
  'Compras',
  'Comercial',
  'Soporte',
  'Otro',
])

// MetodoPago - de src/types/crm.ts
const MetodoPagoSchema = z.enum(['Transferencia', 'Tarjeta', 'Efectivo', 'Cheque', 'Otro'])

// FaseProyecto - de src/types/proyectos.ts
const FaseProyectoSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])

// EstadoProyecto - de src/types/proyectos.ts
const EstadoProyectoSchema = z.enum(['activo', 'cerrado'])

// Role - de src/types/auth.ts
const RoleSchema = z.enum([
  'admin',
  'comercial',
  'especialista',
  'compras',
  'facturacion',
  'marketing',
  'cliente',
])

// ============================================================================
// Esquemas de validación para entidades del CRM
// ============================================================================

/**
 * Esquema de validación para Empresa
 * Basado en la interfaz Empresa de src/types/crm.ts
 */
export const EmpresaSchema = z.object({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' }),
  tipo_entidad: TipoEntidadSchema,
  nombre: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(255, { message: 'El nombre no puede exceder 255 caracteres' }),
  industria: IndustriaSchema.optional(),
  tamaño: TamañoSchema.optional(),
  origen: OrigenSchema.optional(),
  tipo_relacion: TipoRelacionSchema.optional(),
  telefono_principal: z.string().optional(),
  email_principal: z.string().email({ message: 'El email debe ser válido' }).optional().or(z.literal('')),
  sitio_web: z.string().url({ message: 'El sitio web debe ser una URL válida' }).optional().or(z.literal('')),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  pais: z.string().optional(),
  notas_internas: z.string().optional(),
  // Datos de facturación
  razon_social: z.string().optional(),
  rfc: z.string().optional(),
  direccion_fiscal: z.string().optional(),
  regimen_fiscal: z.string().optional(),
  email_facturacion: z.string().email({ message: 'El email de facturación debe ser válido' }).optional().or(z.literal('')),
  metodo_pago: MetodoPagoSchema.optional(),
  plazo_pago: z.number().int().min(0, { message: 'El plazo de pago debe ser un número positivo' }).optional(),
  moneda_preferida: MonedaSchema.optional(),
  // Metadatos
  creado_en: z.string().datetime({ message: 'La fecha de creación debe ser una fecha válida' }),
  creado_por: z.string().optional(),
  ultima_actividad: z.string().optional(),
})

export type EmpresaZod = z.infer<typeof EmpresaSchema>

/**
 * Esquema de validación para Contacto
 * Basado en la interfaz Contacto de src/types/crm.ts
 */
export const ContactoSchema = z.object({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' }),
  empresa_id: z.string().uuid({ message: 'El ID de empresa debe ser un UUID válido' }),
  nombre: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(255, { message: 'El nombre no puede exceder 255 caracteres' }),
  cargo: z.string().optional(),
  tipo_contacto: TipoContactoSchema,
  email: z.string().email({ message: 'El email debe ser válido' }),
  telefono: z.string().optional(),
  es_principal: z.boolean(),
  recibe_facturas: z.boolean(),
  notas: z.string().optional(),
  activo: z.boolean(),
  usuario_id: z.string().optional(),
  creado_en: z.string().datetime({ message: 'La fecha de creación debe ser una fecha válida' }),
})

export type ContactoZod = z.infer<typeof ContactoSchema>

/**
 * Esquema de validación para Proyecto
 * Basado en la interfaz Proyecto de src/types/proyectos.ts
 */
export const ProyectoSchema = z.object({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' }),
  empresa_id: z.string().uuid({ message: 'El ID de empresa debe ser un UUID válido' }),
  nombre: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(255, { message: 'El nombre no puede exceder 255 caracteres' }),
  descripcion: z.string().optional(),
  fase_actual: FaseProyectoSchema,
  estado: EstadoProyectoSchema,
  fecha_inicio: z.string().optional(),
  fecha_estimada_fin: z.string().optional(),
  fecha_real_fin: z.string().optional(),
  fecha_cierre: z.string().optional(),
  motivo_cierre: z.string().optional(),
  fecha_inicio_negociacion: z.string().optional(),
  fecha_aceptacion_propuesta: z.string().optional(),
  fecha_inicio_implementacion: z.string().optional(),
  moneda: MonedaSchema,
  monto_estimado: z.number().nonnegative({ message: 'El monto estimado debe ser un número positivo' }).optional(),
  monto_real: z.number().nonnegative({ message: 'El monto real debe ser un número positivo' }).optional(),
  probabilidad_cierre: z
    .number()
    .int()
    .min(0, { message: 'La probabilidad de cierre debe estar entre 0 y 100' })
    .max(100, { message: 'La probabilidad de cierre debe estar entre 0 y 100' }),
  responsable_id: z.string().uuid({ message: 'El ID del responsable debe ser un UUID válido' }),
  responsable_nombre: z.string().optional(),
  equipo: z.array(z.string()).optional(),
  contacto_tecnico_id: z.string().uuid({ message: 'El ID del contacto técnico debe ser un UUID válido' }),
  contacto_tecnico_nombre: z.string().optional(),
  tags: z.array(z.string()).optional(),
  requiere_compras: z.boolean(),
  creado_en: z.string().datetime({ message: 'La fecha de creación debe ser una fecha válida' }),
  creado_por: z.string().optional(),
  cliente_nombre: z.string().optional(),
})

export type ProyectoZod = z.infer<typeof ProyectoSchema>

/**
 * Esquema de validación para Usuario
 * Basado en la interfaz User de src/types/auth.ts
 */
export const UsuarioSchema = z.object({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' }),
  email: z.string().email({ message: 'El email debe ser válido' }),
  nombre: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(255, { message: 'El nombre no puede exceder 255 caracteres' }),
  telefono: z.string().optional(),
  activo: z.boolean(),
  creado_en: z.string().datetime({ message: 'La fecha de creación debe ser una fecha válida' }),
  ultimo_acceso: z.string().optional(),
  cambiar_password_proximo_login: z.boolean(),
  roles: z.array(RoleSchema).min(1, { message: 'El usuario debe tener al menos un rol' }),
})

export type UsuarioZod = z.infer<typeof UsuarioSchema>

// ============================================================================
// Esquemas para creación (sin campos generated)
// ============================================================================

/**
 * Esquema para crear una nueva Empresa (sin id ni fechas)
 */
export const EmpresaCreateSchema = EmpresaSchema.omit({
  id: true,
  creado_en: true,
  ultima_actividad: true,
}).extend({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' }).optional(),
})

export type EmpresaCreateZod = z.infer<typeof EmpresaCreateSchema>

/**
 * Esquema para crear un nuevo Contacto (sin id ni fecha)
 */
export const ContactoCreateSchema = ContactoSchema.omit({
  id: true,
  creado_en: true,
})

export type ContactoCreateZod = z.infer<typeof ContactoCreateSchema>

/**
 * Esquema para crear un nuevo Proyecto (sin id ni fecha)
 */
export const ProyectoCreateSchema = ProyectoSchema.omit({
  id: true,
  creado_en: true,
})

export type ProyectoCreateZod = z.infer<typeof ProyectoCreateSchema>

/**
 * Esquema para crear un nuevo Usuario (sin id ni fechas)
 */
export const UsuarioCreateSchema = UsuarioSchema.omit({
  id: true,
  creado_en: true,
  ultimo_acceso: true,
})

export type UsuarioCreateZod = z.infer<typeof UsuarioCreateSchema>

// ============================================================================
// Exportar todos los esquemas
// ============================================================================

export const schemas = {
  empresa: EmpresaSchema,
  empresaCreate: EmpresaCreateSchema,
  contacto: ContactoSchema,
  contactoCreate: ContactoCreateSchema,
  proyecto: ProyectoSchema,
  proyectoCreate: ProyectoCreateSchema,
  usuario: UsuarioSchema,
  usuarioCreate: UsuarioCreateSchema,
}

export type SchemaType = keyof typeof schemas
