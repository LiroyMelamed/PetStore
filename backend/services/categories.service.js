const pool = require("../config/db");

// שליפת כל הקטגוריות
async function getAllCategories() {
    const { rows } = await pool.query("SELECT * FROM categories WHERE is_active = true ORDER BY id DESC");
    return rows;
}

// שליפת קטגוריה לפי ID
async function getCategoryById(id) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1 AND is_active = true", [id]);
    return rows[0];
}

// יצירת קטגוריה חדשה
async function createCategory({ name }) {
    const query = `
    INSERT INTO categories (name, created_at, updated_at, is_active)
    VALUES ($1, NOW(), NOW(), true)
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [name]);
    return rows[0];
}

// עדכון קטגוריה
async function updateCategory(id, { name }) {
    const query = `
    UPDATE categories
    SET name = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [name, id]);
    return rows[0];
}

// מחיקה רכה (soft delete)
async function deleteCategory(id) {
    const query = `
    UPDATE categories
    SET is_active = false, updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
