const db = require("../config/db");

async function getAllProducts() {
    return db.any("SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC");
}

async function getProductById(id) {
    return db.oneOrNone("SELECT * FROM products WHERE id = $1", [id]);
}

async function createProduct({ name, description, price, stock, category_id, image_url }) {
    return db.one(
        `INSERT INTO products (name, description, price, stock, category_id, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, price, stock, category_id, image_url]
    );
}

async function updateProduct(id, { name, description, price, stock, category_id, image_url }) {
    return db.one(
        `UPDATE products 
         SET name=$1, description=$2, price=$3, stock=$4, category_id=$5, image_url=$6, updated_at=NOW()
         WHERE id=$7 RETURNING *`,
        [name, description, price, stock, category_id, image_url, id]
    );
}

async function deleteProduct(id) {
    return db.none("DELETE FROM products WHERE id=$1", [id]);
}

async function getFeaturedProducts() {
    return db.any(
        `SELECT id, name, description, price, stock, image_url
     FROM products
     WHERE is_featured = true
     ORDER BY id DESC`
    );
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
};
