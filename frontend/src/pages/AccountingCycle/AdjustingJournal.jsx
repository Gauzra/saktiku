// frontend/src/pages/AccountingCycle/AdjustingJournal.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import { toast } from "react-toastify";
import "./accountingCycle.css";

function AdjustingJournal() {
    const { selectedBusiness } = useBusiness();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState({ start_date: "", end_date: "" });
    const [showModal, setShowModal] = useState(false);
    
    // State for Form (Non-Accounting Friendly)
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        transaction_date: new Date().toISOString().split('T')[0],
        description: "",
        category_id: "",
        amount: ""
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setPeriod({
            start_date: firstDay.toISOString().split("T")[0],
            end_date: lastDay.toISOString().split("T")[0],
        });
    }, []);

    const fetchAdjustingJournal = async () => {
        if (!selectedBusiness || !period.start_date || !period.end_date) return;
        setLoading(true);
        try {
            const res = await api.get("/transactions/adjusting/filter", {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id,
                },
            });
            setRows(res.data?.data || []);
        } catch (error) {
            console.error("Gagal ambil data jurnal penyesuaian:", error);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories", {
                params: { is_adjustment: 1 } // Hanya ambil kategori khusus penyesuaian
            });
            setCategories(res.data?.data || []);
        } catch (error) {
            console.error("Gagal ambil data kategori:", error);
        }
    };

    useEffect(() => {
        fetchAdjustingJournal();
    }, [selectedBusiness, period.start_date, period.end_date]);

    useEffect(() => {
        if (showModal) {
            fetchCategories();
        }
    }, [showModal]);

    const handlePeriodChange = (e) => {
        const { name, value } = e.target;
        setPeriod((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler khusus untuk input nominal Rupiah
    const handleAmountChange = (e) => {
        // Hapus semua karakter non-digit
        const raw = e.target.value.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, amount: raw }));
    };

    // Format angka ke tampilan Rupiah (Rp 1.500.000)
    const displayRupiah = (value) => {
        const num = String(value).replace(/\D/g, "");
        if (!num) return "";
        return "Rp " + new Intl.NumberFormat("id-ID").format(Number(num));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Kirim amount sebagai angka murni (tanpa format)
            const rawAmount = Number(String(formData.amount).replace(/\D/g, ""));
            await api.post("/transactions/adjusting", {
                ...formData,
                amount: rawAmount
            });
            toast.success("Penyesuaian berhasil disimpan secara otomatis!");
            setShowModal(false);
            setFormData({
                transaction_date: new Date().toISOString().split('T')[0],
                description: "",
                category_id: "",
                amount: ""
            });
            fetchAdjustingJournal();
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal menyimpan penyesuaian";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const formatRupiah = (angka) => {
        const num = Number(angka) || 0;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (value) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toLocaleDateString("id-ID");
    };

    const handleDelete = async (transactionId) => {
        if (!window.confirm("Yakin ingin menghapus penyesuaian ini?")) {
            return;
        }
        
        try {
            await api.delete(`/transactions/${transactionId}`);
            toast.success("Penyesuaian berhasil dihapus!");
            fetchAdjustingJournal();
        } catch (error) {
            console.error("Gagal menghapus penyesuaian:", error);
            const msg = error.response?.data?.message || "Gagal menghapus penyesuaian";
            toast.error(msg);
        }
    };

    const handleExport = async (format) => {
        try {
            const response = await api.get('/reports/export/adjusting-journal', {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id,
                    format: format
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `jurnal_penyesuaian_${period.start_date}_to_${period.end_date}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengekspor laporan.");
        }
    };

    if (!selectedBusiness) {
        return (
            <div className="ac-container">
                <div className="ac-card">
                    <div className="ac-empty">
                        <p>Silakan pilih jenis usaha terlebih dahulu di sidebar.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ac-container">
            <div className="ac-header">
                <div>
                    <h2 className="ac-title">Jurnal Penyesuaian - {selectedBusiness.name}</h2>
                    <p className="ac-subtitle">Lakukan penyesuaian saldo akhir periode dengan memilih kategori yang sesuai.</p>
                </div>

                <div className="ac-actions">
                    <div className="ac-filter">
                        <input
                            type="date"
                            name="start_date"
                            value={period.start_date}
                            onChange={handlePeriodChange}
                        />
                        <span className="ac-filter-sep">s/d</span>
                        <input
                            type="date"
                            name="end_date"
                            value={period.end_date}
                            onChange={handlePeriodChange}
                        />
                    </div>
                    <div className="ac-export-btns">
                        <button 
                            className="ac-btn-export-excel" 
                            onClick={() => handleExport('excel')}
                            title="Export ke Excel"
                        >
                            <i className="fas fa-file-excel"></i> Excel
                        </button>
                        <button 
                            className="ac-btn-export-pdf" 
                            onClick={() => handleExport('pdf')}
                            title="Export ke PDF"
                        >
                            <i className="fas fa-file-pdf"></i> PDF
                        </button>
                    </div>
                    <button className="ac-btn-primary" onClick={() => setShowModal(true)}>
                        + Buat Penyesuaian Baru
                    </button>
                </div>
            </div>

            <div className="ac-card">
                {loading ? (
                    <div className="ac-empty"><p>Memuat data...</p></div>
                ) : rows.length === 0 ? (
                    <div className="ac-empty">
                        <p>Belum ada data penyesuaian untuk periode ini.</p>
                        <p className="ac-muted">Klik tombol di atas untuk mulai membuat penyesuaian otomatis.</p>
                    </div>
                ) : (
                    <div className="ac-table-wrap">
                        <table className="ac-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Keterangan</th>
                                    <th>Akun Terkait (Debit)</th>
                                    <th className="ac-text-right">Nominal</th>
                                    <th>Akun Terkait (Kredit)</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.transaction_id}>
                                        <td>{formatDate(r.transaction_date)}</td>
                                        <td>{r.description || "-"}</td>
                                        <td className="ac-muted">{r.debit_code} - {r.debit_name}</td>
                                        <td className="ac-text-right" style={{ fontWeight: 'bold' }}>{formatRupiah(r.debit)}</td>
                                        <td className="ac-muted">{r.credit_code} - {r.credit_name}</td>
                                        <td>
                                            <button 
                                                className="ac-btn-danger" 
                                                onClick={() => handleDelete(r.transaction_id)}
                                                title="Hapus penyesuaian"
                                            >
                                                <i className="fas fa-trash-alt"></i> Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL FORM SMART ADJUSTMENT */}
            {showModal && (
                <div className="ac-modal-overlay">
                    <div className="ac-modal">
                        <div className="ac-modal-header">
                            <h3>Buat Penyesuaian Otomatis</h3>
                            <button className="ac-modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="ac-form">
                            <div className="ac-form-group">
                                <label>Apa yang ingin Anda sesuaikan?</label>
                                <select name="category_id" value={formData.category_id} onChange={handleFormChange} required>
                                    <option value="">-- Pilih Jenis Penyesuaian --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="ac-muted" style={{ marginTop: '5px' }}>
                                    *Sistem akan otomatis menentukan akun akuntansi berdasarkan pilihan Anda.
                                </p>
                            </div>
                            
                            <div className="ac-form-grid">
                                <div className="ac-form-group">
                                    <label>Tanggal Penyesuaian</label>
                                    <input 
                                        type="date" 
                                        name="transaction_date" 
                                        value={formData.transaction_date} 
                                        onChange={handleFormChange} 
                                        required 
                                    />
                                </div>
                                <div className="ac-form-group">
                                    <label>Nominal (Rp)</label>
                                    <input 
                                        type="text" 
                                        name="amount" 
                                        value={displayRupiah(formData.amount)} 
                                        onChange={handleAmountChange} 
                                        placeholder="Rp 0" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="ac-form-group">
                                <label>Keterangan Tambahan</label>
                                <input 
                                    type="text" 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleFormChange} 
                                    placeholder="Contoh: Penyesuaian nilai peralatan kantor" 
                                    required 
                                />
                            </div>

                            <div className="ac-modal-footer">
                                <button type="button" className="ac-btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="ac-btn-primary" disabled={submitting}>
                                    {submitting ? "Memproses..." : "Simpan & Sesuaikan Otomatis"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdjustingJournal;
