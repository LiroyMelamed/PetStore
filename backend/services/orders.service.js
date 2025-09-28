const db = require("../config/db");

// יצירת כתובת אם מגיע אובייקט כתובת
async function ensureAddress(t, userId, addr, type) {
  if (!addr) throw new Error(`${type} address is required`);
  const { country, city, street, house_no, postal_code } = addr || {};
  if (!country || !city || !street || !house_no) {
    throw new Error(`Missing fields for ${type} address (country, city, street, house_no)`);
  }
  const row = await t.one(
    `INSERT INTO addresses (user_id, type, country, city, street, house_no, postal_code, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)
     RETURNING id`,
    [userId, type, country, city, street, house_no, postal_code || null]
  );
  return row.id;
}

// אימות בעלות על כתובת קיימת
async function validateAddressOwnership(t, userId, addressId, type) {
  const row = await t.oneOrNone(
    `SELECT id FROM addresses WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );
  if (!row) throw new Error(`${type} address not found for this user`);
  return row.id;
}

async function checkout({
  userId,
  items,
  discount_code,
  currency = "ILS",
  shipping_address_id,
  billing_address_id,
  shipping_address,
  billing_address
}) {
  return db.tx(async (t) => {
    // 1) ולידציית משתמש ופרופיל מלא (שם, אימייל, טלפון)
    const user = await t.oneOrNone(
      `SELECT id, username, email, phone FROM users WHERE id = $1`,
      [userId]
    );
    if (!user) throw new Error("User not found");
    if (!user.username || !user.email || !user.phone) {
      throw new Error("User profile incomplete (username/email/phone required)");
    }

    // 2) טיפול בכתובת משלוח
    let shipId;
    if (shipping_address_id) {
      shipId = await validateAddressOwnership(t, userId, shipping_address_id, "Shipping");
    } else {
      shipId = await ensureAddress(t, userId, shipping_address, "shipping");
    }

    // 3) טיפול בכתובת חיוב (אם לא סופקה — נשתמש בכתובת משלוח)
    let billId;
    if (billing_address_id) {
      billId = await validateAddressOwnership(t, userId, billing_address_id, "Billing");
    } else if (billing_address) {
      billId = await ensureAddress(t, userId, billing_address, "billing");
    } else {
      billId = shipId;
    }

    // 4) קריאה ל־SP שמטפל במלאי, סכומים וקופונים
    const result = await t.one(
      `SELECT * FROM sp_create_order($1, $2, $3, $4::jsonb, $5, $6)`,
      [userId, shipId, billId, JSON.stringify(items), currency, discount_code || null]
    );

    return result; // { order_id, status, subtotal, discount, total }
  });
}

async function getOrderById(id) {
  const order = await db.oneOrNone(`SELECT * FROM orders WHERE id = $1`, [id]);
  if (!order) return null;
  const items = await db.any(`SELECT * FROM order_items WHERE order_id = $1`, [id]);
  order.items = items;
  return order;
}

async function getMyOrders(userId) {
  return db.any(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
}

async function updateStatus(id, status) {
  // אופציונלי: לוודא שהסטטוס תקין מול enum בצד ה־DB
  return db.one(
    `UPDATE orders SET status = $1::order_status WHERE id = $2 RETURNING *`,
    [status, id]
  );
}

module.exports = {
  checkout,
  getOrderById,
  getMyOrders,
  updateStatus,
};
