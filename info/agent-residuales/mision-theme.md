# MISIÓN: Google Console Estético Funcional (PARKO)

**Objetivo:** Establecer un tema visual maestro (`theme.css`) para el Catálogo Gestionado, caracterizado por su limpieza, modernidad y robustez tecnológica, inspirado directamente en el ecosistema y consola de Google.

**Directivas Tecnológicas:**
1.  **HTML Semántico Jerárquico:** El CSS debe apuntar directa y principalmente a las etiquetas HTML (`body`, `main`, `header`, `nav`, `section`, `article`, `h1-h6`, `p`, `button`, `a`, `input`, `form`, `table`, `ul`, `li`, etc.) y sus pseudo-clases/estados (`:hover`, `:focus`, `:active`, `:disabled`).
2.  **Anti-Clases (Anti-Utility Classes):** Se prohíbe el uso de filosofías tipo TailwindCSS o Bootstrap en las vistas. No se deben crear clases específicas de vista (ej. `.tarjeta-dashboard-verde`). El HTML debe permanecer inmaculado y semántico.
3.  **Variables Globales CSS:** Se utilizarán variables (`--color-primary`, `--spacing-md`, etc.) en `:root` para gestionar el tema y permitir escalabilidad/modo oscuro en un futuro si se requiere.
4.  **Aesthetics "Google Console":**
    -   Fondos blancos o muy neutros (grises muy claros).
    -   Tipografía limpia (idealmente sans-serif estandarizada como Roboto o Inter, o fuentes de sistema).
    -   Uso de bordes sutiles y sombras ligeras para dar profundidad (Material Design sutil).
    -   Botones consistentes con el estilo Material (planos, outline, o solid) basados en jerarquía semántica (ej. `button`, `button[type="submit"]`).
5.  **Centralización:** El 100% de este estilo debe residir en el archivo global `theme.css` (importado en `index.css`).

**Flujo de Implementación:**
*   Aterrizar estas reglas en un `CSS_DIRECTIVE.md` en el directorio `info/`.
*   Generar `front/src/theme.css`.
*   Ajustar el scaffolding del Frontend (App.jsx y CatalogCard.jsx) para eliminar cualquier clase tipo utility/Tailwind generada anteriormente y depender puramente de HTML semántico.
