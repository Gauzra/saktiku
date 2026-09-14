// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBusiness } from "../../context/BusinessContext";
import api from "../../services/Api";

function Sidebar({ isOpen, closeSidebar }) {
    const [openReports, setOpenReports] = useState(false);
    const [openAccountingCycle, setOpenAccountingCycle] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const {
        selectedBusiness,
        businessTypes,
        switchBusiness,
        refreshBusiness
    } = useBusiness();

    const handleBusinessChange = async (businessId) => {
        try {
            const business = businessTypes.find(b => b.id === parseInt(businessId));
            if (!business) return;

            setLoading(true);
            const loadingToast = toast.loading("Mengubah jenis usaha...");

            await api.post("/business/setup", {
                business_type_id: businessId
            });

            // 🔥 UPDATE CONTEXT
            switchBusiness(business);

            toast.update(loadingToast, {
                render: `Berhasil beralih ke ${business.name}`,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            // 🔥 REFRESH DATA TANPA RELOAD PAGE
            setTimeout(() => {
                window.location.reload();  // MASIH PERLU RELOAD UNTUK SEMENTARA
            }, 1500);

        } catch (error) {
            console.error("Error switching business:", error);
            toast.error("Gagal mengubah jenis usaha");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <aside className={isOpen ? "sidebar active" : "sidebar"}>

                <div className="sidebar-brand">
                    <img src="/Images/sakti.png" alt="SAKTIKU Logo" className="brand-logo" />
                    <p className="brand-sub">Sistem Akuntansi Keuangan Terintegrasi Khusus UMKM</p>
                </div>

                {/* DROPDOWN USAHA */}
                <div className="sidebar-business">
                    <label>Pilih Jenis Usaha Anda</label>
                    <select
                        value={selectedBusiness?.id || ""}
                        onChange={(e) => handleBusinessChange(e.target.value)}
                        className="business-select"
                        disabled={loading}
                    >
                        <option value="" disabled>Pilih jenis usaha</option>
                        {businessTypes.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                    {selectedBusiness && (
                        <p className="business-active">
                            Aktif: {selectedBusiness.name}
                        </p>
                    )}
                </div>

                <div className="sidebar-divider"></div>

                <nav className="sidebar-menu">
                    <NavLink to="/app" end className="menu-item" onClick={closeSidebar}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/app/atur-saldo-awal" className="menu-item" onClick={closeSidebar}>
                        Atur Saldo Awal</NavLink>

                    <NavLink to="/app/transaction" className="menu-item" onClick={closeSidebar}>
                        Transaksi
                    </NavLink>

                    <div
                        className="menu-item dropdown-toggle"
                        onClick={() => setOpenAccountingCycle(!openAccountingCycle)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setOpenAccountingCycle(!openAccountingCycle);
                        }}
                    >
                        Siklus Akuntansi
                        <span className={`arrow ${openAccountingCycle ? "rotate" : ""}`}>▾</span>
                    </div>

                    {openAccountingCycle && (
                        <div className="submenu">
                            <NavLink
                                to="/app/siklus-akuntansi/jurnal-umum"
                                className="submenu-item"
                                onClick={closeSidebar}
                            >
                                Jurnal Umum
                            </NavLink>
                            <NavLink
                                to="/app/siklus-akuntansi/buku-besar"
                                className="submenu-item"
                                onClick={closeSidebar}
                            >
                                Buku Besar
                            </NavLink>
                            <NavLink
                                to="/app/siklus-akuntansi/neraca-saldo"
                                className="submenu-item"
                                onClick={closeSidebar}
                            >
                                Neraca Saldo
                            </NavLink>
                            <NavLink
                                to="/app/siklus-akuntansi/jurnal-penyesuaian"
                                className="submenu-item"
                                onClick={closeSidebar}
                            >
                                Jurnal Penyesuaian
                            </NavLink>
                        </div>
                    )}

                    <div
                        className="menu-item dropdown-toggle"
                        onClick={() => setOpenReports(!openReports)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setOpenReports(!openReports);
                        }}
                    >
                        Laporan
                        <span className={`arrow ${openReports ? "rotate" : ""}`}>▾</span>
                    </div>

                    {openReports && (
                        <div className="submenu">
                            <NavLink to="/app/laporan/laba-rugi" className="submenu-item" onClick={closeSidebar}>
                                Laba Rugi
                            </NavLink>
                            <NavLink to="/app/laporan/perubahan-modal" className="submenu-item" onClick={closeSidebar}>
                                Perubahan Modal
                            </NavLink>
                            <NavLink to="/app/laporan/neraca" className="submenu-item" onClick={closeSidebar}>
                                Neraca
                            </NavLink>

                            <NavLink to="/app/laporan/arus-kas" className="submenu-item" onClick={closeSidebar}>
                                Arus Kas
                            </NavLink>
                        </div>
                    )}

                    <NavLink to="/app/profile" className="menu-item" onClick={closeSidebar}>
                        Profil
                    </NavLink>
                    
                    <div className="menu-item guide-item" onClick={() => { navigate('/panduan'); closeSidebar(); }}>
                        <i className="fas fa-question-circle"></i>
                        <span>Panduan</span>
                    </div>
                </nav>

            </aside>
        </>
    );
}

export default Sidebar;
