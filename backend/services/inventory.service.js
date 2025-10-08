const db = require("../config/db");

async function adjust({ product_id, variant_id = null, delta, reason = "manual_adjust", note = null }) {
    if (!product_id || !delta) throw new Error("product_id and delta are required");
    await db.none(
        `SELECT sp_adjust_stock($1,$2,$3,$4,NULL,$5)`,
        [product_id, variant_id, delta, reason, note]
    );
    return { ok: true };
}

module.exports = { adjust };
