// src/pages/Reports/BalanceSheet.jsx
import { useState, useEffect } from "react";
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext";
import { toast } from "react-toastify";
import "./reports.css";

function BalanceSheet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [asOfDate, setAsOfDate] = useState("");
    const [exporting, setExporting] = useState(false);

    const { selectedBusiness } = useBusiness();

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        setAsOfDate(`${year}-${month}-${day}`);
    }, []);

    useEffect(() => {
        if (asOfDate && selectedBusiness) {
            fetchBalanceSheet();
        }
    }, [asOfDate, selectedBusiness]);

    const fetchBalanceSheet = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/reports/balance-sheet-detail`, {
                params: {
                    as_of_date: asOfDate,
                    business_type_id: selectedBusiness.id
                }
            });
            
            if (response.data?.success) {
                setData(response.data.data);
            } else {
                setData(null);
            }
        } catch (error) {
            console.error("Gagal ambil data neraca:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };
    
    const handleExportExcel = async () => {
        if (!selectedBusiness || !asOfDate) {
            toast.warning("Pilih tanggal terlebih dahulu");
            return;
        }

        setExporting(true);
        try {
            const response = await api.get(`/reports/export/balance-sheet`, {
                params: {
                    as_of_date: asOfDate,
                    business_type_id: selectedBusiness.id,
                    format: 'excel'
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `neraca_${selectedBusiness.name}_${asOfDate}.xlsx`);
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
        if (!selectedBusiness || !asOfDate) {
            toast.warning("Pilih tanggal terlebih dahulu");
            return;
        }

        setExporting(true);
        try {
            const response = await api.get(`/reports/export/balance-sheet`, {
                params: {
                    as_of_date: asOfDate,
                    business_type_id: selectedBusiness.id,
                    format: 'pdf'
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `neraca_${selectedBusiness.name}_${asOfDate}.pdf`);
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
                    <h2>Laporan Neraca - {selectedBusiness.name}</h2>
                    <div className="reports-actions">
                        <div className="reports-filter">
                            <span>Per Tanggal: </span>
                            <input
                                type="date"
                                value={asOfDate}
                                onChange={(e) => setAsOfDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="report-card empty-state">
                    <p>Tidak ada data neraca untuk tanggal {formatDate(asOfDate)}</p>
                </div>
            </div>
        );
    }

    const totalAset = data.aset?.total || 0;
    const totalLiabilitas = data.liabilitas?.total || 0;
    const totalEkuitas = data.ekuitas?.total || 0;
    const totalLiabilitiesEquity = totalLiabilitas + totalEkuitas;
    const isBalance = Math.abs(totalAset - totalLiabilitiesEquity) < 100;

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Laporan Neraca - {selectedBusiness.name}</h2>
                <div className="reports-actions">
                    <div className="reports-filter">
                        <span>Per Tanggal: </span>
                        <input
                            type="date"
                            value={asOfDate}
                            onChange={(e) => setAsOfDate(e.target.value)}
                        />
                    </div>
                    <div className="export-buttons">
                        <button onClick={handleExportExcel} className="export-excel-btn" disabled={exporting}>
                            {exporting ? "..." : "Excel"}
                        </button>
                        <button onClick={handleExportPdf} className="export-pdf-btn" disabled={exporting}>
                            {exporting ? "..." : "PDF"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="report-card">
                {/* ASET */}
                <div className="report-section">
                    <h3 className="section-title asset-title">ASET</h3>
                    {data.aset?.items?.length === 0 ? (
                        <p className="empty-message">Tidak ada aset</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <tbody>
                                    {data.aset.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="code-cell">{item.code}</td>
                                            <td>{item.name}</td>
                                            <td className="text-right asset-text">
                                                {formatRupiah(item.saldo)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="total-row-custom">
                                <span className="total-label">TOTAL ASET</span>
                                <span className="total-value asset-text">{formatRupiah(totalAset)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* UTANG */}
                <div className="report-section">
                    <h3 className="section-title liability-title">UTANG</h3>
                    {data.liabilitas?.items?.length === 0 ? (
                        <p className="empty-message">Tidak ada utang</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <tbody>
                                    {data.liabilitas.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="code-cell">{item.code}</td>
                                            <td>{item.name}</td>
                                            <td className="text-right liability-text">
                                                {formatRupiah(Math.abs(item.saldo))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="total-row-custom">
                                <span className="total-label">TOTAL UTANG</span>
                                <span className="total-value liability-text">
                                    {formatRupiah(Math.abs(totalLiabilitas))}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL */}
                <div className="report-section">
                    <h3 className="section-title equity-title">MODAL</h3>
                    {data.ekuitas?.items?.length === 0 ? (
                        <p className="empty-message">Tidak ada modal</p>
                    ) : (
                        <div className="report-table-wrapper">
                            <table className="report-table detail-table">
                                <tbody>
                                    {data.ekuitas.items.map((item, index) => {
                                        const isPrive = item.code === '3301' || item.name.toLowerCase().includes('prive');
                                        let displayValue;
                                        if (isPrive && item.saldo > 0) {
                                            displayValue = `(${formatRupiah(item.saldo)})`;
                                        } else if (isPrive && item.saldo < 0) {
                                            displayValue = `(${formatRupiah(Math.abs(item.saldo))})`;
                                        } else {
                                            displayValue = formatRupiah(item.saldo);
                                        }
                                        return (
                                            <tr key={index}>
                                                <td className="code-cell">{item.code}</td>
                                                <td>{item.name}</td>
                                                <td className="text-right equity-text">
                                                    {displayValue}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="total-row-custom">
                                <span className="total-label">TOTAL MODAL</span>
                                <span className="total-value equity-text">{formatRupiah(totalEkuitas)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* TOTAL UTANG & MODAL */}
                <div className="report-section">
                    <h3 className="section-title total-title">TOTAL UTANG & MODAL</h3>
                    <div className="total-row-custom grand-total">
                        <span className="total-label">UTANG + MODAL</span>
                        <span className="total-value total-text">{formatRupiah(totalLiabilitiesEquity)}</span>
                    </div>
                </div>

                {/* INDIKATOR BALANCE */}
                {totalAset > 0 && (
                    <div className={`balance-badge ${isBalance ? 'balanced' : 'unbalanced'}`}>
                        {isBalance ? ' NERACA SEIMBANG' : ' NERACA TIDAK SEIMBANG'}
                    </div>
                )}

                <div className="report-footer">
                    <p className="date-info">Neraca per tanggal: {formatDate(asOfDate)}</p>
                </div>
            </div>
        </div>
    );
}

export default BalanceSheet;