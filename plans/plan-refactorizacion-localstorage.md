# Plan: Refactorización de localStorage para NetOps CRM

## Objetivo

Preparar el sistema de almacenamiento local del proyecto para:
1. **Pruebas locales** fluidas y confiables
2. **Migración futura** a Supabase sin reescribir toda la aplicación

---

## Fase 1: Estructura Unificada de Storage

### 1.1 Crear `storage-config.ts`

Archivo centralizado en `src/constants/storage-config.ts` que defina:

```typescript
// Enum unificado de todas las keys
export enum StorageKeys {
  // Auth
  AUTH_USER = 'netops_auth_user',
  PORTAL_USER = 'netops_portal_user',
  
  // CRM
  EMPRESAS = 'netops_crm_empresas',
  CONTACTOS = 'netops_crm_contactos',
  DOCUMENTOS = 'netops_crm_documentos',
  
  // Proyectos
  PROYECTOS = 'netops_proyectos',
  HISTORIAL_PROYECTOS = 'netops_proyectos_historial',
  
  // Tareas
  TAREAS = 'netops_tareas',
  SUBTAREAS = 'netops_subtareas',
  COMENTARIOS = 'netops_comentarios',
  
  // Soporte
  CONTRATOS = 'netops_soporte_contratos',
  TICKETS = 'netops_soporte_tickets',
  COMENTARIOS_TICKETS = 'netops_soporte_comentarios',
  
  // Compras
  ORDENES_COMPRA = 'netops_compras_ordenes',
  PROVEEDORES = 'netops_compras_proveedores',
  COTIZACIONES = 'netops_compras_cotizaciones',
  
  // Calendario
  REUNIONES = 'netops_calendario_reuniones',
  
  // Archivos
  ARCHIVOS = 'netops_archivos',
  
  // Archivados
  PROYECTOS_CERRADOS = 'netops_proyectos_cerrados',
  PROYECTOS_ARCHIVADOS = 'netops_proyectos_archivados',
  CONFIG_ARCHIVADO = 'netops_config_archivado',
  
  // Notificaciones
  NOTIFICACIONES_CONFIG = 'netops_notificaciones_config',
  NOTIFICACIONES_PREFERENCIA = 'netops_notificaciones_preferencia',
  NOTIFICACIONES_EVENTOS = 'netops_notificaciones_eventos',
  
  // Usuarios
  USUARIOS = 'netops_usuarios',
  
  // UI State
  COMPRAS_VISTA = 'netops_ui_compras_vista',
  SOPORTE_VISTA = 'netops_ui_soporte_vista',
  NOTIFICACIONES_VISTA = 'netops_ui_notificaciones_vista',
}

// Tipos de datos para validación
export interface StorageSchema {
  [StorageKeys.AUTH_USER]: User | null
  [StorageKeys.EMPRESAS]: Empresa[]
  // ... todos los tipos
}
```

### 1.2 Sistema de Validación con Zod

Crear `src/lib/storage-validation.ts`:

```typescript
import { z } from 'zod'

// Esquemas de validación para cada entidad
export const empresaSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  // ... campos
})

// Función de validación genérica
export function validateStorageData<T>(key: string, schema: z.ZodType<T>): T | null {
  try {
    const data = localStorage.getItem(key)
    if (!data) return null
    return schema.parse(JSON.parse(data))
  } catch {
    return null
  }
}
```

---

## Fase 2: Mejoras en useLocalStorage

### 2.1 Sincronización entre Tabs

Actualizar `src/lib/useLocalStorage.ts`:

```typescript
// Añadir event listener para sincronización
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      setStoredValue(JSON.parse(e.newValue))
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [key])
```

### 2.2 Validación Automática

```typescript
// Nuevo parámetro para esquema de validación
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    schema?: z.ZodType<T>
    onInvalid?: (error: z.ZodError) => void
  }
)
```

---

## Fase 3: Utilerías de Testing

### 3.1 Export/Import de Datos

Crear `src/lib/storage-utils.ts`:

```typescript
// Exportar todos los datos
export function exportAllData(): Record<string, unknown>

// Importar datos
export function importData(data: Record<string, unknown>): void

// Limpiar todo
export function clearAllData(): void

// Obtener tamaño usado
export function getStorageUsage(): { used: number, total: number }
```

### 3.2 Datos Demo Separados

Mover datos demo de `useArchivadoStorage.ts` a archivo separado:

```
src/
├── data/
│   └── demo/
│       ├── proyectos-demo.ts
│       ├── empresas-demo.ts
│       └── ...
```

---

## Fase 4: Refactorización de Hooks

### 4.1 actualizar todos los hooks para usar StorageKeys

```typescript
// Antes
const STORAGE_KEYS = { ARCHIVOS: 'netops_archivos' }

// Después
import { StorageKeys } from '@/constants/storage-config'
// Usar StorageKeys.ARCHIVOS
```

### 4.2 Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `useArchivosStorage.ts` | Usar StorageKeys.ARCHIVOS |
| `useArchivadoStorage.ts` | Usar StorageKeys.*, mover demo data |
| `auth-context.tsx` | Usar StorageKeys.AUTH_USER |
| `portal-auth-context.tsx` | Usar StorageKeys.PORTAL_USER |
| `constants/storage.ts` | Mantener como alias, deprecado |
| `welcome-header.tsx` | Actualizar imports |
| `dashboard/compras/page.tsx` | Usar StorageKeys |
| `dashboard/soporte/page.tsx` | Usar StorageKeys |
| `dashboard/usuarios/page.tsx` | Usar StorageKeys |
| `dashboard/notificaciones/page.tsx` | Usar StorageKeys |

---

## Fase 5: Preparación para Supabase

### 5.1 Hook de Fuente de Datos Abtracta

Crear `src/hooks/useDataSource.ts`:

```typescript
type DataSource = 'localStorage' | 'supabase'

interface UseDataSourceOptions {
  source: DataSource
  supabaseTable?: string
}

export function useDataSource<T>(key: string, initialValue: T, options: UseDataSourceOptions) {
  // Si source es supabase, usar Supabase
  // Si source es localStorage, usar useLocalStorage
}
```

### 5.2 Script de Migración

Crear `scripts/migrate-to-supabase.ts`:

```typescript
// Pseudocódigo - función para migrar datos
async function migrateToSupabase() {
  const data = exportAllData()
  
  for (const [key, value] of Object.entries(data)) {
    const tableName = keyToTableName(key) // netops_tareas -> tareas
    await supabase.from(tableName).upsert(value)
  }
}
```

### 5.3 Documentación de Esquemas

Crear `docs/supabase-schema.md` con:
- Tablas necesarias
- Relaciones entre tablas
- Políticas RLS sugeridas

---

## Fase 6: Pruebas Locales

### 6.1 Checklist de Verificación

- [ ] Login/logout funciona correctamente
- [ ] CRUD de empresas en CRM
- [ ] CRUD de proyectos
- [ ] CRUD de tareas
- [ ] CRUD de tickets y contratos
- [ ] CRUD de compras
- [ ] Archivos se guardan correctamente
- [ ] Proyectos archivados funcionan
- [ ] Notificaciones se guardan
- [ ] Vista de usuario se mantiene al recargar
- [ ] Datos persisten al cerrar navegador
- [ ] Sincronización entre tabs funciona
- [ ] Export/import funciona correctamente

### 6.2 Comandos de Prueba

```bash
# Desarrollo local
npm run dev

# Verificar tamaño de localStorage
# (Ejecutar en consola del navegador)
console.log(JSON.stringify(localStorage).length)
```

---

## Orden de Implementación Recomendado

```
1. storage-config.ts (enum + tipos)
2. storage-validation.ts (Zod)
3. Actualizar useLocalStorage (sync + validación)
4. storage-utils.ts (export/import/clear)
5. Mover datos demo a carpeta separada
6. Refactorizar useArchivosStorage
7. Refactorizar useArchivadoStorage
8. Refactorizar auth-context
9. Refactorizar portal-auth-context
10. Actualizar resto de páginas
11. Pruebas locales
12. Documentación Supabase
13. Crear scripts de migración (para después)
```

---

## Notas Importantes

1. **No eliminar funcionalidad**: Mantener retrocompatibilidad
2. **Prefijo recomendado**: `netops_` (ya usado en algunos lugares)
3. **Zod**: Verificar que esté instalado o agregar a package.json
4. **Supabase**: No implementar aún, solo preparar estructura
5. **Testing**: Cada módulo debe funcionar independientemente

---

## Archivos a Crear/Modificar

### Nuevos archivos
- `src/constants/storage-config.ts` ← NUEVO
- `src/lib/storage-validation.ts` ← NUEVO
- `src/lib/storage-utils.ts` ← NUEVO
- `src/hooks/useDataSource.ts` ← NUEVO
- `src/data/demo/*.ts` ← NUEVO (carpeta)
- `scripts/migrate-to-supabase.ts` ← NUEVO (futuro)

### Archivos a modificar
- `src/lib/useLocalStorage.ts`
- `src/constants/storage.ts` (deprecar)
- `src/hooks/useArchivosStorage.ts`
- `src/hooks/useArchivadoStorage.ts`
- `src/contexts/auth-context.tsx`
- `src/contexts/portal-auth-context.tsx`
- Múltiples páginas que usan localStorage

---

*Plan creado para facilitar la migración futura a Supabase mientras se mantiene un sistema local funcional para pruebas.*
