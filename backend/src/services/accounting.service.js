const createJournalEntry = async (
    connection,
    {
        tenant_id,
        transaction_id,
        debit_account_id,
        credit_account_id,
        amount
    }
) => {

    if (!tenant_id || !transaction_id || !debit_account_id || !credit_account_id) {
        throw new Error("Data jurnal tidak lengkap");
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
        throw new Error("Amount tidak valid");
    }

    if (debit_account_id === credit_account_id) {
        throw new Error("Debit dan Credit account tidak boleh sama");
    }

    // Insert Debit
    const [debitResult] = await connection.query(
        `INSERT INTO journal_entries
        (tenant_id, transaction_id, account_id, debit, credit)
        VALUES (?, ?, ?, ?, 0)`,
        [tenant_id, transaction_id, debit_account_id, numericAmount]
    );

    if (!debitResult.insertId) {
        throw new Error("Gagal insert debit");
    }

    // Insert Credit
    const [creditResult] = await connection.query(
        `INSERT INTO journal_entries
        (tenant_id, transaction_id, account_id, debit, credit)
        VALUES (?, ?, ?, 0, ?)`,
        [tenant_id, transaction_id, credit_account_id, numericAmount]
    );

    if (!creditResult.insertId) {
        throw new Error("Gagal insert credit");
    }

    return true;
};

module.exports = {
    createJournalEntry
};