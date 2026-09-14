import { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import "./accountingCycle.css";

function Ledger() {
    const { selectedBusiness } = useBusiness();

    const [entries, setEntries] = useState([]);
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

        const fetchLedger = async () => {
            setLoading(true);
            try {
                const res = await api.get("/accounting/ledger", {
                    params: {
                        start_date: period.start_date,
                        end_date: period.end_date,
                        business_type_id: selectedBusiness.id,
                    },
                });
                setEntries(res.data?.data || []);
            } catch (error) {
                console.error("Gagal ambil data buku besar:", error);
                setEntries([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
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
            const response = await api.get('/reports/export/ledger', {
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
            link.setAttribute('download', `buku_besar_${period.start_date}_to_${period.end_date}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengekspor laporan.");
        }
    };

    const grouped = useMemo(() => {
        const root = {
            asset: new Map(),      // ← TAMBAHKAN
            liability: new Map(),  // ← TAMBAHKAN
            equity: new Map(),     // ← TAMBAHKAN
            income: new Map(),
            expense: new Map(),
        };

        for (const e of entries) {
            const type = e.account_type;
            if (!root[type]) continue; // skip jika type tidak dikenal

            const key = String(e.account_code || e.account_id);
            if (!root[type].has(key)) {
                root[type].set(key, {
                    account_code: e.account_code,
                    account_name: e.account_name,
                    items: [],
                });
            }
            root[type].get(key).items.push(e);
        }

        const mapToSortedArray = (m) =>
            Array.from(m.values()).sort((a, b) => String(a.account_code).localeCompare(String(b.account_code)));

        return {
            asset: mapToSortedArray(root.asset),
            liability: mapToSortedArray(root.liability),
            equity: mapToSortedArray(root.equity),
            income: mapToSortedArray(root.income),
            expense: mapToSortedArray(root.expense),
        };
    }, [entries]);

    const renderAccount = (acc) => {
        // Urutkan item berdasarkan tanggal
        const sortedItems = [...acc.items].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

        // Hitung total mutasi
        const totalDebit = sortedItems.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
        const totalCredit = sortedItems.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);

        return (
            <div key={acc.account_code} className="ac-ledger-account" style={{ marginBottom: '30px' }}>
                <div className="ac-ledger-account-header" style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', borderBottom: '2px solid #e2e8f0', borderRadius: '8px 8px 0 0' }}>
                    <div className="ac-ledger-account-title">
                        <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>
                            [{acc.account_code}] {acc.account_name}
                        </strong>
                    </div>
                </div>

                <div className="ac-ledger-account-body" style={{ border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', overflowX: 'auto' }}>
                    <table className="report-table" style={{ width: '100%', margin: 0, minWidth: '600px' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b', whiteSpace: 'nowrap' }}>Tanggal</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b', whiteSpace: 'nowrap' }}>Deskripsi</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#64748b', whiteSpace: 'nowrap' }}>Debit</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#64748b', whiteSpace: 'nowrap' }}>Kredit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedItems.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px' }}>{formatDate(item.transaction_date)}</td>
                                    <td style={{ padding: '12px 16px' }}>{item.description || "-"}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        {Number(item.debit) > 0 ? formatRupiah(item.debit) : '-'}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        {Number(item.credit) > 0 ? formatRupiah(item.credit) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {/* Baris Total Mutasi */}
                            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                                <td colSpan="2" style={{ padding: '12px 16px', textAlign: 'right' }}>Total:</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#000000ff' }}>{formatRupiah(totalDebit)}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#000000ff' }}>{formatRupiah(totalCredit)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
                    <h2 className="ac-title">Buku Besar - {selectedBusiness.name}</h2>
                    <p className="ac-subtitle">
                        Ditampilkan per akun. Setiap transaksi dipisah agar mudah ditelusuri.
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
                {loading ? (
                    <div className="ac-empty">
                        <p>Memuat data...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="ac-empty">
                        <p>Tidak ada data buku besar untuk periode ini.</p>
                        <p className="ac-muted">
                            Periode: {period.start_date} s/d {period.end_date}
                        </p>
                    </div>
                ) : (
                    <div className="ac-ledger">
                        <section className="ac-ledger-section">
                            <h3 className="ac-ledger-section-title">Aset</h3>
                            {grouped.asset.length === 0 ? <p className="ac-muted">Tidak ada data aset.</p> : grouped.asset.map(renderAccount)}
                        </section>

                        <section className="ac-ledger-section">
                            <h3 className="ac-ledger-section-title">Utang</h3>
                            {grouped.liability.length === 0 ? <p className="ac-muted">Tidak ada data utang.</p> : grouped.liability.map(renderAccount)}
                        </section>

                        <section className="ac-ledger-section">
                            <h3 className="ac-ledger-section-title">Modal</h3>
                            {grouped.equity.length === 0 ? <p className="ac-muted">Tidak ada data modal.</p> : grouped.equity.map(renderAccount)}
                        </section>

                        <section className="ac-ledger-section">
                            <h3 className="ac-ledger-section-title">Pendapatan</h3>
                            {grouped.income.length === 0 ? <p className="ac-muted">Tidak ada data pendapatan.</p> : grouped.income.map(renderAccount)}
                        </section>

                        <section className="ac-ledger-section">
                            <h3 className="ac-ledger-section-title">Beban</h3>
                            {grouped.expense.length === 0 ? <p className="ac-muted">Tidak ada data beban.</p> : grouped.expense.map(renderAccount)}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Ledger;

