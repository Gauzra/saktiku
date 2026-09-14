import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/Api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        business_name: "",
        business_type_id: "",
        business_age: ""
    });

    const [businessTypes, setBusinessTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/business/types")
            .then(res => {
                if (res.data.success) {
                    setBusinessTypes(res.data.data);
                }
            })
            .catch(() => {
                setBusinessTypes([]);
            });
    }, []);

    const handleChange = (e) => {
        setError("");
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.business_name.trim()) {
            setError("Nama, email, password, dan nama usaha wajib diisi.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password minimal 6 karakter.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                business_type_id: form.business_type_id ? Number(form.business_type_id) : null
            };
            const res = await api.post("/auth/register", payload);
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            const msg = err.response?.data?.message || "Terjadi kesalahan, coba lagi.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="aurora-bg"></div>
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            {/* Left Panel */}
            <div className="register-left">
                <h1>SAKTIKU</h1>
                <p>
                    Sistem Akuntansi Keuangan Terintegrasi Khusus UMKM.
                    Daftarkan usaha Anda dan mulai kelola keuangan secara otomatis, cerdas, dan profesional.
                </p>
                <div className="feature-list">
                    <div className="feature-item">
                        <div className="feature-icon">1.</div>
                        <span>Jurnal umum, buku besar & neraca saldo otomatis</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">2.</div>
                        <span>Laporan keuangan lengkap (Laba Rugi, Neraca, Arus Kas)</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">3.</div>
                        <span>Template khusus per jenis usaha UMKM</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">4.</div>
                        <span>Ekspor laporan ke PDF & Excel</span>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="register-right">
                <div className="register-card">
                    <h2>Buat Akun Baru</h2>
                    <p className="subtitle">Isi data di bawah untuk mulai menggunakan SAKTIKU</p>

                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* — Informasi Akun — */}
                        <p className="section-label">Informasi Akun</p>

                        <div className="form-row">
                            <div className="register-input-group">
                                <label htmlFor="name">
                                    Nama Lengkap <span className="required">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Budi Santoso"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div className="register-input-group">
                                <label htmlFor="phone">Nomor HP</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="0812xxxxxxxx"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                />
                            </div>
                        </div>

                        <div className="form-row-full register-input-group">
                            <label htmlFor="email">
                                Email <span className="required">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="nama@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-row-full register-input-group">
                            <label htmlFor="password">
                                Password <span className="required">*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Min. 6 karakter"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* — Informasi Usaha — */}
                        <p className="section-label" style={{ marginTop: "18px" }}>Informasi Usaha</p>

                        <div className="form-row-full register-input-group">
                            <label htmlFor="business_name">
                                Nama Usaha <span className="required">*</span>
                            </label>
                            <input
                                id="business_name"
                                type="text"
                                name="business_name"
                                placeholder="Warung Maju Jaya"
                                value={form.business_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="register-input-group">
                                <label htmlFor="business_type_id">Jenis Usaha</label>
                                <select
                                    id="business_type_id"
                                    name="business_type_id"
                                    value={form.business_type_id}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Pilih Jenis Usaha --</option>
                                    {businessTypes.map(bt => (
                                        <option key={bt.id} value={bt.id}>{bt.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="register-input-group">
                                <label htmlFor="business_age">Usia Usaha</label>
                                <input
                                    id="business_age"
                                    type="text"
                                    name="business_age"
                                    placeholder="Contoh: 2 tahun"
                                    value={form.business_age}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            id="register-submit-btn"
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading && <span className="spinner"></span>}
                            {loading ? "Memproses..." : "Daftar Sekarang"}
                        </button>
                    </form>

                    <p className="register-footer">
                        Sudah punya akun?{" "}
                        <Link to="/login">Masuk di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
