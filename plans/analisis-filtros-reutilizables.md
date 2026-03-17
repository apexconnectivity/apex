# Análisis: Sección de Búsqueda y Filtros Reutilizable

## Estado Actual

### Componente Existente: [`ModuleSearch`](netops-crm/src/components/module/ModuleSearch.tsx:1)

Ya existe un componente que intenta ser reutilizable:

```tsx
interface ModuleSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  filters?: ReactNode  // <- Acepta filtros como children
  className?: string
}
```

**Estructura actual**:
```tsx
<div className="flex flex-col sm:flex-row gap-3 items-center">
  {/* Input de búsqueda */}
  <div className="relative flex-1 max-w-md">
    <Search className="..." />
    <Input className="pl-9 pr-8 ..." />
    {/* Botón X para limpiar */}
  </div>
  
  {/* Contenedor de filtros */}
  {filters && (
    <div className="flex items-center gap-2">
      <Filter className="..." />
      {filters}
    </div>
  )}
</div>
```

### Análisis del Componente Actual

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Campo de búsqueda | ✅ Implementado | Tiene icono, botón limpiar |
| Contenedor de filtros | ✅ Implementado | Acepta ReactNode |
| Estilo de filtros | ❌ No controlado | Cada módulo pone lo que quiere |
| Consistencia | ❌ No hay | |

---

## Problemas Identificados

### 1. La estructura no es idéntica al CRM
- CRM usa: `flex flex-wrap gap-4 items-center`
- ModuleSearch usa: `flex flex-col sm:flex-row gap-3 items-center`

### 2. Los filtros dentro de ModuleSearch no tienen estilo unificado
Cada módulo que usa ModuleSearch pasa sus propios Select:

```tsx
// Ejemplo de uso actual (no existe en el proyecto)
<ModuleSearch
  value={searchQuery}
  onChange={setSearchQuery}
  filters={
    <>
      <Select>...</Select>
      <Select>...</Select>
    </>
  }
/>
```

### 3. Los módulos actuales NO usan ModuleSearch
- **CRM**: Tiene su propia implementación inline
- **Tareas**: Tiene su propia implementación inline
- **Soporte**: Tiene su propia implementación inline
- **Proyectos**: No tiene filtros

---

## Solución Propuesta: Componente FilterBar

Crear un nuevo componente `FilterBar` que encapsule toda la sección de búsqueda y filtros:

### Diseño Propuesto

```tsx
// src/components/ui/filter-bar.tsx

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label?: string
  placeholder?: string
  options: FilterOption[]
  width?: string  // w-40, w-48, etc.
}

interface FilterBarProps {
  // Búsqueda
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  
  // Filtros
  filters: FilterConfig[]
  values: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  
  // Limpiar filtros
  onClearFilters?: () => void
  hasActiveFilters?: boolean
}
```

### Estructura Visual Objetivo

```tsx
<div className="flex flex-wrap gap-4 items-center">
  {/* Campo de búsqueda */}
  <div className="relative flex-1 min-w-[200px] max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      placeholder={searchPlaceholder}
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10"
    />
  </div>
  
  {/* Filtros generados automáticamente */}
  {filters.map(filter => (
    <Select
      key={filter.key}
      value={values[filter.key]}
      onValueChange={(v) => onFilterChange(filter.key, v)}
    >
      <SelectTrigger className={filter.width ? filter.width : 'w-40 h-8 bg-input border-border'}>
        <SelectValue placeholder={filter.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filter.options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ))}
  
  {/* Botón limpiar filtros (solo si hay filtros activos) */}
  {hasActiveFilters && (
    <Button variant="ghost" size="sm" onClick={onClearFilters}>
      <X className="h-4 w-4 mr-1" />
      Limpiar
    </Button>
  )}
</div>
```

---

## Beneficios de Esta Arquitectura

### 1. **Totalmente reutilizable**
- Un solo componente para todos los módulos
- Configuración declarativa

### 2. **Consistencia garantizada**
- Mismo estilo visual
- Mismo comportamiento

### 3. **Fácil mantenimiento**
- Cambios en un solo lugar
- Sin código duplicado

### 4. **TypeScript estricto**
- Props tipadas
- autocomplete en IDE

---

## Ejemplo de Uso

### En CRM:
```tsx
<FilterBar
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Buscar empresas..."
  filters={[
    {
      key: 'tipo',
      placeholder: 'Tipo',
      options: [
        { value: 'todos', label: 'Todos los tipos' },
        { value: 'cliente', label: 'Clientes' },
        { value: 'proveedor', label: 'Proveedores' },
        { value: 'ambos', label: 'Ambos' },
      ],
      width: 'w-40'
    },
    {
      key: 'industria',
      placeholder: 'Industria',
      options: [
        { value: 'todas', label: 'Todas las industrias' },
        ...INDUSTRIAS.map(i => ({ value: i, label: i }))
      ],
      width: 'w-48'
    }
  ]}
  values={{ tipo: tipoFilter, industria: industriaFilter }}
  onFilterChange={(key, value) => {
    if (key === 'tipo') setTipoFilter(value as TipoEntidad | 'todos')
    if (key === 'industria') setIndustriaFilter(value)
  }}
  hasActiveFilters={tipoFilter !== 'todos' || industriaFilter !== 'todas'}
  onClearFilters={() => {
    setTipoFilter('todos')
    setIndustriaFilter('todas')
    setSearchQuery('')
  }}
/>
```

### En Tareas:
```tsx
<FilterBar
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Buscar tareas..."
  filters={[
    { key: 'proyecto', placeholder: 'Proyecto', options: proyectoOptions, width: 'w-40' },
    { key: 'persona', placeholder: 'Persona', options: personaOptions, width: 'w-36' },
    { key: 'estado', placeholder: 'Estado', options: estadoOptions, width: 'w-32' },
    { key: 'categoria', placeholder: 'Categoría', options: categoriaOptions, width: 'w-36' },
    { key: 'prioridad', placeholder: 'Prioridad', opciones: prioridadOptions, width: 'w-32' },
  ]}
  values={filtros}
  onFilterChange={handleFilterChange}
  hasActiveFilters={hasActiveFilters}
  onClearFilters={clearFilters}
/>
```

---

## Conclusión

**Sí es viable** crear una sección de búsqueda y filtros reutilizable. El enfoque recomendado es:

1. **Crear** el componente `FilterBar` en `src/components/ui/filter-bar.tsx`
2. **Migrar** el CRM primero (ya tiene la estructura más simple)
3. **Migrar** Tareas y Soporte
4. **Agregar** a Proyectos

Esto eliminaría el código duplicado y garantizaría consistencia visual en todo el aplicativo.
