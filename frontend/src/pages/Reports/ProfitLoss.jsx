// src/pages/Reports/ProfitLoss.jsx
import { useState, useEffect } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import { toast } from "react-toastify";
import "./reports.css";

function ProfitLoss() {
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
            fetchProfitLoss();
        }
    }, [period, selectedBusiness]);

    const fetchProfitLoss = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/reports/profit-loss-detail`, {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id
                }
            });
            console.log("Profit Loss Detail:", response.data);
            setData(response.data.data);
        } catch (error) {
            console.error("Gagal ambil data laba rugi:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (e) => {
        const { name, value } = e.target;
        setPeriod(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🔥 FUNGSI EXPORT EXCEL
    const handleExportExcel = async () => {
        if (!selectedBusiness || !period.start_date || !period.end_date) {
            toast.warning("Pilih periode terlebih dahulu");
            return;
        }

        setExporting(true);
        try {
            const response = await api.get(`/reports/export/profit-loss`, {
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
            link.setAttribute('download', `laba_rugi_${selectedBusiness.name}_${period.start_date}_to_${period.end_date}.xlsx`);
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

    // 🔥 FUNGSI EXPORT PDF
    const handleExportPdf = async () => {
        if (!selectedBusiness || !period.start_date || !period.end_date) {
            toast.warning("Pilih periode terlebih dahulu");
            return;
        }

        setExporting(true);
        try {
            const response = await api.get(`/reports/export/profit-loss`, {
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
            link.setAttribute('download', `laba_rugi_${selectedBusiness.name}_${period.start_date}_to_${period.end_date}.pdf`);
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
        return dateString;
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
                    <h2>Laporan Laba Rugi - {selectedBusiness.name}</h2>
                    <div className="reports-filter">
                        <input
                            type="date"
                            name="start_date"
                            value={period.start_date}
                            onChange={handlePeriodChange}
                        />
                        <span> s/d </span>
                        <input
                            type="date"
                            name="end_date"
                            value={period.end_date}
                            onChange={handlePeriodChange}
                        />
                    </div>
                </div>
                <div className="report-card empty-state">
                    <p>Tidak ada data transaksi untuk periode ini</p>
                </div>
            </div>
        );
    }

    const incomeItems = data?.income?.items || [];
    const expenseItems = data?.expense?.items || [];
    const totalIncome = data?.income?.total || 0;
    const totalExpense = data?.expense?.total || 0;
    const netProfit = data?.netProfit || 0;
    const isProfit = netProfit >= 0;

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Laporan Laba Rugi - {selectedBusiness.name}</h2>
                <div className="reports-actions">
                    <div className="reports-filter">
                        <input
                            type="date"
                            name="start_date"
                            value={period.start_date}
                            onChange={handlePeriodChange}
                        />
                        <span> s/d </span>
                        <input
                            type="date"
                            name="end_date"
                            value={period.end_date}
                            onChange={handlePeriodChange}
                        />
                    </div>
                    <div className="export-buttons">
                        <button
                            onClick={handleExportExcel}
                            className="export-excel-btn"
                            disabled={exporting}
                        >
                            {exporting ? "..." : "Excel"}
                        </button>
                        <button
                            onClick={handleExportPdf}
                            className="export-pdf-btn"
                            disabled={exporting}
                        >
                            {exporting ? "..." : "PDF"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="report-card">
                {/* TABLE PENDAPATAN */}
                <div className="report-section">
                    <h3 className="section-title income-title">PENDAPATAN</h3>
                    {incomeItems.length === 0 ? (
                        <p className="empty-message">Tidak ada pendapatan</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <thead>
                                    <tr>
                                        <th>Kode Akun</th>
                                        <th>Nama Akun</th>
                                        <th className="text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomeItems.map((item, index) => (
                                        <tr key={index} className="income-row">
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.description || "-"}</td>
                                            <td className="text-right income-text">
                                                {formatRupiah(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="total-row income-total">
                                        <td colSpan="2"><strong>Total Pendapatan</strong></td>
                                        <td className="text-right income-text">
                                            <strong>{formatRupiah(totalIncome)}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* TABLE BEBAN */}
                <div className="report-section">
                    <h3 className="section-title expense-title">BEBAN</h3>
                    {expenseItems.length === 0 ? (
                        <p className="empty-message">Tidak ada beban</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <thead>
                                    <tr>
                                        <th>Kode Akun</th>
                                        <th>Nama Akun</th>
                                        <th className="text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenseItems.map((item, index) => (
                                        <tr key={index} className="expense-row">
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.description || "-"}</td>
                                            <td className="text-right expense-text">
                                                {formatRupiah(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="total-row expense-total">
                                        <td colSpan="2"><strong>Total Beban</strong></td>
                                        <td className="text-right expense-text">
                                            <strong>{formatRupiah(totalExpense)}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* LABA BERSIH */}
                <div className={`profit-loss-summary ${isProfit ? 'profit' : 'loss'}`}>
                    <div className="summary-row">
                        <span className="summary-label">LABA BERSIH</span>
                        <span className="summary-value">
                            {formatRupiah(Math.abs(netProfit))}
                            {!isProfit && <span className="loss-badge"> (RUGI)</span>}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfitLoss;