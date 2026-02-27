/**
 * Schema runner — Executes schema.sql statements individually against Aiven MySQL.
 * Usage: node src/db/run-schema.js
 */
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        // Test connection
        await db.query('SELECT 1');
        console.log('✓ Connected to Aiven MySQL');

        // Create categorias table
        console.log('Creating categorias table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('✓ categorias table ready');

        // Create elementos_catalogo table
        console.log('Creating elementos_catalogo table...');
        await db.query(`
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
            ) ENGINE=InnoDB
        `);
        console.log('✓ elementos_catalogo table ready');

        // Seed data — only if empty
        const [cats] = await db.query('SELECT COUNT(*) as c FROM categorias');
        if (cats[0].c === 0) {
            console.log('Seeding categorias...');
            await db.query(`INSERT INTO categorias (nombre, descripcion) VALUES
                ('Software', 'Soluciones de software y plataformas digitales'),
                ('Infraestructura', 'Servicios de infraestructura y cloud'),
                ('Consultoría', 'Servicios de consultoría tecnológica')
            `);
            console.log('✓ categorias seeded');

            console.log('Seeding elementos_catalogo...');
            await db.query(`INSERT INTO elementos_catalogo (titulo, detalle, tipo_producto, url_sitio, url_documentacion, categoria_id) VALUES
                ('Dashboard OIM', 'Consola de gestión logística.', 'MVP', 'https://demo.inntek.dev', '#', 1),
                ('Monitor SLA', 'Monitoreo de Service Level Agreements en tiempo real.', 'Demo', '#', '#', 1),
                ('Reportes Finanzas', 'Módulo de reportería financiera para pruebas de usuario.', 'UAT', '#', '#', 1),
                ('Control de Flota', 'Sistema de rastreo de vehículos.', 'MVP', 'https://flota.inntek.dev', '#', 2),
                ('Gestor Documental', 'Almacenamiento y categorización de documentos ISO.', 'Producción', '#', '#', 1)
            `);
            console.log('✓ elementos_catalogo seeded');
        } else {
            console.log('⚡ Tables already have data, skipping seed');
        }

        // Verify
        const [tables] = await db.query('SHOW TABLES');
        console.log('\nTables:', tables.map(t => Object.values(t)[0]).join(', '));

        const [items] = await db.query('SELECT id, titulo, tipo_producto FROM elementos_catalogo');
        console.log('Catalog items:', items.length);
        items.forEach(i => console.log(`  - [${i.id}] ${i.titulo} (${i.tipo_producto})`));

        console.log('\n✓ Schema setup complete!');
        process.exit(0);
    } catch (e) {
        console.error('✗ Error:', e.message);
        process.exit(1);
    }
})();
