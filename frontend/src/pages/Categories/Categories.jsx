import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import "./Category.css";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            setCategories(data);
        } catch (err) {
            console.error(err);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="category-container">
            <div className="category-header">
                <h2>Manajemen Kategori</h2>
                <p>Kelola kategori pemasukan dan pengeluaran</p>
            </div>

            <div className="category-grid">
                <CategoryForm
                    fetchCategories={fetchCategories}
                    editingCategory={editingCategory}
                    setEditingCategory={setEditingCategory}
                />

                <CategoryList
                    categories={categories}
                    fetchCategories={fetchCategories}
                    setEditingCategory={setEditingCategory}
                />
            </div>
        </div>
    );
}

export default Categories;