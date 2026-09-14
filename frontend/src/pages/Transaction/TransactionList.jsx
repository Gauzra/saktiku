// src/pages/Transaction/TransactionList.jsx
import React, { useState } from "react";
import api from "../../services/Api";
import { FiEdit2, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useBusiness } from "../../context/BusinessContext";

const TransactionList = ({ transactions, onEdit, onDelete, onRefresh }) => {
    const [filterDate, setFilterDate] = useState(() => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        
        return {
            start_date: oneMonthAgo.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
        };
    });
    const [loading, setLoading] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const { selectedBusiness } = useBusiness();
    
    // Apply default filter on mount
    React.useEffect(() => {
        if (selectedBusiness && filterDate.start_date && filterDate.end_date) {
            applyFilter();
        }
    }, [selectedBusiness]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        if (dateString.includes('/')) return dateString;

        const date = new Date(dateString);
        if (isNaN(date)) return "-";
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(angka);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterDate(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilter = async () => {
        if (!filterDate.start_date || !filterDate.end_date) {
            toast.warning("Pilih tanggal awal dan akhir");
            return;
        }

        setLoading(true);
        try {
            // 🔥 TAMBAHKAN BUSINESS_TYPE_ID
            const response = await api.get(`/transactions/filter`, {
                params: {
                    start_date: filterDate.start_date,
                    end_date: filterDate.end_date,
                    business_type_id: selectedBusiness?.id
                }
            });
            if (response.data.success) {
                if (onRefresh) onRefresh(response.data.data);
            }
        } catch (error) {
            console.error("Filter error:", error);
            toast.error("Gagal memfilter data");
        } finally {
            setLoading(false);
        }
    };

    const resetFilter = () => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        
        const defaultDates = {
            start_date: oneMonthAgo.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
        };
        
        setFilterDate(defaultDates);
        if (onRefresh) onRefresh();
    };

    // 🔥 PERBAIKI FUNGSI EXPORT EXCEL
    const handleExportExcel = async () => {
        try {
            const params = {
                start_date: filterDate.start_date,
                end_date: filterDate.end_date,
                business_type_id: selectedBusiness?.id
            };

            const response = await api.get(`/transactions/export/excel`, {
                params,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const fileName = filterDate.start_date && filterDate.end_date
                ? `transaksi_${filterDate.start_date}_sampai_${filterDate.end_date}.xlsx`
                : `transaksi_semua.xlsx`;

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Export Excel berhasil");
        } catch (error) {
            console.error("Export Excel error:", error);
            toast.error("Gagal export Excel");
        }
    };

    // 🔥 PERBAIKI FUNGSI EXPORT PDF
    const handleExportPdf = async () => {
        try {
            const params = {
                start_date: filterDate.start_date,
                end_date: filterDate.end_date,
                business_type_id: selectedBusiness?.id
            };

            const response = await api.get(`/transactions/export/pdf`, {
                params,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const fileName = filterDate.start_date && filterDate.end_date
                ? `transaksi_${filterDate.start_date}_sampai_${filterDate.end_date}.pdf`
                : `transaksi_semua.pdf`;

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Export PDF berhasil");
        } catch (error) {
            console.error("Export PDF error:", error);
            toast.error("Gagal export PDF");
        }
    };

    // ===== FUNGSI HAPUS SEMUA TRANSAKSI =====
    const handleDeleteAllClick = () => {
        setShowDeleteAllModal(true);
    };

    const confirmDeleteAll = async () => {
        setShowDeleteAllModal(false);

        if (!selectedBusiness) {
            toast.error("Pilih jenis usaha terlebih dahulu");
            return;
        }

        const loadingToast = toast.loading("Menghapus semua transaksi...");

        try {
            await api.delete("/transactions/all", {
                params: { business_type_id: selectedBusiness.id }
            });

            toast.update(loadingToast, {
                render: " Semua transaksi berhasil dihapus",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            if (onRefresh) onRefresh();

        } catch (error) {
            console.error("Delete all error:", error);

            toast.update(loadingToast, {
                render: "❌ Gagal menghapus transaksi",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    const cancelDeleteAll = () => {
        setShowDeleteAllModal(false);
    };

    const handleEditClick = (transaction) => {
        if (onEdit) {
            onEdit(transaction);
        } else {
            toast.warning("Fungsi edit belum tersedia");
        }
    };

    const handleDeleteClick = (id) => {
        if (onDelete) {
            onDelete(id);
        } else {
            toast.warning("Fungsi hapus belum tersedia");
        }
    };

    if (!transactions || transactions.length === 0) {
        return (
            <div className="transaction-list">
                <h2>Daftar Transaksi</h2>

                <div className="filter-section">
                    <div className="filter-dates">
                        <input
                            type="date"
                            name="start_date"
                            value={filterDate.start_date}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                        <span>s/d</span>
                        <input
                            type="date"
                            name="end_date"
                            value={filterDate.end_date}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                        <button onClick={applyFilter} className="filter-btn" disabled={loading}>
                            {loading ? "Memproses..." : "Filter"}
                        </button>
                        <button onClick={resetFilter} className="reset-btn">Reset</button>
                    </div>
                    <div className="export-buttons">
                        <button onClick={handleExportExcel} className="export-excel-btn">
                            Excel
                        </button>
                        <button onClick={handleExportPdf} className="export-pdf-btn">
                            PDF
                        </button>
                    </div>
                </div>

                <p>Belum ada transaksi</p>
            </div>
        );
    }

    return (
        <div className="transaction-list">
            <div className="list-header">
                <h2>Daftar Transaksi</h2>

                {transactions.length > 0 && (
                    <button
                        onClick={handleDeleteAllClick}
                        className="btn-delete-all"
                    >
                        <FiTrash2 /> Hapus Semua Transaksi
                    </button>
                )}
            </div>

            <div className="filter-section">
                <div className="filter-dates">
                    <input
                        type="date"
                        name="start_date"
                        value={filterDate.start_date}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <span>s/d</span>
                    <input
                        type="date"
                        name="end_date"
                        value={filterDate.end_date}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <button onClick={applyFilter} className="filter-btn" disabled={loading}>
                        {loading ? "Memproses..." : "Filter"}
                    </button>
                    <button onClick={resetFilter} className="reset-btn">Reset</button>
                </div>
                <div className="export-buttons">
                    <button onClick={handleExportExcel} className="export-excel-btn">
                        Excel
                    </button>
                    <button onClick={handleExportPdf} className="export-pdf-btn">
                        PDF
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Kode Debit</th>
                            <th>Nama Rekening Debit</th>
                            <th>Kode Kredit</th>
                            <th>Nama Rekening Kredit</th>
                            <th>Keterangan</th>
                            <th>Nominal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx, index) => (
                            <tr key={trx.transaction_id || index}>
                                <td>
                                    <span className="date-badge">{formatDate(trx.transaction_date)}</span>
                                </td>
                                <td>
                                    <span className="code-badge debit">{trx.debit_code}</span>
                                </td>
                                <td>
                                    <span className="account-name">{trx.debit_name}</span>
                                </td>
                                <td>
                                    <span className="code-badge credit">{trx.credit_code}</span>
                                </td>
                                <td>
                                    <span className="account-name">{trx.credit_name}</span>
                                </td>
                                <td>
                                    <span className="description">{trx.description || '-'}</span>
                                </td>
                                <td>
                                    <span className="amount nominal">{formatRupiah(trx.debit)}</span>
                                </td>
                                <td className="action-cell">
                                    <button
                                        onClick={() => handleEditClick(trx)}
                                        className="action-btn edit-btn"
                                        title="Edit"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(trx.transaction_id)}
                                        className="action-btn delete-btn"
                                        title="Hapus"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL KONFIRMASI HAPUS SEMUA */}
            {showDeleteAllModal && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="modal-header">
                            <FiAlertTriangle className="warning-icon" />
                            <h3>Hapus Semua Transaksi</h3>
                        </div>
                        <div className="modal-body">
                            <p>Anda yakin ingin menghapus <strong>SEMUA</strong> transaksi?</p>
                            <p className="warning-text">Tindakan ini tidak dapat dibatalkan!</p>
                            <p>Total transaksi yang akan dihapus: <strong>{transactions.length}</strong></p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={cancelDeleteAll} className="btn-cancel">
                                Batal
                            </button>
                            <button onClick={confirmDeleteAll} className="btn-delete">
                                Ya, Hapus Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;