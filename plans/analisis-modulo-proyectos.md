# Análisis Exhaustivo del Módulo de Proyectos

## 1. Visión General del Módulo

El **Módulo de Proyectos** es uno de los módulos centrales del CRM NetOps, diseñado para gestionar el ciclo de vida completo de los proyectos de Apex Connectivity. El módulo implementa un **pipeline de 5 fases** que permite visualizar y gestionar el progreso de cada proyecto desde la prospección inicial hasta el cierre y posterior archivado.

### Características Principales

| Característica | Descripción |
|----------------|-------------|
| **Pipeline Visual** | Vista Kanban con 5 columnas que representan las fases del proyecto |
| **Gestión de Estados** | Control de proyectos activos, cerrados y archivados |
| **Integración con Tareas** | Generación automática de tareas al cambiar de fase |
| **Control de Permisos** | Sistema basado en roles con restricciones específicas |
| **Historial de Cambios** | Registro completo de todas las acciones realizadas |

---

## 2. Arquitectura del Módulo

### 2.1 Estructura de Archivos

```
netops-crm/
├── src/
│   ├── app/(dashboard)/dashboard/proyectos/
│   │   └── page.tsx                    # Página principal del módulo
│   ├── components/
│   │   ├── module/
│   │   │   ├── CreateProjectModal.tsx   # Modal de creación/edición
│   │   │   ├── ProjectDetailPanel.tsx  # Panel lateral de detalles
│   │   │   ├── ProyectoArchivadoCard.tsx
│   │   │   └── ProyectoCerradoCard.tsx
│   │   └── pipeline.tsx                # Componente de visualización pipeline
│   ├── types/
│   │   └── proyectos.ts                # Definiciones TypeScript
│   ├── constants/
│   │   └── proyectos.ts                # Constantes y etiquetas
│   ├── hooks/
│   │   ├── useProyectos.ts             # Gestión de proyectos
│   │   └── useHistorialProyectos.ts    # Gestión de historial
│   └── lib/
│       └── colors.ts                   # Sistema de colores
```

### 2.2 Componentes Principales

#### `proyectos/page.tsx`

Página principal que implementa:

- **Pipeline de 5 fases** con vista Kanban horizontal
- **Sistema de tabs**: Pipeline | Cerrados
- **Barra de búsqueda** para filtrar proyectos
- **Stats por fase** usando `MiniStat`
- **Gestión de modales**: Crear, Cerrar, Archivar proyectos
- **Panel lateral de detalles**: `ProjectDetailPanel`

#### `CreateProjectModal.tsx`

Modal reutilizable para crear y editar proyectos con:

- **Sub-modales integrados**: Crear empresa y usuario inline
- **Validación de campos**: Nombre, cliente, responsable, contacto técnico
- **Gestión de campos**: Monto, probabilidad, fecha estimada, requiere compras
- **Estados de carga** con feedback visual

> **⚠️ MEJORA IDENTIFICADA**: El campo "Contacto Técnico del Cliente" actualmente **NO** tiene un botón para agregar nuevos contactos inline, a diferencia de los campos "Cliente" y "Responsable" que sí tienen `InlineAddButton`. Esto genera una inconsistencia en la experiencia de usuario ya que el usuario debe salir del modal para crear un nuevo contacto técnico.

#### `ProjectDetailPanel.tsx`

Panel lateral que muestra:

- **Progreso del proyecto** (probabilidad de cierre)
- **Información de fase y estado**
- **Tareas de la fase actual**
- **Acciones**: Cerrar proyecto, Archivar

#### `pipeline.tsx`

Componente de visualización alternativo con:

- **Vista Kanban** con cards de proyecto
- **Filtros por rol**: Todas las fases, Comercial (1-3), Técnico (4-5)
- **Estadísticas por fase**: Conteo, valor total, probabilidad promedio
- **Skeleton loaders** para estados de carga

---

## 3. Estructura de Datos

### 3.1 Interfaces TypeScript

#### `Proyecto`

```typescript
interface Proyecto {
  id: string                           // UUID único
  empresa_id: string                  // FK a empresa
  nombre: string                      // Nombre identificativo
  descripcion?: string                // Detalle del alcance
  fase_actual: FaseProyecto           // 1-5
  estado: EstadoProyecto              // 'activo' | 'cerrado'
  fecha_inicio?: string               // Fecha de inicio
  fecha_estimada_fin?: string         // Fecha estimada de fin
  fecha_real_fin?: string             // Fecha real de fin
  fecha_cierre?: string               // Fecha cuando se cerró
  motivo_cierre?: string              // Motivo del cierre
  moneda: Moneda                      // USD | MXN | EUR
  monto_estimado?: number             // Presupuesto estimado
  monto_real?: number                 // Costo real
  probabilidad_cierre: number         // 0-100%
  responsable_id: string              // Técnico principal
  responsable_nombre?: string
  equipo?: string[]                  // Técnicos secundarios
  contacto_tecnico_id: string         // Contacto técnico del cliente
  contacto_tecnico_nombre?: string
  tags?: string[]                    // Etiquetas personalizadas
  requiere_compras: boolean          // Necesita gestión de compras
  creado_en: string                  // Timestamp de creación
  creado_por?: string
  cliente_nombre?: string
}
```

#### `Fase`

```typescript
interface Fase {
  id: FaseProyecto          // 1 | 2 | 3 | 4 | 5
  nombre: string           // Nombre de la fase
  color: string           // Color hex para visualización
  probabilidad_default: number  // Probabilidad por defecto
}
```

#### `HistorialProyecto`

```typescript
interface HistorialProyecto {
  id: string
  proyecto_id: string
  tipo_evento: TipoEventoHistorial  // 'creacion' | 'cambio_fase' | 'cierre' | ...
  descripcion: string
  fecha: string
  usuario_id?: string
  usuario_nombre?: string
  datos_anteriores?: Record<string, unknown>
  datos_nuevos?: Record<string, unknown>
}
```

### 3.2 Constantes de Fases

| Fase | Nombre | Color | Probabilidad Default |
|------|--------|-------|----------------------|
| 1 | Prospecto | `#6b7280` (gris) | 20% |
| 2 | Diagnóstico | `#3b82f6` (azul) | 40% |
| 3 | Propuesta | `#eab308` (amarillo) | 70% |
| 4 | Implementación | `#10b981` (verde) | 90% |
| 5 | Cierre y Entrega | `#8b5cf6` (púrpura) | 100% |

### 3.3 Plantillas de Tareas por Fase

El sistema incluye **19 plantillas de tareas** automáticas que se generan al entrar en cada fase:

| Fase | Plantillas |
|------|------------|
| **Prospecto** | Llamada inicial, Enviar presentación, Calificar interés |
| **Diagnóstico** | Coordinar visita, Auditoría in-situ, Solicitar diagramas, Redactar informe |
| **Propuesta** | Elaborar propuesta, Enviar a cliente, Negociar ajustes, Obtener firma |
| **Implementación** | Configurar equipos, Migrar servicios, Pruebas internas, Documentar cambios |
| **Cierre** | Capacitar usuario, Entregar documentación, Facturar, Activar soporte |

---

## 4. Roles y Permisos

### 4.1 Matriz de Permisos

| Rol | Ver | Crear | Editar | Mover Fases | Cerrar | Reabrir | Archivar |
|-----|-----|-------|--------|-------------|--------|----------|----------|
| **Administrador** | ✅ Todos | ✅ | ✅ (con restricciones) | ✅ | ✅ | ✅ | ✅ |
| **Comercial** | ✅ Fases 1-3 | ✅ | ✅ (datos comerciales) | ✅ Fases 1-3 | ❌ | ❌ | ❌ |
| **Técnico** | ✅ Fases 4-5 | ❌ | ✅ (tareas, notas) | ✅ Fases 4-5 | ❌ | ❌ | ❌ |
| **Compras** | ✅ Con necesidades de compra | ❌ | ✅ (datos de compras) | ❌ | ❌ | ❌ | ❌ |
| **Facturación** | ✅ Solo datos económicos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Cliente** | ✅ Solo su proyecto activo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 4.2 Implementación de Permisos

Los permisos se implementan en `proyectos/page.tsx`:

```typescript
const isAdmin = user?.roles.includes('admin')
const isComercial = user?.roles.includes('comercial')
const isTecnico = user?.roles.includes('tecnico')
const canMovePhases = isAdmin || isComercial || isTecnico
const canClose = isAdmin
```

---

## 5. Flujos Principales

### 5.1 Crear Proyecto

1. Usuario hace clic en "Nuevo Proyecto"
2. Se abre `CreateProjectModal`
3. Usuario completa campos obligatorios:
   - Nombre del proyecto
   - Cliente (empresa)
   - Responsable interno
   - Contacto técnico del cliente
4. Al guardar:
   - Se crea el proyecto con fase 1 (Prospecto)
   - Se genera historial de "creación"
   - Se crean automáticamente las tareas de la fase 1
   - El proyecto aparece en el pipeline

### 5.2 Cambiar de Fase

1. Usuario hace clic en flechas de navegación en el card del proyecto
2. Se valida el permiso según el rol:
   - Comercial: solo fases 1-3
   - Técnico: solo fases 4-5
   - Admin: todas las fases
3. Si se avanza a una fase superior:
   - Se genera historial de "cambio de fase"
   - Se crean automáticamente las tareas de la nueva fase
4. Se actualiza la probabilidad de cierre según la fase

### 5.3 Cerrar Proyecto (Solo Admin)

1. Admin selecciona "Cerrar Proyecto" desde el panel de detalles
2. Modal de confirmación solicita:
   - **Motivo de cierre** (obligatorio)
   - Notas adicionales (opcional)
3. Al confirmar:
   - Estado cambia a `cerrado`
   - Se registra `fecha_cierre`
   - Se guarda `motivo_cierre`
   - Se genera historial de "cierre"
   - El proyecto se mueve a la vista de cerrados

### 5.4 Reabrir Proyecto (Solo Admin)

1. Admin selecciona "Reabrir" en la vista de cerrados
2. Modal de confirmación
3. Al confirmar:
   - Estado cambia a `activo`
   - Mantiene la fase donde estaba
   - Se genera historial de "reapertura"

### 5.5 Archivar Proyecto (Solo Admin)

1. Admin selecciona "Archivar" desde proyecto cerrado
2. El sistema evalúa automáticamente:
   - Si fase = 5 Y todas las tareas de fase 5 completadas → "completado"
   - En caso contrario → "inconcluso"
3. Admin puede modificar la clasificación
4. Al confirmar:
   - El proyecto se elimina de la tabla principal
   - Se genera historial de "archivado"
   - El proyecto queda disponible en el módulo de archivados

---

## 6. Integración con Otros Módulos

### 6.1 Módulo de Tareas

- **Generación automática**: Las tareas se crean automáticamente al cambiar de fase
- **Vinculación por fase**: Las tareas se filtran por `fase_origen === fase_actual`
- **Plantillas**: 19 plantillas predefinidas con subtareas

### 6.2 Módulo CRM (Empresas y Contactos)

- **Asociación a empresa**: Cada proyecto tiene `empresa_id`
- **Contacto técnico**: Relación con contactos del cliente
- **Validación**: El contacto debe ser de tipo "Técnico"

### 6.3 Módulo de Usuarios

- **Responsable**: Relación con usuarios internos (admin/técnico)
- **Equipo**: Array de UUIDs para técnicos secundarios
- **Permisos**: Basados en roles de usuario

### 6.4 Módulo de Archivados

- **Proyectos cerrados**: Almacenados temporalmente
- **Proyectos archivados**: Información resumida con clasificación
- **Restauración**: Posibilidad de recuperar proyectos archivados

---

## 7. Sistema de Validaciones

### 7.1 Validaciones de Creación/Edición

| Campo | Validación | Mensaje |
|-------|------------|---------|
| Nombre | Obligatorio, mínimo 5 caracteres | "El nombre es obligatorio (mínimo 3 caracteres)" |
| Cliente | Debe ser empresa de tipo cliente | "Selecciona una empresa cliente" |
| Responsable | Usuario interno activo (admin/técnico) | "Selecciona un responsable técnico" |
| Contacto técnico | Contacto de la empresa, tipo técnico | "Selecciona un contacto técnico del cliente" |
| Moneda | USD, MXN o EUR | "Selecciona una moneda" |
| Monto | Número positivo | "El monto no puede ser negativo" |
| Probabilidad | Entre 0 y 100 | "La probabilidad debe estar entre 0 y 100" |

### 7.2 Validaciones de Cierre

| Campo | Validación | Mensaje |
|-------|------------|---------|
| Motivo de cierre | Obligatorio, mínimo 5 caracteres | "El motivo debe tener al menos 5 caracteres" |

---

## 8. Gestión de Estado

### 8.1 LocalStorage

El módulo utiliza **localStorage** para persistencia:

| Key | Descripción |
|-----|-------------|
| `netops_proyectos` | Lista de proyectos activos y cerrados |
| `netops_proyectos_historial` | Historial de cambios por proyecto |

### 8.2 Hooks Personalizados

- `useProyectos()`: CRUD de proyectos
- `useHistorialProyectos()`: Gestión de historial
- `useTareas()`: Gestión de tareas vinculadas

---

## 9. Características UI/UX

### 9.1 Diseño Visual

- **Pipeline horizontal** con scroll para muchas fases
- **Cards de proyecto** con información resumida
- **Barras de progreso** visuales
- **Badges de estado** con colores semánticos
- **Iconos de Lucide React** para acciones

### 9.2 Componentes UI Utilizados

| Componente | Uso |
|------------|-----|
| `Button` | Acciones principales |
| `Input` | Campos de formulario |
| `Select` | Dropdowns |
| `Badge` | Etiquetas de estado |
| `MiniStat` | Estadísticas por fase |
| `BaseModal` | Modales |
| `BaseSidePanel` | Panel de detalles |

### 9.3 Responsive Design

- **Pipeline scrollable**: `overflow-x-auto` con `min-w-[1400px]`
- **Grid adaptativo**: Columnas responsivas según el espacio disponible

---

## 10. Fortalezas del Módulo

### ✅ Aspectos Positivos

1. **Arquitectura bien organizada**: Separación clara entre tipos, componentes, hooks y constantes
2. **Pipeline visual intuitivo**: Vista Kanban que facilita el seguimiento
3. **Generación automática de tareas**: Al cambiar de fase se crean las tareas pertinentes
4. **Control de permisos robusto**: Sistema granular basado en roles
5. **Historial completo**: Registro de todas las acciones
6. **Integración con CRM**: Relación con empresas y contactos
7. **Ciclo de vida completo**: Estados activo → cerrado → archivado
8. **Validaciones completas**: Mensajes de error claros y específicos
9. **Sub-modales para creación rápida**: Crear empresa y usuario sin salir del flujo
10. **Plantillas de tareas**: 19 plantillas predefinidas que aceleran la configuración

---

## 11. Áreas de Mejora Potencial

### ⚠️ Aspectos a Considerar

1. **Sin datos demo**: El módulo no incluye datos de ejemplo para pruebas
   - *Recomendación*: Agregar datos demo para facilitar testing

2. **LocalStorage únicamente**: No hay integración real con Supabase
   - *Recomendación*: Implementar sincronización con backend

3. **Configuración de fases en memoria**: Los cambios en fases no persisten
   - *Recomendación*: Guardar configuración en localStorage o backend

4. **Filtros limitados**: La barra de búsqueda existe pero con funcionalidad básica
   - *Recomendación*: Expandir filtros por: fecha, responsable, estado, tags

5. **Sin notificaciones**: No hay alertas para proyectos inactivos o por cerrar
   - *Recomendación*: Integrar con módulo de notificaciones (M9)

6. **Gestión de archivos**: Los archivos se vinculan a nivel de proyecto
   - *Recomendación*: Mejorar integración con módulo de archivos (M6)

7. **Portal del cliente**: Los clientes solo ven su proyecto
   - *Recomendación*: Expandir funcionalidades del portal

8. **⚠️ Crear contacto técnico inline no reutilizable**: En `CreateProjectModal.tsx`, el campo "Contacto Técnico del Cliente" actualmente **NO tiene un botón** para agregar nuevos contactos, a diferencia de los campos "Cliente" y "Responsable" que sí tienen `InlineAddButton`
   - *Problema*: El usuario debe salir del modal para crear un nuevo contacto técnico
   - *Recomendación*: Agregar `InlineAddButton` junto al campo de contacto técnico que abra el `ManageContactsModal` existente
   - *Nota*: Este es un **patrón inconsistente** - Cliente y Responsable SÍ tienen funcionalidad inline pero Contacto Técnico NO

---

## 12. Recomendaciones de Implementación

### 12.1 Mejoras Inmediatas

1. **Agregar botón de crear contacto técnico inline**: Implementar el mismo patrón de `InlineAddButton` que tienen Cliente y Responsable
2. **Agregar datos demo**: Crear proyectos de ejemplo para testing
3. **Persistir configuración de fases**: Guardar en localStorage

### 12.2 Mejoras a Mediano Plazo

1. **Integración con Supabase**: Migrar de localStorage a base de datos real
2. **Notificaciones**: Implementar alertas de inactividad
3. **Dashboard de proyectos**: Métricas y KPIs visuales
4. **Exportación**: PDF, Excel de proyectos

### 12.3 Mejoras a Largo Plazo

1. **Gantt**: Vista de cronograma de proyectos
2. **Recursos**: Asignación de recursos y carga de trabajo
3. **Presupuesto**: Seguimiento de presupuesto vs. real
4. **Integración con N8N**: Automatizaciones avanzadas

---

## 13. Conclusión

El **Módulo de Proyectos** es una pieza central y bien diseñada del CRM NetOps. Su implementación con un pipeline de 5 fases, generación automática de tareas y control de permisos basado en roles proporciona una base sólida para la gestión de proyectos.

Las principales fortalezas radican en su **arquitectura limpia**, la **integración con otros módulos** y el **control granular de permisos**. 

**La mejora más urgente** a implementar es agregar el botón inline para crear contactos técnicos en el `CreateProjectModal`, ya que actualmente existe una inconsistencia donde los campos Cliente y Responsable sí tienen esta funcionalidad pero Contacto Técnico no.

Las áreas de mejora restantes se centran principalmente en la **persistencia de datos** (actualmente solo localStorage), la **falta de datos demo** y la **necesidad de integraciones más profundas** con el backend de Supabase.

---

*Análisis generado el 20 de marzo de 2026*
*Versión del módulo: 1.0*
