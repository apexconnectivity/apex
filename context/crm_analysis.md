# Análisis del Módulo CRM - NetOps CRM

## Resumen

Este documento presenta el análisis exhaustivo del módulo de CRM del proyecto NetOps CRM, incluyendo su estructura, componentes, funcionalidades y problemas potenciales identificados.

---

## 1. Estructura del Módulo CRM

### 1.1 Ruta Principal

```
src/app/(dashboard)/dashboard/crm/page.tsx
```

### 1.2 Páginas Relacionadas con CRM

| Página | Ruta | Propósito |
|--------|------|-----------|
| **CRM Principal** | `/dashboard/crm` | Gestión de empresas, contactos y documentos |
| **Soporte** | `/dashboard/soporte` | Tickets y contratos de soporte |
| **Estadísticas** | `/dashboard/estadisticas` | Dashboard de métricas CRM y otros módulos |

### 1.3 Subdirectorios de Componentes CRM

```
src/components/module/
├── EmpresaCard.tsx          # Tarjeta de empresa en el listado
├── CreateEmpresaModal.tsx   # Modal para crear/editar empresas
├── ManageContactsModal.tsx  # Gestión de contactos por empresa
├── EmpresaDetailModal.tsx   # Vista detallada de empresa
├── UploadDocumentModal.tsx  # Subida de documentos
├── StatusBadge.tsx          # Badge de estado
└── ModuleCard.tsx           # Componente base para tarjetas
```

### 1.4 Hooks Relacionados con CRM

| Hook | Archivo | Descripción |
|------|---------|-------------|
| `useEmpresas` | `src/hooks/useEmpresas.ts` | Gestión de empresas en localStorage |
| `useContactos` | `src/hooks/useContactos.ts` | Gestión de contactos en localStorage |
| `useDocumentos` | `src/hooks/useDocumentos.ts` | Gestión de documentos CRM en localStorage |

### 1.5 Tipos y Constantes

| Archivo | Contenido |
|---------|-----------|
| `src/types/crm.ts` | Tipos: `Empresa`, `Contacto`, `Documento`, `TipoEntidad`, `Industria`, etc. |
| `src/constants/crm.ts` | Constantes de UI, etiquetas, colores, etapas del pipeline |

---

## 2. Arquitectura y Flujo de Datos

### 2.1 Flujo Principal del CRM

```
┌─────────────────┐
│  CRMPage       │
│  (page.tsx)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Hooks   │
    │ (state) │
    └────┬────┘
         │
    ┌────┴────────────────────────────┐
    │           Componentes            │
    │  ├── CreateEmpresaModal          │
    │  ├── EmpresaDetailModal          │
    │  ├── ManageContactsModal         │
    │  ├── UploadDocumentModal         │
    │  └── EmpresaCard                 │
    └─────────────────────────────────┘
         │
    ┌────┴────┐
    │ local-  │
    │ Storage │
    └─────────┘
```

### 2.2 Permisos y Roles

El módulo CRM implementa un sistema de permisos basado en roles:

| Rol | Puede ver Clientes | Puede ver Proveedores | Puede Editar | Puede Subir Docs |
|-----|--------------------|----------------------|--------------|------------------|
| `admin` | ✅ | ✅ | ✅ | ✅ |
| `comercial` | ✅ | ❌ | ✅ | ✅ |
| `compras` | ❌ | ✅ | ✅ | ✅ |
| `facturacion` | ✅ | ✅ | ❌ | ❌ |
| `marketing` | ✅ | ✅ | ❌ | ❌ |
| `especialista` (técnico) | ✅ (limitado) | ❌ | ❌ | ❌ |
| `cliente` | ❌ | ❌ | ❌ | ❌ |

### 2.3 Estados de UI (Agrupados)

El componente principal usa un patrón de estados agrupados:

```typescript
// Estados de búsqueda y filtros
const [searchState, setSearchState] = useState({
  query: '',
  tipo: 'todos' as TipoEntidad | 'todos',
  industria: 'todas'
})

// Estados de modales y UI
const [uiState, setUiState] = useState({
  selectedEmpresa: null as Empresa | null,
  isModalEmpresa: false,
  isModalContacto: false,
  isModalDocumento: false,
  isModalNewProject: false,
  editingEmpresa: null as Partial<Empresa> | null,
  empresaForContacto: null as Empresa | null,
  empresaForDocumento: null as Empresa | null,
  notaEditando: false,
  empresaToDelete: null as string | null,
})
```

---

## 3. Estructuras de Datos

### 3.1 Modelo: Empresa

```typescript
interface Empresa {
  id: string
  tipo_entidad: TipoEntidad  // 'cliente' | 'proveedor' | 'ambos'
  nombre: string
  industria?: Industria
  tamaño?: Tamaño
  origen?: Origen
  tipo_relacion?: TipoRelacion  // 'Cliente' | 'Prospecto' | 'Ex-cliente'
  tipo_contrato?: TipoContrato
  telefono_principal?: string
  sitio_web?: string
  direccion?: string
  ciudad?: string
  pais?: string
  notas_internas?: string
  // Datos de facturación
  razon_social?: string
  rfc?: string
  direccion_fiscal?: string
  regimen_fiscal?: string
  email_facturacion?: string
  metodo_pago?: MetodoPago
  plazo_pago?: number
  moneda_preferida?: Moneda
  // Metadatos
  creado_en: string
  creado_por?: string
  ultima_actividad?: string
}
```

### 3.2 Modelo: Contacto

```typescript
interface Contacto {
  id: string
  empresa_id: string
  nombre: string
  cargo?: string
  tipo_contacto: TipoContacto  // 'Técnico' | 'Administrativo' | 'Financiero' | etc.
  email: string
  telefono?: string
  es_principal: boolean
  recibe_facturas: boolean
  rol?: RolContacto  // 'especializacion' | 'facturacion' | 'compras'
  notas?: string
  activo: boolean
  usuario_id?: string
  creado_en: string
}
```

### 3.3 Modelo: Documento

```typescript
interface Documento {
  id: string
  empresa_id: string
  archivo_id: string
  visibilidad: VisibilidadDocumento  // 'interno' | 'publico'
  descripcion?: string
  subido_por?: string
  fecha_subida: string
  nombre_archivo?: string
}
```

---

## 4. Dependencias

### 4.1 Dependencias Internas

- **`@/hooks`**: `useEmpresas`, `useContactos`, `useProyectos`, `useTareas`, `useDocumentos`
- **`@/lib/useLocalStorage`**: Persistencia de datos
- **`@/lib/colors`**: Colores para estados
- **`@/lib/utils`**: Utilidad `cn()` para clases
- **`@/constants/crm`**: Constantes de UI
- **`@/constants/storage`**: Keys para localStorage
- **`@/contexts/auth-context`**: Autenticación y permisos

### 4.2 Dependencias Externas

- **`react`**: useState, useMemo, useCallback, useEffect
- **`next/dynamic`**: Lazy loading de modales
- **`lucide-react`**: Iconos
- **`@/components/ui/*`**: Componentes de UI (Card, Button, Input, etc.)
- **`@/components/base/*`**: BaseModal, ModalHeader, ModalBody, ModalFooter

---

## 5. Ejemplos de Uso

### 5.1 Renderizado de EmpresaCard

```tsx
{filteredEmpresas.map(empresa => (
  <EmpresaCard
    key={empresa.id}
    empresa={empresa}
    stats={{
      contactos: getContactos(empresa.id).length,
      proyectos: getProyectos(empresa.id).length
    }}
    onClick={() => setSelectedEmpresa(empresa)}
  />
))}
```

### 5.2 Memoización de Datos

```typescript
// Memoización: Filtrado de empresas
const filteredEmpresas = useMemo(() => {
  return empresas.filter(e => {
    if (isTecnico && e.tipo_entidad === 'cliente') {
      if (!empresasAsignadasTecnico.includes(e.id)) return false
    }
    if (!canViewClientes && e.tipo_entidad === 'cliente') return false
    if (!canViewProveedores && (e.tipo_entidad === 'proveedor' || e.tipo_entidad === 'ambos')) return false
    // ... más filtros
  })
}, [empresas, isTecnico, canViewClientes, canViewProveedores, searchQuery, tipoFilter, industriaFilter])
```

---

## 6. Problemas Identificados

### 6.1 Props Sin Usar (ESLint Disabled)

| Archivo | Línea | Prop | Problema |
|---------|-------|------|----------|
| `page.tsx` | 326 | `getDocumentos` | eslint-disable - función no usada |
| `page.tsx` | 331 | `getDocumentosInternos` | eslint-disable - función no usada |
| `page.tsx` | 336 | `getDocumentosPublicos` | eslint-disable - función no usada |
| `page.tsx` | 345 | `getTickets` | eslint-disable - función no usada |

**Recomendación**: Eliminar estas funciones o usarlas en el código.

### 6.2 Uso de @ts-ignore para Dynamic Imports

| Archivo | Línea | Problema |
|---------|-------|----------|
| `page.tsx` | 25 | `@ts-ignore` - preload supported in Next.js 14 but types not updated |
| `page.tsx` | 30 | `@ts-ignore` |
| `page.tsx` | 35 | `@ts-ignore` |

**Recomendación**: Actualizar tipos de Next.js o usar casting apropiado en lugar de `@ts-ignore`.

### 6.3 Magic Numbers

| Archivo | Línea | Valor | Problema |
|---------|-------|-------|----------|
| `page.tsx` | 71 | `const DIAS_INACTIVIDAD_PROSPECTO = 60` | Definido inline, debería estar en constants |
| `page.tsx` | 263 | `const empresasAsignadasTecnico = isTecnico ? ['1', '3'] : []` | Valores hardcodeados |

**Recomendación**: Mover a `src/constants/crm.ts`.

### 6.4 Código Duplicado

- **`TIPO_COLORS`**: Definido tanto en `EmpresaCard.tsx` como en `EmpresaDetailModal.tsx` (líneas 27-43 y 20-36 respectivamente)
- **`TIPO_LABELS`**: Duplicado en ambos archivos

**Recomendación**: Extraer a un archivo compartido en `src/constants/colors.ts` o crear un archivo `src/constants/crm-colors.ts`.

### 6.5 Validación Duplicada

En `CreateEmpresaModal.tsx`:
- Las funciones `validateRequired`, `validateEmail`, `validateRFC`, `validateURL` se importan de `@/lib/validation-utils`
- También hay validación manual en la función `canSave()` (líneas 102-125)

**Recomendación**: Unificar la validación usando solo las utilidades de validación.

### 6.6 Función `isSubmittingRef` con useRef

En `CreateEmpresaModal.tsx`:
```typescript
const isSubmittingRef = React.useRef(false)
```

Esta es una solución para prevenir múltiples submissions, pero hay una variable redundante `isSubmittingLocal` que podría simplificarse.

### 6.7 Posibles Mejoras de Performance

1. **Memoización incompleta**: Algunas funciones como `handleFilterChange` podrían memoizarse completamente
2. **Re-renders innecesarios**: El componente podría beneficiarse de más `React.memo` en los hijos
3. **Carga de datos**: Los hooks `useEmpresas`, `useContactos`, etc. podrían usar Suspense para mejor UX

---

## 7. Componentes Relacionados

### 7.1 Componentes de Soporte (relacionados con CRM)

| Componente | Propósito |
|------------|-----------|
| `CreateTicketModal.tsx` | Crear tickets de soporte |
| `CreateContractModal.tsx` | Crear contratos de soporte |
| `TicketDetailPanel.tsx` | Panel de detalles de ticket |

### 7.2 Componentes Compartidos

- `ModuleCard.tsx` - Tarjeta base
- `ModuleContainer.tsx` - Contenedor del módulo
- `ModuleHeader.tsx` - Encabezado
- `FilterBar.tsx` - Barra de filtros

---

## 8. Recomendaciones de Optimización

### 8.1 Alta Prioridad

1. **Eliminar funciones no usadas** (líneas 326-350 de `page.tsx`)
2. **Reemplazar `@ts-ignore`** con tipos adecuados o casting
3. **Extraer Magic Numbers** a constantes
4. **Crear archivo de colores compartidos** para `TIPO_COLORS` y `TIPO_LABELS`

### 8.2 Media Prioridad

1. **Unificar validación** en `CreateEmpresaModal.tsx`
2. **Agregar manejo de errores** más robusto para localStorage
3. **Implementar Suspense** para carga de datos
4. **Optimizar memoización** de funciones callback

### 8.3 Baja Prioridad (Mejoras Futuras)

1. **Migrar a Server Components** donde sea posible
2. **Implementar caching** con React Query o SWR
3. **Agregar tests unitarios** para lógica de negocio
4. **Documentar API** del módulo

---

## 9. Notas Adicionales

### 9.1 Estado delocalStorage

El módulo depende completamente de `localStorage` para persistencia:
- No hay integración real con Supabase en el CRM
- Los datos se pierden al limpiar el navegador
- Advertencia mostrada al usuario si localStorage no está disponible

### 9.2 Integración con Otros Módulos

- **Proyectos**: Los proyectos se crean desde empresas
- **Soporte**: Tickets vinculados a empresas
- **Contactos**: Sincronización con usuarios del portal de clientes
- **Estadísticas**: Dashboard usa datos de empresas y contactos

### 9.3 Patrones de Código Observados

- **Patrón de estados agrupados**: Uso de objetos de estado para organizar UI
- **Lazy loading**: Modales cargados dinámicamente con `next/dynamic`
- **Memoización extensiva**: Uso de `useMemo` para filtros y cálculos
- **Permisos por rol**: Sistema de control de acceso basado en roles

---

## 10. Archivo de Contexto Relacionado

- `STACK.md` - Actualizar con versiones de dependencias usadas en CRM
