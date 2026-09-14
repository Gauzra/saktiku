const db = require('../config/db');

// =============================================
// GET REVIEWS (PUBLIC)
// =============================================
const getReviews = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, name, role, rating, review, created_at
             FROM reviews
             WHERE is_approved = 1 AND deleted_at IS NULL
             ORDER BY created_at DESC
             LIMIT 50`
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Get reviews error:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil review' });
    }
};

// =============================================
// CREATE REVIEW (PUBLIC)
// =============================================
const createReview = async (req, res) => {
    const { name, role, rating, review } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Nama wajib diisi' });
    }
    if (!review || !review.trim()) {
        return res.status(400).json({ success: false, message: 'Isi review terlebih dahulu' });
    }

    const cleanName = name.trim().slice(0, 255);
    const cleanRole = (role || '').trim().slice(0, 255) || null;
    const cleanReview = review.trim();
    const cleanRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    try {
        const [result] = await db.execute(
            `INSERT INTO reviews (name, role, rating, review, is_approved)
             VALUES (?, ?, ?, ?, 1)`,
            [cleanName, cleanRole, cleanRating, cleanReview]
        );

        const [rows] = await db.execute(
            `SELECT id, name, role, rating, review, created_at
             FROM reviews WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Review berhasil dikirim. Terima kasih!',
            data: rows[0]
        });
    } catch (err) {
        console.error('Create review error:', err);
        res.status(500).json({ success: false, message: 'Gagal menyimpan review' });
    }
};

module.exports = {
    getReviews,
    createReview
};