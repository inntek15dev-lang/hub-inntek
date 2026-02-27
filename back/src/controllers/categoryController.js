const db = require('../config/db');

// GET /api/categories
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM categorias WHERE is_active = true ORDER BY nombre ASC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/categories/:id
exports.getById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM categorias WHERE id = ? AND is_active = true',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/categories
exports.create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

        const [result] = await db.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/categories/:id
exports.update = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

        const [result] = await db.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion || null, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ id: parseInt(req.params.id), nombre, descripcion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/categories/:id (soft delete)
exports.remove = async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE categorias SET is_active = false WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
