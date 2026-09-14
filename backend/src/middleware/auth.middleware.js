// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token tidak ada" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded token:", decoded); // CEK STRUKTUR TOKEN

        req.user = decoded; // { user_id, tenant_id, role }

        next();
    } catch (err) {
        console.error("Token error:", err.message);
        return res.status(401).json({ message: "Token tidak valid" });
    }
}

module.exports = authMiddleware;