const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const categoryController = require('../controllers/categoryController');

// ── Categories ─────────────────────────────────────────────────────────
router.get('/categories', categoryController.getAll);
router.get('/categories/:id', categoryController.getById);
router.post('/categories', categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.remove);

// ── Catalog Elements ───────────────────────────────────────────────────
router.get('/catalog', catalogController.getAll);
router.get('/catalog/:id', catalogController.getById);
router.post('/catalog', catalogController.create);
router.put('/catalog/:id', catalogController.update);
router.delete('/catalog/:id', catalogController.remove);

module.exports = router;
