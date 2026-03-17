# Plan de Unificación de Filtros y Búsqueda

## Objetivo
Unificar la apariencia y comportamiento de las barras de filtros en los módulos de CRM, Tareas y Proyectos, incluyendo un componente de búsqueda reutilizable.

---

## Estructura de Referencia (CRM)

```tsx
{/* Contenedor de filtros */}
<div className="flex flex-wrap gap-4 items-center">
  
  {/* 1. Campo de búsqueda */}
  <div className="relative flex-1 min-w-[200px] max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      placeholder="Buscar empresas..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10"
    />
  </div>

  {/* 2. Selectores de filtro */}
  <Select value={tipoFilter} onValueChange={...}>
    <SelectTrigger className="w-40 h-8 bg-input border-border">
      <SelectValue placeholder="Tipo" />
    </SelectTrigger>
    <SelectContent>...</SelectContent>
  </Select>
  
  <Select value={industriaFilter} onValueChange={...}>
    <SelectTrigger className="w-48 h-8 bg-input border-border">
      <SelectValue placeholder="Industria" />
    </SelectTrigger>
    <SelectContent>...</SelectContent>
  </Select>
</div>
```

### Características del CRM:
- **Contenedor**: `flex flex-wrap gap-4 items-center`
- **Búsqueda**: `flex-1 min-w-[200px] max-w-md` con icono Search
- **Selectores**: `w-40 h-8 bg-input border-border`
- **Orden**: Búsqueda primero, luego filtros

---

## Estado Actual por Módulo

### CRM ✅ (Referencia)
- Tiene búsqueda (input con icono)
- Tiene filtros (Tipo, Industria)
- Usa ModuleContainer

### Tareas ⚠️ (Necesita cambios)
- Tiene búsqueda (NO tiene icono)
- Tiene filtros (Proyecto, Persona, Estado, Categoría, Prioridad, Fechas)
- Usa Card con filtros dentro

### Proyectos ❌ (No tiene filtros)
- NO tiene búsqueda
- NO tiene barra de filtros
- Usa ModuleContainerWithPanel

### Soporte ⚠️ (Necesita cambios)
- NO tiene búsqueda
- Tiene filtros (Cliente, Responsable, Estado, Categoría, Prioridad, Fechas)
- Usa div simple

---

## Plan de Implementación

### Fase 1: Crear Componente de Búsqueda Reutilizable

**Archivo**: `src/components/ui/module-search.tsx` (ya existe)

El componente [`ModuleSearch`](netops-crm/src/components/module/ModuleSearch.tsx:1) ya existe pero no tiene icono Search.

**Mejora propuesta**:
```tsx
// En ModuleSearch.tsx
<div className="relative flex-1 min-w-[200px] max-w-md">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
  <Input
    {...props}
    className="pl-10" // Agregar padding para el icono
  />
</div>
```

---

### Fase 2: Refactorizar Módulo Tareas

**Archivo**: `tareas/page.tsx`

**Cambios**:
1. Mover filtros fuera del Card
2. Agregar icono de búsqueda
3. Usar mismo contenedor: `flex flex-wrap gap-4 items-center`
4. Aplicar mismo estilo a SelectTrigger: `w-40 h-8 bg-input border-border`

**Estructura objetivo**:
```tsx
<div className="flex flex-wrap gap-4 items-center">
  {/* Búsqueda */}
  <div className="relative flex-1 min-w-[200px] max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      placeholder="Buscar tareas..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10"
    />
  </div>
  
  {/* Filtros */}
  <Select>...</Select>
  <Select>...</Select>
  <Select>...</Select>
</div>
```

---

### Fase 3: Agregar Filtros a Proyectos

**Archivo**: `proyectos/page.tsx`

**Agregar**:
1. Campo de búsqueda (igual que CRM)
2. Filtros sugeridos:
   - Estado (Activo/Cerrado)
   - Fase (Prospecto, Diagnóstico, etc.)
   - Empresa/Cliente

**Estructura objetivo**:
```tsx
<div className="flex flex-wrap gap-4 items-center">
  {/* Búsqueda */}
  <div className="relative flex-1 min-w-[200px] max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      placeholder="Buscar proyectos..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10"
    />
  </div>
  
  {/* Filtros */}
  <Select value={filtroEstado} onValueChange={...}>
    <SelectTrigger className="w-40 h-8 bg-input border-border">
      <SelectValue placeholder="Estado" />
    </SelectTrigger>
    <SelectContent>...</SelectContent>
  </Select>
  
  <Select value={filtroFase} onValueChange={...}>
    <SelectTrigger className="w-40 h-8 bg-input border-border">
      <SelectValue placeholder="Fase" />
    </SelectTrigger>
    <SelectContent>...</SelectContent>
  </Select>
</div>
```

---

### Fase 4: Refactorizar Módulo Soporte

**Archivo**: `soporte/page.tsx`

**Cambios**:
1. Agregar campo de búsqueda
2. Usar mismo estilo de contenedor
3. Aplicar mismo estilo a SelectTrigger

---

## Orden de Implementación Sugerido

1. **Primero**: Actualizar ModuleSearch con icono (componente reutilizable)
2. **Segundo**: Refactorizar Tareas (más similar a CRM)
3. **Tercero**: Agregar filtros a Proyectos
4. **Cuarto**: Refactorizar Soporte

---

## Componentes a Modificar/Crear

| Componente | Acción | Archivo |
|------------|--------|---------|
| ModuleSearch | Mejorar con icono | `src/components/module/ModuleSearch.tsx` |
| tareas/page.tsx | Refactorizar filtros | `src/app/(dashboard)/dashboard/tareas/page.tsx` |
| proyectos/page.tsx | Agregar búsqueda y filtros | `src/app/(dashboard)/dashboard/proyectos/page.tsx` |
| soporte/page.tsx | Agregar búsqueda + refactorizar | `src/app/(dashboard)/dashboard/soporte/page.tsx` |

---

## Estados Necesarios por Módulo

### Proyectos (agregar):
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [filtroEstado, setFiltroEstado] = useState<string>('todos')
const [filtroFase, setFiltroFase] = useState<string>('todas')
```

### Soporte (agregar):
```typescript
const [searchQuery, setSearchQuery] = useState('')
```
