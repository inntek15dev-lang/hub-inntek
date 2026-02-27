/**
 * Auth Controller — Login + Me endpoints
 * IEEE Trace: privilegios-engine | Auth Controller
 */
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
        }

        // Find user
        const [users] = await db.query(
            `SELECT u.*, r.nombre as rol_nombre 
             FROM usuarios u 
             LEFT JOIN roles r ON u.rol_id = r.id 
             WHERE u.email = ? AND u.is_active = true`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Load privileges
        const [privileges] = await db.query(
            'SELECT ref_modulo, `read`, `write`, excec FROM privilegios WHERE rol_id = ?',
            [user.rol_id]
        );

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, rolId: user.rol_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol_nombre
                },
                token,
                privileges
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/auth/me
exports.me = async (req, res) => {
    try {
        const [roles] = await db.query('SELECT nombre FROM roles WHERE id = ?', [req.user.rol_id]);
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    nombre: req.user.nombre,
                    email: req.user.email,
                    rol: roles[0]?.nombre
                },
                privileges: req.user.privileges
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
