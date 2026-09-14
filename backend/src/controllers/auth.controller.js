const authService = require("../services/auth.service");

async function register(req, res) {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function login(req, res) {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function googleLogin(req, res) {
    try {
        console.log("Request body:",req.body);
        const { tokenId } = req.body;
          console.log("TokenId received:", tokenId ? "YES" : "NO"); 
        const result = await authService.googleLogin(tokenId);
        res.status(200).json(result);
    } catch (err) {
        console.error("Google login error:", err);
        res.status(400).json({ message: err.message || "Gagal login dengan Google" });
    }
}

module.exports = { register, login, googleLogin };