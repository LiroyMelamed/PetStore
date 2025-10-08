const db = require("../config/db");

async function createPayment({ order_id, provider, amount, currency, provider_ref, status }) {
    if (!order_id || !amount) throw new Error("Missing fields");
    return db.one(
        `INSERT INTO payments (order_id, provider, amount, currency, provider_ref, status)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, order_id, amount, currency, status, created_at`,
        [order_id, provider || 'manual', amount, currency || 'ILS', provider_ref || null, status || 'authorized']
    );
}

async function getByOrder(orderId) {
    return db.any(
        `SELECT id, order_id, provider, amount, currency, status, provider_ref, created_at
     FROM payments
     WHERE order_id = $1
     ORDER BY created_at DESC`,
        [orderId]
    );
}

module.exports = { createPayment, getByOrder };
