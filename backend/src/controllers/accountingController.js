const db = require("../config/db");

// GET /api/accounting/ledger
// Query ledger entries per account, filtered by period & business_type_id.
async function getLedger(req, res) {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "start_date dan end_date diperlukan",
            });
        }

        let businessFilter = "";
        const params = [tenant_id, tenant_id, start_date, end_date];

        if (business_type_id) {
            businessFilter = " AND t.business_type_id = ? ";
            params.push(business_type_id);
        }

        const [rows] = await db.execute(
            `
            SELECT
                t.id AS transaction_id,
                t.transaction_date,
                t.description,
                t.business_type_id,
                a.id AS account_id,
                a.code AS account_code,
                a.name AS account_name,
                a.type AS account_type,
                je.debit,
                je.credit
            FROM journal_entries je
            JOIN transactions t ON je.transaction_id = t.id
            JOIN accounts a ON je.account_id = a.id
            WHERE je.tenant_id = ?
              AND t.tenant_id = ?
              AND DATE(t.transaction_date) BETWEEN ? AND ?
              ${businessFilter}
            -- HAPUS filter a.type IN ('income', 'expense')
            ORDER BY
                FIELD(a.type, 'asset', 'liability', 'equity', 'income', 'expense'),
                a.code ASC,
                t.transaction_date DESC,
                t.id DESC
            `,
            params
        );

        return res.json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("GET LEDGER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// GET /api/accounting/trial-balance
// Neraca saldo untuk periode: agregasi debit/kredit per akun (hanya akun yang ada mutasi).
async function getTrialBalance(req, res) {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "start_date dan end_date diperlukan",
            });
        }

        let businessFilter = "";
        const params = [tenant_id, tenant_id, start_date, end_date];

        if (business_type_id) {
            businessFilter = " AND t.business_type_id = ? ";
            params.push(business_type_id);
        }

        const [rows] = await db.execute(
            `
            SELECT
                a.type AS account_type,
                a.code AS account_code,
                a.name AS account_name,
                SUM(je.debit) AS total_debit,
                SUM(je.credit) AS total_credit
            FROM journal_entries je
            JOIN transactions t ON je.transaction_id = t.id
            JOIN accounts a ON je.account_id = a.id
            WHERE je.tenant_id = ?
              AND t.tenant_id = ?
              AND DATE(t.transaction_date) BETWEEN ? AND ?
              ${businessFilter}
            GROUP BY a.id, a.type, a.code, a.name
            HAVING (SUM(je.debit) <> 0 OR SUM(je.credit) <> 0)
            ORDER BY a.type ASC, a.code ASC
            `,
            params
        );

        let totalDebit = 0;
        let totalCredit = 0;

        const data = rows.map((r) => {
            const td = Number(r.total_debit) || 0;
            const tc = Number(r.total_credit) || 0;
            totalDebit += td;
            totalCredit += tc;
            return {
                account_type: r.account_type,
                account_code: r.account_code,
                account_name: r.account_name,
                total_debit: td,
                total_credit: tc,
            };
        });

        return res.json({
            success: true,
            data: {
                rows: data,
                totals: {
                    total_debit: totalDebit,
                    total_credit: totalCredit,
                    difference: totalDebit - totalCredit,
                },
            },
        });
    } catch (error) {
        console.error("GET TRIAL BALANCE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { getLedger, getTrialBalance };

