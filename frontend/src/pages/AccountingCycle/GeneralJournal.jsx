import { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import "./accountingCycle.css";

function GeneralJournal() {
    const { selectedBusiness } = useBusiness();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState({ start_date: "", end_date: "" });

    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setPeriod({
            start_date: firstDay.toISOString().split("T")[0],
            end_date: lastDay.toISOString().split("T")[0],
        });
    }, []);

    useEffect(() => {
        if (!selectedBusiness || !period.start_date || !period.end_date) return;

        const fetchJournal = async () => {
            setLoading(true);
            try {
                const res = await api.get("/transactions/filter", {
                    params: {
                        start_date: period.start_date,
                        end_date: period.end_date,
                        business_type_id: selectedBusiness.id,
                    },
                });
                setRows(res.data?.data || []);
            } catch (error) {
                console.error("Gagal ambil data jurnal umum:", error);
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJournal();
    }, [selectedBusiness, period.start_date, period.end_date]);

    const handlePeriodChange = (e) => {
        const { name, value } = e.target;
        setPeriod((prev) => ({ ...prev, [name]: value }));
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

    const handleExport = async (format) => {
        try {
            const response = await api.get('/reports/export/general-journal', {
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
            link.setAttribute('download', `jurnal_umum_${period.start_date}_to_${period.end_date}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengekspor laporan.");
        }
    };

    const hasBusiness = Boolean(selectedBusiness);
    const title = useMemo(() => {
        if (!selectedBusiness) return "Jurnal Umum";
        return `Jurnal Umum - ${selectedBusiness.name}`;
    }, [selectedBusiness]);

    if (!hasBusiness) {
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
                    <h2 className="ac-title">{title}</h2>
                    <p className="ac-subtitle">Pencatatan transaksi (debit/kredit) berdasarkan periode.</p>
                </div>

                <div className="ac-actions">
                    <div className="ac-filter">
                        <input
                            type="date"
                            name="start_date"
                            value={period.start_date}
                            onChange={handlePeriodChange}
                            aria-label="Tanggal mulai"
                        />
                        <span className="ac-filter-sep">s/d</span>
                        <input
                            type="date"
                            name="end_date"
                            value={period.end_date}
                            onChange={handlePeriodChange}
                            aria-label="Tanggal akhir"
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
                </div>
            </div>

            <div className="ac-card">
                {loading ? (
                    <div className="ac-empty">
                        <p>Memuat data...</p>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="ac-empty">
                        <p>Tidak ada data jurnal untuk periode ini.</p>
                        <p className="ac-muted">
                            Periode: {period.start_date} s/d {period.end_date}
                        </p>
                    </div>
                ) : (
                    <div className="ac-table-wrap">
                        <table className="ac-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 140 }}>Tanggal</th>
                                    <th>Deskripsi</th>
                                    <th style={{ width: 220 }}>Akun Debit</th>
                                    <th style={{ width: 160 }} className="ac-text-right">Debit</th>
                                    <th style={{ width: 220 }}>Akun Kredit</th>
                                    <th style={{ width: 160 }} className="ac-text-right">Kredit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.transaction_id}>
                                        <td>{formatDate(r.transaction_date)}</td>
                                        <td>{r.description || "-"}</td>
                                        <td className="ac-mono">
                                            {r.debit_code} — {r.debit_name}
                                        </td>
                                        <td className="ac-text-right ac-mono">{formatRupiah(r.debit)}</td>
                                        <td className="ac-mono">
                                            {r.credit_code} — {r.credit_name}
                                        </td>
                                        <td className="ac-text-right ac-mono">{formatRupiah(r.credit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GeneralJournal;

