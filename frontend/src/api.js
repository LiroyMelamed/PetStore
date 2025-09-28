// src/api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

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

export const fetchProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/products`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        throw error;
    }
};

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
        console.log("Fetched banners:", data);

        return data;
    } catch (e) {
        handleError(e);
    }
};

// ===================== FEATURED PRODUCTS =====================
export const fetchFeaturedProducts = async () => {
    try {
        const { data } = await api.get("/products/featured");
        console.log("Fetched featured products:", data);
        return data;
    } catch (e) {
        handleError(e);
    }
};