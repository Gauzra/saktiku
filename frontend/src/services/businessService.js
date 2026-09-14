// src/services/businessService.js
import api from "./Api";

export const getBusinessTypes = async () => {
    try {
        const response = await api.get("/business/types");
        return response.data;
    } catch (error) {
        console.error("Error fetching business types:", error);
        throw error.response?.data || { message: "Gagal mengambil jenis usaha" };
    }
};

export const setupUserBusiness = async (businessTypeId) => {
    try {
        const response = await api.post("/business/setup", {
            business_type_id: businessTypeId
        });
        return response.data;
    } catch (error) {
        console.error("Error setting up business:", error);
        throw error.response?.data || { message: "Gagal setup usaha" };
    }
};