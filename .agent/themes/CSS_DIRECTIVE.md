# DIRECTIVA DE ESTILOS GLOBALES FRONTEND (CSS DIRECTIVE)

**STATUS: MANDATORIO**

## Filosofía Principal: HTML Semántico + CSS Jerárquico

Todo desarrollo de UI en este proyecto debe suscribirse incondicionalmente a esta directiva. El objetivo es mantener un código HTML (React JSX) extremadamente limpio, legible y escalable, centralizando toda la inteligencia visual en un único origen global inspirado en la limpieza técnica de la Consola de Google.

## Reglas de Oro

1. **PROHIBICIÓN DE CLASES DE UTILIDAD:** Está TERMINANTEMENTE PROHIBIDO usar clases tipo TailwindCSS (ej. `class="mt-4 flex bg-blue-500"`).
2. **PROHIBICIÓN DE CLASES ESPECÍFICAS DE VISTA:** No crees clases "a medida" para un componente específico (ej. `class="boton-guardar-registro"`).
3. **HTML COMO ESTRUCTURA, CSS COMO DISEÑO:** Escribe el JSX utilizando etiquetas HTML estándar y semánticas (`<article>`, `<section>`, `<nav>`, `<aside>`, `<main>`, `<header>`, `<footer>`, `<b>`, `<i>`, `<mark>`, `<details>`, `<summary>`).
4. **ESTILIZACIÓN POR CASCADA/JERARQUÍA:** El archivo `theme.css` global capturará el renderizado de estas etiquetas. Si un `<button>` está dentro de un `<nav>`, la regla CSS `nav button {}` definirá su aspecto en ese contexto.

## Variables de Tema Activas (`:root`)
El sistema utiliza variables CSS para asegurar coherencia en:
- Tipografía (System fonts)
- Paleta de Colores (Blancos, grises, azules Google, etc.)
- Espaciado (Padding, margin)
- Bordes (Radius, sombras)
- Transiciones

## Ejemplo React JSX (Correcto vs Incorrecto)

### INCORRECTO (Prohibido)
```jsx
<div className="card shadow-lg bg-gray-100 p-6 flex flex-col">
    <span className="text-xl font-bold title-text">Titulo</span>
    <button className="btn-primary custom-margin">Click</button>
</div>
```

### CORRECTO (Obligatorio)
```jsx
<article>
    <h2>Titulo</h2>
    <button>Click</button>
</article>
```

(El archivo `theme.css` global se encargará automáticamente de que cada `<article>` parezca una card y cada `<h2>` dentro de un `<article>` tenga el formato correcto).
