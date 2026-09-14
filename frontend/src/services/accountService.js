// src/services/accountService.js
import api from "./Api";

const getAccounts = async () => {
    try {
        const response = await api.get("/accounts");
        return response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error.response?.data || { message: "Gagal mengambil data akun" };
    }
};

const getAccountById = async (id) => {
    try {
        const response = await api.get(`/accounts/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil detail akun" };
    }
};

const accountService = {
    getAccounts,
    getAccountById
};

export default accountService;