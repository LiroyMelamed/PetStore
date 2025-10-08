const db = require("../config/db");

async function addReview({ product_id, rating, title, comment, user_id }) {
    if (!product_id || !rating || !user_id) throw new Error("Missing fields");
    return db.one(
        `INSERT INTO reviews (product_id, user_id, rating, title, comment)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, product_id, user_id, rating, title, comment, created_at`,
        [product_id, user_id, rating, title || null, comment || null]
    );
}

async function getByProduct(productId) {
    return db.any(
        `SELECT r.id, r.rating, r.title, r.comment, r.created_at,
            u.id as user_id, u.email as user_email
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
        [productId]
    );
}

module.exports = { addReview, getByProduct };
