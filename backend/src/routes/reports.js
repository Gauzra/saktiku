const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
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
} = require('../controllers/reportsController');

router.use(authMiddleware);

// Laporan
router.get('/profit-loss', getProfitLoss);
router.get('/profit-loss-detail', getProfitLossDetail);
router.get('/balance-sheet', getBalanceSheet);
router.get('/balance-sheet-detail', getBalanceSheetDetail);
router.get('/equity-change', getEquityChange);
router.get('/cash-flow', getCashFlow);
router.get('/cash-flow-chart', getCashFlowChart);

// EXPORT 
router.get('/export/profit-loss', exportProfitLoss);
router.get('/export/balance-sheet', exportBalanceSheet);
router.get('/export/equity-change', exportEquityChange);
router.get('/export/cash-flow', exportCashFlow);
router.get('/export/general-journal', exportGeneralJournal);
router.get('/export/adjusting-journal', exportAdjustingJournal);
router.get('/export/ledger', exportLedger);
router.get('/export/trial-balance', exportTrialBalance);

module.exports = router;