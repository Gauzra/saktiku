// src/pages/Reports/EquityChange.jsx
import { useState, useEffect } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import { toast } from "react-toastify";
import "./reports.css";

function EquityChange() {
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
            fetchEquityChange();
        }
    }, [period, selectedBusiness]);

    const fetchEquityChange = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/reports/equity-change`, {
                params: {
                    start_date: period.start_date,
                    end_date: period.end_date,
                    business_type_id: selectedBusiness.id
                }
            });
            setData(response.data.data);
        } catch (error) {
            console.error("Gagal ambil data perubahan modal:", error);
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

    const handleExportExcel = async () => {
        if (!selectedBusiness || !period.start_date || !period.end_date) {
            toast.warning("Pilih periode terlebih dahulu");
            return;
        }

        setExporting(true);
        try {
            const response = await api.get(`/reports/export/equity-change`, {
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
            link.setAttribute('download', `perubahan_modal_${selectedBusiness.name}_${period.start_date}_to_${period.end_date}.xlsx`);
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
            const response = await api.get(`/reports/export/equity-change`, {
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
            link.setAttribute('download', `perubahan_modal_${selectedBusiness.name}_${period.start_date}_to_${period.end_date}.pdf`);
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
                    <h2>Laporan Perubahan Modal - {selectedBusiness.name}</h2>
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
                    <p>Gagal memuat data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Laporan Perubahan Modal - {selectedBusiness.name}</h2>
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
                <div className="report-section">
                    <div className="report-table-wrapper">
                        <table className="report-table">
                            <tbody>
                                <tr>
                                    <td><strong>Modal Awal</strong> <br/><small className="text-muted">(Per {period.start_date})</small></td>
                                    <td className="text-right"><strong>{formatRupiah(data.beginning_equity)}</strong></td>
                                </tr>
                                
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    <td>Ditambah: {data.net_income >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}</td>
                                    <td className="text-right" style={{ color: data.net_income >= 0 ? '#2e7d32' : '#c62828' }}>
                                        {formatRupiah(Math.abs(data.net_income))}
                                    </td>
                                </tr>
                                
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    <td>Ditambah: Penambahan Modal Lainnya</td>
                                    <td className="text-right" style={{ color: '#2e7d32' }}>
                                        {formatRupiah(data.additional_capital)}
                                    </td>
                                </tr>
                                
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    <td>Dikurangi: Penarikan Pribadi (Prive)</td>
                                    <td className="text-right" style={{ color: '#c62828' }}>
                                        {formatRupiah(data.withdrawals)}
                                    </td>
                                </tr>

                                <tr className="total-row" style={{ backgroundColor: '#eff6ff' }}>
                                    <td><strong>MODAL AKHIR</strong> <br/><small className="text-muted">(Per {period.end_date})</small></td>
                                    <td className="text-right" style={{ fontSize: '1.1em' }}>
                                        <strong>{formatRupiah(data.ending_equity)}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquityChange;
