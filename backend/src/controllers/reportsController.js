const db = require('../config/db');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// =============================================
// LABA RUGI (TOTAL SAJA)
// =============================================
const getProfitLoss = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id } = req.query;

        let transactionFilter = "";
        const params = [tenant_id];

        if (start_date && end_date) {
            transactionFilter += " AND t.transaction_date BETWEEN ? AND ?";
            params.push(start_date, end_date);
        }

        if (business_type_id) {
            transactionFilter += " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        // Ambil semua pendapatan (berdasarkan akun)
        const [income] = await db.execute(`
            SELECT COALESCE(SUM(je.credit - je.debit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'income'
                ${transactionFilter}
        `, params);

        // Ambil semua beban (berdasarkan akun)
        const [expense] = await db.execute(`
            SELECT COALESCE(SUM(je.debit - je.credit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'expense'
                ${transactionFilter}
        `, params);

        const totalIncome = parseFloat(income[0].total);
        const totalExpense = parseFloat(expense[0].total);
        const netProfit = totalIncome - totalExpense;

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netProfit
            }
        });
    } catch (err) {
        console.error("Profit Loss Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// =============================================
// LABA RUGI DETAIL (PER TRANSAKSI)
// =============================================
const getProfitLossDetail = async (req, res) => {
    const tenant_id = req.user.tenant_id;
    const { start_date, end_date, business_type_id } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: "start_date dan end_date diperlukan"
        });
    }

    try {
        let transactionFilter = "";
        const params = [tenant_id, start_date, end_date];

        if (business_type_id) {
            transactionFilter = " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        // Ambil detail pendapatan (berdasarkan akun)
        const [income] = await db.execute(`
            SELECT 
                a.code as date,
                a.name as description,
                SUM(je.credit - je.debit) as amount
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'income'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            GROUP BY a.id, a.code, a.name
            HAVING amount != 0
            ORDER BY a.code ASC
        `, params);

        // Ambil detail beban (berdasarkan akun)
        const [expense] = await db.execute(`
            SELECT 
                a.code as date,
                a.name as description,
                SUM(je.debit - je.credit) as amount
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'expense'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            GROUP BY a.id, a.code, a.name
            HAVING amount != 0
            ORDER BY a.code ASC
        `, params);

        // Hitung total
        const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalExpense = expense.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const netProfit = totalIncome - totalExpense;

        res.json({
            success: true,
            data: {
                income: {
                    items: income,
                    total: totalIncome
                },
                expense: {
                    items: expense,
                    total: totalExpense
                },
                netProfit
            }
        });

    } catch (err) {
        console.error("Profit Loss Detail Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


// =============================================
// NERACA
// =============================================
const getBalanceSheet = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { as_of_date, business_type_id } = req.query;

        let transactionFilter = "";
        const params = [tenant_id, as_of_date];

        if (business_type_id) {
            transactionFilter = " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        // 1. Hitung Aset
        const [asset] = await db.execute(`
            SELECT COALESCE(SUM(je.debit - je.credit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'asset'
                AND t.transaction_date <= ?
                ${transactionFilter}
        `, params);

        // 2. Hitung Liabilitas
        const [liabilities] = await db.execute(`
            SELECT COALESCE(SUM(je.credit - je.debit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'liability'
                AND t.transaction_date <= ?
                ${transactionFilter}
        `, params);

        // 3. Hitung Modal (equity)
        const [equity] = await db.execute(`
            SELECT COALESCE(SUM(je.credit - je.debit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'equity'
                AND t.transaction_date <= ?
                ${transactionFilter}
        `, params);

        // 4. Hitung Laba dari Pendapatan - Beban (berdasarkan akun)
        const [income] = await db.execute(`
            SELECT COALESCE(SUM(je.credit - je.debit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'income'
                AND t.transaction_date <= ?
                ${transactionFilter}
        `, params);

        const [expense] = await db.execute(`
            SELECT COALESCE(SUM(je.debit - je.credit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'expense'
                AND t.transaction_date <= ?
                ${transactionFilter}
        `, params);

        const laba = parseFloat(income[0].total) - parseFloat(expense[0].total);

        // Ekuitas total = modal + laba
        const totalEquity = parseFloat(equity[0].total) + laba;

        // 1b. Hitung Khusus Kas & Bank (untuk Dashboard)
        const [cashBank] = await db.execute(`
            SELECT COALESCE(SUM(je.debit - je.credit), 0) as total 
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND (a.code LIKE '11%' OR a.code LIKE '12%')
                AND t.transaction_date <= ?
                ${transactionFilter}
        `, params);

        res.json({
            success: true,
            data: {
                assets: parseFloat(asset[0].total),
                cashAndBank: parseFloat(cashBank[0].total),
                liabilities: parseFloat(liabilities[0].total),
                equity: totalEquity,
                laba: laba
            }
        });

    } catch (err) {
        console.error("Balance Sheet Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


// =============================================
// NERACA DETAIL (VERSI FINAL - BALANCE)
// =============================================
const getBalanceSheetDetail = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { as_of_date, business_type_id } = req.query;

        console.log("Balance Sheet Detail - Tenant:", tenant_id, "Date:", as_of_date, "Business:", business_type_id);

        // Query untuk ambil semua akun dengan saldo
        const [rows] = await db.execute(`
            SELECT 
                a.code,
                a.name,
                a.type,
                COALESCE(
                    (SELECT SUM(je.debit - je.credit) 
                     FROM journal_entries je 
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.account_id = a.id 
                       AND je.tenant_id = a.tenant_id 
                       AND t.transaction_date <= ?
                       ${business_type_id ? 'AND t.business_type_id = ?' : ''}), 0
                ) as selisih
            FROM accounts a
            WHERE a.tenant_id = ?
            ORDER BY a.type, a.code
        `, business_type_id
            ? [as_of_date, business_type_id, tenant_id]
            : [as_of_date, tenant_id]);

        // Pisahkan berdasarkan type dengan rumus yang benar
        const aset = [];
        const liabilitas = [];
        const ekuitas = [];

        rows.forEach(item => {
            const selisih = parseFloat(item.selisih);

            if (Math.abs(selisih) > 0.01) { // Hanya sertakan yang ada saldonya
                if (item.type === 'asset') {
                    // ASET: saldo normal di Debit (selisih positif)
                    aset.push({
                        code: item.code,
                        name: item.name,
                        saldo: selisih
                    });
                }
                else if (item.type === 'liability') {
                    // LIABILITAS: saldo normal di Credit (selisih negatif)
                    // Kita tampilkan sebagai positif di laporan (credit - debit)
                    liabilitas.push({
                        code: item.code,
                        name: item.name,
                        saldo: -selisih
                    });
                }
                else if (item.type === 'equity') {
                    // EKUITAS: saldo normal di Credit (selisih negatif)
                    let saldo = -selisih;

                    // KHUSUS PRIVE atau akun kontra lainnya tetap mengikuti selisihnya
                    ekuitas.push({
                        code: item.code,
                        name: item.name,
                        saldo: saldo
                    });
                }
            }
        });


        console.log("=== PRIVE DEBUG ===");
        const priveRow = rows.find(item => item.code === '3301');
        if (priveRow) {
            console.log("Prive row:", priveRow);
            console.log("Prive selisih:", priveRow.selisih);
        }

        // Hitung laba bersih
        let labaParams, labaQuery;

        if (business_type_id) {
            labaQuery = `
                SELECT 
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0) 
                     FROM journal_entries je 
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE a.type = 'income' 
                       AND je.tenant_id = ? 
                       AND t.transaction_date <= ?
                       AND t.business_type_id = ?) as total_pendapatan,
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0) 
                     FROM journal_entries je 
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE a.type = 'expense' 
                       AND je.tenant_id = ? 
                       AND t.transaction_date <= ?
                       AND t.business_type_id = ?) as total_beban
            `;
            labaParams = [tenant_id, as_of_date, business_type_id, tenant_id, as_of_date, business_type_id];
        } else {
            labaQuery = `
                SELECT 
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0) 
                     FROM journal_entries je 
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE a.type = 'income' 
                       AND je.tenant_id = ? 
                       AND t.transaction_date <= ?) as total_pendapatan,
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0) 
                     FROM journal_entries je 
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE a.type = 'expense' 
                       AND je.tenant_id = ? 
                       AND t.transaction_date <= ?) as total_beban
            `;
            labaParams = [tenant_id, as_of_date, tenant_id, as_of_date];
        }

        const [labaResult] = await db.execute(labaQuery, labaParams);

        const totalPendapatan = parseFloat(labaResult[0]?.total_pendapatan || 0);
        const totalBeban = parseFloat(labaResult[0]?.total_beban || 0);
        const labaBersih = totalPendapatan - totalBeban;

        // Tambahkan laba ke ekuitas
        if (Math.abs(labaBersih) > 0) {
            ekuitas.push({
                code: 'LABA',
                name: labaBersih > 0 ? 'Laba Tahun Berjalan' : 'Rugi Tahun Berjalan',
                saldo: labaBersih
            });
        }

        // Hitung total
        const totalAset = aset.reduce((sum, item) => sum + item.saldo, 0);
        const totalLiabilitas = liabilitas.reduce((sum, item) => sum + item.saldo, 0);
        const totalEkuitas = ekuitas.reduce((sum, item) => sum + item.saldo, 0);
        const totalLiabilitiesEquity = totalLiabilitas + totalEkuitas;

        // Format untuk frontend
        const formatItems = (items) => items.map(item => ({
            code: item.code,
            name: item.name,
            saldo: item.saldo
        }));

        res.json({
            success: true,
            data: {
                aset: {
                    items: formatItems(aset),
                    total: totalAset
                },
                liabilitas: {
                    items: formatItems(liabilitas),
                    total: totalLiabilitas
                },
                ekuitas: {
                    items: formatItems(ekuitas),
                    total: totalEkuitas
                },
                laba: labaBersih,
                isBalance: Math.abs(totalAset - totalLiabilitiesEquity) < 100
            }
        });

    } catch (err) {
        console.error("ERROR BALANCE SHEET DETAIL:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// =============================================
// ARUS KAS
// =============================================
const getCashFlow = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id } = req.query;

        let transactionFilter = "";
        const params = [tenant_id, start_date, end_date];

        if (business_type_id) {
            transactionFilter = " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        // Ambil Kas Masuk (debit)
        const [inflowItems] = await db.execute(`
            SELECT 
                DATE_FORMAT(t.transaction_date, '%d/%m/%Y') as date,
                t.description,
                je.debit as amount
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            LEFT JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE je.tenant_id = ? 
                AND (a.code LIKE '11%' OR a.code LIKE '12%')
                AND (cat.is_adjustment IS NULL OR cat.is_adjustment = 0)
                AND je.debit > 0
                AND t.type != 'opening_balance'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            ORDER BY t.transaction_date ASC
        `, params);

        // Ambil Kas Keluar (credit)
        const [outflowItems] = await db.execute(`
            SELECT 
                DATE_FORMAT(t.transaction_date, '%d/%m/%Y') as date,
                t.description,
                je.credit as amount
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            LEFT JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE je.tenant_id = ? 
                AND (a.code LIKE '11%' OR a.code LIKE '12%')
                AND (cat.is_adjustment IS NULL OR cat.is_adjustment = 0)
                AND je.credit > 0
                AND t.type != 'opening_balance'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            ORDER BY t.transaction_date ASC
        `, params);

        const cashIn = inflowItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const cashOut = outflowItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const netCash = cashIn - cashOut;

        // Ambil saldo awal kas dari opening_balances
        const [saldoAwalRows] = await db.execute(`
            SELECT COALESCE(SUM(CASE WHEN ob.side = 'debit' THEN ob.amount ELSE 0 END), 0) as total
            FROM opening_balances ob
            JOIN accounts a ON ob.account_id = a.id
            WHERE ob.tenant_id = ? AND (a.code LIKE '11%' OR a.code LIKE '12%')
        `, [tenant_id]);

        const saldoAwal = parseFloat(saldoAwalRows[0].total) || 0;
        const saldoAkhir = saldoAwal + netCash;

        res.json({
            success: true,
            data: {
                cashIn: cashIn,
                cashOut: cashOut,
                netCash: netCash,
                saldoAwal: saldoAwal,
                saldoAkhir: saldoAkhir,
                inflow: {
                    items: inflowItems,
                    total: cashIn
                },
                outflow: {
                    items: outflowItems,
                    total: cashOut
                }
            }
        });

    } catch (err) {
        console.error("Cash Flow Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// =============================================
// GRAFIK ARUS KAS
// =============================================
const getCashFlowChart = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id } = req.query;

        let transactionFilter = "";
        const params = [tenant_id, start_date, end_date];

        if (business_type_id) {
            transactionFilter = " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        const [rows] = await db.execute(`
            SELECT 
                DATE(t.transaction_date) as date,
                SUM(CASE 
                    WHEN a.code = '1101' AND je.debit > 0 
                    THEN je.debit ELSE 0 
                END) as kas_masuk,
                SUM(CASE 
                    WHEN a.code = '1101' AND je.credit > 0 
                    THEN je.credit ELSE 0 
                END) as kas_keluar
            FROM journal_entries je
            JOIN transactions t ON je.transaction_id = t.id
            JOIN accounts a ON je.account_id = a.id
            WHERE je.tenant_id = ?
                AND a.code = '1101'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            GROUP BY DATE(t.transaction_date)
            ORDER BY date
        `, params);

        const chartData = rows.map(row => {
            const masuk = parseFloat(row.kas_masuk) || 0;
            const keluar = parseFloat(row.kas_keluar) || 0;
            return {
                date: new Date(row.date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short'
                }),
                masuk: masuk,
                keluar: keluar,
                net: masuk - keluar // Garis baru: Saldo Bersih Harian
            };
        });

        res.json({
            success: true,
            data: chartData
        });

    } catch (err) {
        console.error("Chart data error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// =============================================
// EXPORT LABA RUGI
// =============================================
const exportProfitLoss = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id, format } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "start_date dan end_date diperlukan"
            });
        }

        let transactionFilter = "";
        const params = [tenant_id, start_date, end_date];

        if (business_type_id) {
            transactionFilter = " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        // Ambil data pendapatan (berdasarkan akun)
        const [income] = await db.execute(`
            SELECT 
                a.code as tanggal,
                a.name as description,
                SUM(je.credit - je.debit) as nominal
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'income'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            GROUP BY a.id, a.code, a.name
            HAVING nominal != 0
            ORDER BY a.code ASC
        `, params);

        // Ambil data beban (berdasarkan akun)
        const [expense] = await db.execute(`
            SELECT 
                a.code as tanggal,
                a.name as description,
                SUM(je.debit - je.credit) as nominal
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? 
                AND a.type = 'expense'
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            GROUP BY a.id, a.code, a.name
            HAVING nominal != 0
            ORDER BY a.code ASC
        `, params);

        // Hitung total
        const totalPendapatan = income.reduce((sum, item) => sum + parseFloat(item.nominal || 0), 0);
        const totalBeban = expense.reduce((sum, item) => sum + parseFloat(item.nominal || 0), 0);
        const labaBersih = totalPendapatan - totalBeban;

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        if (format === 'excel') {
            // ========== GENERATE EXCEL ==========
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Laba Rugi');

            // Header
            worksheet.mergeCells('A1:C1');
            worksheet.getCell('A1').value = 'LAPORAN LABA RUGI';
            worksheet.getCell('A1').font = { size: 16, bold: true };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };

            worksheet.mergeCells('A2:C2');
            worksheet.getCell('A2').value = businessName.toUpperCase();
            worksheet.getCell('A2').font = { size: 14, bold: true };
            worksheet.getCell('A2').alignment = { horizontal: 'center' };

            worksheet.mergeCells('A3:C3');
            worksheet.getCell('A3').value = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
            worksheet.getCell('A3').alignment = { horizontal: 'center' };

            // Baris kosong
            worksheet.addRow([]);

            // Header tabel pendapatan
            const incomeHeaderRow = worksheet.addRow(['PENDAPATAN', '', '']);
            incomeHeaderRow.font = { bold: true };
            incomeHeaderRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
                c.font = { color: { argb: 'FF065F46' }, bold: true };
            });

            const incomeColHeader = worksheet.addRow(['Kode Akun', 'Nama Akun', 'Nominal']);
            incomeColHeader.eachCell(c => {
                c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
            });

            // Data pendapatan
            income.forEach(item => {
                const row = worksheet.addRow([item.tanggal, item.description || '-', item.nominal]);
                row.getCell(3).numFmt = '#,##0';
            });

            // Total pendapatan
            const totalIncomeRow = worksheet.addRow(['', 'TOTAL PENDAPATAN', totalPendapatan]);
            totalIncomeRow.font = { bold: true };
            totalIncomeRow.getCell(3).numFmt = '#,##0';

            // Baris kosong
            worksheet.addRow([]);

            // Header tabel beban
            const expenseHeaderRow = worksheet.addRow(['BEBAN', '', '']);
            expenseHeaderRow.font = { bold: true };
            expenseHeaderRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } }; // Light red for expense
                c.font = { color: { argb: 'FF991B1B' }, bold: true };
            });

            const expenseColHeader = worksheet.addRow(['Kode Akun', 'Nama Akun', 'Nominal']);
            expenseColHeader.eachCell(c => {
                c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };
            });

            // Data beban
            expense.forEach(item => {
                const row = worksheet.addRow([item.tanggal, item.description || '-', item.nominal]);
                row.getCell(3).numFmt = '#,##0';
            });

            // Total beban
            const totalExpenseRow = worksheet.addRow(['', 'TOTAL BEBAN', totalBeban]);
            totalExpenseRow.font = { bold: true };
            totalExpenseRow.getCell(3).numFmt = '#,##0';

            // Baris kosong
            worksheet.addRow([]);

            // Laba bersih
            const finalRow = worksheet.addRow(['', 'LABA BERSIH', labaBersih]);
            finalRow.font = { bold: true, size: 12 };
            finalRow.getCell(3).numFmt = '#,##0';
            const finalColor = labaBersih >= 0 ? 'FFECFDF5' : 'FFFEF2F2';
            finalRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: finalColor } };
            });

            // Format kolom
            worksheet.columns = [
                { width: 15 },
                { width: 45 },
                { width: 25 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=laba_rugi_${start_date}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();

        } else {
            // ========== GENERATE PDF ==========
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=laba_rugi_${start_date}.pdf`);
            doc.pipe(res);

            // Header
            doc.fontSize(16).font('Helvetica-Bold').text('LAPORAN LABA RUGI', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.fontSize(10).font('Helvetica').text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            // Tabel Pendapatan
            doc.rect(40, doc.y - 5, 515, 20).fill('#ecfdf5');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#065f46').text('PENDAPATAN', 50, doc.y);
            doc.moveDown(0.8);

            // Header tabel
            const tableHeaderY = doc.y;
            doc.fontSize(9).font('Helvetica-Bold').fillColor('black');
            doc.text('Kode Akun', 50, tableHeaderY);
            doc.text('Nama Akun', 150, tableHeaderY);
            doc.text('Nominal', 450, tableHeaderY, { align: 'right', width: 100 });
            doc.moveTo(40, tableHeaderY + 12).lineTo(555, tableHeaderY + 12).strokeColor('#10b981').lineWidth(0.5).stroke();
            doc.moveDown(0.5);

            // Data pendapatan
            doc.font('Helvetica').fontSize(9).fillColor('black');
            income.forEach(item => {
                if (doc.y > 750) doc.addPage();
                const y = doc.y;
                doc.text(item.tanggal, 50, y);
                doc.text(item.description || '-', 150, y, { width: 280 });
                doc.text(Number(item.nominal).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            // Total pendapatan
            const totalInY = doc.y;
            doc.rect(40, totalInY - 5, 515, 20).fill('#ecfdf5');
            doc.font('Helvetica-Bold').fillColor('#065f46');
            doc.text('TOTAL PENDAPATAN', 150, totalInY);
            doc.text(`Rp ${totalPendapatan.toLocaleString('id-ID')}`, 450, totalInY, { align: 'right', width: 100 });
            doc.moveDown(2);

            // Tabel Beban
            doc.rect(40, doc.y - 5, 515, 20).fill('#fef2f2');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#991b1b').text('BEBAN', 50, doc.y);
            doc.moveDown(0.8);

            // Header tabel
            const expenseHeaderY = doc.y;
            doc.fontSize(9).font('Helvetica-Bold').fillColor('black');
            doc.text('Kode Akun', 50, expenseHeaderY);
            doc.text('Nama Akun', 150, expenseHeaderY);
            doc.text('Nominal', 450, expenseHeaderY, { align: 'right', width: 100 });
            doc.moveTo(40, expenseHeaderY + 12).lineTo(555, expenseHeaderY + 12).strokeColor('#ef4444').lineWidth(0.5).stroke();
            doc.moveDown(0.5);

            // Data beban
            doc.font('Helvetica').fontSize(9).fillColor('black');
            expense.forEach(item => {
                if (doc.y > 750) doc.addPage();
                const y = doc.y;
                doc.text(item.tanggal, 50, y);
                doc.text(item.description || '-', 150, y, { width: 280 });
                doc.text(Number(item.nominal).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            // Total beban
            const totalOutY = doc.y;
            doc.rect(40, totalOutY - 5, 515, 20).fill('#fef2f2');
            doc.font('Helvetica-Bold').fillColor('#991b1b');
            doc.text('TOTAL BEBAN', 150, totalOutY);
            doc.text(`Rp ${totalBeban.toLocaleString('id-ID')}`, 450, totalOutY, { align: 'right', width: 100 });
            doc.moveDown(2);

            // Laba bersih
            const finalY = doc.y;
            const labaColor = labaBersih >= 0 ? '#065f46' : '#991b1b';
            const labaBg = labaBersih >= 0 ? '#ecfdf5' : '#fef2f2';
            doc.rect(40, finalY - 5, 515, 25).fill(labaBg);
            doc.fontSize(14).font('Helvetica-Bold').fillColor(labaColor);
            doc.text('LABA BERSIH', 150, finalY);
            doc.text(`Rp ${labaBersih.toLocaleString('id-ID')}${labaBersih < 0 ? ' (RUGI)' : ''}`, 450, finalY, { align: 'right', width: 100 });

            doc.end();
        }

    } catch (err) {
        console.error("Export Profit Loss Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// =============================================
// EXPORT NERACA
// =============================================
// controllers/reportsController.js
const exportBalanceSheet = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { as_of_date, business_type_id, format } = req.query;

        if (!as_of_date) {
            return res.status(400).json({
                success: false,
                message: "as_of_date diperlukan"
            });
        }

        console.log("Export Balance Sheet - Tenant:", tenant_id, "Date:", as_of_date, "Business:", business_type_id, "Format:", format);

        let transactionFilter = "";
        let params = [];

        if (business_type_id) {
            transactionFilter = " AND je.transaction_id IN (SELECT id FROM transactions WHERE business_type_id = ?)";
            params = [as_of_date, business_type_id, tenant_id];
        } else {
            params = [as_of_date, tenant_id];
        }

        // 🔥 AMBIL DATA ASET
        const [aset] = await db.execute(`
            SELECT 
                a.code,
                a.name,
                COALESCE(
                    (SELECT SUM(je.debit - je.credit) 
                     FROM journal_entries je 
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.account_id = a.id 
                       AND je.tenant_id = a.tenant_id 
                       AND t.transaction_date <= ?
                       ${transactionFilter}), 0
                ) as saldo
            FROM accounts a
            WHERE a.tenant_id = ? AND a.type = 'asset'
            ORDER BY a.code
        `, params);

        // 🔥 AMBIL DATA LIABILITAS
        const [liabilitas] = await db.execute(`
            SELECT 
                a.code,
                a.name,
                COALESCE(
                    (SELECT SUM(je.credit - je.debit) 
                     FROM journal_entries je 
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.account_id = a.id 
                       AND je.tenant_id = a.tenant_id 
                       AND t.transaction_date <= ?
                       ${transactionFilter}), 0
                ) as saldo
            FROM accounts a
            WHERE a.tenant_id = ? AND a.type = 'liability'
            ORDER BY a.code
        `, params);

        // 🔥 AMBIL DATA EKUITAS
        const [ekuitas] = await db.execute(`
            SELECT 
                a.code,
                a.name,
                COALESCE(
                    (SELECT SUM(je.credit - je.debit) 
                     FROM journal_entries je 
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.account_id = a.id 
                       AND je.tenant_id = a.tenant_id 
                       AND t.transaction_date <= ?
                       ${transactionFilter}), 0
                ) as saldo
            FROM accounts a
            WHERE a.tenant_id = ? AND a.type = 'equity'
            ORDER BY a.code
        `, params);

        // 🔥 FILTER SALDO != 0
        const asetFiltered = aset.filter(item => Math.abs(parseFloat(item.saldo)) > 0);
        const liabilitasFiltered = liabilitas.filter(item => Math.abs(parseFloat(item.saldo)) > 0);
        const ekuitasFiltered = ekuitas.filter(item => Math.abs(parseFloat(item.saldo)) > 0);

        // 🔥 HITUNG LABA
        let labaParams = [tenant_id, as_of_date, tenant_id, as_of_date];
        let labaQuery = `
            SELECT 
                (SELECT COALESCE(SUM(je.credit - je.debit), 0) 
                 FROM journal_entries je 
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE a.type = 'income' 
                   AND je.tenant_id = ? 
                   AND t.transaction_date <= ?) as pendapatan,
                (SELECT COALESCE(SUM(je.debit - je.credit), 0) 
                 FROM journal_entries je 
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE a.type = 'expense' 
                   AND je.tenant_id = ? 
                   AND t.transaction_date <= ?) as beban
        `;

        if (business_type_id) {
            labaQuery = `
                SELECT 
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0) 
                     FROM journal_entries je 
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE a.type = 'income' 
                       AND je.tenant_id = ? 
                       AND t.transaction_date <= ?
                       AND t.business_type_id = ?) as pendapatan,
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0) 
                     FROM journal_entries je 
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE a.type = 'expense' 
                       AND je.tenant_id = ? 
                       AND t.transaction_date <= ?
                       AND t.business_type_id = ?) as beban
            `;
            labaParams = [tenant_id, as_of_date, business_type_id, tenant_id, as_of_date, business_type_id];
        }

        const [labaResult] = await db.execute(labaQuery, labaParams);

        const pendapatan = parseFloat(labaResult[0]?.pendapatan || 0);
        const beban = parseFloat(labaResult[0]?.beban || 0);
        const labaBersih = pendapatan - beban;

        // 🔥 HITUNG TOTAL
        const totalAset = asetFiltered.reduce((sum, item) => sum + parseFloat(item.saldo), 0);
        const totalLiabilitas = liabilitasFiltered.reduce((sum, item) => sum + parseFloat(item.saldo), 0);
        const totalEkuitas = ekuitasFiltered.reduce((sum, item) => sum + parseFloat(item.saldo), 0) + labaBersih;

        console.log("Total Aset:", totalAset, "Total Liabilitas:", totalLiabilitas, "Total Ekuitas:", totalEkuitas);

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        // ========== GENERATE FILE ==========
        if (format === 'excel') {
            // EXCEL
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Neraca');

            // Header
            worksheet.mergeCells('A1:C1');
            worksheet.getCell('A1').value = 'LAPORAN NERACA';
            worksheet.getCell('A1').font = { size: 16, bold: true };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };

            worksheet.mergeCells('A2:C2');
            worksheet.getCell('A2').value = businessName.toUpperCase();
            worksheet.getCell('A2').font = { size: 14, bold: true };
            worksheet.getCell('A2').alignment = { horizontal: 'center' };

            worksheet.mergeCells('A3:C3');
            worksheet.getCell('A3').value = `Per Tanggal: ${moment(as_of_date).format('DD/MM/YYYY')}`;
            worksheet.getCell('A3').alignment = { horizontal: 'center' };

            worksheet.addRow([]);

            // ASET
            const asetHeader = worksheet.addRow(['ASET', '', '']);
            asetHeader.font = { bold: true };
            asetHeader.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
                c.font = { color: { argb: 'FF065F46' }, bold: true };
            });

            asetFiltered.forEach(item => {
                const row = worksheet.addRow([item.code, item.name, item.saldo]);
                row.getCell(3).numFmt = '#,##0';
            });

            const totalAsetRow = worksheet.addRow(['', 'TOTAL ASET', totalAset]);
            totalAsetRow.font = { bold: true };
            totalAsetRow.getCell(3).numFmt = '#,##0';

            worksheet.addRow([]);

            // UTANG
            const liabHeader = worksheet.addRow(['UTANG', '', '']);
            liabHeader.font = { bold: true };
            liabHeader.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };
                c.font = { color: { argb: 'FF991B1B' }, bold: true };
            });

            liabilitasFiltered.forEach(item => {
                const row = worksheet.addRow([item.code, item.name, item.saldo]);
                row.getCell(3).numFmt = '#,##0';
            });

            const totalLiabRow = worksheet.addRow(['', 'TOTAL UTANG', totalLiabilitas]);
            totalLiabRow.font = { bold: true };
            totalLiabRow.getCell(3).numFmt = '#,##0';

            worksheet.addRow([]);

            // MODAL
            const equityHeader = worksheet.addRow(['MODAL', '', '']);
            equityHeader.font = { bold: true };
            equityHeader.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
                c.font = { color: { argb: 'FF065F46' }, bold: true };
            });

            ekuitasFiltered.forEach(item => {
                const row = worksheet.addRow([item.code, item.name, item.saldo]);
                row.getCell(3).numFmt = '#,##0';
            });

            const labaRow = worksheet.addRow(['', 'LABA TAHUN BERJALAN', labaBersih]);
            labaRow.getCell(3).numFmt = '#,##0';

            const totalEquityRow = worksheet.addRow(['', 'TOTAL MODAL', totalEkuitas]);
            totalEquityRow.font = { bold: true };
            totalEquityRow.getCell(3).numFmt = '#,##0';

            worksheet.addRow([]);

            const finalRow = worksheet.addRow(['', 'TOTAL UTANG & MODAL', totalLiabilitas + totalEkuitas]);
            finalRow.font = { bold: true, size: 12 };
            finalRow.getCell(3).numFmt = '#,##0';
            finalRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
                c.font = { color: { argb: 'FF065F46' }, bold: true };
            });

            // Format kolom
            worksheet.columns = [
                { width: 15 },
                { width: 45 },
                { width: 25 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=neraca_${as_of_date}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();

        } else {
            // PDF
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 40, size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=neraca_${as_of_date}.pdf`);
            doc.pipe(res);

            doc.fontSize(16).font('Helvetica-Bold').text('LAPORAN NERACA', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.fontSize(10).font('Helvetica').text(`Per Tanggal: ${moment(as_of_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            // ASET
            doc.rect(40, doc.y - 5, 515, 20).fill('#ecfdf5');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#065f46').text('ASET', 50, doc.y);
            doc.moveDown(0.8);

            asetFiltered.forEach(item => {
                if (doc.y > 750) doc.addPage();
                doc.fontSize(9).font('Helvetica').fillColor('black');
                const y = doc.y;
                doc.text(`${item.code} - ${item.name}`, 70, y, { width: 300 });
                doc.text(Number(item.saldo).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            doc.font('Helvetica-Bold').fillColor('#065f46');
            const yAset = doc.y;
            doc.rect(40, yAset - 5, 515, 20).fill('#ecfdf5');
            doc.fillColor('#065f46').text('TOTAL ASET', 70, yAset);
            doc.text(`Rp ${totalAset.toLocaleString('id-ID')}`, 450, yAset, { align: 'right', width: 100 });
            doc.moveDown(2);

            // UTANG
            const yLiabStart = doc.y;
            doc.rect(40, yLiabStart - 5, 515, 20).fill('#fef2f2');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#991b1b').text('UTANG', 50, yLiabStart);
            doc.moveDown(0.8);

            liabilitasFiltered.forEach(item => {
                if (doc.y > 750) doc.addPage();
                doc.fontSize(9).font('Helvetica').fillColor('black');
                const y = doc.y;
                doc.text(`${item.code} - ${item.name}`, 70, y, { width: 300 });
                doc.text(Number(item.saldo).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            const yLiabTotal = doc.y;
            doc.rect(40, yLiabTotal - 5, 515, 20).fill('#fef2f2');
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#991b1b');
            doc.text('TOTAL UTANG', 70, yLiabTotal);
            doc.text(`Rp ${totalLiabilitas.toLocaleString('id-ID')}`, 450, yLiabTotal, { align: 'right', width: 100 });
            doc.moveDown(2);

            // MODAL
            const yEquityStart = doc.y;
            doc.rect(40, yEquityStart - 5, 515, 20).fill('#ecfdf5');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#065f46').text('MODAL', 50, yEquityStart);
            doc.moveDown(0.8);

            ekuitasFiltered.forEach(item => {
                if (doc.y > 750) doc.addPage();
                doc.fontSize(9).font('Helvetica').fillColor('black');
                const y = doc.y;
                doc.text(`${item.code} - ${item.name}`, 70, y, { width: 300 });
                doc.text(Number(item.saldo).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            doc.font('Helvetica').fillColor('black');
            const yLaba = doc.y;
            doc.text('LABA TAHUN BERJALAN', 70, yLaba);
            doc.text(labaBersih.toLocaleString('id-ID'), 450, yLaba, { align: 'right', width: 100 });
            doc.moveDown(0.5);

            const yEquityTotal = doc.y;
            doc.rect(40, yEquityTotal - 5, 515, 20).fill('#ecfdf5');
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#065f46');
            doc.text('TOTAL MODAL', 70, yEquityTotal);
            doc.text(`Rp ${totalEkuitas.toLocaleString('id-ID')}`, 450, yEquityTotal, { align: 'right', width: 100 });
            doc.moveDown(2);

            // TOTAL FINAL
            const finalY = doc.y;
            doc.rect(40, finalY - 5, 515, 25).fill('#ecfdf5');
            doc.fontSize(13).font('Helvetica-Bold').fillColor('#065f46');
            doc.text('TOTAL UTANG & MODAL', 50, finalY);
            doc.text(`Rp ${(totalLiabilitas + totalEkuitas).toLocaleString('id-ID')}`, 450, finalY, { align: 'right', width: 100 });

            doc.end();
        }

    } catch (err) {
        console.error("Export Balance Sheet Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// =============================================
// EXPORT ARUS KAS
// =============================================
const exportCashFlow = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id, format } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "start_date dan end_date diperlukan"
            });
        }

        let transactionFilter = "";
        const params = [tenant_id, start_date, end_date];

        if (business_type_id) {
            transactionFilter = " AND t.business_type_id = ?";
            params.push(business_type_id);
        }

        // 1. Ambil detail Kas Masuk
        const [inflowItems] = await db.execute(`
            SELECT 
                DATE_FORMAT(t.transaction_date, '%d/%m/%Y') as date,
                t.description,
                je.debit as amount
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            LEFT JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE je.tenant_id = ? 
                AND (a.code LIKE '11%' OR a.code LIKE '12%')
                AND (cat.is_adjustment IS NULL OR cat.is_adjustment = 0)
                AND je.debit > 0
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            ORDER BY t.transaction_date ASC
        `, params);

        // 2. Ambil detail Kas Keluar
        const [outflowItems] = await db.execute(`
            SELECT 
                DATE_FORMAT(t.transaction_date, '%d/%m/%Y') as date,
                t.description,
                je.credit as amount
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            LEFT JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE je.tenant_id = ? 
                AND (a.code LIKE '11%' OR a.code LIKE '12%')
                AND (cat.is_adjustment IS NULL OR cat.is_adjustment = 0)
                AND je.credit > 0
                AND t.transaction_date BETWEEN ? AND ?
                ${transactionFilter}
            ORDER BY t.transaction_date ASC
        `, params);

        const cashIn = inflowItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const cashOut = outflowItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const netCash = cashIn - cashOut;

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Arus Kas');

            // Header
            worksheet.mergeCells('A1:C1');
            worksheet.getCell('A1').value = 'LAPORAN ARUS KAS';
            worksheet.getCell('A1').font = { size: 16, bold: true };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };

            worksheet.mergeCells('A2:C2');
            worksheet.getCell('A2').value = businessName.toUpperCase();
            worksheet.getCell('A2').font = { size: 14, bold: true };
            worksheet.getCell('A2').alignment = { horizontal: 'center' };

            worksheet.mergeCells('A3:C3');
            worksheet.getCell('A3').value = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
            worksheet.getCell('A3').alignment = { horizontal: 'center' };

            worksheet.addRow([]);

            // KAS MASUK
            const inHeader = worksheet.addRow(['KAS MASUK', '', '']);
            inHeader.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
                c.font = { color: { argb: 'FF065F46' }, bold: true };
            });

            const inColHeader = worksheet.addRow(['Tanggal', 'Deskripsi', 'Nominal']);
            inColHeader.eachCell(c => {
                c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
            });

            inflowItems.forEach(item => {
                const row = worksheet.addRow([item.date, item.description || '-', item.amount]);
                row.getCell(3).numFmt = '#,##0';
            });

            const totalInRow = worksheet.addRow(['', 'TOTAL KAS MASUK', cashIn]);
            totalInRow.font = { bold: true };
            totalInRow.getCell(3).numFmt = '#,##0';

            worksheet.addRow([]);

            // KAS KELUAR
            const outHeader = worksheet.addRow(['KAS KELUAR', '', '']);
            outHeader.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };
                c.font = { color: { argb: 'FF991B1B' }, bold: true };
            });

            const outColHeader = worksheet.addRow(['Tanggal', 'Deskripsi', 'Nominal']);
            outColHeader.eachCell(c => {
                c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };
            });

            outflowItems.forEach(item => {
                const row = worksheet.addRow([item.date, item.description || '-', item.amount]);
                row.getCell(3).numFmt = '#,##0';
            });

            const totalOutRow = worksheet.addRow(['', 'TOTAL KAS KELUAR', cashOut]);
            totalOutRow.font = { bold: true };
            totalOutRow.getCell(3).numFmt = '#,##0';

            worksheet.addRow([]);

            // TOTAL
            const netRow = worksheet.addRow(['', 'ARUS KAS BERSIH', netCash]);
            netRow.font = { bold: true, size: 12 };
            netRow.getCell(3).numFmt = '#,##0';
            const netColor = netCash >= 0 ? 'FFECFDF5' : 'FFFEF2F2';
            netRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: netColor } };
            });

            worksheet.columns = [
                { width: 15 },
                { width: 45 },
                { width: 25 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=arus_kas_${start_date}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();

        } else {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=arus_kas_${start_date}.pdf`);
            doc.pipe(res);

            doc.fontSize(16).font('Helvetica-Bold').text('LAPORAN ARUS KAS', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.fontSize(10).font('Helvetica').text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            // KAS MASUK
            doc.rect(40, doc.y - 5, 515, 20).fill('#ecfdf5');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#065f46').text('KAS MASUK', 50, doc.y);
            doc.moveDown(0.8);

            doc.fontSize(9).font('Helvetica-Bold').fillColor('black');
            const hInY = doc.y;
            doc.text('Tanggal', 50, hInY);
            doc.text('Deskripsi', 150, hInY);
            doc.text('Nominal', 450, hInY, { align: 'right', width: 100 });
            doc.moveTo(40, hInY + 12).lineTo(555, hInY + 12).strokeColor('#10b981').lineWidth(0.5).stroke();
            doc.moveDown(0.5);

            doc.font('Helvetica').fontSize(9).fillColor('black');
            inflowItems.forEach(item => {
                if (doc.y > 750) doc.addPage();
                const y = doc.y;
                doc.text(item.date, 50, y);
                doc.text(item.description || '-', 150, y, { width: 280 });
                doc.text(Number(item.amount).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            // Total Kas Masuk
            const totalInY = doc.y;
            doc.rect(40, totalInY - 5, 515, 20).fill('#ecfdf5');
            doc.font('Helvetica-Bold').fillColor('#065f46');
            doc.text('TOTAL KAS MASUK', 150, totalInY);
            doc.text(`Rp ${cashIn.toLocaleString('id-ID')}`, 450, totalInY, { align: 'right', width: 100 });
            doc.moveDown(2);

            // KAS KELUAR
            doc.rect(40, doc.y - 5, 515, 20).fill('#fef2f2');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#991b1b').text('KAS KELUAR', 50, doc.y);
            doc.moveDown(0.8);

            doc.fontSize(9).font('Helvetica-Bold').fillColor('black');
            const hOutY = doc.y;
            doc.text('Tanggal', 50, hOutY);
            doc.text('Deskripsi', 150, hOutY);
            doc.text('Nominal', 450, hOutY, { align: 'right', width: 100 });
            doc.moveTo(40, hOutY + 12).lineTo(555, hOutY + 12).strokeColor('#ef4444').lineWidth(0.5).stroke();
            doc.moveDown(0.5);

            doc.font('Helvetica').fontSize(9).fillColor('black');
            outflowItems.forEach(item => {
                if (doc.y > 750) doc.addPage();
                const y = doc.y;
                doc.text(item.date, 50, y);
                doc.text(item.description || '-', 150, y, { width: 280 });
                doc.text(Number(item.amount).toLocaleString('id-ID'), 450, y, { align: 'right', width: 100 });
                doc.moveDown(0.5);
            });

            // Total Kas Keluar
            const totalOutY = doc.y;
            doc.rect(40, totalOutY - 5, 515, 20).fill('#fef2f2');
            doc.font('Helvetica-Bold').fillColor('#991b1b');
            doc.text('TOTAL KAS KELUAR', 150, totalOutY);
            doc.text(`Rp ${cashOut.toLocaleString('id-ID')}`, 450, totalOutY, { align: 'right', width: 100 });
            doc.moveDown(2);

            const finalY = doc.y;
            const netColor = netCash >= 0 ? '#065f46' : '#991b1b';
            const netBg = netCash >= 0 ? '#ecfdf5' : '#fef2f2';
            doc.rect(40, finalY - 5, 515, 25).fill(netBg);
            doc.fontSize(14).font('Helvetica-Bold').fillColor(netColor);
            doc.text('ARUS KAS BERSIH', 150, finalY);
            doc.text(`Rp ${netCash.toLocaleString('id-ID')}${netCash < 0 ? ' (DEFISIT)' : ''}`, 450, finalY, { align: 'right', width: 100 });

            doc.end();
        }

    } catch (err) {
        console.error("Export Cash Flow Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// =============================================
// GET EQUITY CHANGE (PERUBAHAN MODAL)
// =============================================
const getEquityChange = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ success: false, message: "start_date dan end_date harus diisi" });
        }

        // 1. MODAL AWAL - saldo akun modal pada tanggal awal periode (termasuk transaksi di tanggal awal)
        // Transaksi setoran modal PADA start_date dianggap sebagai Modal Awal (modal usaha pertama)
        // Penambahan modal hanya untuk transaksi SETELAH start_date
        let queryModalAwal = `
            SELECT 
                (SELECT COALESCE(SUM(CASE WHEN ob.side = 'credit' THEN ob.amount ELSE -ob.amount END), 0)
                 FROM opening_balances ob
                 JOIN accounts a ON ob.account_id = a.id
                 WHERE ob.tenant_id = ? AND a.type = 'equity' AND ob.as_of_date <= ?) as opening_equity_balance,
                 
                (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.type = 'equity' AND a.code != '3301' AND t.transaction_date <= ?) as accumulated_capital,
                 
                (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.code = '3301' AND t.transaction_date <= ?) as accumulated_prive,
                 
                (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.type = 'income' AND t.transaction_date < ?) as accumulated_income,
                 
                (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.type = 'expense' AND t.transaction_date < ?) as accumulated_expense
        `;
        let paramsModal = [
            tenant_id, start_date, 
            tenant_id, start_date, 
            tenant_id, start_date, 
            tenant_id, start_date, 
            tenant_id, start_date
        ];

        if (business_type_id) {
            queryModalAwal = `
                SELECT 
                    (SELECT COALESCE(SUM(CASE WHEN ob.side = 'credit' THEN ob.amount ELSE -ob.amount END), 0)
                     FROM opening_balances ob
                     JOIN accounts a ON ob.account_id = a.id
                     WHERE ob.tenant_id = ? AND a.type = 'equity' AND ob.as_of_date <= ? AND ob.business_type_id = ?) as opening_equity_balance,
                     
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.type = 'equity' AND a.code != '3301' AND t.transaction_date <= ? AND t.business_type_id = ?) as accumulated_capital,
                     
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.code = '3301' AND t.transaction_date <= ? AND t.business_type_id = ?) as accumulated_prive,
                     
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.type = 'income' AND t.transaction_date < ? AND t.business_type_id = ?) as accumulated_income,
                     
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.type = 'expense' AND t.transaction_date < ? AND t.business_type_id = ?) as accumulated_expense
            `;
            paramsModal = [
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id
            ];
        }

        const [beginningEquityRows] = await db.execute(queryModalAwal, paramsModal);
        const rowModal = beginningEquityRows[0] || {};
        const openingEqBal = parseFloat(rowModal.opening_equity_balance) || 0;
        const accCapital = parseFloat(rowModal.accumulated_capital) || 0;
        const accPrive = parseFloat(rowModal.accumulated_prive) || 0;
        const accIncome = parseFloat(rowModal.accumulated_income) || 0;
        const accExpense = parseFloat(rowModal.accumulated_expense) || 0;
        
        const beginningEquity = openingEqBal + accCapital + (accIncome - accExpense) - accPrive;

        // 2. LABA/RUGI BERSIH - dari income - expense
        let queryLaba = `
            SELECT 
                COALESCE(SUM(CASE WHEN a.type = 'income' THEN je.credit - je.debit ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN a.type = 'expense' THEN je.debit - je.credit ELSE 0 END), 0) as total_expense
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? AND t.transaction_date BETWEEN ? AND ?
        `;
        let paramsLaba = [tenant_id, start_date, end_date];

        if (business_type_id) {
            queryLaba += ` AND t.business_type_id = ?`;
            paramsLaba.push(business_type_id);
        }

        const [netIncomeRows] = await db.execute(queryLaba, paramsLaba);
        const totalIncome = parseFloat(netIncomeRows[0]?.total_income || 0);
        const totalExpense = parseFloat(netIncomeRows[0]?.total_expense || 0);
        const netIncome = totalIncome - totalExpense;

        // 3. PRIVE - dari akun 3301 (hanya setelah tanggal awal, karena prive di start_date sudah masuk Modal Awal)
        let queryPrive = `
            SELECT COALESCE(SUM(je.debit), 0) as total
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? AND a.code = '3301' AND t.transaction_date > ? AND t.transaction_date <= ?
        `;
        let paramsPrive = [tenant_id, start_date, end_date];

        if (business_type_id) {
            queryPrive += ` AND t.business_type_id = ?`;
            paramsPrive.push(business_type_id);
        }

        const [withdrawalsRows] = await db.execute(queryPrive, paramsPrive);
        const withdrawals = parseFloat(withdrawalsRows[0].total) || 0;

        // 4. PENAMBAHAN MODAL - investasi (category_type = 'capital'), hanya transaksi SETELAH tanggal awal
        // Transaksi modal pada tanggal awal periode sudah dihitung sebagai Modal Awal
        let queryCapital = `
            SELECT COALESCE(SUM(je.credit - je.debit), 0) as total
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE je.tenant_id = ? AND a.type = 'equity' AND a.code != '3301' AND cat.category_type = 'capital' AND t.transaction_date > ? AND t.transaction_date <= ?
        `;
        let paramsCapital = [tenant_id, start_date, end_date];

        if (business_type_id) {
            queryCapital += ` AND t.business_type_id = ?`;
            paramsCapital.push(business_type_id);
        }

        const [additionalCapitalRows] = await db.execute(queryCapital, paramsCapital);
        const additionalCapital = parseFloat(additionalCapitalRows[0].total) || 0;

        // 5. MODAL AKHIR
        const endingEquity = beginningEquity + netIncome + additionalCapital - withdrawals;

        res.json({
            success: true,
            data: {
                beginning_equity: beginningEquity,
                net_income: netIncome,
                additional_capital: additionalCapital,
                withdrawals: withdrawals,
                ending_equity: endingEquity
            }
        });

    } catch (err) {
        console.error("Get Equity Change Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================
// EXPORT EQUITY CHANGE
// =============================================
const exportEquityChange = async (req, res) => {
    try {
        const { format, start_date, end_date, business_type_id } = req.query;
        const tenant_id = req.user.tenant_id;

        // 1. MODAL AWAL - akumulasi dari saldo awal + (modal + laba - prive) sebelum start_date
        let queryModalAwal = `
            SELECT 
                (SELECT COALESCE(SUM(CASE WHEN ob.side = 'credit' THEN ob.amount ELSE -ob.amount END), 0)
                 FROM opening_balances ob
                 JOIN accounts a ON ob.account_id = a.id
                 WHERE ob.tenant_id = ? AND a.type = 'equity' AND ob.as_of_date <= ?) as opening_equity_balance,
                 
                (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.type = 'equity' AND a.code != '3301' AND t.transaction_date < ?) as accumulated_capital,
                 
                (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.code = '3301' AND t.transaction_date < ?) as accumulated_prive,
                 
                (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.type = 'income' AND t.transaction_date < ?) as accumulated_income,
                 
                (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                 FROM journal_entries je
                 JOIN accounts a ON je.account_id = a.id
                 JOIN transactions t ON je.transaction_id = t.id
                 WHERE je.tenant_id = ? AND a.type = 'expense' AND t.transaction_date < ?) as accumulated_expense
        `;
        let paramsModal = [
            tenant_id, start_date, 
            tenant_id, start_date, 
            tenant_id, start_date, 
            tenant_id, start_date, 
            tenant_id, start_date
        ];

        if (business_type_id) {
            queryModalAwal = `
                SELECT 
                    (SELECT COALESCE(SUM(CASE WHEN ob.side = 'credit' THEN ob.amount ELSE -ob.amount END), 0)
                     FROM opening_balances ob
                     JOIN accounts a ON ob.account_id = a.id
                     WHERE ob.tenant_id = ? AND a.type = 'equity' AND ob.as_of_date <= ? AND ob.business_type_id = ?) as opening_equity_balance,
                     
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.type = 'equity' AND a.code != '3301' AND t.transaction_date < ? AND t.business_type_id = ?) as accumulated_capital,
                     
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.code = '3301' AND t.transaction_date < ? AND t.business_type_id = ?) as accumulated_prive,
                     
                    (SELECT COALESCE(SUM(je.credit - je.debit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.type = 'income' AND t.transaction_date < ? AND t.business_type_id = ?) as accumulated_income,
                     
                    (SELECT COALESCE(SUM(je.debit - je.credit), 0)
                     FROM journal_entries je
                     JOIN accounts a ON je.account_id = a.id
                     JOIN transactions t ON je.transaction_id = t.id
                     WHERE je.tenant_id = ? AND a.type = 'expense' AND t.transaction_date < ? AND t.business_type_id = ?) as accumulated_expense
            `;
            paramsModal = [
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id,
                tenant_id, start_date, business_type_id
            ];
        }

        const [beginningEquityRows] = await db.execute(queryModalAwal, paramsModal);
        const rowModal = beginningEquityRows[0] || {};
        const openingEqBal = parseFloat(rowModal.opening_equity_balance) || 0;
        const accCapital = parseFloat(rowModal.accumulated_capital) || 0;
        const accPrive = parseFloat(rowModal.accumulated_prive) || 0;
        const accIncome = parseFloat(rowModal.accumulated_income) || 0;
        const accExpense = parseFloat(rowModal.accumulated_expense) || 0;
        
        const beginningEquity = openingEqBal + accCapital + (accIncome - accExpense) - accPrive;

        // 2. LABA/RUGI BERSIH
        let queryLaba = `
            SELECT 
                COALESCE(SUM(CASE WHEN a.type = 'income' THEN je.credit - je.debit ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN a.type = 'expense' THEN je.debit - je.credit ELSE 0 END), 0) as total_expense
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? AND t.transaction_date BETWEEN ? AND ?
        `;
        let paramsLaba = [tenant_id, start_date, end_date];

        if (business_type_id) {
            queryLaba += ` AND t.business_type_id = ?`;
            paramsLaba.push(business_type_id);
        }

        const [netIncomeRows] = await db.execute(queryLaba, paramsLaba);
        const totalIncome = parseFloat(netIncomeRows[0]?.total_income || 0);
        const totalExpense = parseFloat(netIncomeRows[0]?.total_expense || 0);
        const netIncome = totalIncome - totalExpense;

        // 3. PRIVE
        let queryPrive = `
            SELECT COALESCE(SUM(je.debit), 0) as total
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            WHERE je.tenant_id = ? AND a.code = '3301' AND t.transaction_date BETWEEN ? AND ?
        `;
        let paramsPrive = [tenant_id, start_date, end_date];

        if (business_type_id) {
            queryPrive += ` AND t.business_type_id = ?`;
            paramsPrive.push(business_type_id);
        }

        const [withdrawalsRows] = await db.execute(queryPrive, paramsPrive);
        const withdrawals = parseFloat(withdrawalsRows[0].total) || 0;

        // 4. PENAMBAHAN MODAL
        let queryCapital = `
            SELECT COALESCE(SUM(je.credit - je.debit), 0) as total
            FROM journal_entries je
            JOIN accounts a ON je.account_id = a.id
            JOIN transactions t ON je.transaction_id = t.id
            JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE je.tenant_id = ? AND a.type = 'equity' AND a.code != '3301' AND cat.category_type = 'capital' AND t.transaction_date BETWEEN ? AND ?
        `;
        let paramsCapital = [tenant_id, start_date, end_date];

        if (business_type_id) {
            queryCapital += ` AND t.business_type_id = ?`;
            paramsCapital.push(business_type_id);
        }

        const [additionalCapitalRows] = await db.execute(queryCapital, paramsCapital);
        const additionalCapital = parseFloat(additionalCapitalRows[0].total) || 0;

        const endingEquity = beginningEquity + netIncome + additionalCapital - withdrawals;

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        if (format === 'excel') {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Perubahan Modal');

            sheet.mergeCells('A1:B1');
            sheet.getCell('A1').value = 'LAPORAN PERUBAHAN MODAL';
            sheet.getCell('A1').font = { size: 16, bold: true };
            sheet.getCell('A1').alignment = { horizontal: 'center' };

            sheet.mergeCells('A2:B2');
            sheet.getCell('A2').value = businessName.toUpperCase();
            sheet.getCell('A2').font = { size: 14, bold: true };
            sheet.getCell('A2').alignment = { horizontal: 'center' };

            sheet.mergeCells('A3:B3');
            sheet.getCell('A3').value = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
            sheet.getCell('A3').alignment = { horizontal: 'center' };

            sheet.addRow([]);

            const tableHeader = sheet.addRow(['Keterangan', 'Nilai (Rp)']);
            tableHeader.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
                c.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            });

            const data = [
                ['Modal Awal', beginningEquity],
                [netIncome >= 0 ? 'Laba Bersih' : 'Rugi Bersih', netIncome],
                ['Penambahan Modal', additionalCapital],
                ['Penarikan Pribadi (Prive)', -withdrawals],
                ['Modal Akhir', endingEquity]
            ];

            data.forEach((item, idx) => {
                const row = sheet.addRow(item);
                row.getCell(2).numFmt = '#,##0';
                if (idx === data.length - 1) {
                    row.font = { bold: true };
                    row.eachCell(c => {
                        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
                        c.font = { color: { argb: 'FF065F46' }, bold: true };
                    });
                }
            });

            sheet.columns = [{ width: 40 }, { width: 25 }];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=perubahan_modal_${start_date}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();

        } else if (format === 'pdf') {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=perubahan_modal_${start_date}.pdf`);
            doc.pipe(res);

            doc.fontSize(16).font('Helvetica-Bold').text('LAPORAN PERUBAHAN MODAL', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.fontSize(10).font('Helvetica').text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            const tableTop = doc.y;
            doc.rect(50, tableTop - 5, 495, 20).fill('#235347');
            doc.fillColor('white').font('Helvetica-Bold').fontSize(11);
            doc.text('Keterangan', 60, tableTop);
            doc.text('Nilai (Rp)', 400, tableTop, { align: 'right', width: 130 });

            let y = tableTop + 25;
            const items = [
                { label: 'Modal Awal', val: beginningEquity },
                { label: netIncome >= 0 ? 'Laba Bersih' : 'Rugi Bersih', val: netIncome },
                { label: 'Penambahan Modal', val: additionalCapital },
                { label: 'Penarikan (Prive)', val: -withdrawals },
                { label: 'Modal Akhir', val: endingEquity, isTotal: true }
            ];

            items.forEach(item => {
                if (item.isTotal) {
                    doc.rect(50, y - 5, 495, 25).fill('#ecfdf5');
                    doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(12);
                } else {
                    doc.fillColor('black').font('Helvetica').fontSize(11);
                }
                doc.text(item.label, 60, y);
                doc.text(Number(item.val).toLocaleString('id-ID'), 400, y, { align: 'right', width: 130 });
                y += 25;
            });

            doc.end();
        } else {
            res.status(400).json({ success: false, message: "Format tidak didukung" });
        }
    } catch (err) {
        console.error("Export Equity Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================
// EXPORT JURNAL UMUM
// =============================================
const exportGeneralJournal = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id, format } = req.query;

        const [rows] = await db.execute(`
            SELECT 
                t.transaction_date, t.description,
                ad.code AS debit_code, ad.name AS debit_name, d.debit,
                ac.code AS credit_code, ac.name AS credit_name, c.credit
            FROM transactions t
            JOIN journal_entries d ON t.id = d.transaction_id AND d.debit > 0 AND d.tenant_id = ?
            JOIN accounts ad ON d.account_id = ad.id
            JOIN journal_entries c ON t.id = c.transaction_id AND c.credit > 0 AND c.tenant_id = ?
            JOIN accounts ac ON c.account_id = ac.id
            WHERE t.tenant_id = ? AND t.type != 'opening_balance'
            AND t.transaction_date BETWEEN ? AND ?
            ${business_type_id ? 'AND t.business_type_id = ?' : ''}
            ORDER BY t.transaction_date DESC, t.id DESC
        `, business_type_id ? [tenant_id, tenant_id, tenant_id, start_date, end_date, business_type_id] : [tenant_id, tenant_id, tenant_id, start_date, end_date]);

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Jurnal Umum');

            sheet.mergeCells('A1:H1');
            sheet.getCell('A1').value = 'LAPORAN JURNAL UMUM';
            sheet.getCell('A1').font = { size: 16, bold: true };
            sheet.getCell('A1').alignment = { horizontal: 'center' };

            sheet.mergeCells('A2:H2');
            sheet.getCell('A2').value = businessName.toUpperCase();
            sheet.getCell('A2').font = { size: 14, bold: true };
            sheet.getCell('A2').alignment = { horizontal: 'center' };

            sheet.mergeCells('A3:H3');
            sheet.getCell('A3').value = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
            sheet.getCell('A3').alignment = { horizontal: 'center' };

            sheet.addRow([]);
            const header = sheet.addRow(['Tanggal', 'Kode Debit', 'Nama Debit', 'Debit', 'Kode Kredit', 'Nama Kredit', 'Kredit', 'Keterangan']);
            header.font = { bold: true };
            header.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
                c.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            });

            rows.forEach(r => {
                const row = sheet.addRow([
                    moment(r.transaction_date).format('DD/MM/YYYY'),
                    r.debit_code, r.debit_name, r.debit,
                    r.credit_code, r.credit_name, r.credit,
                    r.description || '-'
                ]);
                row.getCell(4).numFmt = '#,##0'; // Debit
                row.getCell(7).numFmt = '#,##0'; // Kredit
            });

            sheet.columns.forEach((col, i) => { col.width = [15, 12, 25, 15, 12, 25, 15, 35][i]; });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=jurnal_umum_${start_date}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } else {
            const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=jurnal_umum_${start_date}.pdf`);
            doc.pipe(res);

            doc.font('Helvetica-Bold').fontSize(16).text('LAPORAN JURNAL UMUM', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.font('Helvetica').fontSize(10).text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            const tableTop = 120;
            const colPos = [30, 95, 150, 260, 350, 405, 515, 605];
            const colWidths = [65, 55, 110, 90, 55, 110, 90, 145];
            const headers = ['Tanggal', 'Kode D', 'Nama Debit', 'Debit', 'Kode K', 'Nama Kredit', 'Kredit', 'Keterangan'];

            // DRAW HEADER BACKGROUND
            doc.rect(30, tableTop - 5, 720, 20).fill('#ecfdf5');
            doc.fillColor('#065f46'); // Dark green text for header

            doc.fontSize(9).font('Helvetica-Bold');
            headers.forEach((h, i) => {
                doc.text(h, colPos[i], tableTop, { width: colWidths[i], align: 'left' });
            });

            doc.moveTo(30, tableTop + 15).lineTo(750, tableTop + 15).strokeColor('#10b981').lineWidth(0.5).stroke();
            doc.fillColor('black'); // Reset text color
            doc.font('Helvetica').fontSize(8);
            let y = tableTop + 25;
            rows.forEach(r => {
                if (y > 520) { doc.addPage(); y = 50; }
                doc.text(moment(r.transaction_date).format('DD/MM/YY'), colPos[0], y);
                doc.text(r.debit_code, colPos[1], y);
                doc.text(r.debit_name, colPos[2], y, { width: colWidths[2] });
                doc.text(`Rp ${r.debit.toLocaleString('id-ID')}`, colPos[3], y, { width: colWidths[3] });
                doc.text(r.credit_code, colPos[4], y);
                doc.text(r.credit_name, colPos[5], y, { width: colWidths[5] });
                doc.text(`Rp ${r.credit.toLocaleString('id-ID')}`, colPos[6], y, { width: colWidths[6] });
                doc.text(r.description || '-', colPos[7], y, { width: colWidths[7] });
                y += 20;
            });
            doc.end();
        }
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// =============================================
// EXPORT JURNAL PENYESUAIAN
// =============================================
const exportAdjustingJournal = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id, format } = req.query;

        const [rows] = await db.execute(`
            SELECT 
                t.transaction_date, t.description,
                ad.code AS debit_code, ad.name AS debit_name, d.debit,
                ac.code AS credit_code, ac.name AS credit_name, c.credit
            FROM transactions t
            JOIN journal_entries d ON t.id = d.transaction_id AND d.debit > 0 AND d.tenant_id = ?
            JOIN accounts ad ON d.account_id = ad.id
            JOIN journal_entries c ON t.id = c.transaction_id AND c.credit > 0 AND c.tenant_id = ?
            JOIN accounts ac ON c.account_id = ac.id
            JOIN business_type_categories cat ON t.category_id = cat.id
            WHERE t.tenant_id = ? AND cat.is_adjustment = 1
            AND t.transaction_date BETWEEN ? AND ?
            ${business_type_id ? 'AND t.business_type_id = ?' : ''}
            ORDER BY t.transaction_date DESC, t.id DESC
        `, business_type_id ? [tenant_id, tenant_id, tenant_id, start_date, end_date, business_type_id] : [tenant_id, tenant_id, tenant_id, start_date, end_date]);

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Jurnal Penyesuaian');

            sheet.mergeCells('A1:H1');
            sheet.getCell('A1').value = 'LAPORAN JURNAL PENYESUAIAN';
            sheet.getCell('A1').font = { size: 16, bold: true };
            sheet.getCell('A1').alignment = { horizontal: 'center' };

            sheet.mergeCells('A2:H2');
            sheet.getCell('A2').value = businessName.toUpperCase();
            sheet.getCell('A2').font = { size: 14, bold: true };
            sheet.getCell('A2').alignment = { horizontal: 'center' };

            sheet.mergeCells('A3:H3');
            sheet.getCell('A3').value = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
            sheet.getCell('A3').alignment = { horizontal: 'center' };

            sheet.addRow([]);
            const header = sheet.addRow(['Tanggal', 'Kode Debit', 'Nama Debit', 'Debit', 'Kode Kredit', 'Nama Kredit', 'Kredit', 'Keterangan']);
            header.font = { bold: true };
            header.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
                c.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            });

            rows.forEach(r => {
                const row = sheet.addRow([
                    moment(r.transaction_date).format('DD/MM/YYYY'),
                    r.debit_code, r.debit_name, r.debit,
                    r.credit_code, r.credit_name, r.credit,
                    r.description || '-'
                ]);
                row.getCell(4).numFmt = '#,##0'; // Debit
                row.getCell(7).numFmt = '#,##0'; // Kredit
            });

            sheet.columns.forEach((col, i) => { col.width = [15, 12, 25, 15, 12, 25, 15, 35][i]; });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=jurnal_penyesuaian_${start_date}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } else {
            const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=jurnal_penyesuaian_${start_date}.pdf`);
            doc.pipe(res);

            doc.font('Helvetica-Bold').fontSize(16).text('LAPORAN JURNAL PENYESUAIAN', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.font('Helvetica').fontSize(10).text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            const tableTop = 120;
            const colPos = [30, 95, 150, 260, 350, 405, 515, 605];
            const colWidths = [65, 55, 110, 90, 55, 110, 90, 145];
            const headers = ['Tanggal', 'Kode D', 'Nama Debit', 'Debit', 'Kode K', 'Nama Kredit', 'Kredit', 'Keterangan'];

            // DRAW HEADER BACKGROUND
            doc.rect(30, tableTop - 5, 720, 20).fill('#ecfdf5');
            doc.fillColor('#065f46');

            doc.fontSize(9).font('Helvetica-Bold');
            headers.forEach((h, i) => {
                doc.text(h, colPos[i], tableTop, { width: colWidths[i], align: 'left' });
            });

            doc.moveTo(30, tableTop + 15).lineTo(750, tableTop + 15).strokeColor('#10b981').lineWidth(0.5).stroke();
            doc.fillColor('black');
            doc.font('Helvetica').fontSize(8);
            let y = tableTop + 25;
            rows.forEach(r => {
                if (y > 520) { doc.addPage(); y = 50; }
                doc.text(moment(r.transaction_date).format('DD/MM/YY'), colPos[0], y);
                doc.text(r.debit_code, colPos[1], y);
                doc.text(r.debit_name, colPos[2], y, { width: colWidths[2] });
                doc.text(`Rp ${r.debit.toLocaleString('id-ID')}`, colPos[3], y, { width: colWidths[3] });
                doc.text(r.credit_code, colPos[4], y);
                doc.text(r.credit_name, colPos[5], y, { width: colWidths[5] });
                doc.text(`Rp ${r.credit.toLocaleString('id-ID')}`, colPos[6], y, { width: colWidths[6] });
                doc.text(r.description || '-', colPos[7], y, { width: colWidths[7] });
                y += 20;
            });
            doc.end();
        }
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// =============================================
// EXPORT BUKU BESAR
// =============================================
const exportLedger = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id, format } = req.query;

        const [rows] = await db.execute(`
            SELECT a.code, a.name, a.type, t.transaction_date, t.description, je.debit, je.credit
            FROM journal_entries je
            JOIN transactions t ON je.transaction_id = t.id
            JOIN accounts a ON je.account_id = a.id
            WHERE je.tenant_id = ? AND t.transaction_date BETWEEN ? AND ?
            ${business_type_id ? 'AND t.business_type_id = ?' : ''}
            ORDER BY FIELD(a.type, 'asset', 'liability', 'equity', 'income', 'expense'), a.code ASC, t.transaction_date ASC
        `, business_type_id ? [tenant_id, start_date, end_date, business_type_id] : [tenant_id, start_date, end_date]);

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        // Grouping by account
        const accounts = {};
        rows.forEach(r => {
            if (!accounts[r.code]) accounts[r.code] = { code: r.code, name: r.name, items: [] };
            accounts[r.code].items.push(r);
        });

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Buku Besar');
            sheet.addRow(['LAPORAN BUKU BESAR']).font = { bold: true, size: 16 };
            sheet.addRow([businessName.toUpperCase()]).font = { bold: true };
            sheet.addRow([`Periode: ${start_date} - ${end_date}`]);
            sheet.addRow([]);

            Object.values(accounts).forEach(acc => {
                const accRow = sheet.addRow([`AKUN: [${acc.code}] ${acc.name}`]);
                accRow.font = { bold: true };
                accRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }; // Light green

                const header = sheet.addRow(['Tanggal', 'Keterangan', 'Debit', 'Kredit']);
                header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                header.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
                });
                acc.items.forEach(item => {
                    const r = sheet.addRow([moment(item.transaction_date).format('DD/MM/YYYY'), item.description, item.debit, item.credit]);
                    r.getCell(3).numFmt = '#,##0'; r.getCell(4).numFmt = '#,##0';
                });
                sheet.addRow([]);
            });
            sheet.columns.forEach((col, i) => { col.width = [15, 40, 20, 20][i]; });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=buku_besar.xlsx`);
            await workbook.xlsx.write(res); res.end();
        } else {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=buku_besar.pdf`);
            doc.pipe(res);
            doc.font('Helvetica-Bold').fontSize(16).text('LAPORAN BUKU BESAR', { align: 'center' });
            doc.fontSize(12).text(businessName.toUpperCase(), { align: 'center' });
            doc.font('Helvetica').fontSize(10).text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);
            Object.values(accounts).forEach(acc => {
                if (doc.y > 650) doc.addPage();

                // Account Title - Explicitly set x=50 to avoid inheriting x from previous calls
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e293b').text(`AKUN: [${acc.code}] ${acc.name}`, 50, doc.y);
                doc.fillColor('black').font('Helvetica').fontSize(9);
                doc.moveDown(0.5);

                // Table Header for this account
                const headerY = doc.y;
                doc.rect(50, headerY - 3, 490, 15).fill('#ecfdf5');
                doc.fillColor('#065f46').font('Helvetica-Bold');

                doc.text('Tgl', 50, headerY);
                doc.text('Keterangan', 110, headerY);
                doc.text('Debit', 320, headerY, { width: 100, align: 'left' });
                doc.text('Kredit', 430, headerY, { width: 100, align: 'left' });

                doc.moveTo(50, headerY + 12).lineTo(540, headerY + 12).strokeColor('#10b981').lineWidth(0.5).stroke();
                doc.fillColor('black').font('Helvetica');

                let y = headerY + 18;
                acc.items.forEach(item => {
                    if (y > 750) {
                        doc.addPage();
                        y = 50;
                        // Re-add header on new page if items continue
                        doc.rect(50, y - 3, 490, 35).fill('#ecfdf5');
                        doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(10).text(`AKUN: [${acc.code}] ${acc.name} (Lanjutan)`, 50, y);
                        y += 20;
                        doc.fontSize(9).text('Tgl', 50, y);
                        doc.text('Keterangan', 110, y);
                        doc.text('Debit', 320, y, { width: 100, align: 'left' });
                        doc.text('Kredit', 430, y, { width: 100, align: 'left' });
                        doc.moveTo(50, y + 12).lineTo(540, y + 12).strokeColor('#10b981').lineWidth(0.5).stroke();
                        doc.fillColor('black');
                        y += 18;
                    }

                    const dVal = Number(item.debit) || 0;
                    const cVal = Number(item.credit) || 0;

                    doc.font('Helvetica');
                    doc.text(moment(item.transaction_date).format('DD/MM/YY'), 50, y);
                    doc.text(item.description || '-', 110, y, { width: 200 });
                    doc.text(dVal > 0 ? `Rp ${dVal.toLocaleString('id-ID')}` : '-', 320, y, { width: 100, align: 'left' });
                    doc.text(cVal > 0 ? `Rp ${cVal.toLocaleString('id-ID')}` : '-', 430, y, { width: 100, align: 'left' });

                    y += 18;
                });

                doc.y = y;
                doc.moveDown(1.5);
            });
            doc.end();
        }
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// =============================================
// EXPORT NERACA SALDO
// =============================================
const exportTrialBalance = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { start_date, end_date, business_type_id, format } = req.query;

        const [rows] = await db.execute(`
            SELECT a.code, a.name, SUM(je.debit) as total_debit, SUM(je.credit) as total_credit
            FROM journal_entries je
            JOIN transactions t ON je.transaction_id = t.id
            JOIN accounts a ON je.account_id = a.id
            WHERE je.tenant_id = ? AND t.transaction_date BETWEEN ? AND ?
            ${business_type_id ? 'AND t.business_type_id = ?' : ''}
            GROUP BY a.id, a.code, a.name
            HAVING (SUM(je.debit) <> 0 OR SUM(je.credit) <> 0)
            ORDER BY a.code ASC
        `, business_type_id ? [tenant_id, start_date, end_date, business_type_id] : [tenant_id, start_date, end_date]);

        const [tenantRows] = await db.execute("SELECT name FROM tenants WHERE id = ?", [tenant_id]);
        const businessName = tenantRows[0]?.name || "(Nama Usaha)";

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Neraca Saldo');

            sheet.mergeCells('A1:D1');
            sheet.getCell('A1').value = 'LAPORAN NERACA SALDO';
            sheet.getCell('A1').font = { size: 16, bold: true };
            sheet.getCell('A1').alignment = { horizontal: 'center' };

            sheet.mergeCells('A2:D2');
            sheet.getCell('A2').value = businessName.toUpperCase();
            sheet.getCell('A2').font = { size: 14, bold: true };
            sheet.getCell('A2').alignment = { horizontal: 'center' };

            sheet.mergeCells('A3:D3');
            sheet.getCell('A3').value = `Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`;
            sheet.getCell('A3').alignment = { horizontal: 'center' };

            sheet.addRow([]);
            const header = sheet.addRow(['Kode Akun', 'Nama Akun', 'Total Debit', 'Total Kredit']);
            header.font = { bold: true };
            header.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF235347' } };
                c.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            });

            rows.forEach(r => {
                const row = sheet.addRow([r.code, r.name, r.total_debit, r.total_credit]);
                row.getCell(3).numFmt = '#,##0'; row.getCell(4).numFmt = '#,##0';
            });
            const tDebit = rows.reduce((s, r) => s + Number(r.total_debit), 0);
            const tCredit = rows.reduce((s, r) => s + Number(r.total_credit), 0);

            const totalRow = sheet.addRow(['', 'TOTAL KESELURUHAN', tDebit, tCredit]);
            totalRow.font = { bold: true };
            totalRow.getCell(3).numFmt = '#,##0';
            totalRow.getCell(4).numFmt = '#,##0';
            totalRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
            });

            sheet.columns.forEach((col, i) => { col.width = [15, 35, 20, 20][i]; });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=neraca_saldo_${start_date}.xlsx`);
            await workbook.xlsx.write(res); res.end();
        } else {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=neraca_saldo_${start_date}.pdf`);
            doc.pipe(res);

            doc.font('Helvetica-Bold').fontSize(16).text('LAPORAN NERACA SALDO', { align: 'center' });
            doc.fontSize(14).text(businessName.toUpperCase(), { align: 'center' });
            doc.font('Helvetica').fontSize(10).text(`Periode: ${moment(start_date).format('DD/MM/YYYY')} - ${moment(end_date).format('DD/MM/YYYY')}`, { align: 'center' });
            doc.moveDown(2);

            const tableTop = 120;
            // Draw Header Background
            doc.rect(40, tableTop - 5, 510, 20).fill('#ecfdf5');
            doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(10);

            doc.text('Kode', 50, tableTop);
            doc.text('Nama Akun', 120, tableTop);
            doc.text('Debit', 320, tableTop, { align: 'right', width: 100 });
            doc.text('Kredit', 440, tableTop, { align: 'right', width: 100 });

            doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#10b981').lineWidth(0.5).stroke();

            let y = tableTop + 25; doc.fillColor('black').font('Helvetica').fontSize(9);
            rows.forEach(r => {
                if (y > 750) { doc.addPage(); y = 50; }
                doc.text(r.code, 50, y);
                doc.text(r.name, 120, y, { width: 190 });
                doc.text(Number(r.total_debit).toLocaleString('id-ID'), 320, y, { align: 'right', width: 100 });
                doc.text(Number(r.total_credit).toLocaleString('id-ID'), 440, y, { align: 'right', width: 100 });
                y += 20;
            });

            const tDebit = rows.reduce((s, r) => s + Number(r.total_debit), 0);
            const tCredit = rows.reduce((s, r) => s + Number(r.total_credit), 0);

            // Total Row
            doc.moveTo(40, y).lineTo(550, y).strokeColor('#10b981').lineWidth(1).stroke();
            y += 10;
            doc.font('Helvetica-Bold').fontSize(10);
            doc.text('TOTAL KESELURUHAN', 120, y);
            doc.text(`Rp ${tDebit.toLocaleString('id-ID')}`, 320, y, { align: 'right', width: 100 });
            doc.text(`Rp ${tCredit.toLocaleString('id-ID')}`, 440, y, { align: 'right', width: 100 });

            doc.end();
        }
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = {
    getProfitLoss,
    getProfitLossDetail,
    getBalanceSheet,
    getBalanceSheetDetail,
    getCashFlow,
    getCashFlowChart,
    exportProfitLoss,
    exportBalanceSheet,
    exportCashFlow,
    getEquityChange,
    exportEquityChange,
    exportGeneralJournal,
    exportAdjustingJournal,
    exportLedger,
    exportTrialBalance
};