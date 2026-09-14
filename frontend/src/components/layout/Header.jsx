import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function Header({ toggleSidebar }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const getTitle = () => {
        const path = location.pathname;
        if (path === "/") return "Dashboard";
        if (path ==="/atur-saldo-awal") return "Atur Saldo Awal";   
        if (path === "/transaction") return "Transaksi";
        if (path === "/siklus-akuntansi/jurnal-umum") return "Jurnal Umum";
        if (path === "/siklus-akuntansi/buku-besar") return "Buku Besar";
        if (path === "/siklus-akuntansi/neraca-saldo") return "Neraca Saldo";
        if (path === "/siklus-akuntansi/jurnal-penyesuaian") return "Jurnal Penyesuaian";
        if (path === "/laporan/laba-rugi") return "Laporan Laba Rugi";
        if (path === "/laporan/neraca") return "Laporan Neraca";
        if (path === "/laporan/perubahan-modal") return "Laporan Perubahan Modal";
        if (path === "/laporan/arus-kas") return "Laporan Arus Kas";
        if (path === "/profile") return "Profil Pengguna";
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Berhasil keluar");
        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    return (
        <>
            <div className="header">

                {/* Hamburger (Mobile Only via CSS) */}
                <button
                    className="menu-toggle"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>

                <h3>{getTitle()}</h3>

                <div className="header-right">
                    <button 
                        id="btn-logout" 
                        className="btn-logout" 
                        title="Keluar"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Keluar</span>
                    </button>
                </div>

            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Konfirmasi</h3>
                        <p>Yakin ingin keluar dari sistem?</p>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </button>

                            <button
                                className="btn-confirm"
                                onClick={handleLogout}
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;