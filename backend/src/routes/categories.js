const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getCategories } = require('../controllers/categoriesController');

// Semua route pakai auth
router.use(authMiddleware);

// ✅ HANYA SATU ROUTE
router.get('/', getCategories);


module.exports = router;