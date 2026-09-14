import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";

function CategoryForm({ fetchCategories, editingCategory, setEditingCategory }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("income");
    const [categories, setCategories] = useState([]);

    // Ambil semua kategori dari database
    useEffect(() => {
        fetchAllCategories();
    }, []);

    const fetchAllCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            setCategories(res.data || []);
        } catch (err) {
            console.error("Gagal ambil kategori:", err);
        }
    };

    // Filter kategori berdasarkan tipe yang dipilih
    const filteredCategories = categories.filter(cat => cat.type === type);

    useEffect(() => {
        if (editingCategory) {
            setName(editingCategory.name);
            setType(editingCategory.type);
        }
    }, [editingCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !type) {
            alert("Pilih tipe dan nama kategori!");
            return;
        }

        // Cari kategori yang dipilih untuk mendapatkan debit_account_id & credit_account_id
        const selectedCategory = categories.find(c => c.name === name && c.type === type);

        if (!selectedCategory) {
            alert("Kategori tidak valid!");
            return;
        }

        const payload = {
            name: selectedCategory.name,
            type: selectedCategory.type,
            debit_account_id: selectedCategory.debit_account_id,
            credit_account_id: selectedCategory.credit_account_id
        };

        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, payload);
            } else {
                await categoryService.createCategory(payload);
            }

            setName("");
            setType("income");
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            console.error("Gagal simpan kategori:", err);
            alert("Gagal menyimpan kategori");
        }
    };

    return (
        <div className="card">
            <h3>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</h3>

            <form onSubmit={handleSubmit}>
                {/* Dropdown 1: TIPE */}
                <div className="form-group">
                    <label>Tipe</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                        <option value="capital">Modal</option>
                        <option value="liability">Transaksi Lainnya</option>
                    </select>
                </div>

                {/* Dropdown 2: NAMA KATEGORI (berdasarkan tipe) */}
                <div className="form-group">
                    <label>Nama Kategori</label>
                    <select
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    >
                        <option value="">Pilih Kategori</option>
                        {filteredCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <small>Pilih kategori yang sesuai dengan transaksi Anda</small>
                </div>

                <div className="button-group">
                    <button type="submit" className="btn-primary">
                        {editingCategory ? "Update" : "Simpan"}
                    </button>

                    {editingCategory && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setEditingCategory(null)}
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CategoryForm;