## MÓDULO 10: ARCHIVADO DE PROYECTOS 
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar el ciclo de vida final de los proyectos, moviendo la información de proyectos cerrados desde la base de datos operativa (Supabase) a un almacenamiento de bajo costo en Google Drive, manteniendo solo referencias mínimas. Este proceso, ejecutable únicamente por el administrador, permite:
- **Mantener la base de datos ligera** y dentro del free tier de Supabase.
- **Conservar el histórico completo** para futuras referencias o re-activaciones.
- **Liberar espacio** sin perder información.
- **Clasificar automáticamente** los proyectos como "Completados" (cerrados desde fase 5 con todas las tareas de cierre completadas) o "Inconclusos" (cualquier otro caso), con posibilidad de ajuste manual por el admin.
- **Tener un backup natural** en la nube.

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver archivados | Puede restaurar | Puede eliminar definitivamente |
|-------|----------------------|-----------------|-------------------------------|
| **Administrador** | Sí (vía gestor de archivados) | Sí | Sí (con confirmación) |
| **Técnico** | No (solo si se restaura) | No | No |
| **Comercial** | No | No | No |
| **Compras** | No | No | No |
| **Facturación** | No | No | No |
| **Cliente** | No (desaparece de su portal) | No | No |

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Entidad: PROYECTO_ARCHIVADO (Registro mínimo en BD)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Mismo ID del proyecto original |
| empresa_id | UUID | Cliente (para búsqueda) |
| nombre | string | Nombre del proyecto |
| **clasificacion** | enum | **completado / inconcluso** |
| fecha_cierre | timestamp | Cuándo se cerró el proyecto (original) |
| fecha_archivado | timestamp | Cuándo se archivó |
| motivo_cierre | text | Motivo registrado al cerrar |
| drive_carpeta_id | string | ID de la carpeta en Drive |
| drive_carpeta_link | string | Link a la carpeta |
| tamaño_archivo_mb | integer | Tamaño total de la carpeta |
| archivo_json_link | string | Link al JSON con todos los datos |
| archivo_pdf_link | string | Link al resumen PDF (opcional) |
| archivado_por | UUID | Usuario que archivó (admin) |
| proyecto_original_id | UUID | Para trazabilidad |

### 3.2 Archivos generados en Drive

```
📁 Archivo Histórico
├── 📁 Completados
│   └── 📁 [Año]
│       └── 📁 [Empresa] - [Nombre Proyecto]
│           ├── 📄 exportacion_datos.json
│           ├── 📄 resumen_ejecutivo.pdf (opcional)
│           └── 📁 archivos
│               ├── (copia de todos los archivos del proyecto)
│               └── (estructura original: Entregables Cliente, Internos, Facturas)
│
└── 📁 Inconclusos
    └── 📁 [Año]
        └── 📁 [Empresa] - [Nombre Proyecto]
            ├── 📄 exportacion_datos.json
            ├── 📄 resumen_ejecutivo.pdf (opcional)
            └── 📁 archivos
                └── ...
```

**Nota:** Los documentos corporativos de la empresa (carpeta "Corporativo") NO se archivan con el proyecto, ya que son independientes y permanecen en la carpeta de la empresa.

### 3.3 Contenido del archivo JSON

El JSON debe incluir toda la información del proyecto, tal como se definió en el Módulo 3 y Módulo 10 original, pero actualizado con los nuevos campos (categorías, fechas clave, etc.). Además, debe incluir:

- `clasificacion` (completado/inconcluso)
- `motivo_cierre`
- `fecha_cierre`
- Datos de la empresa (nombre, RFC, etc.)
- Lista de tareas (con categorías, asignaciones, fechas)
- Lista de tickets asociados (si se incluyen, configurable)
- Lista de reuniones
- Lista de archivos (con enlaces)

---

## 4. PANTALLAS (Wireframes Descriptivos)

### 4.1 Configuración de Archivado (Admin)

```
+----------------------------------------------------------+
|  CONFIGURACIÓN DE ARCHIVADO                      [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ARCHIVADO AUTOMÁTICO                                     |
|  [✔] Activar archivado automático                         |
|                                                           |
|  Cuándo archivar:                                         |
|  ( ) Al marcar proyecto como "Cerrado"                    |
|  (●) Después de [30] días en estado "Cerrado"            |
|  ( ) Manualmente solo                                     |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  QUÉ ARCHIVAR                                             |
|  [✔] Todos los datos del proyecto (JSON)                 |
|  [✔] Todos los archivos (copia en Drive)                 |
|  [✔] Generar resumen PDF automático                       |
|  [ ] Incluir tickets de soporte asociados                 |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  QUÉ ELIMINAR DE LA BD OPERATIVA                          |
|  [✔] Tareas (libera espacio)                              |
|  [✔] Archivos (solo referencias, ya están en Drive)      |
|  [✔] Reuniones                                            |
|  [ ] Tickets (dejar referencia mínima)                    |
|  [✔] Dejar registro mínimo del proyecto (en proyectos_archivados) |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  UBICACIÓN EN DRIVE                                       |
|  Carpeta raíz de archivo: /Archivo Histórico             |
|  Subcarpetas: Completados / Inconclusos                   |
+----------------------------------------------------------+
```

### 4.2 Gestor de Proyectos Archivados (solo admin)

```
+----------------------------------------------------------+
|  PROYECTOS ARCHIVADOS                           [Buscar] |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  FILTROS: [Todos] [Completados] [Inconclusos] [Por cliente] [Por año]
+----------------------------------------------------------+

+----------------------------------------------------------+
|  COMPLETADOS (5)                                          |
|  +------------------------------------------------------+ |
|  | Soluciones Tecnológicas SA - Implementación Firewall | |
|  | Archivado: 15/07/2026 · Tamaño: 45 MB                | |
|  | [Ver en Drive] [Restaurar] [Eliminar definitivo]     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  INCONCLUSOS (3)                                          |
|  +------------------------------------------------------+ |
|  | Hospital Regional - Migración Servidores             | |
|  | Archivado: 10/06/2026 · Tamaño: 120 MB               | |
|  | Motivo cierre: Cancelado por cliente                  | |
|  | [Ver en Drive] [Restaurar] [Eliminar definitivo]     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 4.3 Detalle de Proyecto Archivado (vista previa)

```
+----------------------------------------------------------+
|  PROYECTO ARCHIVADO: Implementación Firewall    [Volver] |
|  Cliente: Soluciones Tecnológicas SA                     |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Clasificación: COMPLETADO                                |
|  Fecha de cierre: 15/06/2026                              |
|  Fecha de archivado: 15/07/2026                           |
|  Archivado por: Admin                                     |
|  Motivo cierre: Proyecto completado                       |
|  Ubicación en Drive: [Ver carpeta]                        |
|                                                           |
|  Resumen:                                                 |
|  • Duración: 157 días (10/01/2026 - 15/06/2026)          |
|  • Tareas completadas: 24/24                              |
|  • Tickets durante el proyecto: 3                         |
|  • Reuniones: 5                                           |
|  • Archivos totales: 15 (45 MB)                           |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ARCHIVOS GENERADOS                                       |
|  • exportacion_datos.json (completo) [Descargar]         |
|  • resumen_ejecutivo.pdf [Ver]                            |
|  • [Ver carpeta completa en Drive]                        |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ACCIONES                                                 |
|  [RESTAURAR PROYECTO]  [ELIMINAR DEFINITIVAMENTE]        |
+----------------------------------------------------------+
```

---

## 5. FLUJOS PRINCIPALES

### 5.1 Archivado automático (desde proyecto cerrado)

**Disparador:** Según configuración:
- Inmediato al cerrar el proyecto.
- O después de N días en estado "Cerrado" (cron en n8n que verifica proyectos con estado 'cerrado' y fecha_cierre + N días <= hoy).

**Proceso:**

1. **Clasificación automática:**
   - El sistema evalúa: si el proyecto se cerró desde fase 5 **y** todas las tareas de la fase 5 estaban completadas al momento del cierre, se clasifica como "completado". En caso contrario, "inconcluso".
   - Esta clasificación se guardará en el JSON y en el registro de `proyectos_archivados`, pero el admin podrá cambiarla manualmente en el modal de confirmación.

2. **Modal de confirmación (si es automático, podría omitirse o enviarse notificación; lo ideal es que el admin pueda revisar antes de archivar, a menos que sea automático sin intervención. Por seguridad, podemos hacer que el archivado automático genere una notificación y espere confirmación, o que se ejecute directamente con la clasificación automática. En tu configuración, elegiste "después de 30 días", lo que implica que el admin podría revisar antes. Para no saturar, el sistema puede enviar un recordatorio al admin: "Hay proyectos cerrados hace más de 30 días listos para archivar". Luego el admin revisa y archiva manualmente. Eso es más controlado. Por tanto, el archivado será manual siempre, pero con sugerencia del sistema. Ajustamos: el cron de n8n detecta proyectos cerrados con fecha_cierre > 30 días y envía un Slack al admin: "Los siguientes proyectos están listos para archivar: [lista]". El admin luego va al gestor de cerrados y los archiva manualmente.

3. **Archivado manual (desde proyecto cerrado):**
   - Admin va a la lista de proyectos cerrados, selecciona un proyecto, hace clic en "Archivar".
   - Aparece modal con clasificación automática (editable) y opciones.
   - Admin confirma.
   - Sistema ejecuta:
     - Genera JSON con todos los datos.
     - Copia todos los archivos del proyecto (desde sus carpetas en Drive) a la nueva carpeta de archivo, respetando la clasificación (Completados/Inconclusos). Se copian, no se mueven, para no afectar referencias (aunque el proyecto se eliminará de la BD, los archivos originales podrían ser referenciados en otros lugares si se compartieron? En teoría no, porque pertenecían al proyecto. Pero por si acaso, se copian).
     - Elimina de la BD operativa: tareas, reuniones, archivos (referencias), y el proyecto mismo (de la tabla `proyectos`). Los tickets pueden mantenerse si se configuró así.
     - Inserta registro en `proyectos_archivados`.
     - Notifica al admin: "Proyecto [nombre] archivado correctamente."

### 5.2 Archivado directo desde activo (sin pasar por cerrado)

- No está permitido. Debe pasar por cerrado.

### 5.3 Restauración de proyecto

1. Admin va a Gestor de Proyectos Archivados.
2. Busca proyecto, hace clic en "[Restaurar]".
3. Modal de confirmación:
   ```
   ¿Restaurar proyecto?

   Se creará una copia del proyecto en estado "Activo" en la fase [fase] que tenía al archivarse.
   Todos los datos (tareas, archivos, reuniones) se recrearán en la BD operativa.

   El proyecto archivado original NO se eliminará.

   [RESTAURAR] [Cancelar]
   ```
4. Si confirma:
   - Lee archivo JSON desde Drive.
   - Recrea en BD:
     - Proyecto con estado "Activo", fase = fase_archivada, y todos los datos (fechas, montos, etc.). Se genera un nuevo ID o se conserva el original? Para evitar conflictos, se genera un nuevo UUID, pero se guarda referencia al ID original en el JSON.
     - Tareas (con sus categorías, asignaciones, estados, fechas). Las tareas completadas vuelven como completadas; las pendientes, pendientes.
     - Reuniones.
     - Archivos: se crean nuevas referencias a los archivos en la carpeta de archivo (no se mueven, se reutilizan). Opcionalmente se podrían copiar a la carpeta del proyecto activo, pero eso duplicaría espacio. Mejor reutilizar las referencias existentes, ya que los archivos están en una ubicación fija en el archivo. Sin embargo, cuando se restaure, el proyecto estará en "Clientes Activos", pero los archivos estarán en "Archivo Histórico". Para que sean accesibles, se pueden dejar allí y el sistema apunta a esa ubicación. O se pueden copiar a la carpeta del proyecto activo. Lo más limpio es copiarlos a la carpeta del proyecto activo (para mantener la estructura). Como es una restauración, es aceptable copiar. Decidamos: al restaurar, se copian los archivos de la carpeta de archivo a la nueva carpeta del proyecto en "Clientes Activos". Esto asegura que el proyecto restaurado sea completamente independiente.
   - Mensaje: "Proyecto restaurado correctamente. Puedes verlo en Proyectos Activos."
   - Registro en historial.

### 5.4 Eliminación definitiva

1. Admin hace clic en "[Eliminar definitivo]".
2. Modal de ADVERTENCIA (doble confirmación):
   ```
   ⚠️ ELIMINACIÓN DEFINITIVA

   Esto eliminará PERMANENTEMENTE:
   - La carpeta completa en Drive
   - El registro en proyectos_archivados

   Esta acción NO SE PUEDE DESHACER.

   Escribe "ELIMINAR" para confirmar: [__________]

   [ELIMINAR DEFINITIVAMENTE] [Cancelar]
   ```
3. Si confirma:
   - Elimina carpeta de Drive.
   - Elimina registro de BD.
   - Log: "Proyecto [nombre] eliminado definitivamente por [usuario]".

---

## 6. REGLAS DE NEGOCIO ESPECÍFICAS (RN-ARCH-xx)

| ID | Regla |
|----|-------|
| RN-ARCH-01 | Solo se pueden archivar proyectos en estado "Cerrado". |
| RN-ARCH-02 | El archivado NO elimina la empresa ni los contactos de la BD. |
| RN-ARCH-03 | Los archivos en Drive se COPIAN a la carpeta de archivo, no se mueven (para no romper referencias en el proyecto original mientras está cerrado). |
| RN-ARCH-04 | Un proyecto archivado NO es visible para el cliente ni para técnicos (solo admin). |
| RN-ARCH-05 | La restauración crea una COPIA, no reemplaza el archivo original. |
| RN-ARCH-06 | Si un proyecto se restaura y luego se cierra de nuevo, se archiva NUEVAMENTE (nueva carpeta, con fecha actual, nueva clasificación). |
| RN-ARCH-07 | El JSON de archivado debe ser válido y autocontenido (puede importarse a otro sistema si es necesario). |
| RN-ARCH-08 | El proceso de archivado se registra en logs de auditoría. |
| **RN-ARCH-09** | **La clasificación del proyecto (completado/inconcluso) se determina automáticamente según si fue cerrado desde fase 5 con todas las tareas de fase 5 completadas. El admin puede cambiarla manualmente en el momento de archivar.** |
| **RN-ARCH-10** | **Los documentos corporativos de la empresa NO se archivan con el proyecto, ya que son independientes.** |
| **RN-ARCH-11** | **El archivado automático no es inmediato; se envía una notificación al admin con los proyectos listos para archivar después del período configurado (ej. 30 días). El admin debe iniciar el archivado manualmente.** |

---

## 7. VALIDACIONES

| Situación | Validación | Mensaje |
|-----------|------------|---------|
| Archivar proyecto | Estado debe ser "Cerrado" | "Solo se pueden archivar proyectos cerrados" |
| Restaurar | Proyecto debe existir en archivados | "El proyecto no existe en el archivo" |
| Eliminar definitivo | Confirmación escrita | "Debes escribir ELIMINAR para confirmar" |
| Espacio en Drive | Verificar espacio disponible antes de copiar | "Espacio insuficiente en Drive para archivar" |

---

## 8. MENSAJES PARA EL USUARIO (ADMIN)

| Situación | Mensaje |
|-----------|---------|
| Archivado iniciado | "Archivando proyecto en segundo plano. Recibirás una notificación al finalizar." |
| Archivado completado | "Proyecto [nombre] archivado correctamente (clasificación: [completado/inconcluso]). Ver en Gestor de Archivados." |
| Archivado fallido | "Error al archivar proyecto. Revisa logs o espacio en Drive." |
| Proyecto restaurado | "Proyecto restaurado correctamente. Ver en Proyectos Activos." |
| Eliminación definitiva | "Proyecto eliminado permanentemente." |
| Notificación de proyectos listos para archivar | "Hay [N] proyectos cerrados hace más de [30] días listos para archivar. Revísalos en Proyectos > Cerrados." |

---

## 9. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **Proyectos (M3)** | Los proyectos cerrados son candidatos a archivar. Se usa la información de fase y tareas para clasificar. |
| **Archivos (M6)** | Se copian todos los archivos del proyecto a la carpeta de archivo. |
| **Tareas (M4)** | Se eliminan de BD operativa (según configuración). |
| **Soporte (M5)** | Los tickets pueden incluirse o no en el archivado (configurable). |
| **CRM (M2)** | Los datos de empresa se incluyen en el JSON. |
| **Notificaciones (M9)** | Notificaciones de inicio/fin de archivado, y alerta de proyectos listos para archivar. |

---

## 10. OPCIONES DE CONFIGURACIÓN (Para Admin)

### Configuración General de Archivado
- [ ] Archivado automático: [✔] Sí (con período de espera)
- [ ] Días en cerrado antes de notificar para archivar: [30] días
- [ ] Incluir tickets en archivado: [ ] No / [✔] Sí
- [ ] Generar PDF resumen: [✔] Sí

### Limpieza de BD
- [ ] Eliminar tareas: [✔] Sí
- [ ] Eliminar reuniones: [✔] Sí
- [ ] Eliminar referencias a archivos: [✔] Sí
- [ ] Eliminar tickets: [ ] No (dejar referencia mínima)

---

## 11. MÉTRICAS (Para dashboard interno)

- Proyectos archivados por mes/año y clasificación
- Espacio total ocupado en archivo (Drive)
- Tamaño promedio por proyecto
- Clientes con más proyectos archivados
- Tiempo promedio desde cierre hasta archivado

---