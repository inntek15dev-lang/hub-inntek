const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

/**
 * @swagger
 * /api/catalog:
 *   get:
 *     description: Obtener catálogo público
 */
router.get('/catalog', catalogController.getAll);

/**
 * @swagger
 * /api/catalog/{id}:
 *   get:
 *     description: Detalle de elemento
 */
router.get('/catalog/:id', catalogController.getById);

// Admin Routes would go here (protected by auth middleware)
// router.post('/catalog', auth, catalogController.create);
// router.put('/catalog/:id', auth, catalogController.update);
// router.delete('/catalog/:id', auth, catalogController.delete);

module.exports = router;
