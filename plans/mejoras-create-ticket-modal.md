# Plan de Mejoras: CreateTicketModal Reutilizable

## Análisis Comparativo

### Modal Actual vs Requisitos

| Campo | CreateTicketModal (dashboard) | NuevoTicketModal (portal) | Requisito Documentación |
|-------|-------------------------------|---------------------------|------------------------|
| Cliente | ❌ No tiene (solo contrato) | ❌ No tiene | ✅ Requiere |
| Contrato | ✅ | ❌ No aplica | ✅ Requiere |
| Proyecto relacionado | ❌ Falta | ❌ Falta | ✅ Opcional |
| Tipo apertura (cliente/interno) | ❌ Falta | ❌ Falta | ✅ Obligatorio |
| Categoría | ✅ | ✅ | ✅ Obligatorio |
| Prioridad | ✅ | ✅ | ✅ Obligatorio |
| Estado | ✅ | ❌ | ❌ No debe ser editable |
| Responsable | ✅ | ❌ | ✅ Auto-asignado |
| Título | ✅ | ✅ | ✅ Obligatorio |
| Descripción | ✅ | ✅ | ✅ Obligatorio |
| Archivos adjuntos | ❌ Falta | ❌ Falta | ✅ Opcional |

---

## Problemas Identificados

1. **Dos modales distintos**: CreateTicketModal (dashboard) y NuevoTicketModal (portal) no comparten código
2. **Faltan campos obligatorios**: Cliente separado, proyecto, tipo de apertura
3. **No hay lógica de auto-asignación**: Según documentación, al seleccionar categoría debe sugerir responsable

---

## Propuesta de Solución

### 1. Unificar en un solo componente reutilizable

Crear un `TicketForm` genérico que pueda ser usado por:
- Dashboard interno (con todos los campos)
- Portal del cliente (solo campos básicos)

### 2. Props del componente

```typescript
interface TicketFormProps {
  mode: 'create' | 'edit' | 'cliente'  // Modo de uso
  contratos: ContratoSoporte[]          // Lista de contratos disponibles
  empresas?: Empresa[]                 // Empresas (para interno)
  proyectos?: Proyecto[]               // Proyectos (opcional)
  usuarios: Usuario[]                  // Usuarios para asignación
  ticket?: Ticket                      // Ticket a editar (edit mode)
  onSave: (data: TicketFormData) => void
  onDelete?: () => void                // Solo para edit
}
```

### 3. Campos según modo

| Campo | Interno (create) | Interno (edit) | Cliente |
|-------|------------------|----------------|---------|
| Cliente | ✅ editable | solo lectura | ❌ (del usuario) |
| Contrato | ✅ editable | solo lectura | ✅ dropdown contratos |
| Proyecto | ✅ opcional | solo lectura | ❌ |
| Tipo apertura | ✅ (cliente/interno) | no mostrar | siempre "cliente" |
| Categoría | ✅ | ✅ editable | ✅ |
| Prioridad | ✅ | ✅ editable | ✅ |
| Estado | ✅ default "Abierto" | ✅ editable | ❌ (siempre "Abierto") |
| Responsable | ✅ (sugerido auto) | ✅ editable | ❌ (no mostrar) |
| Título | ✅ | ✅ editable | ✅ |
| Descripción | ✅ | ✅ editable | ✅ |

### 4. Lógica de auto-asignación

Al seleccionar categoría, mostrar responsable sugerido:

| Categoría | Responsable Sugerido |
|-----------|---------------------|
| Soporte técnico | técnico_asignado del contrato |
| Consulta comercial | comercial_asignado de la empresa |
| Facturación | usuario con rol facturacion |
| Compras | usuario con rol compras |
| Otro | sin asignar (notificar admin) |

---

## Plan de Implementación

### Fase 1: Refactorizar CreateTicketModal
- [ ] Agregar prop `mode` para distinguir interno vs cliente
- [ ] Agregar selector de cliente (antes del contrato)
- [ ] Agregar selector de proyecto relacionado
- [ ] Agregar opción de tipo apertura (cliente/interno)
- [ ] Implementar lógica de auto-asignación por categoría
- [ ] Ocultar campo estado en modo cliente

### Fase 2: Unificar con portal
- [ ] Reemplazar NuevoTicketModal en portal por CreateTicketModal
- [ ] Pasar mode="cliente" cuando se use en portal

### Fase 3: Mejoras futuras (no prioritario)
- [ ] Agregar campo de archivos adjuntos
- [ ] Validaciones adicionales

---

## Archivo a modificar

- `netops-crm/src/components/module/CreateTicketModal.tsx`
- `netops-crm/src/app/portal/page.tsx` (reemplazar modal)

---

## Pendiente: Confirmación del usuario

Antes de proceder, necesito confirmar:
1. ¿El plan de unificar los dos modales es correcto?
2. ¿Priorizamos la funcionalidad interna primero (dashboard)?
3. ¿Qué funcionalidades específicas necesitas del modal?