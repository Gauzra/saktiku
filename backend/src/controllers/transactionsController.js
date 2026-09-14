const pool = require("../config/db");
const { createJournalEntry } = require("../services/accounting.service");
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// Klasifikasi dashboard / daftar transaksi: berdasarkan kode akun di jurnal (bukan tipe transaksi).
// Urutan pengecekan penting: kasus khusus (Prive, Retur, Modal) dicek SEBELUM kasus umum (Pemasukan/Pengeluaran).
const TRANSACTION_DASHBOARD_FLOW_SQL = `
  CASE
    -- 1. Pemasukan Modal: Debit Kas (1101) & Kredit Modal (3101)
    WHEN EXISTS (
      SELECT 1 FROM journal_entries je_d
      INNER JOIN accounts ax_d ON je_d.account_id = ax_d.id
      WHERE je_d.transaction_id = t.id AND je_d.tenant_id = t.tenant_id
        AND ax_d.code = '1101' AND je_d.debit > 0
    ) AND EXISTS (
      SELECT 1 FROM journal_entries je_c
      INNER JOIN accounts ax_c ON je_c.account_id = ax_c.id
      WHERE je_c.transaction_id = t.id AND je_c.tenant_id = t.tenant_id
        AND ax_c.code = '3101' AND je_c.credit > 0
    ) THEN 'capital_in'

    -- 2. Prive: Debit Prive (3301) & Kredit Kas (1101)
    WHEN EXISTS (
      SELECT 1 FROM journal_entries je_d
      INNER JOIN accounts ax_d ON je_d.account_id = ax_d.id
      WHERE je_d.transaction_id = t.id AND je_d.tenant_id = t.tenant_id
        AND ax_d.code = '3301' AND je_d.debit > 0
    ) AND EXISTS (
      SELECT 1 FROM journal_entries je_c
      INNER JOIN accounts ax_c ON je_c.account_id = ax_c.id
      WHERE je_c.transaction_id = t.id AND je_c.tenant_id = t.tenant_id
        AND ax_c.code = '1101' AND je_c.credit > 0
    ) THEN 'prive'

    -- 3. Retur Penjualan: Debit akun Income & Kredit Kas (1101)
    WHEN EXISTS (
      SELECT 1 FROM journal_entries je_d
      INNER JOIN accounts ax_d ON je_d.account_id = ax_d.id
      WHERE je_d.transaction_id = t.id AND je_d.tenant_id = t.tenant_id
        AND ax_d.type = 'income' AND je_d.debit > 0
    ) AND EXISTS (
      SELECT 1 FROM journal_entries je_c
      INNER JOIN accounts ax_c ON je_c.account_id = ax_c.id
      WHERE je_c.transaction_id = t.id AND je_c.tenant_id = t.tenant_id
        AND ax_c.code = '1101' AND je_c.credit > 0
    ) THEN 'sales_return'

    -- 4. Retur Pembelian: Debit Utang Usaha (2101) & Kredit Persediaan (1401/1402)
    WHEN EXISTS (
      SELECT 1 FROM journal_entries je_d
      INNER JOIN accounts ax_d ON je_d.account_id = ax_d.id
      WHERE je_d.transaction_id = t.id AND je_d.tenant_id = t.tenant_id
        AND ax_d.code = '2101' AND je_d.debit > 0
    ) AND EXISTS (
      SELECT 1 FROM journal_entries je_c
      INNER JOIN accounts ax_c ON je_c.account_id = ax_c.id
      WHERE je_c.transaction_id = t.id AND je_c.tenant_id = t.tenant_id
        AND (ax_c.code LIKE '14%') AND je_c.credit > 0
    ) THEN 'purchase_return'

    -- 5. Pemasukan: Debit Kas (1101)
    WHEN EXISTS (
      SELECT 1 FROM journal_entries je_d
      INNER JOIN accounts ax_d ON je_d.account_id = ax_d.id
      WHERE je_d.transaction_id = t.id AND je_d.tenant_id = t.tenant_id
        AND ax_d.code = '1101' AND je_d.debit > 0
    ) THEN 'income'

    -- 6. Pengeluaran: Kredit Kas (1101)
    WHEN EXISTS (
      SELECT 1 FROM journal_entries je_c
      INNER JOIN accounts ax_c ON je_c.account_id = ax_c.id
      WHERE je_c.transaction_id = t.id AND je_c.tenant_id = t.tenant_id
        AND ax_c.code = '1101' AND je_c.credit > 0
    ) THEN 'expense'

    -- 7. Non Kas: tidak ada pergerakan Kas (1101)
    ELSE 'non_cash'
  END
`;


const OPENING_ALLOWED_ACCOUNT_TYPES = ["asset", "liability", "equity"];

function pickPreferredAccount(rows, options = {}) {
    if (!rows || rows.length === 0) return null;
    const { preferredKeywords = [] } = options;
    if (preferredKeywords.length === 0) return rows[0];
    const loweredKeywords = preferredKeywords.map((k) => String(k).toLowerCase());
    return (
        rows.find((r) =>
            loweredKeywords.some((k) => String(r.name || "").toLowerCase().includes(k))
        ) || rows[0]
    );
}

async function resolveContraAccount(connection, tenant_id, side) {
    // Untuk saldo awal (baik debit maupun kredit), akun lawan yang paling tepat adalah EKUITAS (Modal).
    // Ini agar tidak memengaruhi saldo Kas/Bank secara tidak sengaja saat input utang.
    const [equityRows] = await connection.query(
        "SELECT id, name, code FROM accounts WHERE tenant_id = ? AND type = 'equity' ORDER BY (code = '3999') DESC, is_system DESC, id ASC",
        [tenant_id]
    );

    const pickedEquity = pickPreferredAccount(equityRows, {
        preferredKeywords: ["saldo penyeimbang", "opening balance", "modal", "capital", "ekuitas"],
    });

    if (!pickedEquity) {
        throw new Error("Akun ekuitas (modal) belum tersedia untuk menjadi akun lawan saldo awal. Silakan buat akun modal terlebih dahulu.");
    }

    return pickedEquity.id;
}

// =============================================
// OPENING BALANCE ACCOUNTS (DROPDOWN SOURCE)
// =============================================
async function getOpeningBalanceAccounts(req, res) {
    const tenant_id = req.user.tenant_id;
    try {
        const [rows] = await pool.query(
            `
            SELECT id, code, name, type
            FROM accounts
            WHERE tenant_id = ?
              AND type IN ('asset', 'liability', 'equity')
              AND code != '3999'
            ORDER BY type ASC, code ASC, name ASC
            `,
            [tenant_id]
        );

        // Daftar akun akumulasi penyusutan yang harusnya di KREDIT
        const contraAssetCodes = ['1502', '1805', '1806'];

        // Debit: Asset KECUALI akumulasi penyusutan
        const debit = rows.filter((r) =>
            r.type === "asset" && !contraAssetCodes.includes(r.code)
        );

        // Credit: Liability, Equity, DAN akumulasi penyusutan
        const credit = rows.filter((r) =>
            r.type === "liability" ||
            r.type === "equity" ||
            contraAssetCodes.includes(r.code)
        );

        return res.status(200).json({
            success: true,
            data: { debit, credit },
        });
    } catch (err) {
        console.error("GET OPENING BALANCE ACCOUNTS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

// =============================================
// GET OPENING BALANCES (DATA LIST)
// =============================================
async function getOpeningBalances(req, res) {
    const tenant_id = req.user.tenant_id;
    const { business_type_id } = req.query;

    try {
        let query = `
            SELECT 
                ob.id,
                ob.as_of_date,
                ob.side,
                ob.amount,
                ob.description,
                a.code AS account_code,
                a.name AS account_name,
                a.type AS account_type,
                (SELECT t.id FROM transactions t 
                 WHERE t.tenant_id = ob.tenant_id 
                   AND t.type = 'opening_balance' 
                   AND t.amount = ob.amount 
                   AND t.transaction_date = ob.as_of_date
                 LIMIT 1) as transaction_id
            FROM opening_balances ob
            JOIN accounts a ON ob.account_id = a.id
            WHERE ob.tenant_id = ?
        `;

        const params = [tenant_id];

        if (business_type_id) {
            query += ` AND ob.business_type_id = ?`;
            params.push(business_type_id);
        }

        query += ` ORDER BY ob.as_of_date DESC, ob.id DESC`;

        const [rows] = await pool.query(query, params);

        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("GET OPENING BALANCES ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// =============================================
// CREATE OPENING BALANCE
// =============================================
async function createOpeningBalance(req, res) {
    console.log("=== BACKEND CREATE OPENING BALANCE ===");
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);
    const tenant_id = req.user.tenant_id;
    const created_by = req.user.user_id;
    const { business_type_id, account_id, side, amount, as_of_date, description } = req.body;
    console.log("Parsed values:", { tenant_id, business_type_id, account_id, side, amount, as_of_date });
    const connection = await pool.getConnection();

    try {
        if (!business_type_id || !account_id || !side || !amount || !as_of_date) {
            throw new Error("business_type_id, account_id, side, amount, dan as_of_date wajib diisi");
        }
        if (!["debit", "credit"].includes(String(side).toLowerCase())) {
            throw new Error("side harus debit atau credit");
        }

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            throw new Error("amount harus lebih dari 0");
        }

        await connection.beginTransaction();

        const [accountRows] = await connection.query(
            "SELECT id, code, name, type FROM accounts WHERE id = ? AND tenant_id = ?",
            [account_id, tenant_id]
        );
        if (accountRows.length === 0) {
            throw new Error("Akun saldo awal tidak ditemukan");
        }
        const selectedAccount = accountRows[0];
        if (!OPENING_ALLOWED_ACCOUNT_TYPES.includes(selectedAccount.type)) {
            throw new Error("Akun saldo awal hanya boleh dari aset, utang, atau modal");
        }

        const normalizedSide = String(side).toLowerCase();
        const contraAssetCodes = ['1502', '1805', '1806'];
        const isContraAsset = contraAssetCodes.includes(selectedAccount.code) ||
            selectedAccount.name.toLowerCase().includes('akumulasi penyusutan');

        if (normalizedSide === "debit" && selectedAccount.type !== "asset") {
            throw new Error("Pilihan debit hanya boleh akun aset");
        }
        if (normalizedSide === "credit" &&
            !["liability", "equity"].includes(selectedAccount.type) &&
            !isContraAsset) {
            throw new Error("Pilihan kredit hanya boleh akun utang, modal, atau akumulasi penyusutan");
        }

        const [existing] = await connection.query(
            `
            SELECT id
            FROM opening_balances
            WHERE tenant_id = ?
              AND business_type_id = ?
              AND account_id = ?
              AND side = ?
              AND as_of_date = ?
            LIMIT 1
            `,
            [tenant_id, business_type_id, account_id, normalizedSide, as_of_date]
        );
        if (existing.length > 0) {
            throw new Error("Saldo awal untuk akun/sisi/tanggal ini sudah ada");
        }

        const contra_account_id = await resolveContraAccount(connection, tenant_id, normalizedSide);
        const debit_account_id = normalizedSide === "debit" ? account_id : contra_account_id;
        const credit_account_id = normalizedSide === "credit" ? account_id : contra_account_id;

        const [trxResult] = await connection.query(
            `
            INSERT INTO transactions
                (tenant_id, business_type_id, category_id, type, amount, description, transaction_date)
            VALUES (?, ?, NULL, ?, ?, ?, ?)
            `,
            [
                tenant_id,
                business_type_id,
                "opening_balance",
                numericAmount,
                description || `Saldo awal - ${selectedAccount.name}`,
                as_of_date,
            ]
        );
        const transaction_id = trxResult.insertId;

        await createJournalEntry(connection, {
            tenant_id,
            transaction_id,
            debit_account_id,
            credit_account_id,
            amount: numericAmount,
        });

        await connection.query(
            `
            INSERT INTO opening_balances
                (tenant_id, business_type_id, account_id, as_of_date, side, amount, description, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                tenant_id,
                business_type_id,
                account_id,
                as_of_date,
                normalizedSide,
                numericAmount,
                description || null,
                created_by || null,
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Saldo awal berhasil disimpan",
            data: { transaction_id },
        });
    } catch (err) {
        await connection.rollback();
        console.error("CREATE OPENING BALANCE ERROR:", err);
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    } finally {
        connection.release();
    }
}

// =====================================================
// OTOMATIS BUAT MODAL AWAL SETELAH SEMUA SALDO INPUT
// =====================================================
async function ensureEquityBalance(connection, tenant_id, business_type_id, as_of_date, created_by) {
    // Hitung total debit dan credit dari opening_balances
    const [result] = await connection.query(`
        SELECT 
            COALESCE(SUM(CASE WHEN side = 'debit' THEN amount ELSE 0 END), 0) as total_debit,
            COALESCE(SUM(CASE WHEN side = 'credit' THEN amount ELSE 0 END), 0) as total_credit
        FROM opening_balances
        WHERE tenant_id = ? AND business_type_id = ? AND as_of_date = ?
    `, [tenant_id, business_type_id, as_of_date]);

    let totalDebit = parseFloat(result[0].total_debit);
    let totalCredit = parseFloat(result[0].total_credit);
    let selisih = totalDebit - totalCredit;

    if (Math.abs(selisih) < 1) return;

    const [existingEquity] = await connection.query(`
        SELECT ob.id 
        FROM opening_balances ob
        JOIN accounts a ON ob.account_id = a.id
        WHERE ob.tenant_id = ? AND a.type = 'equity' AND ob.as_of_date = ?
    `, [tenant_id, as_of_date]);

    if (existingEquity.length > 0) return;

    const [equityAccount] = await connection.query(`
        SELECT id FROM accounts 
        WHERE tenant_id = ? AND type = 'equity' AND code = '3101'
        LIMIT 1
    `, [tenant_id]);

    if (equityAccount.length === 0) return;

    await connection.query(`
        INSERT INTO opening_balances
            (tenant_id, business_type_id, account_id, as_of_date, side, amount, description, created_by)
        VALUES (?, ?, ?, ?, 'credit', ?, 'Saldo awal modal (otomatis dari selisih aset - kewajiban)', ?)
    `, [tenant_id, business_type_id, equityAccount[0].id, as_of_date, selisih, created_by]);
}

// =============================================
// CREATE TRANSACTION
// =============================================
// controllers/transactionsController.js
async function createTransaction(req, res) {
    const tenant_id = req.user.tenant_id;
    const { category_id, amount, description, transaction_date } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 🔥 AMBIL BUSINESS_TYPE_ID DARI TENANT
        const [tenantRows] = await connection.query(
            'SELECT business_type_id FROM tenants WHERE id = ?',
            [tenant_id]
        );

        if (tenantRows.length === 0 || !tenantRows[0].business_type_id) {
            throw new Error("Jenis usaha belum dipilih");
        }

        const business_type_id = tenantRows[0].business_type_id;

        // Ambil dari business_type_categories
        const [categoryRows] = await connection.query(
            `SELECT 
                debit_account_code, 
                credit_account_code, 
                category_type AS type 
             FROM business_type_categories 
             WHERE id = ?`,
            [category_id]
        );

        if (categoryRows.length === 0) {
            throw new Error("Kategori tidak ditemukan");
        }

        const { debit_account_code, credit_account_code, type } = categoryRows[0];

        // Cari account_id berdasarkan kode
        const [debitAccount] = await connection.query(
            'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
            [debit_account_code, tenant_id]
        );

        const [creditAccount] = await connection.query(
            'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
            [credit_account_code, tenant_id]
        );

        if (debitAccount.length === 0 || creditAccount.length === 0) {
            throw new Error("Akun debit/kredit tidak ditemukan");
        }

        const debit_account_id = debitAccount[0].id;
        const credit_account_id = creditAccount[0].id;


        const [result] = await connection.query(
            `INSERT INTO transactions 
            (tenant_id, business_type_id, category_id, type, amount, description, transaction_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                tenant_id,
                business_type_id,
                category_id,
                type,
                Number(amount),
                description || null,
                transaction_date || new Date()
            ]
        );

        const transaction_id = result.insertId;

        await createJournalEntry(connection, {
            tenant_id,
            transaction_id,
            debit_account_id,
            credit_account_id,
            amount: Number(amount),
            description: description || null,
            transaction_date: transaction_date || new Date()
        });

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Transaksi berhasil dibuat",
            data: { transaction_id }
        });

    } catch (err) {
        await connection.rollback();
        console.error("CREATE TRANSACTION ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        connection.release();
    }
}

// =============================================
// GET TRANSACTIONS (LIST)
// =============================================
// controllers/transactionsController.js
async function getTransactions(req, res) {
    const tenant_id = req.user.tenant_id;
    const { business_type_id } = req.query;  // ← AMBIL DARI QUERY

    try {
        let query = `
            SELECT 
                t.id AS transaction_id,
                t.transaction_date,
                t.description,
                t.type AS transaction_type,
                (${TRANSACTION_DASHBOARD_FLOW_SQL}) AS dashboard_flow,
                ad.code AS debit_code,
                ad.name AS debit_name,
                d.debit,
                ac.code AS credit_code,
                ac.name AS credit_name,
                c.credit,
                t.business_type_id,
                t.category_id
            FROM transactions t
            JOIN journal_entries d
                ON t.id = d.transaction_id
                AND d.debit > 0
                AND d.tenant_id = ?
            JOIN accounts ad
                ON d.account_id = ad.id
            JOIN journal_entries c
                ON t.id = c.transaction_id
                AND c.credit > 0
                AND c.tenant_id = ?
            JOIN accounts ac
                ON c.account_id = ac.id
            LEFT JOIN business_type_categories cat
                ON t.category_id = cat.id
            WHERE t.tenant_id = ?
              AND (cat.is_adjustment = 0 OR t.category_id IS NULL)
              AND t.type != 'opening_balance'
        `;

        const params = [tenant_id, tenant_id, tenant_id];

        // 🔥 FILTER BERDASARKAN BUSINESS TYPE
        if (business_type_id) {
            query += ` AND t.business_type_id = ?`;
            params.push(business_type_id);
        }

        query += ` ORDER BY t.transaction_date DESC, t.id DESC`;

        const [rows] = await pool.query(query, params);

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (err) {
        console.error("GET TRANSACTIONS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// =============================================
// GET TRANSACTIONS BY DATE (FILTER)
// =============================================
async function getTransactionsByDate(req, res) {
    const tenant_id = req.user.tenant_id;
    const { start_date, end_date, business_type_id } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: "start_date dan end_date diperlukan" });
    }

    try {
        let query = `
            SELECT 
                t.id AS transaction_id,
                t.transaction_date,
                t.description,
                t.type AS transaction_type,
                (${TRANSACTION_DASHBOARD_FLOW_SQL}) AS dashboard_flow,
                ad.code AS debit_code,
                ad.name AS debit_name,
                d.debit,
                ac.code AS credit_code,
                ac.name AS credit_name,
                c.credit,
                t.category_id
            FROM transactions t
            JOIN journal_entries d ON t.id = d.transaction_id AND d.debit > 0 AND d.tenant_id = ?
            JOIN accounts ad ON d.account_id = ad.id
            JOIN journal_entries c ON t.id = c.transaction_id AND c.credit > 0 AND c.tenant_id = ?
            JOIN accounts ac ON c.account_id = ac.id
            LEFT JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE t.tenant_id = ?
                AND (cat.is_adjustment = 0 OR t.category_id IS NULL)
                AND t.type != 'opening_balance'
                AND DATE(t.transaction_date) BETWEEN ? AND ?
        `;

        const params = [tenant_id, tenant_id, tenant_id, start_date, end_date];

        if (business_type_id) {
            query += ` AND t.business_type_id = ?`;
            params.push(business_type_id);
        }

        query += ` ORDER BY t.transaction_date DESC, t.id DESC`;

        const [rows] = await pool.query(query, params);
        return res.status(200).json({ success: true, data: rows });

    } catch (err) {
        console.error("FILTER TRANSACTIONS ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

// =============================================
// GET TRANSACTION BY ID (UNTUK EDIT)
// =============================================
async function getTransactionById(req, res) {
    const tenant_id = req.user.tenant_id;
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT 
                t.id,
                t.transaction_date,
                t.amount,
                t.description,
                t.category_id,
                b.category_name AS category_name,
                b.category_type AS type,
                b.debit_account_code,
                b.credit_account_code
            FROM transactions t
            LEFT JOIN business_type_categories b ON t.category_id = b.id
            WHERE t.id = ? AND t.tenant_id = ?`,
            [id, tenant_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaksi tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (err) {
        console.error("GET TRANSACTION BY ID ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// =============================================
// UPDATE TRANSACTION
// =============================================
async function updateTransaction(req, res) {
    const tenant_id = req.user.tenant_id;
    const { id } = req.params;
    const { category_id, amount, description, transaction_date } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Validasi transaksi exists
        const [existing] = await connection.query(
            "SELECT id FROM transactions WHERE id = ? AND tenant_id = ?",
            [id, tenant_id]
        );

        if (existing.length === 0) {
            throw new Error("Transaksi tidak ditemukan");
        }

        // Ambil mapping dari business_type_categories
        const [categoryRows] = await connection.query(
            `SELECT 
                debit_account_code, 
                credit_account_code, 
                category_type AS type 
             FROM business_type_categories 
             WHERE id = ?`,
            [category_id]
        );

        if (categoryRows.length === 0) {
            throw new Error("Kategori tidak ditemukan");
        }

        const { debit_account_code, credit_account_code, type } = categoryRows[0];

        // Cari account_id berdasarkan kode
        const [debitAccount] = await connection.query(
            'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
            [debit_account_code, tenant_id]
        );

        const [creditAccount] = await connection.query(
            'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
            [credit_account_code, tenant_id]
        );

        if (debitAccount.length === 0 || creditAccount.length === 0) {
            throw new Error("Akun debit/kredit tidak ditemukan");
        }

        const debit_account_id = debitAccount[0].id;
        const credit_account_id = creditAccount[0].id;

        // Update transactions
        await connection.query(
            `UPDATE transactions 
             SET category_id = ?, type = ?, amount = ?, description = ?, transaction_date = ?
             WHERE id = ? AND tenant_id = ?`,
            [
                category_id,
                type,
                Number(amount),
                description || null,
                transaction_date || new Date(),
                id,
                tenant_id
            ]
        );

        // Hapus journal entries lama
        await connection.query(
            "DELETE FROM journal_entries WHERE transaction_id = ? AND tenant_id = ?",
            [id, tenant_id]
        );

        // Insert journal entries baru
        await createJournalEntry(connection, {
            tenant_id,
            transaction_id: id,
            debit_account_id,
            credit_account_id,
            amount: Number(amount),
            description: description || null,
            transaction_date: transaction_date || new Date()
        });

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Transaksi berhasil diupdate"
        });

    } catch (err) {
        await connection.rollback();
        console.error("UPDATE TRANSACTION ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        connection.release();
    }
}

// =============================================
// DELETE TRANSACTION
// =============================================
async function deleteTransaction(req, res) {
    const tenant_id = req.user.tenant_id;
    const { id } = req.params;

    console.log("Delete transaction ID:", id, "Tenant:", tenant_id); // ← LOG

    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "ID transaksi tidak valid"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Cek apakah transaksi ada
        const [existing] = await connection.query(
            "SELECT id, type, business_type_id, amount, transaction_date FROM transactions WHERE id = ? AND tenant_id = ?",
            [id, tenant_id]
        );

        if (existing.length === 0) {
            throw new Error(`Transaksi dengan ID ${id} tidak ditemukan`);
        }

        const trx = existing[0];

        // 🔥 JIKA TIPE ADALAH OPENING BALANCE, HAPUS JUGA DI TABEL opening_balances
        if (trx.type === 'opening_balance') {
            // Kita cari akun mana yang terlibat di jurnal (yang bukan contra account)
            // Namun karena tabel opening_balances tidak punya transaction_id, 
            // kita hapus berdasarkan kriteria yang paling mendekati
            await connection.query(
                `DELETE FROM opening_balances 
                 WHERE tenant_id = ? 
                   AND business_type_id = ? 
                   AND amount = ? 
                   AND as_of_date = ?`,
                [tenant_id, trx.business_type_id, trx.amount, trx.transaction_date]
            );
        }

        // Hapus journal entries
        await connection.query(
            "DELETE FROM journal_entries WHERE transaction_id = ? AND tenant_id = ?",
            [id, tenant_id]
        );

        // Hapus transactions
        await connection.query(
            "DELETE FROM transactions WHERE id = ? AND tenant_id = ?",
            [id, tenant_id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Transaksi berhasil dihapus"
        });

    } catch (err) {
        await connection.rollback();
        console.error("DELETE TRANSACTION ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        connection.release();
    }
}

// =============================================
// DELETE ALL TRANSACTIONS
// =============================================
// controllers/transactionsController.js
async function deleteAllTransactions(req, res) {
    const tenant_id = req.user.tenant_id;
    const { business_type_id } = req.query;  // ← AMBIL DARI QUERY

    if (!business_type_id) {
        return res.status(400).json({
            success: false,
            message: "business_type_id diperlukan"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Hapus journal entries untuk business type tertentu
        await connection.query(
            `DELETE je FROM journal_entries je 
             WHERE je.transaction_id IN (
                 SELECT id FROM transactions 
                 WHERE tenant_id = ? AND business_type_id = ?
             )`,
            [tenant_id, business_type_id]
        );

        // 🔥 HAPUS OPENING BALANCES
        await connection.query(
            'DELETE FROM opening_balances WHERE tenant_id = ? AND business_type_id = ?',
            [tenant_id, business_type_id]
        );

        // Hapus transactions untuk business type tertentu
        await connection.query(
            'DELETE FROM transactions WHERE tenant_id = ? AND business_type_id = ?',
            [tenant_id, business_type_id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: 'Semua transaksi berhasil dihapus'
        });

    } catch (err) {
        await connection.rollback();
        console.error("DELETE ALL TRANSACTIONS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        connection.release();
    }
}

// =============================================
// EXPORT TO EXCEL
// =============================================
async function exportToExcel(req, res) {
    const tenant_id = req.user.tenant_id;
    const { start_date, end_date, business_type_id } = req.query;

    try {
        let query = `
            SELECT 
                t.transaction_date,
                t.description,
                ad.code AS debit_code,
                ad.name AS debit_name,
                d.debit,
                ac.code AS credit_code,
                ac.name AS credit_name,
                c.credit
            FROM transactions t
            JOIN journal_entries d
                ON t.id = d.transaction_id AND d.debit > 0
            JOIN accounts ad ON d.account_id = ad.id
            JOIN journal_entries c
                ON t.id = c.transaction_id AND c.credit > 0
            JOIN accounts ac ON c.account_id = ac.id
            WHERE t.tenant_id = ?
              AND t.type != 'opening_balance'
        `;

        const params = [tenant_id];

        if (start_date && end_date) {
            query += ` AND DATE(t.transaction_date) BETWEEN ? AND ?`;
            params.push(start_date, end_date);
        }

        if (business_type_id) {
            query += ` AND t.business_type_id = ?`;
            params.push(business_type_id);
        }

        query += ` ORDER BY t.transaction_date DESC`;

        const [rows] = await pool.query(query, params);

        const [tenantRows] = await pool.query("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha Belum Diatur)";

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaksi');

        // HEADER LAPORAN
        worksheet.mergeCells('A1:H1');
        worksheet.getCell('A1').value = 'LAPORAN TRANSAKSI';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A2:H2');
        worksheet.getCell('A2').value = businessName.toUpperCase();
        worksheet.getCell('A2').font = { size: 14, bold: true };
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A3:H3');
        let periodStr = 'Periode: Semua Data';
        if (start_date && end_date) {
            periodStr = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
        } else if (rows.length > 0) {
            // Optional: Show range of data if no filter
            const dates = rows.map(r => moment(r.transaction_date));
            const minDate = moment.min(dates).format('DD/MM/YYYY');
            const maxDate = moment.max(dates).format('DD/MM/YYYY');
            periodStr = `Periode: ${minDate} - ${maxDate}`;
        }

        worksheet.getCell('A3').value = periodStr;
        worksheet.getCell('A3').font = { size: 11, bold: true };
        worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.addRow([]); // Spacer

        worksheet.columns = [
            { key: 'transaction_date', width: 15 },
            { key: 'debit_code', width: 12 },
            { key: 'debit_name', width: 25 },
            { key: 'debit', width: 18 },
            { key: 'credit_code', width: 12 },
            { key: 'credit_name', width: 25 },
            { key: 'credit', width: 18 },
            { key: 'description', width: 35 }
        ];

        // HEADER TABEL
        const headerRow = worksheet.addRow([
            'Tanggal', 'Kode Debit', 'Nama Debit', 'Debit',
            'Kode Kredit', 'Nama Kredit', 'Kredit', 'Keterangan'
        ]);

        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF235347' } // Theme green
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left' }; // All left
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // DATA ROWS
        rows.forEach(row => {
            const addedRow = worksheet.addRow({
                transaction_date: moment(row.transaction_date).format('DD/MM/YYYY'),
                debit_code: row.debit_code,
                debit_name: row.debit_name,
                debit: row.debit,
                credit_code: row.credit_code,
                credit_name: row.credit_name,
                credit: row.credit,
                description: row.description || '-'
            });

            // Format nominal
            addedRow.getCell('debit').numFmt = '#,##0';
            addedRow.getCell('credit').numFmt = '#,##0';

            // Add borders and left alignment to cells
            addedRow.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // All left
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const fileName = start_date && end_date
            ? `transaksi_${start_date}_sampai_${end_date}.xlsx`
            : `transaksi_semua.xlsx`;

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("EXPORT EXCEL ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Gagal export Excel: " + err.message
        });
    }
}

// =============================================
// EXPORT TO PDF
// =============================================
async function exportToPdf(req, res) {
    const tenant_id = req.user.tenant_id;
    const { start_date, end_date, business_type_id } = req.query;


    try {
        let query = `
            SELECT 
                t.transaction_date,
                t.description,
                ad.code AS debit_code,
                ad.name AS debit_name,
                d.debit AS debit_amount,
                ac.code AS credit_code,
                ac.name AS credit_name,
                c.credit AS credit_amount
            FROM transactions t
            JOIN journal_entries d
                ON t.id = d.transaction_id AND d.debit > 0
            JOIN accounts ad ON d.account_id = ad.id
            JOIN journal_entries c
                ON t.id = c.transaction_id AND c.credit > 0
            JOIN accounts ac ON c.account_id = ac.id
            WHERE t.tenant_id = ?
              AND t.type != 'opening_balance'
        `;

        const params = [tenant_id];

        if (start_date && end_date) {
            query += ` AND DATE(t.transaction_date) BETWEEN ? AND ?`;
            params.push(start_date, end_date);
        }

        if (business_type_id) {
            query += ` AND t.business_type_id = ?`;
            params.push(business_type_id);
        }

        query += ` ORDER BY t.transaction_date DESC`;

        const [rows] = await pool.query(query, params);

        const [tenantRows] = await pool.query("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha Belum Diatur)";

        res.setHeader('Content-Type', 'application/pdf');

        const fileName = start_date && end_date
            ? `transaksi_${start_date}_sampai_${end_date}.pdf`
            : `transaksi_semua.pdf`;

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
        doc.pipe(res);

        // HEADER LAPORAN
        doc.fontSize(18).font('Helvetica-Bold').text('LAPORAN TRANSAKSI', { align: 'center' });
        doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });

        let periodStr = 'Periode: Semua Data';
        if (start_date && end_date) {
            periodStr = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
        } else if (rows.length > 0) {
            const dates = rows.map(r => moment(r.transaction_date));
            const minDate = moment.min(dates).format('DD/MM/YYYY');
            const maxDate = moment.max(dates).format('DD/MM/YYYY');
            periodStr = `Periode: ${minDate} - ${maxDate}`;
        }

        doc.fontSize(10).font('Helvetica-Bold').text(periodStr, { align: 'center' });

        doc.moveDown();
        doc.fontSize(8).font('Helvetica')
            .text(`Dicetak: ${moment().format('DD/MM/YYYY HH:mm')}`, { align: 'right' });
        doc.moveDown(2);

        const tableTop = doc.y + 10;
        const colWidths = [65, 55, 110, 85, 55, 110, 85, 135];
        const colPositions = [];

        let currentX = 30; // Start with left margin
        colWidths.forEach(width => {
            colPositions.push(currentX);
            currentX += width;
        });

        const headers = ['Tanggal', 'Kode D', 'Nama Debit', 'Debit', 'Kode K', 'Nama Kredit', 'Kredit', 'Keterangan'];

        // DRAW HEADER BACKGROUND
        doc.rect(30, tableTop - 5, 720, 20).fill('#ecfdf5');
        doc.fillColor('#065f46');

        doc.font('Helvetica-Bold').fontSize(9);
        headers.forEach((header, i) => {
            doc.text(header, colPositions[i] + 3, tableTop, {
                width: colWidths[i] - 6,
                align: 'left'
            });
        });

        // DRAW HEADER BOTTOM LINE
        doc.moveTo(30, tableTop + 15).lineTo(750, tableTop + 15).strokeColor('#10b981').lineWidth(0.5).stroke();

        let rowY = tableTop + 22;
        doc.font('Helvetica').fontSize(8).fillColor('#1e293b');

        rows.forEach((row) => {
            // Check if we need a new page
            if (rowY > 520) {
                doc.addPage({ layout: 'landscape', margin: 30 });
                rowY = 40;
                // Re-draw header on new page
                doc.rect(30, rowY - 5, 720, 20).fill('#ecfdf5');
                doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(9);
                headers.forEach((header, i) => {
                    doc.text(header, colPositions[i] + 3, rowY, {
                        width: colWidths[i] - 6,
                        align: 'left'
                    });
                });
                doc.moveTo(30, rowY + 15).lineTo(750, rowY + 15).strokeColor('#10b981').lineWidth(0.5).stroke();
                rowY += 22;
                doc.font('Helvetica').fontSize(8).fillColor('#1e293b');
            }

            const tgl = moment(row.transaction_date).format('DD/MM/YYYY');
            const debitRp = new Intl.NumberFormat('id-ID').format(row.debit_amount);
            const creditRp = new Intl.NumberFormat('id-ID').format(row.credit_amount);

            doc.text(tgl, colPositions[0] + 3, rowY, { width: colWidths[0] - 6 });
            doc.text(row.debit_code, colPositions[1] + 3, rowY, { width: colWidths[1] - 6 });
            doc.text(row.debit_name, colPositions[2] + 3, rowY, { width: colWidths[2] - 6 });
            doc.text(`Rp ${debitRp}`, colPositions[3] + 3, rowY, { width: colWidths[3] - 6, align: 'left' });
            doc.text(row.credit_code, colPositions[4] + 3, rowY, { width: colWidths[4] - 6 });
            doc.text(row.credit_name, colPositions[5] + 3, rowY, { width: colWidths[5] - 6 });
            doc.text(`Rp ${creditRp}`, colPositions[6] + 3, rowY, { width: colWidths[6] - 6, align: 'left' });
            doc.text(row.description || '-', colPositions[7] + 3, rowY, { width: colWidths[7] - 6 });

            // DRAW BORDER LINE FOR ROW
            doc.moveTo(30, rowY + 13).lineTo(730, rowY + 13).strokeColor('#f1f5f9').lineWidth(0.5).stroke();

            rowY += 18;
        });

        const totalDebit = rows.reduce((sum, row) => sum + Number(row.debit_amount), 0);
        const totalKredit = rows.reduce((sum, row) => sum + Number(row.credit_amount), 0);

        doc.moveTo(30, rowY + 5).lineTo(730, rowY + 5).strokeColor('#94a3b8').lineWidth(1.5).stroke();

        doc.font('Helvetica-Bold').fontSize(9).fillColor('#1e293b');
        doc.text('TOTAL SELURUH TRANSAKSI:', colPositions[0], rowY + 12, { width: colWidths[0] + colWidths[1] + colWidths[2], align: 'left' });
        doc.text(`Rp ${new Intl.NumberFormat('id-ID').format(totalDebit)}`, colPositions[3] + 3, rowY + 12, { width: colWidths[3] - 6, align: 'left' });
        doc.text(`Rp ${new Intl.NumberFormat('id-ID').format(totalKredit)}`, colPositions[6] + 3, rowY + 12, { width: colWidths[6] - 6, align: 'left' });

        doc.end();

    } catch (err) {
        console.error("EXPORT PDF ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Gagal export PDF: " + err.message
        });
    }
}

// =============================================
// CREATE ADJUSTING JOURNAL (CATEGORY-BASED / AUTOMATIC)
// =============================================
async function createAdjustingJournal(req, res) {
    const tenant_id = req.user.tenant_id;
    const { category_id, amount, description, transaction_date } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Ambil business_type_id dari tenant
        const [tenantRows] = await connection.query(
            'SELECT business_type_id FROM tenants WHERE id = ?',
            [tenant_id]
        );

        if (tenantRows.length === 0 || !tenantRows[0].business_type_id) {
            throw new Error("Jenis usaha belum dipilih");
        }
        const business_type_id = tenantRows[0].business_type_id;

        // 2. Ambil data kategori untuk mendapatkan kode akun
        const [categoryRows] = await connection.query(
            `SELECT debit_account_code, credit_account_code, category_type AS type 
             FROM business_type_categories 
             WHERE id = ?`,
            [category_id]
        );

        if (categoryRows.length === 0) {
            throw new Error("Kategori penyesuaian tidak ditemukan");
        }

        const { debit_account_code, credit_account_code, type } = categoryRows[0];

        // 3. Cari account_id berdasarkan kode akun tersebut untuk tenant ini
        const [debitAccount] = await connection.query(
            'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
            [debit_account_code, tenant_id]
        );

        const [creditAccount] = await connection.query(
            'SELECT id FROM accounts WHERE code = ? AND tenant_id = ?',
            [credit_account_code, tenant_id]
        );

        if (debitAccount.length === 0 || creditAccount.length === 0) {
            throw new Error(`Akun untuk kode ${debit_account_code} atau ${credit_account_code} tidak ditemukan di daftar akun Anda.`);
        }

        const debit_account_id = debitAccount[0].id;
        const credit_account_id = creditAccount[0].id;

        // 4. INSERT KE TRANSACTIONS (payment_method = NULL sebagai penanda penyesuaian)
        const [result] = await connection.query(
            `INSERT INTO transactions 
            (tenant_id, business_type_id, category_id, type, amount, payment_method, description, transaction_date)
            VALUES (?, ?, ?, ?, ?, NULL, ?, ?)`,
            [
                tenant_id,
                business_type_id,
                category_id,
                type,
                Number(amount),
                description || 'Jurnal Penyesuaian',
                transaction_date
            ]
        );

        const transaction_id = result.insertId;

        // 5. INSERT KE JOURNAL_ENTRIES
        await createJournalEntry(connection, {
            tenant_id,
            transaction_id,
            debit_account_id,
            credit_account_id,
            amount: Number(amount)
        });

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Jurnal Penyesuaian berhasil disimpan secara otomatis",
            data: { transaction_id }
        });

    } catch (err) {
        await connection.rollback();
        console.error("CREATE ADJUSTING JOURNAL ERROR:", err);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    } finally {
        connection.release();
    }
}

// =============================================
// GET ADJUSTING JOURNALS
// =============================================
async function getAdjustingJournals(req, res) {
    const tenant_id = req.user.tenant_id;
    const { start_date, end_date, business_type_id } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: "start_date dan end_date diperlukan" });
    }

    try {
        let query = `
            SELECT 
                t.id AS transaction_id,
                t.transaction_date,
                t.description,
                t.type AS transaction_type,
                ad.code AS debit_code,
                ad.name AS debit_name,
                d.debit,
                ac.code AS credit_code,
                ac.name AS credit_name,
                c.credit
            FROM transactions t
            JOIN journal_entries d ON t.id = d.transaction_id AND d.debit > 0 AND d.tenant_id = ?
            JOIN accounts ad ON d.account_id = ad.id
            JOIN journal_entries c ON t.id = c.transaction_id AND c.credit > 0 AND c.tenant_id = ?
            JOIN accounts ac ON c.account_id = ac.id
            JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE t.tenant_id = ? AND cat.is_adjustment = 1
        `;

        const params = [tenant_id, tenant_id, tenant_id];

        if (business_type_id) {
            query += ` AND t.business_type_id = ?`;
            params.push(business_type_id);
        }

        query += ` AND t.transaction_date BETWEEN ? AND ?`;
        params.push(start_date, end_date);

        query += ` ORDER BY t.transaction_date DESC, t.id DESC`;

        const [rows] = await pool.query(query, params);

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (err) {
        console.error("GET ADJUSTING JOURNALS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// =============================================
// GET ALL ACCOUNTS
// =============================================
async function getAllAccounts(req, res) {
    const tenant_id = req.user.tenant_id;
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(
            `
            SELECT id, code, name, type 
            FROM accounts 
            WHERE tenant_id = ? 
              AND code != '3999'
            ORDER BY type ASC, code ASC, name ASC
            `,
            [tenant_id]
        );

        return res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (err) {
        console.error("GET ALL ACCOUNTS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    } finally {
        connection.release();
    }
}

module.exports = {
    createTransaction,
    createOpeningBalance,
    getOpeningBalanceAccounts,
    getTransactions,
    getTransactionsByDate,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    exportToExcel,
    exportToPdf,
    getOpeningBalances,
    createAdjustingJournal,
    getAdjustingJournals,
    getAllAccounts
};