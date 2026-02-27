const db = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        // const [rows] = await db.query('SELECT * FROM ElementosCatalogo WHERE is_active = true');
        res.json({ message: 'Catalog List (Scaffold)' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        // const [rows] = await db.query('SELECT * FROM ElementosCatalogo WHERE id = ?', [req.params.id]);
        res.json({ message: 'Catalog Item (Scaffold)', id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
