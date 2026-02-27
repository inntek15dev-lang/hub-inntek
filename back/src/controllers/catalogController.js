const db = require('../config/db');

// GET /api/catalog
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, c.nombre AS categoria_nombre
            FROM elementos_catalogo e
            LEFT JOIN categorias c ON e.categoria_id = c.id
            WHERE e.is_active = true
            ORDER BY e.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/catalog/:id
exports.getById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, c.nombre AS categoria_nombre
            FROM elementos_catalogo e
            LEFT JOIN categorias c ON e.categoria_id = c.id
            WHERE e.id = ? AND e.is_active = true
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Elemento no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/catalog
exports.create = async (req, res) => {
    try {
        const { titulo, detalle, tipo_producto, url_sitio, url_documentacion, imagen_url, categoria_id } = req.body;
        if (!titulo) return res.status(400).json({ error: 'El título es requerido' });

        const [result] = await db.query(
            `INSERT INTO elementos_catalogo 
             (titulo, detalle, tipo_producto, url_sitio, url_documentacion, imagen_url, categoria_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [titulo, detalle || null, tipo_producto || null, url_sitio || null, url_documentacion || null, imagen_url || null, categoria_id || null]
        );
        res.status(201).json({ id: result.insertId, titulo, detalle, tipo_producto, url_sitio, url_documentacion, imagen_url, categoria_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/catalog/:id
exports.update = async (req, res) => {
    try {
        const { titulo, detalle, tipo_producto, url_sitio, url_documentacion, imagen_url, categoria_id } = req.body;
        if (!titulo) return res.status(400).json({ error: 'El título es requerido' });

        const [result] = await db.query(
            `UPDATE elementos_catalogo SET 
             titulo = ?, detalle = ?, tipo_producto = ?, url_sitio = ?, 
             url_documentacion = ?, imagen_url = ?, categoria_id = ?
             WHERE id = ?`,
            [titulo, detalle || null, tipo_producto || null, url_sitio || null, url_documentacion || null, imagen_url || null, categoria_id || null, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Elemento no encontrado' });
        res.json({ id: parseInt(req.params.id), titulo, detalle, tipo_producto, url_sitio, url_documentacion, imagen_url, categoria_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/catalog/:id (soft delete)
exports.remove = async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE elementos_catalogo SET is_active = false WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Elemento no encontrado' });
        res.json({ message: 'Elemento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
