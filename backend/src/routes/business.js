const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
    getBusinessTypes,
    setupUserBusiness
} = require('../controllers/businessController');

// GET daftar jenis usaha untuk modal (Public access)
router.get('/types', getBusinessTypes);

// Semua route di bawah ini pakai auth
router.use(authMiddleware);

// POST setup usaha user
router.post('/setup', setupUserBusiness);

module.exports = router;