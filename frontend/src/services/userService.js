// src/services/userService.js
import api from "./Api";

export const getUserProfile = async () => {
    try {
        const response = await api.get("/users/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error.response?.data || { message: "Gagal mengambil profil user" };
    }
};

export const updateUserBusiness = async (businessTypeId) => {
    try {
        const response = await api.post("/users/setup-business", {
            business_type_id: businessTypeId
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user business:", error);
        throw error.response?.data || { message: "Gagal mengupdate usaha" };
    }
};

// Simulasi untuk development (jika backend belum siap)
export const getMockUserProfile = () => {
    return {
        success: true,
        data: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            business_type_id: null // null berarti belum pilih usaha
        }
    };
};