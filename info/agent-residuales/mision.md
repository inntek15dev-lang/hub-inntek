# MISIÓN: Catálogo Gestionado PARKO

**UUID:** hub-inntek-2026-02-27-10-00
**Descripción General:**
El sistema será un catálogo gestionado de elementos que se presentarán en formato de tarjetas.

**Especificaciones de Tarjeta:**
- Título
- Detalle
- Imagen / Icono / Logo
- Tipo de producto
- Set de iconos
- Categorías de usabilidad: operativo, documental, control, descargas, reportes, multimedia, personas, vehículos, sucursales, etc.
- Botones de acción: "editar elemento", "ver documentación", "Ir al Sitio"

**Módulos Requeridos:**
1. **CRUD de Gestión de Elementos del Catálogo** (Admin inntek)
2. **Catálogo Público** (Acceso público)
3. **Home Público** (Integración del componente catálogo)
4. **Módulo de Configuración General** (Gestionar contenido del home, metadata del sitio y datos utilitarios transversales)

**Especificaciones Técnicas (Metadata):**
- **Versión Estándar:** IEEE 12207:2017
- **Criticidad:** ALTA - Catálogo gestionado de acceso a MVPs, Demos, y UAT pre-prod
- **Motor BD:** MySQL 8.0+ (InnoDB) con integración aiven
- **Backend:** Node.js + Express (REST API Stateless)
- **Frontend:** React + Vite (SPA)
- **Autenticación:** JWT (RS256)
- **Puerto API:** 4010
- **Puerto Frontend:** 5177
