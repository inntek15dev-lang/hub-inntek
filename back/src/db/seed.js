/**
 * Seed script — Creates auth tables, roles, privileges, admin user, and catalog data.
 * Usage: node src/db/seed.js
 * IEEE Trace: privilegios-engine | Seed Script
 */
const db = require('../config/db');
const bcrypt = require('bcryptjs');

(async () => {
    try {
        await db.query('SELECT 1');
        console.log('✓ Connected to Aiven MySQL');

        // ── Auth Tables ────────────────────────────────────────────────
        console.log('\n── Creating auth tables...');

        await db.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                descripcion TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('✓ roles table ready');

        await db.query(`
            CREATE TABLE IF NOT EXISTS privilegios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                rol_id INT NOT NULL,
                ref_modulo VARCHAR(100) NOT NULL,
                \`read\` BOOLEAN DEFAULT FALSE,
                \`write\` BOOLEAN DEFAULT FALSE,
                excec BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
                UNIQUE KEY uq_rol_modulo (rol_id, ref_modulo)
            ) ENGINE=InnoDB
        `);
        console.log('✓ privilegios table ready');

        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                email VARCHAR(200) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                rol_id INT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL
            ) ENGINE=InnoDB
        `);
        console.log('✓ usuarios table ready');

        // ── Catalog Tables (ensure exist) ──────────────────────────────
        console.log('\n── Ensuring catalog tables...');

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

        // ── Seed Roles ─────────────────────────────────────────────────
        console.log('\n── Seeding roles...');
        const [existingRoles] = await db.query('SELECT COUNT(*) as c FROM roles');
        if (existingRoles[0].c === 0) {
            await db.query(`INSERT INTO roles (nombre, descripcion) VALUES
                ('SuperAdmin', 'Administrador con acceso total al sistema'),
                ('Viewer', 'Usuario con acceso de solo lectura')
            `);
            console.log('✓ Roles seeded: SuperAdmin, Viewer');
        } else {
            console.log('⚡ Roles already exist, skipping');
        }

        // ── Seed Privileges ────────────────────────────────────────────
        console.log('\n── Seeding privileges...');
        const [existingPrivs] = await db.query('SELECT COUNT(*) as c FROM privilegios');
        if (existingPrivs[0].c === 0) {
            // Get role IDs
            const [roles] = await db.query('SELECT id, nombre FROM roles');
            const superAdminId = roles.find(r => r.nombre === 'SuperAdmin')?.id;
            const viewerId = roles.find(r => r.nombre === 'Viewer')?.id;

            if (superAdminId) {
                // SuperAdmin: wildcard access to everything
                await db.query(`INSERT INTO privilegios (rol_id, ref_modulo, \`read\`, \`write\`, excec) VALUES
                    (?, '*', TRUE, TRUE, TRUE)
                `, [superAdminId]);
                console.log('✓ SuperAdmin wildcard privilege set');
            }

            if (viewerId) {
                // Viewer: read-only on catalog and categories
                await db.query(`INSERT INTO privilegios (rol_id, ref_modulo, \`read\`, \`write\`, excec) VALUES
                    (?, 'Catalogo', TRUE, FALSE, FALSE),
                    (?, 'Categorias', TRUE, FALSE, FALSE)
                `, [viewerId, viewerId]);
                console.log('✓ Viewer read-only privileges set');
            }
        } else {
            console.log('⚡ Privileges already exist, skipping');
        }

        // ── Seed Admin User ────────────────────────────────────────────
        console.log('\n── Seeding admin user...');
        const [existingUsers] = await db.query('SELECT COUNT(*) as c FROM usuarios');
        if (existingUsers[0].c === 0) {
            const [roles] = await db.query('SELECT id FROM roles WHERE nombre = ?', ['SuperAdmin']);
            const hash = await bcrypt.hash('Inntek2026!', 12);
            await db.query(
                'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, ?)',
                ['Inntek Admin', 'admin@inntek.dev', hash, roles[0].id]
            );
            console.log('✓ Admin user created: admin@inntek.dev / Inntek2026!');
        } else {
            console.log('⚡ Users already exist, skipping');
        }

        // ── Seed Catalog Data ──────────────────────────────────────────
        console.log('\n── Seeding catalog data...');
        const [existingCats] = await db.query('SELECT COUNT(*) as c FROM categorias');
        if (existingCats[0].c === 0) {
            await db.query(`INSERT INTO categorias (nombre, descripcion) VALUES
                ('Software', 'Soluciones de software y plataformas digitales'),
                ('Infraestructura', 'Servicios de infraestructura y cloud'),
                ('Consultoría', 'Servicios de consultoría tecnológica')
            `);

            await db.query(`INSERT INTO elementos_catalogo (titulo, detalle, tipo_producto, url_sitio, url_documentacion, categoria_id) VALUES
                ('Dashboard OIM', 'Consola de gestión logística.', 'MVP', 'https://demo.inntek.dev', '#', 1),
                ('Monitor SLA', 'Monitoreo de Service Level Agreements en tiempo real.', 'Demo', '#', '#', 1),
                ('Reportes Finanzas', 'Módulo de reportería financiera para pruebas de usuario.', 'UAT', '#', '#', 1),
                ('Control de Flota', 'Sistema de rastreo de vehículos.', 'MVP', 'https://flota.inntek.dev', '#', 2),
                ('Gestor Documental', 'Almacenamiento y categorización de documentos ISO.', 'Producción', '#', '#', 1)
            `);
            console.log('✓ Catalog data seeded (3 categories, 5 elements)');
        } else {
            console.log('⚡ Catalog data already exists, skipping');
        }

        // ── Verify ─────────────────────────────────────────────────────
        console.log('\n── Verification ──');
        const [tables] = await db.query('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));
        const [userCount] = await db.query('SELECT COUNT(*) as c FROM usuarios');
        console.log('Users:', userCount[0].c);
        const [privCount] = await db.query('SELECT COUNT(*) as c FROM privilegios');
        console.log('Privileges:', privCount[0].c);

        console.log('\n✓ Seed complete!');
        process.exit(0);
    } catch (e) {
        console.error('✗ Error:', e.message);
        process.exit(1);
    }
})();
