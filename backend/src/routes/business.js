const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
    getBusinessTypes,
    setupUserBusiness,
    getUmkmCount
} = require('../controllers/businessController');

// GET daftar jenis usaha untuk modal (Public access)
router.get('/types', getBusinessTypes);

// GET jumlah UMKM terdaftar (Public access)
router.get('/stats/umkm-count', getUmkmCount);

// Semua route di bawah ini pakai auth
router.use(authMiddleware);

// POST setup usaha user
router.post('/setup', setupUserBusiness);

module.exports = router;