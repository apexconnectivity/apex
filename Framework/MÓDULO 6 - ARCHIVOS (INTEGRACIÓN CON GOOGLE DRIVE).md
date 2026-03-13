## MÓDULO 6: ARCHIVOS (INTEGRACIÓN CON GOOGLE DRIVE)
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar todos los archivos asociados a proyectos, tickets, tareas y entidades corporativas (clientes y proveedores) de Apex Connectivity, almacenándolos en Google Drive pero manteniendo referencias y metadatos en la base de datos. Este enfoque híbrido permite:
- **Ahorro de espacio** en Supabase (solo referencias, no archivos)
- **Aprovechar los 15 GB gratuitos** de Google Drive
- **Acceso directo** a los archivos desde cualquier lugar
- **Organización consistente** por cliente, proveedor, proyecto, ticket y tipo
- **Control de permisos** basado en roles (admin, técnico, comercial, compras, facturación, cliente)

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver | Puede subir | Puede eliminar | Puede organizar |
|-------|-----------|-------------|----------------|-----------------|
| **Administrador** | Todos los archivos de todas las entidades | Sí | Sí | Sí (crear carpetas) |
| **Técnico** | Archivos de proyectos donde está asignado (carpetas Internos y Entregables Cliente) y de tickets donde es responsable (carpetas Interno y Cliente) | Sí (en esos contextos) | Sí (propios) | No |
| **Comercial** | Archivos de proyectos en fases 1-3 (carpetas Internos y Entregables Cliente) y documentos corporativos (públicos e internos) de los clientes que gestiona | Sí (en esos contextos) | Sí (propios) | No |
| **Compras** | Archivos de proveedores (carpeta Corporativo/Interno y Compras) y archivos de proyectos con flag `requiere_compras` (carpeta Compras del proyecto) | Sí (en esos contextos) | Sí (propios) | No |
| **Facturación** | Archivos de carpeta Facturas de proyectos y documentos corporativos de facturación de clientes/proveedores | Sí (en esos contextos) | Sí (propios) | No |
| **Marketing** | Ningún archivo (salvo que se requiera para campañas, pero se maneja vía CRM) | No | No | No |
| **Cliente** | Archivos de su propia empresa en carpetas "Entregables Cliente" de sus proyectos y "Cliente" de sus tickets, más documentos corporativos marcados como "Público" | Sí (en tareas y tickets propios) | No | No |

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Entidad: ARCHIVO (Referencia)

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| drive_file_id | string | ID del archivo en Google Drive | Sí |
| nombre_original | string | Nombre del archivo al subirse | Sí |
| nombre_guardado | string | Nombre con el que se guardó (único) | Auto |
| mime_type | string | Tipo de archivo (PDF, imagen, etc.) | Sí |
| tamaño_bytes | integer | | Sí |
| drive_view_link | string | URL para ver el archivo | Sí |
| drive_download_link | string | URL para descargar | Sí |
| drive_embed_link | string | URL para incrustar (vista previa) | No |
| ruta_completa | string | Ruta en Drive (para referencia) | Sí |
| **entidad_tipo** | enum | **proyecto / ticket / tarea / empresa** | Sí |
| **entidad_id** | UUID | ID de la entidad asociada (proyecto, ticket, tarea, empresa) | Sí |
| **visibilidad** | enum | **interno / publico** (solo para documentos de empresa; para otros, se deriva del contexto) | No (default: interno) |
| subido_por | UUID | Usuario que subió | Sí |
| fecha_subida | timestamp | | Auto |
| ultima_descarga | timestamp | | Null |

### 3.2 Entidad: CARPETA_DRIVE (Referencia a estructura)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| drive_folder_id | string | ID de la carpeta en Drive |
| nombre | string | Nombre de la carpeta |
| nivel | enum | Raíz / Cliente / Proveedor / Proyecto / Ticket / Corporativo / etc. |
| empresa_id | UUID | Si es carpeta de cliente o proveedor |
| proyecto_id | UUID | Si es carpeta de proyecto |
| ticket_id | UUID | Si es carpeta de ticket |
| padre_id | UUID | Carpeta padre (para jerarquía) |
| ruta_completa | string | |

---

## 4. ESTRUCTURA DE CARPETAS EN GOOGLE DRIVE (Definitiva)

```
📁 Apex Connectivity (Raíz)
│
├── 📁 Clientes Activos
│   └── 📁 [Nombre Empresa Cliente]
│       ├── 📁 Corporativo
│       │   ├── 📁 Publico          (visible para el cliente en su portal)
│       │   └── 📁 Interno           (solo equipo, según roles)
│       └── 📁 [Nombre Proyecto]
│           ├── 📁 Entregables Cliente (lo que sube el cliente y lo que el equipo comparte con él)
│           ├── 📁 Internos           (solo equipo, según roles)
│           └── 📁 Facturas           (solo facturación y admin)
│
├── 📁 Proveedores
│   └── 📁 [Nombre Proveedor]
│       ├── 📁 Corporativo
│       │   └── 📁 Interno            (solo compras y admin)
│       └── 📁 Compras                (documentos de compras asociados a proyectos, opcional)
│
├── 📁 Tickets
│   └── 📁 [Año]
│       └── 📁 TK-[Número Ticket]
│           ├── 📁 Cliente            (archivos del cliente)
│           └── 📁 Interno             (archivos del equipo)
│
└── 📁 Archivo Histórico
    └── 📁 [Año]
        └── 📁 [Empresa] - [Proyecto]   (o [Proveedor] si se archivan documentos de proveedores)
            ├── exportacion_datos.json
            ├── resumen_ejecutivo.pdf
            └── 📁 archivos
```

**Notas:**
- La carpeta "Clientes Activos" contiene subcarpetas por empresa cliente. Dentro de cada empresa, "Corporativo" almacena documentos globales de la empresa (contratos, NDAs, etc.). La subcarpeta "Publico" es visible para el cliente en su portal; "Interno" solo para el equipo.
- Dentro de cada proyecto, las subcarpetas son estándar.
- "Proveedores" tiene estructura similar, pero sin carpeta "Publico" (los proveedores no tienen portal). La carpeta "Compras" puede albergar documentos relacionados con órdenes de compra de proyectos específicos, o ser una subcarpeta por proyecto dentro de "Compras".
- "Tickets" organiza por año y número de ticket, con subcarpetas para cliente e interno.
- "Archivo Histórico" guarda proyectos archivados, con subcarpeta por año y luego por empresa-proyecto.

---

## 5. PANTALLAS (Wireframes Descriptivos)

### 5.1 Visor de Archivos de Proyecto (con permisos por rol)

```
+----------------------------------------------------------+
|  ARCHIVOS DEL PROYECTO                          [ + SUBIR ]
|  Proyecto: Implementación Firewall - Soluciones Tec      |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Entregables Cliente]                         [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 diagrama_red_actual.pdf      (Cliente · 02/06)   | |
|  |   📎 Tarea: Subir diagrama                           | |
|  |   [Ver en Drive] [Copiar enlace]                     | |
|  +------------------------------------------------------+ |
|  | 📄 requisitos_usuarios.docx      (Cliente · 05/06)   | |
|  |   [Ver en Drive] [Copiar enlace]                     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Internos]                                     [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 informe_diagnostico.pdf       (Carlos · 03/06)    | |
|  |   (Técnico) [Ver en Drive] [Copiar enlace] [Eliminar]| |
|  +------------------------------------------------------+ |
|  | 📄 config_firewall_backup.conf   (Carlos · 08/06)    | |
|  |   (Técnico) [Ver en Drive] [Copiar enlace] [Eliminar]| |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Facturas]                                     [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 factura_2026-05.pdf           (Admin · 31/05)     | |
|  |   (Visible para facturación) [Ver] [Copiar]          | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 5.2 Visor de Documentos Corporativos de Cliente (para comercial/admin)

```
+----------------------------------------------------------+
|  DOCUMENTOS CORPORATIVOS - Soluciones Tecnológicas SA    [+ SUBIR]
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Públicos] (visibles para el cliente)         [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 condiciones_generales.pdf        (Admin · 01/01)  | |
|  |   [Ver en Drive] [Mover a interno] [Eliminar]       | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Internos] (solo equipo)                      [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 contrato_marco_firmado.pdf       (Admin · 01/01)  | |
|  |   [Ver en Drive] [Mover a público] [Eliminar]       | |
|  +------------------------------------------------------+ |
|  | 📄 NDA_firmado.pdf                  (Admin · 01/01)  | |
|  |   [Ver en Drive] [Mover a público] [Eliminar]       | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 5.3 Visor de Archivos de Proveedor (para compras)

```
+----------------------------------------------------------+
|  PROVEEDOR: Distribuidor Mayorista SA           [+ SUBIR]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Corporativo/Interno]                         [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 contrato_proveedor.pdf            (Compras · 10/01)|
|  |   [Ver en Drive] [Eliminar]                           |
|  +------------------------------------------------------+ |
|  | 📄 catalogo_equipos.pdf               (Compras · 15/01)|
|  |   [Ver en Drive] [Eliminar]                           |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [📁 Compras] (asociados a proyectos)            [▼]    |
|  +------------------------------------------------------+ |
|  | 📄 orden_compra_2026-05.pdf (Proy. Firewall)         | |
|  |   [Ver en Drive] [Ir al proyecto]                     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 5.4 Subir Archivo (Modal) - con selección de destino y visibilidad

```
+----------------------------------------------------------+
|  SUBIR ARCHIVO                                  [Subir]  |
|                                            [Cancelar]     |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Destino:                                                 |
|  (●) Proyecto: Implementación Firewall                   |
|      Subcarpeta: [Entregables Cliente ▼]                 |
|  ( ) Ticket: TK-2026-023                                  |
|      Subcarpeta: [Cliente ▼]                              |
|  ( ) Tarea: Configurar firewall                           |
|  ( ) Documentos de empresa: [Soluciones Tecnológicas ▼]  |
|      Visibilidad: [Público (cliente) ▼] / Interno        |
|  ( ) Documentos de proveedor: [Distribuidor Mayorista ▼] |
|      (siempre internos)                                   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Archivo: [Seleccionar archivo] diagramo_nuevo.pdf       |
|  Tamaño: 2.4 MB                                           |
|  Tipo: PDF                                                |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Opciones:                                                |
|  [✔] Notificar al cliente (si aplica)                    |
|  [✔] Asociar a tarea: [Subir diagrama____________]       |
+----------------------------------------------------------+
```

---

## 6. FLUJOS PRINCIPALES

### 6.1 Subir archivo a proyecto (interno)

1. Usuario con permisos (técnico, comercial, etc.) va a proyecto > sección Archivos > "+ SUBIR"
2. Selecciona destino (carpeta dentro del proyecto: Entregables Cliente, Internos, Facturas según su rol).
3. Selecciona archivo local.
4. Opciones: asociar a tarea, notificar al cliente (si aplica y tiene permiso).
5. Sistema:
   - Genera nombre único.
   - Sube a Google Drive a la ruta correspondiente (ej. `/Clientes Activos/[Empresa]/[Proyecto]/Entregables Cliente/`).
   - Guarda referencia en BD con `entidad_tipo = 'proyecto'`, `entidad_id = proyecto.id`.
   - Si se asoció a tarea, vincula el archivo (mediante tabla `archivo_tarea`).
   - Si notificar, envía notificación al cliente (si archivo en Entregables Cliente) o al equipo (si en Internos).
6. Confirmación.

### 6.2 Cliente sube archivo (desde tarea o ticket)

1. Cliente ve tarea que requiere archivo (o ticket donde quiere adjuntar).
2. Hace clic en "SUBIR ARCHIVO".
3. Selecciona archivo (no elige carpeta, va automática a la correcta).
4. Sistema:
   - Valida tamaño y tipo.
   - Sube a Drive: si es tarea, a `/Clientes Activos/[Empresa]/[Proyecto]/Entregables Cliente/`; si es ticket, a `/Tickets/[Año]/TK-[Número]/Cliente/`.
   - Guarda referencia con `entidad_tipo = 'tarea'` o `'ticket'`, y `entidad_id` correspondiente.
   - Si es tarea, marca tarea como completada (si era requerido) y notifica al equipo.
5. Cliente ve archivo en su portal.

### 6.3 Subir documento corporativo (interno)

1. Usuario con permisos (comercial, compras, admin) va a ficha de empresa (cliente o proveedor) > sección "Documentos".
2. Hace clic en "+ SUBIR".
3. Selecciona archivo, descripción, y visibilidad (Público/Interno). Para proveedores, solo Interno.
4. Sistema:
   - Sube a `/Clientes Activos/[Empresa]/Corporativo/[Publico|Interno]/` o `/Proveedores/[Proveedor]/Corporativo/Interno/`.
   - Guarda referencia con `entidad_tipo = 'empresa'`, `entidad_id = empresa.id`, y `visibilidad` según corresponda.
5. Si es público, el cliente podrá verlo en su portal.

### 6.4 Ver archivo

1. Usuario hace clic en "[Ver en Drive]" o en el nombre del archivo.
2. Sistema abre el `drive_view_link` en nueva pestaña.
3. Registra estadística de visualización (opcional).

### 6.5 Eliminar archivo

1. Usuario con permisos hace clic en "[Eliminar]".
2. Modal de confirmación. Si el archivo está referenciado en múltiples entidades (ej. mismo archivo en proyecto y ticket), se debe verificar. Por ahora, asumimos que un archivo pertenece a una sola entidad (aunque puede estar vinculado a una tarea y a un proyecto, pero la referencia es única). Si se necesita múltiple, se maneja con duplicados o con una tabla de relaciones. Por simplicidad, mantenemos una sola entidad por archivo. Si se requiere asociar a varios, se puede copiar el archivo (otro registro).
3. Si confirma:
   - Elimina de Google Drive (o solo referencia, configurable).
   - Elimina referencia de BD.
   - Actualiza vistas.

### 6.6 Mover archivo entre visibilidad (solo admin)

- Desde documentos corporativos, admin puede cambiar un archivo de "Público" a "Interno" y viceversa. Esto implica mover el archivo físicamente en Drive de una carpeta a otra y actualizar `visibilidad` y `ruta_completa`.

---

## 7. REGLAS DE NEGOCIO ESPECÍFICAS (RN-FILE-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-FILE-01 | Los archivos NUNCA se guardan en la base de datos, solo referencias a Google Drive. |
| RN-FILE-02 | Cada archivo debe pertenecer a UNA entidad (proyecto, ticket, tarea o empresa). |
| RN-FILE-03 | Un archivo puede estar asociado a una tarea adicionalmente mediante la tabla `archivo_tarea` (relación many-to-many). |
| RN-FILE-04 | El cliente SOLO puede ver archivos en carpetas "Entregables Cliente" (de sus proyectos), "Cliente" (de sus tickets) y "Corporativo/Publico" de su empresa. |
| RN-FILE-05 | Los archivos en carpetas "Internos" de proyectos, "Interno" de tickets y "Corporativo/Interno" de empresas son invisibles para el cliente. |
| RN-FILE-06 | Tamaño máximo por archivo: 25 MB (configurable). |
| RN-FILE-07 | Tipos de archivo permitidos: PDF, DOCX, XLSX, JPG, PNG, TXT, CONF, LOG (configurable). |
| RN-FILE-08 | Al archivar un proyecto, los archivos se copian a la carpeta de Archivo Histórico (no se eliminan de su ubicación original hasta que se confirme la limpieza). |
| RN-FILE-09 | Al eliminar un ticket, los archivos asociados se eliminan permanentemente (son específicos). |
| RN-FILE-10 | Los archivos subidos por cliente en tareas/tickets no requieren aprobación (son visibles inmediatamente para el equipo). |
| **RN-FILE-11** | **Los roles determinan qué carpetas pueden ver y en cuáles pueden subir archivos (ver sección 2).** |
| **RN-FILE-12** | **Los documentos corporativos de clientes marcados como "Público" son visibles para todos los contactos de esa empresa en su portal.** |
| **RN-FILE-13** | **Los documentos de proveedores son siempre internos y solo accesibles para roles con permiso (admin, compras).** |
| **RN-FILE-14** | **Al subir un archivo a un proyecto, si se marca "Notificar al cliente", el archivo debe colocarse en "Entregables Cliente" (o en "Cliente" de ticket).** |
| **RN-FILE-15** | **No se puede eliminar un archivo si está asociado a una entidad activa (proyecto activo, ticket abierto) a menos que se tenga permiso especial (admin).** |

---

## 8. VALIDACIONES

| Situación | Validación | Mensaje |
|-----------|------------|---------|
| Subir archivo | Tamaño ≤ 25 MB | "El archivo excede el tamaño máximo permitido" |
| Subir archivo | Tipo permitido | "Tipo de archivo no permitido" |
| Subir archivo | Destino válido según permisos | "No tienes permiso para subir archivos en esta ubicación" |
| Eliminar archivo | Tiene permisos | "No tienes permisos para eliminar este archivo" |
| Mover a público/interno | Solo admin | "Solo el administrador puede cambiar la visibilidad" |

---

## 9. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Archivo subido | "Archivo subido correctamente" |
| Archivo eliminado | "Archivo eliminado" |
| Archivo no encontrado | "El archivo no existe o fue eliminado" |
| Cliente sube archivo | (Notificación interna) "El cliente subió [archivo] a [tarea/ticket]" |
| Espacio en Drive próximo a llenarse | "Queda poco espacio en Drive (menos de 1 GB)" |

---

## 10. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **Proyectos (M3)** | Los archivos se asocian a proyectos (carpetas Entregables Cliente, Internos, Facturas). |
| **Tickets (M5)** | Los archivos se asocian a tickets (carpetas Cliente, Interno). |
| **Tareas (M4)** | Los archivos se asocian a tareas (mediante tabla `archivo_tarea`). |
| **CRM (M2)** | Los documentos corporativos se asocian a empresas (clientes y proveedores). |
| **Portal Cliente (M7)** | El cliente ve sus archivos (Entregables Cliente, Ticket/Cliente, Corporativo/Público) y puede subirlos. |
| **Autenticación (M1)** | Los roles determinan permisos. |
| **Notificaciones (M9)** | Alertas de subida, espacio, etc. vía n8n. |

---

## 11. OPCIONES DE CONFIGURACIÓN (Para Admin)

### Configuración General de Archivos
- [ ] Tamaño máximo por archivo: [25] MB
- [ ] Tipos permitidos: [PDF, DOCX, JPG, PNG, TXT, CONF, LOG] (lista editable)
- [ ] Notificar cuando espacio en Drive < [1] GB

### Organización
- [ ] Crear carpetas automáticamente:
  - Al crear empresa (cliente): crear carpetas Corporativo/Publico e Interno.
  - Al crear proveedor: crear carpeta Corporativo/Interno.
  - Al crear proyecto: crear subcarpetas Entregables Cliente, Internos, Facturas.
  - Al crear ticket: crear subcarpetas Cliente e Interno bajo /Tickets/[Año]/TK-.../
- [ ] Mover archivos al archivar: copiar (dejar original) o mover (eliminar original). Recomendado: copiar.

---

## 12. MÉTRICAS (Para dashboard interno)

- Espacio total usado en Drive
- Espacio por cliente/proveedor/proyecto
- Tipos de archivo más comunes
- Usuarios que más archivos suben (por rol)
- Archivos subidos por clientes vs internos

---
**Fin de especificación - Módulo 6: Archivos (Integración con Google Drive) - Versión Definitiva**