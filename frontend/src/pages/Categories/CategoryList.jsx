import categoryService from "../../services/categoryService";

function CategoryList({ categories = [], fetchCategories, setEditingCategory }) {

    const handleToggle = async (id) => {
        await categoryService.toggleCategoryStatus(id);
        fetchCategories();
    };

    const getTypeLabel = (type) => {
        const map = {
            income: "Pemasukan",
            expense: "Pengeluaran",
            capital: "Modal",
            liability: "Hutang",
        };
        return map[type] || type;
    };

    // 🔥 FILTER: HANYA TAMPILKAN YANG AKTIF (is_active = 1)
    const activeCategories = categories.filter(cat => cat.is_active === 1);

    return (
        <div className="card">
            <h3>Daftar Kategori Aktif</h3>

            {/* Info tambahan */}
            <p>Menampilkan {activeCategories.length} dari {categories.length} kategori</p>

            <table className="category-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Tipe</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {activeCategories.length === 0 ? (
                        <tr>
                            <td colSpan="4">Belum ada kategori aktif</td>
                        </tr>
                    ) : (
                        activeCategories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                                <td>{getTypeLabel(cat.type)}</td>
                                <td>
                                    <span className="badge badge-active">
                                        Aktif
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-warning"
                                        onClick={() => setEditingCategory(cat)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn-danger"
                                        onClick={() => handleToggle(cat.id)}
                                    >
                                        Nonaktifkan
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryList;