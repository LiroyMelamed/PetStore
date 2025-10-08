// backend/services/metrics.service.js
const db = require("../config/db");

// If no range supplied, default to last 6 complete months (from = 1st of month - 6 months, to = 1st of this month)
async function normalizeRange(from, to) {
    if (from && to) return { from, to };
    return db.one(`
    SELECT
      (date_trunc('month', now()) - interval '6 months')::timestamptz AS from,
      date_trunc('month', now())::timestamptz AS to
  `);
}

async function getOverview({ from, to }) {
    const range = await normalizeRange(from, to);
    const { from: f, to: t } = range;

    const overview = await db.one(`
    WITH o AS (
      SELECT *
      FROM orders
      WHERE created_at >= $1 AND created_at < $2
    )
    SELECT
      COUNT(*)::int                         AS orders_count,
      COALESCE(SUM(total_price),0)::numeric AS revenue,
      COALESCE(AVG(total_price),0)::numeric AS aov,
      (SELECT COUNT(DISTINCT user_id) FROM o)::int AS active_customers,
      (SELECT COUNT(*) FROM products WHERE is_active = true)::int AS active_products
    FROM o
  `, [f, t]);

    return { range: { from: f, to: t }, ...overview };
}

async function getSeries({ from, to, granularity = "month" }) {
    const range = await normalizeRange(from, to);
    const { from: f, to: t } = range;

    const bucket = granularity === "day" ? "day" :
        granularity === "week" ? "week" : "month";

    const rows = await db.any(`
    SELECT
      to_char(date_trunc('${bucket}', created_at), 'YYYY-MM-DD') AS bucket,
      COUNT(*)::int                                              AS orders_count,
      COALESCE(SUM(total_price),0)::numeric                      AS revenue
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
    GROUP BY 1
    ORDER BY 1
  `, [f, t]);

    return { range: { from: f, to: t }, granularity: bucket, rows };
}

async function getStatusBreakdown({ from, to }) {
    const range = await normalizeRange(from, to);
    const { from: f, to: t } = range;

    return db.any(`
    SELECT status, COUNT(*)::int AS count
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
    GROUP BY status
    ORDER BY count DESC
  `, [f, t]);
}

async function getTopProducts({ from, to, limit = 10 }) {
    const range = await normalizeRange(from, to);
    const { from: f, to: t } = range;

    return db.any(`
    SELECT
      p.id,
      p.name,
      SUM(oi.quantity)::int                              AS qty,
      COALESCE(SUM(oi.quantity * oi.unit_price),0)::numeric AS revenue
    FROM order_items oi
    JOIN orders o   ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.created_at >= $1 AND o.created_at < $2
    GROUP BY p.id, p.name
    ORDER BY revenue DESC
    LIMIT $3
  `, [f, t, limit]);
}

module.exports = {
    getOverview,
    getSeries,
    getStatusBreakdown,
    getTopProducts,
};
