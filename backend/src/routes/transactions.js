const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
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
} = require("../controllers/transactionsController");

router.use(authMiddleware);

router.get("/accounts", getAllAccounts);
router.get("/opening-balance/accounts", getOpeningBalanceAccounts);
router.get("/opening-balance", getOpeningBalances);
router.post("/opening-balance", createOpeningBalance);

// Rute Jurnal Penyesuaian
router.post("/adjusting", createAdjustingJournal);
router.get("/adjusting/filter", getAdjustingJournals);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/filter", getTransactionsByDate);
router.get("/export/excel", exportToExcel);
router.get("/export/pdf", exportToPdf);
router.delete("/all", deleteAllTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;