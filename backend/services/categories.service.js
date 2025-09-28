const db = require("../config/db");

// ===== Get All Categories =====
async function getAll() {
  return db.any(`SELECT * FROM categories WHERE is_active = true ORDER BY created_at DESC`);
}

// ===== Get Category By ID =====
async function getById(id) {
  return db.oneOrNone(`SELECT * FROM categories WHERE id = $1`, [id]);
}

// ===== Create Category =====
async function create({ name, seo_title, seo_description }) {
  return db.one(
    `INSERT INTO categories (name, seo_title, seo_description)
         VALUES ($1, $2, $3)
         RETURNING *`,
    [name, seo_title, seo_description]
  );
}

// ===== Update Category =====
async function update(id, { name, seo_title, seo_description }) {
  return db.one(
    `UPDATE categories
         SET name = $2, seo_title = $3, seo_description = $4, updated_at = now()
         WHERE id = $1
         RETURNING *`,
    [id, name, seo_title, seo_description]
  );
}

// ===== Delete Category =====
async function remove(id) {
  return db.none(`DELETE FROM categories WHERE id = $1`, [id]);
}

async function getProductsByCategory(categoryId) {
  return db.any(
    `SELECT * FROM products WHERE category_id = $1 AND is_active = true ORDER BY created_at DESC`,
    [categoryId]
  );
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getProductsByCategory,
};
