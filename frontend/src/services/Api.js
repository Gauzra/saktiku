// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:5000/api",
// });

// // Auto inject token
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: "/api",  // ← HAPUS "http://localhost:5000"
});

// Auto inject token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;