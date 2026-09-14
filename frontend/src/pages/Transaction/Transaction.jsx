// src/pages/Transaction/Transaction.jsx
import React, { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import ConfirmModal from "../../components/ConfirmModal";
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions
} from "../../services/transactionService";
import { useBusiness } from "../../context/BusinessContext";
import "./transactions.css";

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false); // ← TAMBAHKAN
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    const { selectedBusiness } = useBusiness();

    useEffect(() => {
        if (selectedBusiness) {
            fetchTransactions();
        }
    }, [selectedBusiness]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getTransactions(selectedBusiness.id);
            setTransactions(result.data);
        } catch (err) {
            setError(err.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (formData) => {
        try {
            const payload = {
                ...formData,
                business_type_id: selectedBusiness.id
            };
            await createTransaction(payload);
            fetchTransactions();
        } catch (err) {
            setError(err.message || "Gagal menyimpan transaksi");
        }
    };


    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleUpdate = async (formData) => {
        try {
            const payload = {
                ...formData,
                business_type_id: selectedBusiness.id
            };
            await updateTransaction(editingTransaction.transaction_id, payload);
            setEditingTransaction(null);
            fetchTransactions();
        } catch (err) {
            setError(err.message || "Gagal mengupdate transaksi");
        }
    };

    const handleDeleteClick = (id) => {
        setTransactionToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteTransaction(transactionToDelete);
            setShowConfirmModal(false);
            setTransactionToDelete(null);
            fetchTransactions();
        } catch (err) {
            setError(err.message || "Gagal menghapus transaksi");
            setShowConfirmModal(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setTransactionToDelete(null);
    };

    // 🔥 FUNGSI HAPUS SEMUA
    const handleDeleteAllClick = () => {
        setShowDeleteAllModal(true);
    };

    const confirmDeleteAll = async () => {
        setShowDeleteAllModal(false);

        try {
            setLoading(true);
            await deleteAllTransactions(selectedBusiness.id);
            fetchTransactions();
        } catch (err) {
            setError(err.message || "Gagal menghapus semua transaksi");
        } finally {
            setLoading(false);
        }
    };

    const cancelDeleteAll = () => {
        setShowDeleteAllModal(false);
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    const handleRefresh = (filteredData) => {
        if (filteredData) {
            setTransactions(filteredData);
        } else {
            fetchTransactions();
        }
    };

    if (!selectedBusiness) {
        return (
            <div className="transaction-page">
                <h1>Transaksi</h1>
                <div className="alert alert-warning">
                    <p>Silakan pilih jenis usaha terlebih dahulu di sidebar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="transaction-page">
            <h1>Transaksi - {selectedBusiness.name}</h1>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="transaction-layout">
                <div className="form-column">
                    <TransactionForm
                        onAddTransaction={addTransaction}
                        editingTransaction={editingTransaction}
                        onUpdateTransaction={handleUpdate}
                        onCancelEdit={handleCancelEdit}
                    />
                </div>

                <div className="list-column">
                    <TransactionList
                        transactions={transactions}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        onRefresh={handleRefresh}
                        onDeleteAll={handleDeleteAllClick}  // ← TAMBAHKAN PROPS
                        businessName={selectedBusiness.name}
                    />
                </div>
            </div>

            {/* MODAL KONFIRMASI HAPUS SATU */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Hapus Transaksi"
                message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
            />

            {/* MODAL KONFIRMASI HAPUS SEMUA */}
            {showDeleteAllModal && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="modal-header">
                            <FiAlertTriangle className="warning-icon" />
                            <h3>Hapus Semua Transaksi</h3>
                        </div>
                        <div className="modal-body">
                            <p>Anda yakin ingin menghapus <strong>SEMUA</strong> transaksi untuk <strong>{selectedBusiness.name}</strong>?</p>
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

export default Transaction;