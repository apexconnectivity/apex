## MÓDULO 11: COMPRAS Y PROVEEDORES
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar todo el ciclo de compras de Apex Connectivity: desde la selección de proveedores, solicitud de cotizaciones, generación de órdenes de compra, hasta la recepción de equipos y su vinculación con proyectos. Este módulo se integra con el CRM (proveedores), con proyectos (necesidades de compra) y con tareas (tareas de compras), permitiendo un control de costos y trazabilidad completa. El objetivo es optimizar el proceso de adquisiciones, mantener un histórico de proveedores y precios, y facilitar la gestión del área de compras.

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver | Puede crear | Puede editar | Puede aprobar | Puede eliminar |
|-------|-----------|-------------|--------------|---------------|----------------|
| **Administrador** | Todas las compras, proveedores, órdenes | Sí | Sí | Sí | Sí |
| **Compras** | Proveedores, órdenes de compra, cotizaciones | Sí | Sí (propias) | No (requiere aprobación de admin o jefe) | No |
| **Técnico** | Órdenes de compra de sus proyectos (solo lectura) | No | No | No | No |
| **Comercial** | No (solo a través de proyectos) | No | No | No | No |
| **Facturación** | Órdenes de compra (para facturación de proveedores) | No | No | No | No |
| **Cliente** | No | - | - | - | - |

**Nota:** La aprobación de órdenes de compra puede requerir un flujo de autorización (ej. montos mayores necesitan aprobación de admin). Por simplicidad inicial, solo el admin puede aprobar órdenes, pero el rol compras puede crearlas y editarlas hasta que se aprueben.

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Entidad: PROVEEDOR (extensión de EMPRESA en M2)

En el Módulo 2 ya tenemos empresas de tipo 'proveedor' o 'ambos'. Para este módulo, necesitamos datos adicionales específicos de compras. Podemos añadirlos como campos en EMPRESA o crear una tabla complementaria. Optamos por una tabla `datos_proveedor` para no sobrecargar EMPRESA.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | | Auto |
| empresa_id | UUID | FK a empresas (debe ser tipo proveedor o ambos) | Sí |
| condiciones_pago | text | Ej. 30 días, 50% anticipo, etc. | No |
| plazo_entrega_dias | integer | Tiempo estimado de entrega | No |
| moneda_preferida | enum | USD / MXN / EUR | No |
| minimo_compra | decimal | Monto mínimo de compra | No |
| certificaciones | text[] | Ej. ISO, etc. | No |
| evaluacion | integer | 1-5 (calificación interna) | No |
| notas_compras | text | Notas internas del área de compras | No |

### 3.2 Entidad: PRODUCTO_SERVICIO

Catálogo de productos/servicios que se pueden comprar (opcional, pero muy útil).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| proveedor_id | UUID | FK a proveedor (puede ser null si es producto genérico) |
| nombre | string | |
| descripcion | text | |
| categoria | enum | Equipos / Licencias / Servicios / Insumos |
| unidad_medida | string | Ej. "unidad", "metro", "hora" |
| precio_referencia | decimal | Último precio conocido |
| moneda | enum | USD / MXN |
| activo | boolean | |

### 3.3 Entidad: SOLICITUD_COMPRA (opcional, si se requiere)

Una solicitud interna de compra, que puede originarse desde un proyecto (tarea de compras) o manualmente. Luego se convierte en orden de compra.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| proyecto_id | UUID | Proyecto que la solicita (opcional) |
| tarea_id | UUID | Tarea de compras asociada (opcional) |
| solicitante_id | UUID | Usuario que solicita |
| fecha_solicitud | timestamp | |
| descripcion | text | |
| items | jsonb | Lista de items solicitados (producto, cantidad, especificaciones) |
| estado | enum | Pendiente / Cotizando / Aprobada / Rechazada / Convertida |
| prioridad | enum | Baja / Media / Alta / Urgente |
| fecha_requerida | date | |

### 3.4 Entidad: COTIZACION

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| proveedor_id | UUID | |
| solicitud_id | UUID | Opcional, si viene de una solicitud |
| fecha_cotizacion | date | |
| valida_hasta | date | |
| items | jsonb | Lista de items cotizados (producto, cantidad, precio_unitario, total) |
| condiciones | text | |
| total | decimal | |
| moneda | enum | |
| archivo_id | UUID | Referencia a archivo (PDF de la cotización) |
| estado | enum | Recibida / Aceptada / Rechazada |

### 3.5 Entidad: ORDEN_COMPRA

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | | Auto |
| numero_oc | string | Formato: OC-{año}-{número correlativo} | Auto |
| proyecto_id | UUID | Proyecto al que se imputa | Sí |
| proveedor_id | UUID | | Sí |
| solicitud_id | UUID | Opcional | No |
| cotizacion_id | UUID | Opcional | No |
| fecha_emision | date | | Sí |
| fecha_entrega_estimada | date | | No |
| items | jsonb | Lista de items (producto, cantidad, precio_unitario, total) | Sí |
| subtotal | decimal | | Sí |
| impuestos | decimal | | No |
| total | decimal | | Sí |
| moneda | enum | | Sí |
| condiciones_pago | text | | No |
| estado | enum | Borrador / Pendiente aprobación / Aprobada / Enviada / Recibida parcial / Recibida completa / Cancelada | Sí |
| aprobada_por | UUID | Usuario que aprobó | No (null hasta aprobar) |
| fecha_aprobacion | timestamp | | No |
| enviada_por | UUID | Usuario que envió al proveedor | No |
| fecha_envio | timestamp | | No |
| recibida_por | UUID | Usuario que recibió | No |
| fecha_recepcion | timestamp | | No |
| archivo_oc_id | UUID | Referencia a archivo (PDF generado) | No |
| notas | text | | No |
| creado_por | UUID | | Auto |

### 3.6 Entidad: RECEPCION (parcial)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| orden_compra_id | UUID | |
| fecha_recepcion | timestamp | |
| items | jsonb | Lista de items recibidos (producto, cantidad recibida, lote, etc.) |
| recibido_por | UUID | |
| observaciones | text | |
| archivo_id | UUID | Acta de recepción, foto, etc. |

---

## 4. PANTALLAS (Wireframes Descriptivos)

### 4.1 Dashboard de Compras (vista para rol compras)

```
+----------------------------------------------------------+
|  COMPRAS                                        [Hoy: 3] |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ⚠ ÓRDENES DE COMPRA PENDIENTES DE APROBACIÓN (2)        |
|  +------------------------------------------------------+ |
|  | OC-2026-0042 - Proy: Implementación Firewall        | |
|  | Proveedor: Dist. Mayorista · Total: $2,450 USD      | |
|  | Creada: 10/06 · Urgente                              | |
|  | [Ver] [Solicitar aprobación] (si es compras)        | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  📦 ÓRDENES ENVIADAS PENDIENTES DE RECEPCIÓN (3)         |
|  +------------------------------------------------------+ |
|  | OC-2026-0038 - Proy: Hospital Regional              | |
|  | Proveedor: TecnoImport · Enviada: 05/06              | |
|  | Entrega estimada: 12/06                               | |
|  | [Ver] [Registrar recepción]                          | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  📊 ESTADÍSTICAS RÁPIDAS                                 |
|  • Compras este mes: $12,450 USD                        |
|  • Proveedores activos: 8                               |
|  • Órdenes pendientes: 5                                |
+----------------------------------------------------------+
```

### 4.2 Listado de Proveedores

(Similar al listado de empresas del Módulo 2, pero filtrado por tipo proveedor)

### 4.3 Ficha de Proveedor (con pestañas)

```
+----------------------------------------------------------+
|  PROVEEDOR: Distribuidor Mayorista SA          [Editar] |
+----------------------------------------------------------+

+------------------------+----------------------------------+
| DATOS PRINCIPALES       |  DATOS DE COMPRA                 |
| (del CRM)               |  Condiciones pago: 30 días       |
| ...                     |  Plazo entrega: 5-7 días         |
|                         |  Moneda preferida: USD           |
|                         |  Mínimo compra: $500              |
|                         |  Evaluación: ⭐⭐⭐⭐☆ (4/5)        |
+------------------------+----------------------------------+

+----------------------------------------------------------+
|  [Cotizaciones] [Órdenes de compra] [Productos]          |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ÚLTIMAS COTIZACIONES                           [+ Nueva]|
|  +------------------------------------------------------+ |
|  | 05/06/2026 - Válida hasta 05/07/2026 - $2,450       | |
|  | [Ver] [Crear OC]                                     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 4.4 Nueva Orden de Compra

```
+----------------------------------------------------------+
|  NUEVA ORDEN DE COMPRA                         [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Proyecto*: [Implementación Firewall_________________]   |
|  Proveedor*: [Distribuidor Mayorista SA___________]      |
|                                                           |
|  Fecha emisión*: [11/06/2026______________________]      |
|  Fecha entrega estimada: [18/06/2026_______________]     |
|  Moneda*: (●) USD  ( ) MXN                                |
|                                                           |
|  Items:                                                   |
|  +------------------------------------------------------+ |
|  | Producto          | Cantidad | Precio unit. | Total | |
|  | [Switch Cisco...] | [2]      | [$450]       | $900  | |
|  | [Fibra óptica...] | [100m]   | [$2.5]       | $250  | |
|  | [➕ Agregar item]                                    | |
|  +------------------------------------------------------+ |
|                                                           |
|  Subtotal: $1,150                                         |
|  Impuestos (16%): $184                                    |
|  Total: $1,334                                            |
|                                                           |
|  Condiciones de pago: [50% anticipo, 50% contra entrega] |
|                                                           |
|  Notas: [____________________________________________]   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [✔] Solicitar aprobación (si el usuario no puede aprobar)|
|  [GUARDAR COMO BORRADOR]  [GUARDAR Y ENVIAR]            |
+----------------------------------------------------------+
```

### 4.5 Detalle de Orden de Compra

```
+----------------------------------------------------------+
|  ORDEN DE COMPRA: OC-2026-0042                  [Editar] |
|  Estado: ● Pendiente aprobación                           |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Proyecto: Implementación Firewall                        |
|  Proveedor: Distribuidor Mayorista SA                     |
|  Fecha emisión: 10/06/2026                                 |
|  Entrega estimada: 17/06/2026                              |
|                                                           |
|  Items:                                                   |
|  • Switch Cisco 2960 (2) x $450 = $900                    |
|  • Fibra óptica (100m) x $2.5 = $250                      |
|  • Conectores (20) x $1 = $20                             |
|  Subtotal: $1,170                                          |
|  Impuestos: $187.20                                        |
|  Total: $1,357.20 USD                                      |
|                                                           |
|  Condiciones: 50% anticipo, 50% contra entrega           |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ACCIONES                                                 |
|  [APROBAR] (solo admin)  [ENVIAR AL PROVEEDOR]  [RECIBIR]|
|  [GENERAR PDF]  [DUPLICAR]  [CANCELAR]                    |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  HISTORIAL                                                |
|  • 10/06 - Creada por Compras                             |
|  • 10/06 - Pendiente aprobación                            |
+----------------------------------------------------------+
```

### 4.6 Registro de Recepción

```
+----------------------------------------------------------+
|  REGISTRAR RECEPCIÓN - OC-2026-0038            [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Fecha recepción*: [12/06/2026_____________________]     |
|                                                           |
|  Items recibidos:                                         |
|  +------------------------------------------------------+ |
|  | Producto          | Cantidad pedida | Cantidad recibida |
|  | Switch Cisco 2960 | 2               | [2] ✔           |
|  | Fibra óptica      | 100m            | [80] ⚠ parcial   |
|  +------------------------------------------------------+ |
|                                                           |
|  Observaciones: [Faltaron 20m de fibra, los enviarán     |
|                  la próxima semana]                       |
|                                                           |
|  Adjuntar documento: [Seleccionar archivo] (acta, foto)  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [✔] Marcar como recibida completamente (si todos los items coinciden)
|  [GUARDAR RECEPCIÓN]                                      |
+----------------------------------------------------------+
```

---

## 5. FLUJOS PRINCIPALES

### 5.1 Solicitud de compra desde proyecto/tarea

1. En un proyecto, un técnico (o compras) crea una tarea de categoría "Compras" (Módulo 4). La tarea puede incluir una descripción de lo que se necesita comprar.
2. Desde esa tarea, el usuario puede hacer clic en "Generar solicitud de compra" (opcional), que precarga una solicitud con los datos de la tarea y el proyecto.
3. El usuario de compras recibe la tarea y, al atenderla, puede crear una orden de compra directamente desde la tarea (botón "Crear OC").
4. Al crear la OC, se vincula a la tarea (para trazabilidad) y se puede marcar la tarea como "En progreso" o "Completada" según corresponda.

### 5.2 Creación de orden de compra

1. Usuario con rol compras va a "Nueva orden de compra".
2. Selecciona proyecto (obligatorio, para imputar costos) y proveedor.
3. Agrega items (puede seleccionar de un catálogo de productos o ingresar manualmente).
4. Sistema calcula totales.
5. Opciones al guardar:
   - **Guardar como borrador:** La OC queda en estado "Borrador", visible solo para compras y admin.
   - **Guardar y solicitar aprobación:** Cambia estado a "Pendiente aprobación". Se notifica al admin (o a quien corresponda).
   - **Guardar y enviar (si tiene permisos de aprobación):** Si el usuario puede aprobar (admin), puede enviarla directamente al proveedor (cambia a "Aprobada" y luego "Enviada" tras el envío).

### 5.3 Aprobación de orden de compra

1. Admin (o aprobador designado) recibe notificación (Slack/email) de OC pendiente.
2. Revisa detalle de la OC.
3. Puede:
   - **Aprobar:** Cambia estado a "Aprobada". Se habilita la opción de enviar al proveedor.
   - **Rechazar:** Vuelve a "Borrador" con comentarios.
   - **Solicitar cambios:** (opcional)

### 5.4 Envío al proveedor

1. Desde la OC aprobada, el usuario (compras) hace clic en "Enviar al proveedor".
2. Se genera un PDF de la orden de compra (con formato) y se envía por email al proveedor (desde la app o n8n). Se guarda el archivo en Drive y se registra la fecha de envío.
3. La OC pasa a estado "Enviada".

### 5.5 Recepción de mercancía

1. Al recibir los productos, el usuario (compras o técnico) va a la OC y hace clic en "Registrar recepción".
2. Completa el formulario con cantidades recibidas (puede ser parcial).
3. Si la recepción es completa, la OC pasa a estado "Recibida completa". Si es parcial, queda en "Recibida parcial" y se puede registrar otra recepción después.
4. Se actualiza la tarea de compras asociada (si existe) a "Completada" (o se crea una subtarea de recepción).

### 5.6 Vinculación con costos del proyecto

- Los montos de las órdenes de compra (una vez recibidas) se suman automáticamente al campo `costo_interno_real` del proyecto (Módulo 3), si está implementado. Esto permite calcular márgenes reales.
- Si no se usa costeo, al menos queda registrado en el JSON de archivado.

### 5.7 Catálogo de productos

- Opcional: se puede mantener un catálogo de productos por proveedor para agilizar la creación de OC.
- Los precios de referencia se actualizan con cada cotización u OC.

### 5.8 Alertas automáticas (vía n8n)

| Alerta | Condición | Destino |
|--------|-----------|---------|
| OC pendiente de aprobación | OC en estado "Pendiente aprobación" > 24h | Slack admin |
| OC próxima a fecha entrega | OC en estado "Enviada" con fecha_entrega_estimada en 2 días | Slack compras |
| OC retrasada | OC en estado "Enviada" con fecha_entrega_estimada pasada | Slack compras |
| Recepción parcial | OC en estado "Recibida parcial" con items pendientes | Slack compras |

---

## 6. REGLAS DE NEGOCIO ESPECÍFICAS (RN-COM-xx)

| ID | Regla |
|----|-------|
| RN-COM-01 | Una orden de compra debe estar asociada a un proyecto activo. |
| RN-COM-02 | Solo los usuarios con rol 'compras' o 'admin' pueden crear y editar órdenes de compra. |
| RN-COM-03 | Las órdenes de compra con total superior a [monto_configurable] requieren aprobación de admin. (Configurable por admin). |
| RN-COM-04 | Una orden de compra no puede ser eliminada una vez aprobada; solo cancelada (estado "Cancelada"). |
| RN-COM-05 | Al registrar una recepción completa, se actualiza el costo del proyecto (si el campo `costo_interno_real` existe). |
| RN-COM-06 | Los items de una orden de compra pueden ser parcialmente recibidos; el sistema debe permitir múltiples recepciones. |
| RN-COM-07 | Una orden de compra en estado "Borrador" puede ser modificada por su creador. En estados posteriores, solo lectura (excepto cancelar). |
| RN-COM-08 | Las órdenes de compra canceladas deben conservarse con el estado "Cancelada" y un motivo. |

---

## 7. VALIDACIONES

| Situación | Validación | Mensaje |
|-----------|------------|---------|
| Crear OC | Proveedor debe existir y ser de tipo proveedor | "El proveedor seleccionado no es válido" |
| Crear OC | Proyecto debe estar activo | "El proyecto no está activo" |
| Aprobar OC | Monto > umbral requiere admin | "Esta OC requiere aprobación de administrador" |
| Recibir | Cantidad recibida ≤ cantidad pedida | "No puedes recibir más de lo pedido" |

---

## 8. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| OC creada | "Orden de compra creada correctamente" |
| OC aprobada | "Orden de compra aprobada" |
| OC enviada | "Orden de compra enviada al proveedor" |
| Recepción registrada | "Recepción registrada correctamente" |
| OC cancelada | "Orden de compra cancelada" |

---

## 9. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **CRM (M2)** | Proveedores son empresas de tipo 'proveedor' o 'ambos'. Se usan datos de contacto. |
| **Proyectos (M3)** | Las OC se asocian a proyectos para imputar costos. El flag `requiere_compras` en proyecto puede alertar. |
| **Tareas (M4)** | Las tareas de compras pueden generar solicitudes/OC. La recepción puede completar la tarea. |
| **Archivos (M6)** | Cotizaciones, OC en PDF, actas de recepción se guardan en Drive. |
| **Autenticación (M1)** | Roles y permisos. |
| **Notificaciones (M9)** | Alertas de aprobación, retrasos, etc. |

---

## 10. OPCIONES DE CONFIGURACIÓN (Para Admin)

- [ ] Monto mínimo para requerir aprobación: [$500] (0 = siempre aprobación)
- [ ] Permitir a compras enviar OC sin aprobación: [ ] Sí / [✔] No (requiere aprobación)
- [ ] Activar catálogo de productos: [✔] Sí
- [ ] Formato de número de OC: [OC-{año}-{número}]

---

## 11. MÉTRICAS (Para dashboard interno)

- Órdenes de compra por mes y estado
- Total gastado en compras por proyecto
- Tiempo promedio desde creación hasta aprobación
- Proveedores más utilizados
- Tiempo promedio de entrega por proveedor

---