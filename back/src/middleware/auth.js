/**
 * Auth Middleware — JWT validation + Privilege-based access control
 * IEEE Trace: privilegios-engine | Backend Middleware
 */
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Authenticate: Validates JWT, loads user + privileges, attaches canRead/canWrite/canExec to req.user
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Load user
        const [users] = await db.query(
            'SELECT id, nombre, email, rol_id FROM usuarios WHERE id = ? AND is_active = true',
            [decoded.userId]
        );
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no válido' });
        }

        // Load privileges
        const [privileges] = await db.query(
            'SELECT ref_modulo, `read`, `write`, excec FROM privilegios WHERE rol_id = ?',
            [users[0].rol_id]
        );

        // Attach capability methods
        const user = users[0];
        const hasPrivilege = (moduleName, action) => {
            const wildcard = privileges.find(p => p.ref_modulo === '*');
            if (wildcard && wildcard[action]) return true;
            const priv = privileges.find(p => p.ref_modulo === moduleName);
            return priv?.[action] === 1 || priv?.[action] === true;
        };

        user.canRead = (mod) => hasPrivilege(mod, 'read');
        user.canWrite = (mod) => hasPrivilege(mod, 'write');
        user.canExec = (mod) => hasPrivilege(mod, 'excec');
        user.privileges = privileges;

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};

/**
 * Optional Auth: Same as authenticate but doesn't block unauthenticated requests.
 * If token exists and is valid, attaches user. Otherwise, continues without user.
 */
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // No token — continue as public
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [users] = await db.query(
            'SELECT id, nombre, email, rol_id FROM usuarios WHERE id = ? AND is_active = true',
            [decoded.userId]
        );

        if (users.length > 0) {
            const [privileges] = await db.query(
                'SELECT ref_modulo, `read`, `write`, excec FROM privilegios WHERE rol_id = ?',
                [users[0].rol_id]
            );

            const user = users[0];
            const hasPrivilege = (moduleName, action) => {
                const wildcard = privileges.find(p => p.ref_modulo === '*');
                if (wildcard && wildcard[action]) return true;
                const priv = privileges.find(p => p.ref_modulo === moduleName);
                return priv?.[action] === 1 || priv?.[action] === true;
            };

            user.canRead = (mod) => hasPrivilege(mod, 'read');
            user.canWrite = (mod) => hasPrivilege(mod, 'write');
            user.canExec = (mod) => hasPrivilege(mod, 'excec');
            user.privileges = privileges;
            req.user = user;
        }
    } catch (err) {
        // Invalid token — continue as public
    }
    next();
};

/**
 * requirePrivilege: Middleware that checks if user has a specific privilege on a module.
 * Must be used AFTER authenticate middleware.
 */
const requirePrivilege = (moduleName, action = 'read') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        }

        const checkFn = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;
        const hasAccess = req.user[checkFn]?.(moduleName);

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Falta privilegio ${action} para ${moduleName}.`
            });
        }
        next();
    };
};

module.exports = { authenticate, optionalAuth, requirePrivilege };
