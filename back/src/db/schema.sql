-- ==========================================================================
-- Hub Inntek Catalog — Database Schema (PARKO Protocol)
-- ==========================================================================

-- Aiven managed database: hub-inntek-db
-- CREATE DATABASE is not needed — Aiven creates it automatically.

-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Elementos del Catálogo
CREATE TABLE IF NOT EXISTS elementos_catalogo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    detalle TEXT,
    tipo_producto VARCHAR(50),
    url_sitio VARCHAR(500),
    url_documentacion VARCHAR(500),
    imagen_url VARCHAR(500),
    categoria_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Seed: Categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Software', 'Soluciones de software y plataformas digitales'),
    ('Infraestructura', 'Servicios de infraestructura y cloud'),
    ('Consultoría', 'Servicios de consultoría tecnológica');

-- Seed: Elementos iniciales
INSERT INTO elementos_catalogo (titulo, detalle, tipo_producto, url_sitio, url_documentacion, categoria_id) VALUES
    ('Dashboard OIM', 'Consola de gestión logística.', 'MVP', 'https://demo.inntek.dev', '#', 1),
    ('Monitor SLA', 'Monitoreo de Service Level Agreements en tiempo real.', 'Demo', '#', '#', 1),
    ('Reportes Finanzas', 'Módulo de reportería financiera para pruebas de usuario.', 'UAT', '#', '#', 1),
    ('Control de Flota', 'Sistema de rastreo de vehículos.', 'MVP', 'https://flota.inntek.dev', '#', 2),
    ('Gestor Documental', 'Almacenamiento y categorización de documentos ISO.', 'Producción', '#', '#', 1);
