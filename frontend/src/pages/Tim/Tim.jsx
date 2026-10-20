import { useNavigate, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaCrown,
    FaGraduationCap,
    FaUsers,
    FaCode,
} from "react-icons/fa";
import "./tim.css";

const teamGroups = [
    {
        id: "ketua",
        title: "Ketua",
        icon: <FaCrown />,
        members: [
            {
                name: "Prof. Sukirno, M.Si., Ph.D., CPM., SMAC., Ch.M.",
                role: "Ketua Tim",
                photo: "/Images/team/sukirno.svg",
                featured: true,
            },
        ],
    },
    {
        id: "dosen",
        title: "Tim Dosen",
        icon: <FaGraduationCap />,
        members: [
            {
                name: "Arief Nurrahman, S.Pd., M.Pd.",
                role: "Anggota Tim Dosen",
                photo: "/Images/team/arief.svg",
            },
            {
                name: "Fitria Ningrum Sayekti, S.E., M.Acc.",
                role: "Validator",
                photo: "/Images/team/fitria.svg",
            },
            {
                name: "Nurul Hidayah, S.Pd., M.Sc.",
                role: "Anggota Tim Dosen",
                photo: "/Images/team/nurul.svg",
            },
        ],
    },
    {
        id: "mahasiswa",
        title: "Tim Mahasiswa",
        icon: <FaUsers />,
        members: [
            {
                name: "Bayu Budi Saputro",
                role: "Anggota Tim Mahasiswa",
                photo: "/Images/team/bayu.svg",
            },
            {
                name: "Yulia Nuraeni Suci",
                role: "Anggota Tim Mahasiswa",
                photo: "/Images/team/yulia.jpg",
            },
            {
                name: "Nabil Afif Zamzamy",
                role: "Anggota Tim Mahasiswa",
                photo: "/Images/team/nabil.jpeg",
            },
            {
                name: "Dea Ramadhani P.",
                role: "Anggota Tim Mahasiswa",
                photo: "/Images/team/dea.jpeg",
            },
        ],
    },
    {
        id: "pengembang",
        title: "Pengembang Sistem",
        icon: <FaCode />,
        members: [
            {
                name: "M. Gauz Rofiqul Azhiem",
                role: "Pengembang Sistem SAKTIKU",
                photo: "/Images/team/Gauz.jpg",
            },
        ],
    },
];

const getInitial = (name) => {
    const match = name.match(/[A-Za-z]/);
    return match ? match[0].toUpperCase() : "?";
};

function Tim() {
    const navigate = useNavigate();

    return (
        <div className="tm-page">
            {/* ───── HEADER ───── */}
            <header className="tm-nav">
                <div className="tm-nav-inner">
                    <Link to="/" className="tm-brand">
                        <img src="/Images/sakti.png" alt="SAKTIKU Logo" className="tm-logo" />
                        <span className="tm-brand-name">Saktiku</span>
                    </Link>
                    <button className="tm-back-btn" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                        <span>Kembali</span>
                    </button>
                </div>
            </header>

            {/* ───── HERO ───── */}
            <section className="tm-hero">
                <div className="tm-container">
                    <span className="tm-eyebrow">Tim Kami</span>
                    <h1>
                        Tim di Balik <span className="tm-gradient-text">SAKTIKU</span>
                    </h1>
                    <p>
                        SAKTIKU dikembangkan melalui kolaborasi dosen,  dan mahasiswa, dan
                        yang berkontribusi dalam mewujudkan solusi digital
                        untuk mendukung pencatatan keuangan dan akuntansi.
                    </p>
                </div>
            </section>

            {/* ───── GROUPS ───── */}
            <main className="tm-main">
                <div className="tm-container">
                    {teamGroups.map((group) => (
                        <section className="tm-group" key={group.id}>
                            <div className="tm-group-head">
                                <span className="tm-group-icon">{group.icon}</span>
                                <h2>{group.title}</h2>
                            </div>
                            <div
                                className={`tm-grid ${
                                    group.members.some((m) => m.featured) ? "tm-grid-single" : ""
                                }`}
                            >
                                {group.members.map((m) => (
                                    <article
                                        className={`tm-card ${
                                            m.featured ? "tm-card-featured" : ""
                                        }`}
                                        key={m.name}
                                    >
                                        <div className="tm-photo">
                                            <span className="tm-photo-initial">
                                                {getInitial(m.name)}
                                            </span>
                                            {m.photo && (
                                                <img
                                                    src={m.photo}
                                                    alt={m.name}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="tm-info">
                                            <h3>{m.name}</h3>
                                            <span className="tm-role">{m.role}</span>
                                            {m.desc && <p className="tm-desc">{m.desc}</p>}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* ───── FOOTER ───── */}
            <footer className="tm-footer">
                <div className="tm-container tm-footer-inner">
                    <span>© {new Date().getFullYear()} Saktiku. Semua hak dilindungi.</span>
                    <Link to="/">Kembali ke Beranda</Link>
                </div>
            </footer>
        </div>
    );
}

export default Tim;
