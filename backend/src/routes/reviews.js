const express = require('express');
const router = express.Router();
const {
    getReviews,
    createReview
} = require('../controllers/reviewsController');

// Public: daftar review
router.get('/', getReviews);

// Public: kirim review
router.post('/', createReview);

module.exports = router;