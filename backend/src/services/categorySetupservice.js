const pool = require("../config/db");

async function seedDefaultCategories(tenant_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Ambil account income & expense
        const [incomeAccount] = await connection.query(
            "SELECT id FROM accounts WHERE tenant_id = ? AND type = 'income' LIMIT 1",
            [tenant_id]
        );

        const [expenseAccount] = await connection.query(
            "SELECT id FROM accounts WHERE tenant_id = ? AND type = 'expense' LIMIT 1",
            [tenant_id]
        );

        if (incomeAccount.length === 0 || expenseAccount.length === 0) {
            throw new Error("Account income atau expense tidak ditemukan");
        }

        const income_id = incomeAccount[0].id;
        const expense_id = expenseAccount[0].id;

        // Insert kategori default
        await connection.query(
            `INSERT INTO categories (tenant_id, name, type, account_id)
             VALUES 
             (?, 'Penjualan', 'income', ?),
             (?, 'Pendapatan Lainnya', 'income', ?),
             (?, 'Biaya Operasional', 'expense', ?),
             (?, 'Biaya Lainnya', 'expense', ?)`,
            [
                tenant_id, income_id,
                tenant_id, income_id,
                tenant_id, expense_id,
                tenant_id, expense_id
            ]
        );

        await connection.commit();

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = { seedDefaultCategories };