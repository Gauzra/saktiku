// src/components/ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title || 'Konfirmasi Hapus'}</h3>
                <p>{message || 'Apakah Anda yakin ingin menghapus data ini?'}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-btn cancel-btn">
                        Batal
                    </button>
                    <button onClick={onConfirm} className="modal-btn confirm-btn">
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;