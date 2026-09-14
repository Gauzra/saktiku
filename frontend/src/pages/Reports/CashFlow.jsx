// src/pages/Reports/CashFlow.jsx
import { useState, useEffect } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import { toast } from "react-toastify";
import "./reports.css";

function CashFlow() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState({
        start_date: "",
        end_date: ""
    });
    const [exporting, setExporting] = useState(false);

    const { selectedBusiness } = useBusiness();

    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setPeriod({
            start_date: firstDay.toISOString().split('T')[0],
            end_date: lastDay.toISOString().split('T')[0]
        });
    }, []);

    useEffect(() => {
        if (period.start_date && period.end_date && selectedBusiness) {
            fetchCashFlow();
        }
    }, [period, selectedBusiness]);

    const fetchCashFlow = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/reports/cash-flow`, {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id
                }
            });
            if (response.data?.success) {
                setData(response.data.data);
            } else {
                setData(null);
            }
        } catch (error) {
            console.error("Gagal ambil data arus kas:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (e) => {
        const { name, value } = e.target;
        setPeriod(prev => ({ ...prev, [name]: value }));
    };

    const handleExportExcel = async () => {
        if (!selectedBusiness || !period.start_date || !period.end_date) {
            toast.warning("Pilih periode terlebih dahulu");
            return;
        }
        setExporting(true);
        try {
            const response = await api.get(`/reports/export/cash-flow`, {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id,
                    format: 'excel'
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `arus_kas_${selectedBusiness.name}_${period.start_date}_to_${period.end_date}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Export Excel berhasil");
        } catch (error) {
            console.error("Export Excel error:", error);
            toast.error("Gagal export Excel");
        } finally {
            setExporting(false);
        }
    };

    const handleExportPdf = async () => {
        if (!selectedBusiness || !period.start_date || !period.end_date) {
            toast.warning("Pilih periode terlebih dahulu");
            return;
        }
        setExporting(true);
        try {
            const response = await api.get(`/reports/export/cash-flow`, {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id,
                    format: 'pdf'
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `arus_kas_${selectedBusiness.name}_${period.start_date}_to_${period.end_date}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Export PDF berhasil");
        } catch (error) {
            console.error("Export PDF error:", error);
            toast.error("Gagal export PDF");
        } finally {
            setExporting(false);
        }
    };

    const formatRupiah = (angka) => {
        const num = Number(angka) || 0;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(num);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    if (!selectedBusiness) {
        return (
            <div className="reports-container">
                <div className="alert alert-warning">
                    <p>Silakan pilih jenis usaha terlebih dahulu di sidebar.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="report-card">Loading...</div>;

    if (!data) {
        return (
            <div className="reports-container">
                <div className="reports-header">
                    <h2>Laporan Arus Kas - {selectedBusiness.name}</h2>
                    <div className="reports-actions">
                        <div className="reports-filter">
                            <input type="date" name="start_date" value={period.start_date} onChange={handlePeriodChange} />
                            <span> s/d </span>
                            <input type="date" name="end_date" value={period.end_date} onChange={handlePeriodChange} />
                        </div>
                    </div>
                </div>
                <div className="report-card empty-state">
                    <p>Tidak ada data arus kas untuk periode {formatDate(period.start_date)} - {formatDate(period.end_date)}</p>
                </div>
            </div>
        );
    }

    const cashIn = data.cashIn || 0;
    const cashOut = data.cashOut || 0;
    const netCash = data.netCash || 0;
    const isPositive = netCash >= 0;

    const inflowItems = data.inflow?.items || [];
    const outflowItems = data.outflow?.items || [];

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Laporan Arus Kas - {selectedBusiness.name}</h2>
                <div className="reports-actions">
                    <div className="reports-filter">
                        <input type="date" name="start_date" value={period.start_date} onChange={handlePeriodChange} />
                        <span> s/d </span>
                        <input type="date" name="end_date" value={period.end_date} onChange={handlePeriodChange} />
                    </div>
                    <div className="export-buttons">
                        <button onClick={handleExportExcel} className="export-excel-btn" disabled={exporting}>{exporting ? "..." : "Excel"}</button>
                        <button onClick={handleExportPdf} className="export-pdf-btn" disabled={exporting}>{exporting ? "..." : "PDF"}</button>
                    </div>
                </div>
            </div>

            <div className="report-card">
                {/* TABLE KAS MASUK */}
                <div className="report-section">
                    <h3 className="section-title income-title">KAS MASUK</h3>
                    {inflowItems.length === 0 ? (
                        <p className="empty-message">Tidak ada penerimaan kas</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Deskripsi</th>
                                        <th className="text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inflowItems.map((item, index) => (
                                        <tr key={index} className="income-row">
                                            <td>{item.date}</td>
                                            <td>{item.description || "-"}</td>
                                            <td className="text-right income-text">
                                                {formatRupiah(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="total-row income-total">
                                        <td colSpan="2"><strong>Total Kas Masuk</strong></td>
                                        <td className="text-right income-text">
                                            <strong>{formatRupiah(cashIn)}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* TABLE KAS KELUAR */}
                <div className="report-section">
                    <h3 className="section-title expense-title">KAS KELUAR</h3>
                    {outflowItems.length === 0 ? (
                        <p className="empty-message">Tidak ada pengeluaran kas</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Deskripsi</th>
                                        <th className="text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outflowItems.map((item, index) => (
                                        <tr key={index} className="expense-row">
                                            <td>{item.date}</td>
                                            <td>{item.description || "-"}</td>
                                            <td className="text-right expense-text">
                                                {formatRupiah(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="total-row expense-total">
                                        <td colSpan="2"><strong>Total Kas Keluar</strong></td>
                                        <td className="text-right expense-text">
                                            <strong>{formatRupiah(cashOut)}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="report-section">
                    <h3 className="section-title total-title">ARUS KAS BERSIH</h3>
                    <div className="total-row-custom grand-total">
                        <span className="total-label">Kas Masuk - Kas Keluar</span>
                        <span className={`total-value ${isPositive ? 'positive-value' : 'negative-value'}`}>
                            {formatRupiah(Math.abs(netCash))}
                            {!isPositive && <span className="loss-badge"> (DEFISIT)</span>}
                        </span>
                    </div>
                </div>

                <div className="report-section">
                    <div className="total-row-custom">
                        <span className="total-label">Saldo Kas Awal</span>
                        <span className="total-value">
                            {formatRupiah(data.saldoAwal || 0)}
                        </span>
                    </div>
                    <div className="total-row-custom grand-total">
                        <span className="total-label">Saldo Kas Akhir</span>
                        <span className="total-value positive-value">
                            {formatRupiah(data.saldoAkhir || 0)}
                        </span>
                    </div>
                </div>

                <div className="report-footer">
                    <p className="date-info">Periode: {formatDate(period.start_date)} - {formatDate(period.end_date)}</p>
                </div>
            </div>
        </div>
    );
}

export default CashFlow;