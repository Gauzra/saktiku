const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

async function register(data) {
    const { name, email, password, business_name, business_type_id, business_age, phone } = data;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1. Buat tenant
        const [tenantResult] = await conn.query(
            "INSERT INTO tenants (name, business_type_id, business_age) VALUES (?, ?, ?)",
            [business_name, business_type_id || null, business_age || null]
        );

        const tenantId = tenantResult.insertId;

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Buat user owner
        const [userResult] = await conn.query(
            "INSERT INTO users (tenant_id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)",
            [tenantId, name, email, hashedPassword, "owner", phone || null]
        );

        const userId = userResult.insertId;

        // 4. COPY ACCOUNTS DARI TENANT MASTER (ID=1)
        await conn.query(
            `INSERT INTO accounts (tenant_id, parent_account_id, code, name, type, normal_balance, level, is_leaf, is_system, opening_balance, current_balance, created_at, updated_at)
             SELECT ?, parent_account_id, code, name, type, normal_balance, level, is_leaf, is_system, opening_balance, current_balance, NOW(), NOW()
             FROM accounts WHERE tenant_id = 1`,
            [tenantId]
        );

        // 5. COPY CATEGORIES DARI TENANT MASTER (ID=1)
        await conn.query(
            `INSERT INTO categories (tenant_id, name, type, debit_account_id, credit_account_id, is_active, is_default, created_at)
             SELECT ?, name, type, debit_account_id, credit_account_id, is_active, is_default, NOW()
             FROM categories WHERE tenant_id = 1`,
            [tenantId]
        );

        await conn.commit();

        // Generate JWT
        const token = jwt.sign(
            {
                user_id: userId,
                tenant_id: tenantId,
                role: "owner",
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return { token };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

async function login(data) {
    const { email, password } = data;

    const [users] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (users.length === 0) {
        throw new Error("User tidak ditemukan");
    }

    const user = users[0];

    let isMatch = false;

    try {
        isMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
        isMatch = false;
    }

    // Fallback untuk data lama yang password-nya masih plaintext
    if (!isMatch && user.password === password) {
        isMatch = true;
        const newHashedPassword = await bcrypt.hash(password, 10);
        await pool.query("UPDATE users SET password = ? WHERE id = ?", [
            newHashedPassword,
            user.id,
        ]);
    }

    if (!isMatch) {
        throw new Error("Password salah");
    }

    const token = jwt.sign(
        {
            user_id: user.id,
            tenant_id: user.tenant_id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    return { token };
}

async function googleLogin(tokenId) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const avatarUrl = payload.picture;

    // Cek apakah user sudah ada
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length > 0) {
        // User sudah ada, login langsung
        const user = users[0];
        const token = jwt.sign(
            {
                user_id: user.id,
                tenant_id: user.tenant_id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        return { token };
    } else {
        // User belum ada, buat akun baru (register otomatis)
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Buat tenant
            const [tenantResult] = await conn.query(
                "INSERT INTO tenants (name, created_at) VALUES (?, NOW())",
                [name]
            );
            const tenantId = tenantResult.insertId;

            // Buat user dengan password random
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const [userResult] = await conn.query(
                "INSERT INTO users (tenant_id, name, email, password, role, phone, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [tenantId, name, email, hashedPassword, "owner", null, avatarUrl]
            );
            const userId = userResult.insertId;

            // ========== COPY DATA DARI TENANT MASTER (ID=1) ==========

            // 1. COPY ACCOUNTS
            await conn.query(
                `INSERT INTO accounts (tenant_id, parent_account_id, code, name, type, normal_balance, level, is_leaf, is_system, opening_balance, current_balance, created_at, updated_at)
                 SELECT ?, parent_account_id, code, name, type, normal_balance, level, is_leaf, is_system, opening_balance, current_balance, NOW(), NOW()
                 FROM accounts WHERE tenant_id = 1`,
                [tenantId]
            );

            // 2. COPY CATEGORIES
            await conn.query(
                `INSERT INTO categories (tenant_id, name, type, debit_account_id, credit_account_id, is_active, is_default, created_at)
                 SELECT ?, name, type, debit_account_id, credit_account_id, is_active, is_default, NOW()
                 FROM categories WHERE tenant_id = 1`,
                [tenantId]
            );

            // ========== END COPY DATA ==========

            await conn.commit();

            const token = jwt.sign(
                {
                    user_id: userId,
                    tenant_id: tenantId,
                    role: "owner",
                },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );
            return { token };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = { register, login, googleLogin };