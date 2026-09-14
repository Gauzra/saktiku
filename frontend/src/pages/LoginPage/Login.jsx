import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/Api";
import "./Login.css";

// Ganti dengan Google Client ID kamu!
const GOOGLE_CLIENT_ID = "830840134421-ns13gt3rgusq2a4sn1ri96btt3ojml7t.apps.googleusercontent.com";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const googleButtonRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/");
        }

        const renderGoogleButton = () => {
            if (window.google && googleButtonRef.current) {
                googleButtonRef.current.innerHTML = '';
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                });

                let buttonWidth = googleButtonRef.current.clientWidth;
                if (!buttonWidth || buttonWidth < 200) {
                    const card = googleButtonRef.current.closest(".login-card");
                    if (card) {
                        const style = window.getComputedStyle(card);
                        const paddingL = parseFloat(style.paddingLeft) || 0;
                        const paddingR = parseFloat(style.paddingRight) || 0;
                        buttonWidth = card.clientWidth - paddingL - paddingR;
                    }
                    if (!buttonWidth || buttonWidth < 200) {
                        if (window.innerWidth < 480) {
                            buttonWidth = window.innerWidth - 80;
                        } else if (window.innerWidth < 1024) {
                            buttonWidth = Math.min(420, window.innerWidth - 40) - 96;
                        } else {
                            buttonWidth = 324;
                        }
                    }
                }
                buttonWidth = Math.max(200, Math.min(400, buttonWidth));

                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "outline", size: "large", width: buttonWidth }
                );
            }
        };

        const timer = setTimeout(renderGoogleButton, 50);
        window.addEventListener('resize', renderGoogleButton);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', renderGoogleButton);
        };
    }, [navigate]);

    const handleGoogleCallback = async (response) => {
        try {
            setLoading(true);
            const res = await api.post("/auth/google", { tokenId: response.credential });
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            console.error("Google login error:", err);
            alert("Gagal login dengan Google");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            alert("Email atau password salah");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="aurora-bg"></div>
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="login-left">
                <h1>SAKTIKU</h1>
                <p>
                    Sistem Akuntansi Keuangan Terintegrasi Khusus UMKM.
                    Solusi pencatatan keuangan cerdas untuk UMKM. Kelola transaksi dan laporan keuangan otomatis dalam satu platform.
                </p>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <div className="mobile-brand-header">
                        <h1>SAKTIKU</h1>
                        <p>Sistem Akuntansi Keuangan Terintegrasi Khusus UMKM</p>
                    </div>

                    <h2>Selamat Datang</h2>
                    <p className="subtitle">
                        Silakan masuk ke akun SAKTI anda
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="nama@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Memproses..." : "Masuk Sekarang"}
                        </button>
                    </form>

                    <div className="divider">
                        <span>Atau masuk dengan</span>
                    </div>

                    <div className="google-btn-wrapper">
                        <div ref={googleButtonRef}></div>
                    </div>

                    <div className="register-link-wrapper">
                        Belum punya akun?{" "}
                        <Link 
                            to="/register"
                            className="register-link"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;