# Análisis: Panel Lateral de Información Contextual

## 1. Estructura Actual del Módulo de Proyectos

### 1.1 Renderizado de Cards

El módulo de proyectos ([`proyectos/page.tsx`](netops-crm/src/app/(dashboard)/dashboard/proyectos/page.tsx:200)) utiliza un layout de **pipeline de 5 fases**:

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  Prospecto  │ Diagnóstico │ Propuesta   │ Implement.  │   Cierre    │
│   (Fase 1)  │  (Fase 2)   │  (Fase 3)   │  (Fase 4)   │  (Fase 5)   │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│  Card 1.1   │   Card 2.1  │   Card 3.1  │   Card 4.1  │   Card 5.1  │
│  Card 1.2   │   Card 2.2  │             │   Card 4.2  │             │
│             │             │             │   Card 4.3  │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**Componente usado**: [`ProjectCard`](netops-crm/src/components/module/ModuleCard.tsx:1) (líneas 200-222 del page.tsx)

```tsx
<ProjectCard
  key={p.id}
  title={p.nombre}
  subtitle={p.cliente_nombre}
  progress={p.probabilidad_cierre}
  progressLabel="Probabilidad"
  value={`${p.moneda} ${p.monto_estimado?.toLocaleString()}`}
  assignee={{ name: p.responsable_nombre || '' }}
  tags={(p.tags || []).map(tag => ({ label: tag }))}
  onClick={() => setSelectedId(p.id)}  // ← Click handler
>
```

**Estado actual**: 
- `selectedId` (línea 54) controla qué proyecto está seleccionado
- Al hacer clic, se abre un **Modal** (líneas 255-289) con información básica

### 1.2 Datos del Proyecto

Estructura definida en [`proyectos.ts`](netops-crm/src/types/proyectos.ts:22):

```typescript
interface Proyecto {
  id: string
  empresa_id: string
  nombre: string
  fase_actual: FaseProyecto      // 1-5
  estado: 'activo' | 'cerrado'
  fecha_inicio?: string
  fecha_estimada_fin?: string
  moneda: 'USD' | 'MXN' | 'EUR'
  monto_estimado?: number
  probabilidad_cierre: number
  responsable_id: string
  responsable_nombre?: string
  cliente_nombre?: string
  // ... otros campos
}
```

---

## 2. Relación Proyectos-Tareas

### 2.1 Respuesta a Pregunta #1: ¿Existe relación?

**SÍ EXISTE** - Las tareas tienen un campo [`proyecto_id`](netops-crm/src/types/tareas.ts:17) que las vincula a un proyecto específico:

```typescript
interface Tarea {
  id: string
  proyecto_id: string        // ← Relación con Proyecto
  proyecto_nombre: string    // ← Nombre del proyecto (denormalizado)
  fase_origen: number        // ← Fase del proyecto asociada
  fase_nombre: string
  categoria: CategoriaTarea
  nombre: string
  descripcion?: string
  responsable_id?: string
  responsable_nombre?: string
  fecha_vencimiento?: string
  fecha_completado?: string
  prioridad: PrioridadTarea
  estado: EstadoTarea        // ← 'Pendiente' | 'En progreso' | 'Completada' | 'Bloqueada'
  orden: number
  // ...
}
```

### 2.2 Respuesta a Pregunta #2: ¿Las tareas tienen campo de vinculación?

**SÍ** - [`proyecto_id`](netops-crm/src/types/tareas.ts:17) es el campo que vincula cada tarea a un proyecto específico.

### 2.3 Estados de Tareas

Definidos en [`tareas.ts`](netops-crm/src/types/tareas.ts:5):

```typescript
type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada' | 'Bloqueada'

type PrioridadTarea = 'Baja' | 'Media' | 'Alta' | 'Urgente'

type CategoriaTarea = 'Comercial' | 'Técnica' | 'Compras' | 'Administrativa' | 'General'
```

---

## 3. Recomendaciones de Diseño del Panel Lateral

### 3.1 Arquitectura Recomendada: Slide-over Panel (Drawer)

**Opción seleccionada**: Reemplazar el **Modal actual** por un **Panel Lateral (Drawer)** que se desliza desde el lado derecho.

**Comparación**:

| Característica | Modal Actual | Panel Lateral (Recomendado) |
|----------------|--------------|----------------------------|
| Ancho | ~500px fijo | 400-500px adaptable |
| Visualización tareas | Limitada | Completa con scroll |
| Información contextual | Básica | Extensa |
| UX móvil | Bueno | Necesita adaptación |
| Espacio para列表 | Limitado | Generoso |

### 3.2 Estructura del Panel Lateral

```
┌─────────────────────────────────────┐
│  ×                                  │  ← Botón cerrar
├─────────────────────────────────────┤
│  Nombre del Proyecto               │
│  Cliente: Nombre Cliente            │
│  ─────────────────────────          │
│  Fase: Implementación               │
│  Estado: Activo                     │
│  ─────────────────────────          │
│  □ Progress: 90%  ████████▓░░░      │
│  □ Monto: USD 25,000               │
│  □ Responsable: Carlos Admin        │
├─────────────────────────────────────┤
│  TAREAS (5)                        │
│  ┌─────────────────────────────┐   │
│  │ ✓ Tarea 1 - Completada      │   │  ← Verde/verde claro
│  │ ○ Tarea 2 - Pendiente       │   │  ← Normal
│  │ ◐ Tarea 3 - En progreso     │   │  ← Azul
│  │ ⊘ Tarea 4 - Bloqueada       │   │  ← Rojo/gris
│  │ ○ Tarea 5 - Pendiente       │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  [Crear Tarea]  [Ver todas →]      │
└─────────────────────────────────────┘
```

### 3.3 Información a Mostrar

**Sección 1: Datos Generales del Proyecto**
- Nombre del proyecto
- Cliente/empresa
- Fase actual (con indicador de color)
- Estado (Activo/Cerrado)
- Monto estimado
- Probabilidad de cierre (barra de progreso)
- Responsable
- Fechas (inicio, estimación fin)

**Sección 2: Listado de Tareas**
- Filtrar por `proyecto_id === selectedId`
- Diferenciación visual por estado:
  - ✅ **Completada**: Verde, tachado, checkmark
  - ⏳ **Pendiente**: Color normal, círculo vacío
  - 🔄 **En progreso**: Azul, círculo medio lleno
  - ⛔ **Bloqueada**: Rojo/gris, candado
- Mostrar: nombre, prioridad, fecha vencimiento, responsable

**Sección 3: Estadísticas del Proyecto**
- Total de tareas
- Tareas completadas vs pendientes
- Porcentaje de avance

---

## 4. Plan de Implementación

### 4.1 Componentes Necesarios

1. **Nuevo componente `ProjectSidebar`** o modificar el existente `Modal`
2. **Integración con datos de tareas** - importar desde página de tareas o crear contexto compartido

### 4.2 Cambios en [`proyectos/page.tsx`](netops-crm/src/app/(dashboard)/dashboard/proyectos/page.tsx:1)

```typescript
// Estado adicional necesario
const [tareas, setTareas] = useState<Tarea[]>(DEMO_TAREAS)  // ← Importar tipo Tarea

// Filtrar tareas por proyecto seleccionado
const tareasDelProyecto = useMemo(() => 
  tareas.filter(t => t.proyecto_id === selectedId),
  [tareas, selectedId]
)

// Calcular progreso
const progresoProyecto = useMemo(() => {
  const completadas = tareasDelProyecto.filter(t => t.estado === 'Completada').length
  return tareasDelProyecto.length > 0 
    ? Math.round((completadas / tareasDelProyecto.length) * 100)
    : 0
}, [tareasDelProyecto])
```

### 4.3 Respuesta a Pregunta #3: Información Adicional Recomendada

Además de las tareas, el panel debería mostrar:

1. **Datos del proyecto**: fase, estado, monto, responsable
2. **Progreso calculado**: basado en tareas completadas vs total
3. **Fechas**: inicio, estimación fin, días restantes
4. **Etiquetas/Tags**: del proyecto
5. **Información de contacto**: contacto técnico del cliente
6. **Acciones rápidas**: crear tarea, cerrar proyecto, editar

---

## 5. Consideraciones Técnicas

### 5.1 Componente UI a utilizar

El proyecto ya cuenta con componentes que pueden servir:
- [`Dialog`](netops-crm/src/components/ui/dialog.tsx:1) - para un drawer/slide-over
- [`Modal`](netops-crm/src/components/ui/modal.tsx:1) - ya usado, puede modificarse

### 5.2 Rendimiento

- Usar `useMemo` para filtrar tareas solo cuando cambie `selectedId`
- Considerar cargar tareas bajo demanda si el volumen es grande

### 5.3 Persistencia de Estado

- El panel lateral debe mantener el estado al cerrar/abrir
- No requiere persistencia en localStorage (sesión actual)

---

## 6. Conclusión

El módulo de proyectos **ya tiene la infraestructura necesaria** para implementar el panel lateral:

✅ Relación Proyectos-Tareas definida (`proyecto_id`)  
✅ Estado de proyecto seleccionado (`selectedId`)  
✅ Tipos de datos definidos (Tarea, Proyecto)  
✅ Componentes UI disponibles (Modal, Dialog)

**Próximo paso recomendado**: Implementar el componente de panel lateral替换ando el Modal actual, integrando los datos de tareas filtrados por proyecto.
