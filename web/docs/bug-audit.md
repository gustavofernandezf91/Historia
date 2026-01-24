# Auditoría rápida de bugs (profundización)

## Alcance
- Revisión rápida de páginas App Router y componentes principales (progreso, bloques, navegación de lecciones).
- Validación de consistencia de datos en `content/curriculum.json`.

## Hallazgos principales

### 1) El progreso de la unidad/lesión no se actualiza en caliente
**Impacto:** Medio (el usuario completa actividades, pero el progreso mostrado no cambia hasta refrescar o navegar).  
**Evidencia:**
- `UnitProgress` calcula el progreso solo cuando cambia `blocks` y no se suscribe a los eventos de progreso (no hay `subscribeToProgressUpdates`).
- `BlockGrid` deriva progreso y estados completados en `useMemo` sin suscripción a cambios del store.  

**Sugerencia:**
- Reutilizar `subscribeToProgressUpdates` en `UnitProgress`/`BlockGrid` o mover a estado con `useEffect` para forzar re-render cuando cambie el progreso.

### 2) Tipado de `params` como `Promise` en páginas App Router
**Impacto:** Bajo/Medio (el runtime funciona porque `await` acepta valores no promesa, pero el tipado es incorrecto y puede ocultar errores de contrato).  
**Evidencia:**
- `page.tsx` de `unidad`, `leccion` y `bloque` definen `params: Promise<...>` y luego hacen `await params`.

**Sugerencia:**
- Cambiar a `{ params: { unidadId: string; ... } }` y remover `await` si no hay I/O real.

### 3) Tipado incompleto en la página de bloque
**Impacto:** Medio (con `strict: true` puede fallar el build o generar errores de TypeScript).  
**Evidencia:**
- En `bloque/[bloqueId]/page.tsx`, el tipo `Leccion` no incluye `habilidad_principal`, `habilidad`, `contenidos`/`contenidos_breves`, pero se usan más abajo.

**Sugerencia:**
- Completar el tipo `Leccion` para reflejar el contenido real del JSON.

### 4) Evaluación de orden sin orden esperado en el curriculum
**Impacto:** Medio (la evaluación de “arrastrar y ordenar” se aprueba siempre si no hay `ordenCorrecto`).  
**Evidencia:**
- En `curriculum.json` existe un bloque de evaluación con `formato: "arrastrar_y_ordenar"` sin `ordenCorrecto` (unidad `u0`, lección `u0l2`, bloque "Chequeo rápido").
- `DragAndOrder` marca correcto cuando `expectedOrder` no existe.

**Sugerencia:**
- Completar `ordenCorrecto` en el JSON o ajustar UI para advertir cuando falte.

## Notas rápidas
- No se detectaron IDs duplicados en unidades/lecciones ni bloques sin `tipo`.
- Validaciones mínimas de datos pasan, pero el flujo de progreso depende de `localStorage` sin sincronización automática en varias vistas.
