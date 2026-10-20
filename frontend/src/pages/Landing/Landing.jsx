import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/Api";
import {
    FaStore,
    FaCoins,
    FaWallet,
    FaChartLine,
    FaFileInvoiceDollar,
    FaExchangeAlt,
    FaShieldAlt,
    FaBolt,
    FaClock,
    FaUserCheck,
    FaStar,
    FaArrowRight,
    FaCheckCircle,
    FaBars,
    FaTimes,
    FaChevronUp,
} from "react-icons/fa";
import "./landing.css";

const IMG = {
    hero: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=80",
    cashier: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    meeting: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80",
    store: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    finance: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
};

const features = [
    {
        icon: <FaChartLine />,
        title: "Dashboard Real-time",
        desc: "Pantau saldo kas, piutang, dan kinerja usaha dalam satu tampilan ringkas yang selalu terupdate.",
    },
    {
        icon: <FaCoins />,
        title: "Atur Saldo Awal",
        desc: "Mulai dari nol dengan mudah — masukkan saldo awal kas, bank, dan modal usaha secara akurat.",
    },
    {
        icon: <FaWallet />,
        title: "Pencatatan Transaksi",
        desc: "Catat pemasukan, pengeluaran, dan utang-piutang dengan kategori yang terorganisir otomatis.",
    },
    {
        icon: <FaExchangeAlt />,
        title: "Siklus Akuntansi Lengkap",
        desc: "Jurnal umum, buku besar, neraca saldo, sampai jurnal penyesuaian — semuanya saling terhubung.",
    },
    {
        icon: <FaFileInvoiceDollar />,
        title: "Laporan Keuangan Otomatis",
        desc: "Laba rugi, neraca, perubahan modal, dan arus kas tersusun otomatis tanpa harus menghitung manual.",
    },
    {
        icon: <FaStore />,
        title: "Multi Jenis Usaha",
        desc: "Cocok untuk dagang, jasa, manufaktur, hingga katering. Ganti jenis usaha kapan saja.",
    },
];

const steps = [
    {
        num: "01",
        icon: <FaStore />,
        title: "Pilih Jenis Usaha",
        desc: "Daftar gratis dan pilih kategori usaha kamu — restoran, toko, jasa, manufaktur, dan lainnya.",
    },
    {
        num: "02",
        icon: <FaCoins />,
        title: "Atur Saldo Awal",
        desc: "Masukkan saldo awal kas, bank, dan modal agar laporan keuangan dimulai dari posisi yang benar.",
    },
    {
        num: "03",
        icon: <FaWallet />,
        title: "Catat Setiap Transaksi",
        desc: "Input pemasukan dan pengeluaran harian dengan cepat — Saktiku mengerjakan pembukuannya.",
    },
    {
        num: "04",
        icon: <FaFileInvoiceDollar />,
        title: "Dapatkan Laporan Siap Pakai",
        desc: "Laba rugi, neraca, dan arus kas otomatis tersusun — siap untuk pengajuan modal bank atau pajak.",
    },
];

const advantages = [
    {
        icon: <FaBolt />,
        title: "Cepat & Praktis",
        desc: "Tanpa perlu paham akuntansi mendalam. Saktiku mengelola pembukuan secara otomatis.",
    },
    {
        icon: <FaShieldAlt />,
        title: "Aman & Terpercaya",
        desc: "Data tersimpan aman, hanya kamu yang bisa mengakses laporan keuangan usahamu.",
    },
    {
        icon: <FaClock />,
        title: "Hemat Waktu",
        desc: "Hemat puluhan jam per bulan yang biasanya dihabiskan untuk pembukuan manual.",
    },
    {
        icon: <FaUserCheck />,
        title: "Panduan Lengkap",
        desc: "Ikuti panduan interaktif dan buku petunjuk langkah demi langkah dari awal pendaftaran.",
    },
];

const testimonials = [
    {
        name: "Bu Ratna",
        role: "Pemilik Warung Makan & Katering",
        text: "Dulu pembukuan saya berantakan. Sekarang laporan laba rugi sudah otomatis, tinggal cetak. Saktiku luar biasa!",
        initial: "R",
    },
    {
        name: "Pak Andi",
        role: "Pemilik Toko Sembako",
        text: "Pengajuan KUR jadi mudah karena laporan keuangannya rapi. Bank langsung percaya dengan usaha saya.",
        initial: "A",
    },
    {
        name: "Kak Sari",
        role: "Pemilik Bisnis Fashion Online",
        text: "Fitur arus kasnya membantu saya tahu persis berapa uang masuk dan keluar tiap bulan. Sangat direkomendasikan!",
        initial: "S",
    },
];

function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [umkmCount, setUmkmCount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: "", role: "", rating: 5, review: "" });
    const [reviewStatus, setReviewStatus] = useState(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        api.get("/business/stats/umkm-count")
            .then((res) => {
                if (res.data?.success) {
                    setUmkmCount(res.data.data.count);
                }
            })
            .catch(() => {});
    }, []);

    const loadReviews = () => {
        api.get("/reviews")
            .then((res) => {
                if (res.data?.success) setReviews(res.data.data);
            })
            .catch(() => {});
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleReviewChange = (e) => {
        setReviewStatus(null);
        setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
    };

    const handleRatingSelect = (val) => {
        setReviewStatus(null);
        setReviewForm({ ...reviewForm, rating: val });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.name.trim() || !reviewForm.review.trim()) {
            setReviewStatus({ type: "error", msg: "Nama dan isi review wajib diisi." });
            return;
        }
        setSending(true);
        setReviewStatus(null);
        try {
            await api.post("/reviews", reviewForm);
            setReviewStatus({ type: "success", msg: "Review berhasil dikirim. Terima kasih!" });
            setReviewForm({ name: "", role: "", rating: 5, review: "" });
            loadReviews();
        } catch (err) {
            setReviewStatus({
                type: "error",
                msg: err.response?.data?.message || "Gagal mengirim review. Coba lagi.",
            });
        } finally {
            setSending(false);
        }
    };

    const scrollTo = (id) => {
        setMenuOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const displayReviews =
        reviews.length > 0
            ? reviews.map((r) => ({
                  id: r.id,
                  name: r.name,
                  role: r.role || "Pelaku UMKM",
                  text: r.review,
                  rating: r.rating || 5,
                  initial: (r.name || "?").charAt(0).toUpperCase(),
              }))
            : testimonials;

    return (
        <div className="landing-page">
            {/* ───── NAVBAR ───── */}
            <header className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
                <div className="lp-nav-inner">
                    <a className="lp-brand" onClick={() => scrollTo("hero")}>
                        <img src="/Images/sakti.png" alt="SAKTIKU Logo" className="lp-logo" />
                        <span className="lp-brand-name">Saktiku</span>
                    </a>

                    <nav className={`lp-links ${menuOpen ? "open" : ""}`}>
                        <a onClick={() => scrollTo("fitur")}>Fitur</a>
                        <a onClick={() => scrollTo("cara-kerja")}>Cara Kerja</a>
                        <a onClick={() => scrollTo("keunggulan")}>Keunggulan</a>
                        <a onClick={() => scrollTo("testimoni")}>Testimoni</a>
                        <Link to="/tim">Tim</Link>
                        <div className="lp-nav-cta">
                            <Link to="/login" className="lp-btn lp-btn-ghost">Masuk</Link>
                            <Link to="/register" className="lp-btn lp-btn-solid">Daftar Gratis</Link>
                        </div>
                    </nav>

                    <button
                        className="lp-hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </header>

            {/* ───── HERO ───── */}
            <section id="hero" className="lp-hero">
                <div className="lp-hero-bg"></div>
                <div className="lp-hero-orbs"></div>
                <div className="lp-container lp-hero-inner">
                    <div className="lp-hero-text">
                        <span className="lp-badge">
                            <FaStar />#1 Sistem Akuntansi untuk UMKM Indonesia
                        </span>
                        <h1>
                            Kelola Keuangan UMKM Lebih
                            <span className="lp-gradient-text"> Mudah & Profesional</span>
                        </h1>
                        <p>
                            Saktiku membantu warung, toko, dan usaha kecil mencatat transaksi,
                            menyusun siklus akuntansi, hingga menghasilkan laporan keuangan
                            otomatis — <strong>tanpa perlu paham akuntansi</strong>.
                        </p>

                        <div className="lp-hero-cta">
                            <Link to="/register" className="lp-btn lp-btn-solid lp-btn-lg">
                                Mulai Gratis <FaArrowRight />
                            </Link>
                            <button
                                className="lp-btn lp-btn-outline lp-btn-lg"
                                onClick={() => scrollTo("cara-kerja")}
                            >
                                Lihat Cara Kerja
                            </button>
                        </div>

                        <div className="lp-hero-stats">
                            <div className="lp-stat">
                                <h3>{umkmCount.toLocaleString("id-ID")}+</h3>
                                <span>UMKM Terdaftar</span>
                            </div>
                            <div className="lp-stat">
                                <h3>4</h3>
                                <span>Laporan Otomatis</span>
                            </div>
                            <div className="lp-stat">
                                <h3>24/7</h3>
                                <span>Akses Data</span>
                            </div>
                        </div>
                    </div>

                    <div className="lp-hero-visual">
                        <div className="lp-hero-img-wrap">
                            <img src={IMG.hero} alt="Pemilik UMKM" className="lp-hero-img" />
                        </div>
                        <div className="lp-float-card lp-float-card-green">
                            <FaCheckCircle />
                            <div>
                                <strong>+ Rp5.200.000</strong>
                                <span>Laba bulan ini</span>
                            </div>
                        </div>
                        <div className="lp-float-card lp-float-card-gold">
                            <FaFileInvoiceDollar />
                            <div>
                                <strong>Laporan Rapi</strong>
                                <span>Siap untuk modal & pajak</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── TRUST BAND ───── */}
            <section className="lp-band">
                <div className="lp-container">
                    <p className="lp-band-text">
                        Dipercaya oleh pelaku usaha dari berbagai bidang
                    </p>
                    <div className="lp-band-row">
                        <span><FaStore /> Warung & Toko</span>
                        <span><FaBolt /> Online Shop</span>
                        <span><FaCoins /> Katering</span>
                        <span><FaWallet /> Jasa</span>
                        <span><FaChartLine /> Manufaktur</span>
                    </div>
                </div>
            </section>

            {/* ───── FITUR ───── */}
            <section id="fitur" className="lp-section lp-features">
                <div className="lp-container">
                    <div className="lp-section-head">
                        <span className="lp-eyebrow">Fitur Unggulan</span>
                        <h2>Semua Kebutuhan Pembukuan dalam Satu Aplikasi</h2>
                        <p>
                            Dari jurnal sampai laporan keuangan — Saktiku merapikan semuanya
                            secara otomatis dan terintegrasi.
                        </p>
                    </div>

                    <div className="lp-feature-grid">
                        {features.map((f, i) => (
                            <div className="lp-feature-card" key={f.title}>
                                <div className="lp-feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                                <span className="lp-feature-num">0{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── CARA KERJA ───── */}
            <section id="cara-kerja" className="lp-section lp-how bg-dark">
                <div className="lp-container">
                    <div className="lp-section-head light">
                        <span className="lp-eyebrow">Cara Kerja</span>
                        <h2>Menjalankan Akuntansi Hanya 4 Langkah</h2>
                        <p>
                            Tidak perlu gelar akuntan. Cukup ikuti langkah sederhana ini dan
                            biarkan Saktiku mengerjakan sisanya.
                        </p>
                    </div>

                    <div className="lp-step-grid">
                        {steps.map((s) => (
                            <div className="lp-step-card" key={s.num}>
                                <div className="lp-step-icon">{s.icon}</div>
                                <span className="lp-step-num">{s.num}</span>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── KEUNGGULAN ───── */}
            <section id="keunggulan" className="lp-section lp-why">
                <div className="lp-container lp-why-inner">
                    <div className="lp-why-visual">
                        <img src={IMG.meeting} alt="Diskusi pengembangan usaha" className="lp-why-img" />
                        <img src={IMG.finance} alt="Dokumen keuangan" className="lp-why-img-small" />
                        <div className="lp-why-chip">
                            <FaChartLine />
                            <span>Pertumbuhan usaha tertata</span>
                        </div>
                    </div>

                    <div className="lp-why-content">
                        <span className="lp-eyebrow">Kenapa Saktiku?</span>
                        <h2>Buku Keuangan Rapi adalah Kunci Usaha Berkembang</h2>
                        <p>
                            Banyak UMKM gagal naik kelas karena tidak punya catatan keuangan yang
                            jelas. Saktiku hadir untuk mengubah itu.
                        </p>

                        <div className="lp-adv-grid">
                            {advantages.map((a) => (
                                <div className="lp-adv-item" key={a.title}>
                                    <div className="lp-adv-icon">{a.icon}</div>
                                    <div>
                                        <h3>{a.title}</h3>
                                        <p>{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONI ───── */}
            <section id="testimoni" className="lp-section lp-testi">
                <div className="lp-container">
                    <div className="lp-section-head">
                        <span className="lp-eyebrow">Testimoni</span>
                        <h2>Kata Mereka yang Sudah Pakai Saktiku</h2>
                    </div>

                    <div className="lp-testi-grid">
                        {displayReviews.map((t) => (
                            <div className="lp-testi-card" key={t.id || t.name}>
                                <div className="lp-testi-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < t.rating ? "" : "dim"}
                                        />
                                    ))}
                                </div>
                                <p className="lp-testi-text">"{t.text}"</p>
                                <div className="lp-testi-user">
                                    <div className="lp-avatar">{t.initial}</div>
                                    <div>
                                        <strong>{t.name}</strong>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lp-review-wrap">
                        <div className="lp-review-form">
                            <h3>Bagikan Pengalaman Kamu</h3>
                            <p>
                                Sudah menggunakan Saktiku? Ceritakan pengalamanmu di sini agar
                                membantu UMKM lain.
                            </p>

                            {reviewStatus && (
                                <div className={`lp-review-status ${reviewStatus.type}`}>
                                    {reviewStatus.msg}
                                </div>
                            )}

                            <form onSubmit={handleReviewSubmit}>
                                <div className="lp-review-row">
                                    <div className="lp-field">
                                        <label htmlFor="review-name">Nama</label>
                                        <input
                                            id="review-name"
                                            type="text"
                                            name="name"
                                            placeholder="Nama kamu"
                                            value={reviewForm.name}
                                            onChange={handleReviewChange}
                                        />
                                    </div>
                                    <div className="lp-field">
                                        <label htmlFor="review-role">Jenis Usaha / Peran</label>
                                        <input
                                            id="review-role"
                                            type="text"
                                            name="role"
                                            placeholder="Contoh: Pemilik Warung Makan"
                                            value={reviewForm.role}
                                            onChange={handleReviewChange}
                                        />
                                    </div>
                                </div>

                                <div className="lp-field">
                                    <label>Rating</label>
                                    <div className="lp-review-stars">
                                        {[1, 2, 3, 4, 5].map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                className={v <= reviewForm.rating ? "active" : ""}
                                                onClick={() => handleRatingSelect(v)}
                                                aria-label={`${v} bintang`}
                                            >
                                                <FaStar />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="lp-field">
                                    <label htmlFor="review-text">Review Kamu</label>
                                    <textarea
                                        id="review-text"
                                        name="review"
                                        rows="4"
                                        placeholder="Ceritakan pengalamanmu menggunakan Saktiku..."
                                        value={reviewForm.review}
                                        onChange={handleReviewChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="lp-btn lp-btn-solid lp-btn-lg"
                                    disabled={sending}
                                >
                                    {sending ? "Mengirim..." : "Kirim Review"}
                                    {!sending && <FaArrowRight />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── CTA ───── */}
            <section className="lp-section lp-cta">
                <div className="lp-cta-card">
                    <div className="lp-cta-glow"></div>
                    <span className="lp-eyebrow">Yuk Mulai Sekarang</span>
                    <h2>Rapikan Keuangan Usahamu Hari Ini</h2>
                    <p>
                        Bergabung gratis dan rasakan kemudahan pembukuan yang terintegrasi
                        khusus untuk UMKM Indonesia.
                    </p>
                    <Link to="/register" className="lp-btn lp-btn-gold lp-btn-lg">
                        Daftar Gratis Sekarang <FaArrowRight />
                    </Link>
                    <span className="lp-cta-note">Tanpa kartu kredit · Tanpa biaya tersembunyi</span>
                </div>
            </section>

            {/* ───── FOOTER ───── */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer-grid">
                        <div className="lp-footer-brand">
                            <div className="lp-brand">
                                <img src="/Images/sakti.png" alt="SAKTIKU Logo" className="lp-logo" />
                                <span className="lp-brand-name">Saktiku</span>
                            </div>
                            <p>
                                Sistem Akuntansi Keuangan Terintegrasi Khusus UMKM. Kelola
                                keuangan usaha lebih mudah dan profesional.
                            </p>
                        </div>

                        <div className="lp-footer-col">
                            <h4>Produk</h4>
                            <a onClick={() => scrollTo("fitur")}>Fitur</a>
                            <a onClick={() => scrollTo("cara-kerja")}>Cara Kerja</a>
                            <a onClick={() => scrollTo("keunggulan")}>Keunggulan</a>
                        </div>

                        <div className="lp-footer-col">
                            <h4>Dukungan</h4>
                            <Link to="/panduan">Panduan Penggunaan</Link>
                            <Link to="/tim">Tim Kami</Link>
                            <a href="mailto:hallo@saktiku.id">hallo@saktiku.id</a>
                        </div>

                        <div className="lp-footer-col">
                            <h4>Mulai</h4>
                            <Link to="/register">Daftar Gratis</Link>
                            <Link to="/login">Masuk</Link>
                        </div>
                    </div>

                    <div className="lp-footer-bottom">
                        <span>© {new Date().getFullYear()} Saktiku. Semua hak dilindungi.</span>
                        <span className="lp-backtop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                            <FaChevronUp /> Kembali ke atas
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;