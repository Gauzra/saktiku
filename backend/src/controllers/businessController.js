const db = require('../config/db');

// =============================================
// GET BUSINESS TYPES
// =============================================
const getBusinessTypes = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, description FROM business_types ORDER BY id'
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error('Get business types error:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data jenis usaha'
        });
    }
};

// =============================================
// SETUP USER BUSINESS
// =============================================
const setupUserBusiness = async (req, res) => {
    const { business_type_id } = req.body;
    const tenant_id = req.user.tenant_id;

    if (!business_type_id) {
        return res.status(400).json({
            success: false,
            message: 'Pilih jenis usaha terlebih dahulu'
        });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Update tenant dengan business_type_id
        await connection.execute(
            'UPDATE tenants SET business_type_id = ? WHERE id = ?',
            [business_type_id, tenant_id]
        );

        // 2. Ambil template kategori untuk business type ini
        const [categories] = await connection.execute(
            `SELECT * FROM business_type_categories 
             WHERE business_type_id = ? 
             ORDER BY sort_order`,
            [business_type_id]
        );

        // 3. Insert kategori ke tabel categories
        for (let cat of categories) {
            // Cari id account berdasarkan kode debit
            const [debitAccount] = await connection.execute(
                'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
                [cat.debit_account_code, tenant_id]
            );

            // Cari id account berdasarkan kode kredit
            const [creditAccount] = await connection.execute(
                'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
                [cat.credit_account_code, tenant_id]
            );

            // Validasi account ditemukan
            if (debitAccount.length === 0 || creditAccount.length === 0) {
                throw new Error(`Account not found for category: ${cat.category_name}`);
            }

            // Insert kategori
            await connection.execute(
                `INSERT INTO categories 
                (tenant_id, name, type, debit_account_id, credit_account_id, is_active, is_default, created_at) 
                VALUES (?, ?, ?, ?, ?, 1, ?, NOW())`,
                [
                    tenant_id,
                    cat.category_name,
                    cat.category_type,
                    debitAccount[0].id,
                    creditAccount[0].id,
                    cat.is_default
                ]
            );
        }

        await connection.commit();

        res.json({
            success: true,
            message: 'Setup usaha berhasil',
            data: {
                business_type_id
            }
        });

    } catch (err) {
        await connection.rollback();
        console.error('Setup business error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Gagal setup usaha'
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getBusinessTypes,
    setupUserBusiness
};