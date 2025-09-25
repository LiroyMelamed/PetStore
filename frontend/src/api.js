import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

// --- Product API Calls ---
export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(`${API_URL}/products`, productData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/products/${id}`, productData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/products/${id}`, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// --- Category API Calls ---
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/categories`, categoryData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const fetchCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/categories/${id}`, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// --- Admin API Calls ---
export const fetchAdmins = async () => {
    try {
        const response = await fetch(`${API_URL}/admins`, { headers: authHeader() });
        if (!response.ok) {
            throw new Error('Failed to fetch admins');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }
};

export const addAdmin = async (adminData) => {
    try {
        const response = await fetch(`${API_URL}/admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
            body: JSON.stringify(adminData),
        });
        if (!response.ok) {
            throw new Error('Failed to add admin');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding admin:', error);
        throw error;
    }
};

export const deleteAdmin = async (id) => {
    try {
        const response = await fetch(`${API_URL}/admins/${id}`, {
            method: 'DELETE',
            headers: authHeader(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete admin');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting admin:', error);
        throw error;
    }
};
