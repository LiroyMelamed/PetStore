// src/api.js
import axios from "axios";

// ✅ נשארים עם אותה ארכיטקטורה, רק מוסיפים Fallback ל-ENV בלי לשנות את הקוד סביב
const API_URL = (import.meta?.env?.VITE_API_BASE) || "http://localhost:3000/api";

// --- Axios Instance ---
const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// הזרקת Authorization אוטומטית
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const handleError = (error) => {
    console.error("API Error:", error?.response || error);
    throw error?.response?.data || error;
};

// ===================== AUTH =====================
export const register = async (userData) => {
    try {
        const { data } = await api.post("/auth/register", userData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const loginEmail = async (credentials) => {
    try {
        const { data } = await api.post("/auth/login-email", credentials);
        if (data.token) localStorage.setItem("token", data.token);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const requestOtp = async (phone) => {
    try {
        const { data } = await api.post("/auth/login-phone/request", { phone });
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const verifyOtp = async (phone, code) => {
    try {
        const { data } = await api.post("/auth/login-phone/verify", { phone, code });
        if (data.token) localStorage.setItem("token", data.token);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== PRODUCTS =====================
export const fetchProducts = async () => {
    try {
        const { data } = await api.get("/products");
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchProductById = async (id) => {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const createProduct = async (productData) => {
    try {
        const { data } = await api.post("/products", productData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const { data } = await api.put(`/products/${id}`, productData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const deleteProduct = async (id) => {
    try {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ✅ איחוד לשימוש ב-axios instance בלבד (בלי fetch/axios חיצוני)
export const fetchCategoryProducts = async (categoryId) => {
    try {
        const { data } = await api.get(`/categories/${categoryId}/products`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// אליאס לשמירת תאימות אם יש קוד שקורא לשם הישן:
export const fetchProductsByCategory = fetchCategoryProducts;

// ===================== CATEGORIES =====================
export const fetchCategories = async () => {
    try {
        const { data } = await api.get("/categories");
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const createCategory = async (categoryData) => {
    try {
        const { data } = await api.post("/categories", categoryData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const { data } = await api.put(`/categories/${id}`, categoryData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const deleteCategory = async (id) => {
    try {
        const { data } = await api.delete(`/categories/${id}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== ORDERS =====================
export const checkout = async (orderData) => {
    try {
        const { data } = await api.post("/orders/checkout", orderData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchMyOrders = async () => {
    try {
        const { data } = await api.get("/orders/my");
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchOrderById = async (id) => {
    try {
        const { data } = await api.get(`/orders/${id}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const { data } = await api.patch(`/orders/${id}/status`, { status });
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== REVIEWS =====================
export const addReview = async (reviewData) => {
    try {
        const { data } = await api.post("/reviews", reviewData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchReviewsForProduct = async (productId) => {
    try {
        const { data } = await api.get(`/reviews/product/${productId}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== PAYMENTS =====================
export const createPayment = async (paymentData) => {
    try {
        const { data } = await api.post("/payments", paymentData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchPaymentsByOrder = async (orderId) => {
    try {
        const { data } = await api.get(`/payments/order/${orderId}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== ADMINS =====================
export const fetchAdmins = async () => {
    try {
        const { data } = await api.get("/admins");
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const addAdmin = async (adminData) => {
    try {
        const { data } = await api.post("/admins", adminData);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const deleteAdmin = async (id) => {
    try {
        const { data } = await api.delete(`/admins/${id}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== BANNERS =====================
export const fetchBanners = async () => {
    try {
        const { data } = await api.get("/banners");
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== BANNERS (admin helpers) =====================
export const createBanner = async (payload) => {
    try { const { data } = await api.post("/banners", payload); return data; }
    catch (e) { handleError(e); }
};

export const updateBanner = async (id, payload) => {
    try { const { data } = await api.put(`/banners/${id}`, payload); return data; }
    catch (e) { handleError(e); }
};

export const deleteBannerApi = async (id) => {
    try { const { data } = await api.delete(`/banners/${id}`); return data; }
    catch (e) { handleError(e); }
};

export const fetchAllBanners = async () => {
    try { const { data } = await api.get("/banners/all"); return data; }
    catch (e) { handleError(e); }
};

// ===================== FEATURED PRODUCTS =====================
export const fetchFeaturedProducts = async () => {
    try {
        const { data } = await api.get("/products/featured");
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== STAFF ORDERS LIST =====================
export const fetchOrders = async (params = {}) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await api.get(`/orders${q ? `?${q}` : ""}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== ROLE MANAGEMENT =====================
export const setUserRole = async (userId, role) => {
    try {
        const { data } = await api.patch(`/admins/users/${userId}/role`, { role });
        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== METRICS =====================
export const fetchAdminOverview = async (params = {}) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await api.get(`/admins/metrics/overview${q ? `?${q}` : ""}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchMetricsSeries = async (params = {}) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await api.get(`/admins/metrics/series${q ? `?${q}` : ""}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchMetricsStatus = async (params = {}) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await api.get(`/admins/metrics/status${q ? `?${q}` : ""}`);
        return data;
    } catch (e) {
        handleError(e);
    }
};

export const fetchTopProducts = async (params = {}) => {
    try { const { data } = await api.get(`/admins/metrics/top-products`, { params }); return data; }
    catch (e) { handleError(e); }
};

// ===================== INVENTORY =====================
export const adjustInventory = async (payload) => {
    try {
        const { data } = await api.post(`/inventory/adjust`, payload);
        return data;
    } catch (e) {
        handleError(e);
    }
};



export const fetchOrdersOverTime = async (params = {}) => {
    try { const { data } = await api.get(`/admins/metrics/orders-over-time`, { params }); return data; }
    catch (e) { handleError(e); }
};

export const fetchRevenueOverTime = async (params = {}) => {
    try { const { data } = await api.get(`/admins/metrics/revenue-over-time`, { params }); return data; }
    catch (e) { handleError(e); }
};

export const fetchOrdersByStatus = async (params = {}) => {
    try { const { data } = await api.get(`/admins/metrics/orders-by-status`, { params }); return data; }
    catch (e) { handleError(e); }
};
