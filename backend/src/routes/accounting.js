const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getLedger, getTrialBalance } = require("../controllers/accountingController");

router.use(authMiddleware);

router.get("/ledger", getLedger);
router.get("/trial-balance", getTrialBalance);

module.exports = router;

