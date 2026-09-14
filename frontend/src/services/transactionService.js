import api from "./Api";

// Ambil semua transaksi (dengan filter business_type)
export const getTransactions = async (businessTypeId) => {
    try {
        const params = businessTypeId ? { business_type_id: businessTypeId } : {};
        const response = await api.get("/transactions", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil transaksi" };
    }
};

// Tambah transaksi baru
export const createTransaction = async (payload) => {
    try {
        const response = await api.post("/transactions", payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal membuat transaksi" };
    }
};

export const getOpeningBalanceAccounts = async () => {
    try {
        const response = await api.get("/transactions/opening-balance/accounts");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil akun saldo awal" };
    }
};

export const createOpeningBalance = async (payload) => {
    try {
        const response = await api.post("/transactions/opening-balance", payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal menyimpan saldo awal" };
    }
};

export const getOpeningBalances = async (businessTypeId) => {
    try {
        const params = businessTypeId ? { business_type_id: businessTypeId } : {};
        const response = await api.get("/transactions/opening-balance", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil data saldo awal" };
    }
};

// Update transaksi
export const updateTransaction = async (id, payload) => {
    try {
        const response = await api.put(`/transactions/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengupdate transaksi" };
    }
};

// Hapus transaksi
export const deleteTransaction = async (id) => {
    try {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal menghapus transaksi" };
    }
};

// Filter transaksi berdasarkan tanggal (dengan filter business_type)
export const filterTransactionsByDate = async (start_date, end_date, businessTypeId) => {
    try {
        const params = {
            start_date,
            end_date,
            business_type_id: businessTypeId
        };
        const response = await api.get("/transactions/filter", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal memfilter transaksi" };
    }
};

// Hapus semua transaksi (dengan filter business_type)
export const deleteAllTransactions = async (businessTypeId) => {
    try {
        const params = businessTypeId ? { business_type_id: businessTypeId } : {};
        const response = await api.delete("/transactions/all", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal menghapus semua transaksi" };
    }
};

// Export ke Excel (dengan filter business_type)
export const exportTransactionsToExcel = async (start_date, end_date, businessTypeId) => {
    try {
        const params = {
            start_date,
            end_date,
            business_type_id: businessTypeId
        };
        const response = await api.get("/transactions/export/excel", {
            params,
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        throw error.response?.data || { message: "Gagal export Excel" };
    }
};

// Export ke PDF (dengan filter business_type)
export const exportTransactionsToPdf = async (start_date, end_date, businessTypeId) => {
    try {
        const params = {
            start_date,
            end_date,
            business_type_id: businessTypeId
        };
        const response = await api.get("/transactions/export/pdf", {
            params,
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        throw error.response?.data || { message: "Gagal export PDF" };
    }
};

// Ambil satu transaksi berdasarkan ID (untuk edit)
export const getTransactionById = async (id) => {
    try {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil detail transaksi" };
    }
};