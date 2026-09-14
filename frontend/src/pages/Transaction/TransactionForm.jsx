import React, { useEffect, useState } from "react";
import api from "../../services/Api";

const TransactionForm = ({ 
    onAddTransaction, 
    editingTransaction, 
    onUpdateTransaction, 
    onCancelEdit 
}) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        transaction_date: getTodayDate(),
        category_id: "",
        amount: "",
        description: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    // 🔥 POPULASI DATA SAAT EDIT
    useEffect(() => {
        if (editingTransaction) {
            let formattedDate = "";
            
            if (editingTransaction.transaction_date) {
                const date = new Date(editingTransaction.transaction_date);
                if (!isNaN(date)) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    formattedDate = `${year}-${month}-${day}`;
                }
            }

            setFormData({
                transaction_date: formattedDate || getTodayDate(),
                category_id: editingTransaction.category_id || "",
                amount: String(editingTransaction.debit || editingTransaction.amount || ""),
                description: editingTransaction.description || ""
            });
        } else {
            setFormData({
                transaction_date: getTodayDate(),
                category_id: "",
                amount: "",
                description: ""
            });
        }
    }, [editingTransaction]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get("/categories");
            console.log("Response categories:", response.data);

            // AMBIL DATA DENGAN BENAR
            let categoriesData = [];

            if (Array.isArray(response.data)) {
                categoriesData = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                categoriesData = response.data.data;
            }

            // 🔥 TANPA FILTER is_active
            setCategories(categoriesData);
            console.log("Categories loaded:", categoriesData.length);

        } catch (err) {
            console.error("Gagal ambil kategori", err);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const formatRupiah = (number) => {
        if (!number) return "";
        return new Intl.NumberFormat("id-ID").format(number);
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        setFormData({
            ...formData,
            amount: rawValue
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || parseInt(formData.amount) <= 0)
            return alert("Nominal tidak valid");
        if (!formData.transaction_date) return alert("Pilih tanggal");
        if (!formData.category_id) return alert("Pilih kategori");

        if (editingTransaction) {
            const payload = {
                transaction_date: formData.transaction_date,
                category_id: parseInt(formData.category_id),
                amount: parseInt(formData.amount),
                description: formData.description
            };
            onUpdateTransaction(payload);
        } else {
            const payload = {
                transaction_date: formData.transaction_date,
                category_id: parseInt(formData.category_id),
                amount: parseInt(formData.amount),
                payment_account_id: 1,
                description: formData.description
            };
            onAddTransaction(payload);
        }

        if (!editingTransaction) {
            setFormData({
                transaction_date: getTodayDate(),
                category_id: "",
                amount: "",
                description: ""
            });
        }
    };

    return (
        <div className="transaction-form">
            <h2>{editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tanggal Transaksi</label>
                    <input
                        type="date"
                        name="transaction_date"
                        value={formData.transaction_date}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Kategori</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="form-input"
                        required
                        disabled={loading}
                    >
                        <option value="">
                            {loading ? "Memuat kategori..." : "Pilih kategori"}
                        </option>

                        {!loading && categories.length > 0 ? (
                            categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))
                        ) : (
                            !loading && <option disabled>Tidak ada kategori</option>
                        )}
                    </select>

                    {!loading && (
                        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                            {categories.length} kategori tersedia
                        </small>
                    )}
                </div>

                <div className="form-group">
                    <label>Nominal</label>
                    <input
                        type="text"
                        placeholder="Rp 0"
                        value={
                            formData.amount
                                ? `Rp ${formatRupiah(formData.amount)}`
                                : ""
                        }
                        onChange={handleAmountChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Deskripsi</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Contoh: Membeli baju"
                    />
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-submit" style={{ flex: 1 }}>
                        {editingTransaction ? "Update" : "Simpan"}
                    </button>
                    {editingTransaction && (
                        <button 
                            type="button" 
                            onClick={onCancelEdit} 
                            className="btn-cancel"
                            style={{ 
                                flex: 1, 
                                backgroundColor: '#6b7280', 
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;