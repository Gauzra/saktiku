// src/components/BusinessTypeModal.jsx
import React, { useState, useEffect } from "react";
import { getBusinessTypes, setupUserBusiness } from "../services/businessService";
import "./BusinessTypeModal.css";

const BusinessTypeModal = ({ onClose, onSuccess }) => {
    const [businessTypes, setBusinessTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBusinessTypes();
    }, []);

    const fetchBusinessTypes = async () => {
        setLoading(true);
        try {
            const response = await getBusinessTypes();
            // Filter nama agar tidak dobel
            const cleanedData = response.data.map(type => ({
                ...type,
                displayName: type.name.replace(/[🏪🔧🍳🏭🌾]\s/g, '').trim()
            }));
            setBusinessTypes(cleanedData);
        } catch (error) {
            console.error("Gagal ambil jenis usaha:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (type) => {
        setSelectedType(type);
    };

    const handleSubmit = async () => {
        if (!selectedType) {
            alert("Pilih jenis usaha terlebih dahulu");
            return;
        }

        setSubmitting(true);
        try {
            await setupUserBusiness(selectedType.id);
            onSuccess(selectedType);
        } catch (error) {
            alert("Gagal menyimpan pilihan usaha");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content compact" style={{ textAlign: 'center', padding: '30px' }}>
                    <p>Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content compact">
                <div className="modal-header">
                    <h2>Selamat Datang!</h2>
                    <p>Pilih jenis usaha Anda untuk memulai</p>
                </div>

                <div className="business-list">
                    {businessTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`business-item ${selectedType?.id === type.id ? "selected" : ""}`}
                            onClick={() => handleSelect(type)}
                        >
                            <div className="business-item-header">
                                <span className="business-emoji">{type.name.split(' ')[0]}</span>
                                <span className="business-name">{type.displayName}</span>
                            </div>
                            <p className="business-desc">{type.description}</p>
                        </div>
                    ))}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Nanti
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={!selectedType || submitting}
                    >
                        {submitting ? "..." : "Pilih"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessTypeModal;