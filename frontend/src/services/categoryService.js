// src/services/categoryService.js
import api from "./Api";

const getCategories = async () => {
    try {
        const response = await api.get("/categories");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil kategori" };
    }
};

const createCategory = async (payload) => {
    try {
        const response = await api.post("/categories", payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal membuat kategori" };
    }
};

const updateCategory = async (id, payload) => {
    try {
        const response = await api.put(`/categories/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengupdate kategori" };
    }
};

const toggleCategoryStatus = async (id) => {
    try {
        const response = await api.patch(`/categories/${id}/toggle`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengubah status" };
    }
};

const categoryService = {
    getCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus
};

export default categoryService;