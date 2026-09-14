const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Gunakan path absolut agar lebih aman
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Hanya file gambar (jpg, png, webp) yang diizinkan!"));
    }
});

const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tenantId = req.user.tenant_id;

        const [userRows] = await db.execute(
            `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, t.name as business_name, t.id as tenant_id, t.business_type_id 
             FROM users u 
             JOIN tenants t ON u.tenant_id = t.id 
             WHERE u.id = ? AND u.tenant_id = ?`,
            [userId, tenantId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        res.json({ success: true, data: userRows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tenantId = req.user.tenant_id;
        const { name, phone, business_name } = req.body;

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // Update User
            await conn.execute(
                "UPDATE users SET name = ?, phone = ? WHERE id = ?",
                [name, phone, userId]
            );

            // Update Tenant (Nama Usaha)
            await conn.execute(
                "UPDATE tenants SET name = ? WHERE id = ?",
                [business_name, tenantId]
            );

            await conn.commit();
            res.json({ success: true, message: "Profil berhasil diperbarui" });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
        }

        const userId = req.user.user_id;
        const avatarUrl = `/uploads/${req.file.filename}`;

        await db.execute(
            "UPDATE users SET avatar_url = ? WHERE id = ?",
            [avatarUrl, userId]
        );

        res.json({ 
            success: true, 
            message: "Foto profil berhasil diperbarui",
            avatar_url: avatarUrl 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getProfile, updateProfile, updateAvatar, upload };
