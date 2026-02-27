const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const { authenticate, requirePrivilege } = require('../middleware/auth');

// ── Auth (Public) ──────────────────────────────────────────────────────
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.me);

// ── Categories ─────────────────────────────────────────────────────────
router.get('/categories', categoryController.getAll);           // Public
router.get('/categories/:id', categoryController.getById);      // Public
router.post('/categories', authenticate, requirePrivilege('Categorias', 'write'), categoryController.create);
router.put('/categories/:id', authenticate, requirePrivilege('Categorias', 'write'), categoryController.update);
router.delete('/categories/:id', authenticate, requirePrivilege('Categorias', 'write'), categoryController.remove);

// ── Catalog Elements ───────────────────────────────────────────────────
router.get('/catalog', catalogController.getAll);               // Public
router.get('/catalog/:id', catalogController.getById);          // Public
router.post('/catalog', authenticate, requirePrivilege('Catalogo', 'write'), catalogController.create);
router.put('/catalog/:id', authenticate, requirePrivilege('Catalogo', 'write'), catalogController.update);
router.delete('/catalog/:id', authenticate, requirePrivilege('Catalogo', 'write'), catalogController.remove);

module.exports = router;
