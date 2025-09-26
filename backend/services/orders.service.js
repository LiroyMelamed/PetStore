const pool = require("../config/db");

async function createOrder({ customer_id, shipping_address_id, billing_address_id, items, discount_code }) {
    const client = await pool.connect();
    try {
        const query = `
      SELECT * FROM sp_create_order(
        $1::int,
        $2::int,
        $3::int,
        $4::jsonb,
        $5::varchar,
        $6::text
      )
    `;
        const values = [customer_id, shipping_address_id, billing_address_id, JSON.stringify(items), "ILS", discount_code];
        const { rows } = await client.query(query, values);
        return rows[0];
    } finally {
        client.release();
    }
}

module.exports = { createOrder };
