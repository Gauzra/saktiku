import { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import "./accountingCycle.css";

function accountTypeLabel(type) {
    switch (String(type || "").toLowerCase()) {
        case "asset":
            return "Aset";
        case "liability":
            return "Utang";
        case "equity":
            return "Modal";
        case "income":
            return "Pendapatan";
        case "expense":
            return "Beban";
        default:
            return String(type || "-");
    }
}

function TrialBalance() {
    const { selectedBusiness } = useBusiness();

    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState(null);
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

        const fetchTrialBalance = async () => {
            setLoading(true);
            try {
                const res = await api.get("/accounting/trial-balance", {
                    params: {
                        start_date: period.start_date,
                        end_date: period.end_date,
                        business_type_id: selectedBusiness.id,
                    },
                });

                const payload = res.data?.data;
                setRows(payload?.rows || []);
                setTotals(payload?.totals || null);
            } catch (error) {
                console.error("Gagal ambil data neraca saldo:", error);
                setRows([]);
                setTotals(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTrialBalance();
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

    const handleExport = async (format) => {
        try {
            const response = await api.get('/reports/export/trial-balance', {
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
            link.setAttribute('download', `neraca_saldo_${period.start_date}_to_${period.end_date}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengekspor laporan.");
        }
    };

    const groupedRows = useMemo(() => {
        const groups = new Map();
        for (const r of rows) {
            const key = String(r.account_type || "unknown");
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(r);
        }

        const order = ["asset", "liability", "equity", "income", "expense"];
        const keys = Array.from(groups.keys()).sort((a, b) => {
            const ia = order.indexOf(String(a).toLowerCase());
            const ib = order.indexOf(String(b).toLowerCase());
            const sa = ia === -1 ? 999 : ia;
            const sb = ib === -1 ? 999 : ib;
            if (sa !== sb) return sa - sb;
            return String(a).localeCompare(String(b));
        });

        return keys.map((k) => ({
            type: k,
            label: accountTypeLabel(k),
            items: groups.get(k) || [],
        }));
    }, [rows]);

    const diff = totals ? Number(totals.difference) || 0 : 0;
    const isBalanced = Math.abs(diff) < 0.000001;

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
                    <h2 className="ac-title">Neraca Saldo - {selectedBusiness.name}</h2>
                    <p className="ac-subtitle">
                        Ringkasan total debit dan kredit per akun untuk periode yang dipilih.
                    </p>
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
                {totals && (
                    <div className="ac-tb-summary">
                        <div className="ac-tb-summary-item">
                            <div className="ac-tb-summary-label">Total Debit</div>
                            <div className="ac-tb-summary-value ac-mono">{formatRupiah(totals.total_debit)}</div>
                        </div>
                        <div className="ac-tb-summary-item">
                            <div className="ac-tb-summary-label">Total Kredit</div>
                            <div className="ac-tb-summary-value ac-mono">{formatRupiah(totals.total_credit)}</div>
                        </div>
                        <div className="ac-tb-summary-item">
                            <div className="ac-tb-summary-label">Selisih (Debit − Kredit)</div>
                            <div className="ac-tb-summary-value ac-mono">{formatRupiah(diff)}</div>
                        </div>
                        <div className="ac-tb-summary-item ac-tb-summary-item--status">
                            <div className="ac-tb-summary-label">Status</div>
                            <div className="ac-tb-summary-value">
                                {isBalanced ? "Seimbang" : "Tidak seimbang"}
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="ac-empty">
                        <p>Memuat data...</p>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="ac-empty">
                        <p>Tidak ada data neraca saldo untuk periode ini.</p>
                        <p className="ac-muted">
                            Periode: {period.start_date} s/d {period.end_date}
                        </p>
                    </div>
                ) : (
                    <div className="ac-tb-groups">
                        {groupedRows.map((g) => (
                            <section key={g.type} className="ac-tb-group">
                                <h3 className="ac-tb-group-title">{g.label}</h3>

                                <div className="ac-table-wrap">
                                    <table className="ac-table ac-tb-table" style={{ minWidth: '650px' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: 100, whiteSpace: 'nowrap' }}>Kode</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Nama Akun</th>
                                                <th style={{ width: 170, whiteSpace: 'nowrap' }} className="ac-text-right">
                                                    Debit
                                                </th>
                                                <th style={{ width: 170, whiteSpace: 'nowrap' }} className="ac-text-right">
                                                    Kredit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {g.items.map((r) => (
                                                <tr key={`${g.type}-${r.account_code}`}>
                                                    <td className="ac-mono">{r.account_code}</td>
                                                    <td>{r.account_name}</td>
                                                    <td className="ac-text-right ac-mono" style={{ whiteSpace: 'nowrap' }}>{formatRupiah(r.total_debit)}</td>
                                                    <td className="ac-text-right ac-mono" style={{ whiteSpace: 'nowrap' }}>{formatRupiah(r.total_credit)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrialBalance;

