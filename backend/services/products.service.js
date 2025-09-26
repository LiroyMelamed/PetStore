const pool = require("../config/db");

// ✅ שליפת כל המוצרים
async function getAllProducts() {
    const { rows } = await pool.query("SELECT * FROM products WHERE is_active = true ORDER BY id DESC");
    return rows;
}

// ✅ שליפת מוצר לפי ID
async function getProductById(id) {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1 AND is_active = true", [id]);
    return rows[0];
}

// ✅ יצירת מוצר חדש
async function createProduct({ name, description, price, category_id, stock }) {
    const query = `
    INSERT INTO products (name, description, price, category_id, stock, created_at, updated_at, is_active)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), true)
    RETURNING *;
  `;
    const values = [name, description, price, category_id, stock];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// ✅ עדכון מוצר
async function updateProduct(id, { name, description, price, category_id, stock }) {
    const query = `
    UPDATE products
    SET name = $1,
        description = $2,
        price = $3,
        category_id = $4,
        stock = $5,
        updated_at = NOW()
    WHERE id = $6
    RETURNING *;
  `;
    const values = [name, description, price, category_id, stock, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// ✅ מחיקת מוצר (soft delete)
async function deleteProduct(id) {
    const query = `
    UPDATE products
    SET is_active = false, updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
