require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const transactionsRoutes = require("./routes/transactions");
const categoriesRoutes = require("./routes/categories");
const reportsRoutes = require("./routes/reports");
const businessRoutes = require("./routes/business");
const usersRoutes = require("./routes/users");  // ← INI YANG KURANG!
const accountingRoutes = require("./routes/accounting");
const reviewsRoutes = require("./routes/reviews");

const path = require("path");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sajikan file statis dari folder uploads
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Route test
app.get("/", (req, res) => {
    res.send("API PKM jalan");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/transactions", transactionsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/users", usersRoutes);  // ← SEKARANG SUDAH TERDEFINISI
app.use("/api/accounting", accountingRoutes);
app.use("/api/reviews", reviewsRoutes);

// Protected test route
app.get("/api/me", authMiddleware, (req, res) => {
    res.json({
        message: "Token valid",
        user: req.user
    });
});

// Test DB
async function testDB() {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected");
    } catch (err) {
        console.error("Database error:", err.message);
    }
}

testDB();

app.listen(5000, () => {
    console.log("Server running on port 5000");
});