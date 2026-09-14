const express = require("express");
const cors = require("cors");

const app = express();
const categoriesRoutes = require("./routes/categories");
const transactionsRoutes = require("./routes/transactions");
const reportsRoutes = require("./routes/reports");


app.use(cors());
app.use(express.json());
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/reports", reportsRoutes);


app.get("/", (req, res) => {
    res.json({ message: "KeuTrack API Running" });
});

module.exports = app;