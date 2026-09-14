const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "sistem_pkm",
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;