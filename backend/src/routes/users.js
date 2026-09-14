// routes/users.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/userController');

// GET /api/users/profile - Ambil profile user
router.get('/profile', authMiddleware, userController.getProfile);

// PUT /api/users/profile - Update profile user & tenant
router.put('/profile', authMiddleware, userController.updateProfile);

// PUT /api/users/avatar - Update avatar (Upload file)
router.put('/avatar', authMiddleware, userController.upload.single('avatar'), userController.updateAvatar);

module.exports = router;