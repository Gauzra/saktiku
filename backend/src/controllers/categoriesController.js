const db = require('../config/db');

// GET /api/categories → list kategori berdasarkan jenis usaha tenant
const getCategories = async (req, res) => {
    try {
        // Ambil business_type_id dari tenant
        const [tenant] = await db.execute(
            'SELECT business_type_id FROM tenants WHERE id = ?',
            [req.user.tenant_id]
        );

        const business_type_id = tenant[0]?.business_type_id;

        if (!business_type_id) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Ambil dari business_type_categories
        // Kita tambahkan filter is_adjustment. Defaultnya 0 (transaksi harian).
        const is_adjustment = req.query.is_adjustment || 0;

        const [rows] = await db.execute(`
            SELECT 
                id,
                category_name AS name,
                category_type AS type,
                debit_account_code,
                credit_account_code,
                is_adjustment
            FROM business_type_categories 
            WHERE business_type_id = ? AND is_adjustment = ?
            ORDER BY sort_order
        `, [business_type_id, is_adjustment]);

        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// Ekspor hanya getCategories (karena create, update, delete dihapus)
module.exports = {
    getCategories
};