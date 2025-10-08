// backend/services/admin.service.js
const db = require("../config/db");

// ---------- Admins (people) ----------
async function getAdmins() {
    return db.any(
        `SELECT id, email, role
     FROM users
     WHERE role IN ('admin','manager')
     ORDER BY id ASC`
    );
}

async function addAdmin(userId) {
    return db.one(
        `UPDATE users
     SET role = 'admin'
     WHERE id = $1
     RETURNING id, email, role`,
        [userId]
    );
}

async function deleteAdmin(userId) {
    // "remove admin" -> demote to user
    return db.one(
        `UPDATE users
     SET role = 'user'
     WHERE id = $1
     RETURNING id, email, role`,
        [userId]
    );
}

async function setUserRole(userId, role) {
    return db.one(
        `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING id, email, role`,
        [role, userId]
    );
}

// ---------- Analytics helpers ----------
function clampGranularity(g) {
    const allowed = new Set(["day", "week", "month"]);
    return allowed.has(g) ? g : "month";
}

function normalizePeriod({ from, to }) {
    const f = from ? new Date(from) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
    const t = to ? new Date(to) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime()) || f >= t) {
        // fallback: last 6 months
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { from: start, to: end };
    }
    return { from: f, to: t };
}

// ---------- Analytics (overview) ----------
async function metricsOverview({ from, to }) {
    const period = normalizePeriod({ from, to });

    const ordersRow = await db.one(
        `
    SELECT
      COALESCE(COUNT(*) FILTER (WHERE status NOT IN ('canceled','failed')), 0)::int         AS orders_count,
      COALESCE(SUM(total_price) FILTER (WHERE status NOT IN ('canceled','failed')), 0)::numeric AS revenue,
      COALESCE(COUNT(DISTINCT user_id) FILTER (WHERE status NOT IN ('canceled','failed')), 0)::int AS active_customers
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
    `,
        [period.from, period.to]
    );

    const prodRow = await db.one(
        `SELECT COALESCE(COUNT(*),0)::int AS active_products FROM products WHERE is_active = true`
    );

    // avg order value (for successful orders)
    const aovRow = await db.one(
        `
    SELECT COALESCE(AVG(total_price),0)::numeric AS aov
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
      AND status NOT IN ('canceled','failed')
    `,
        [period.from, period.to]
    );

    return {
        orders_count: ordersRow.orders_count,
        revenue: ordersRow.revenue,
        active_customers: ordersRow.active_customers,
        active_products: prodRow.active_products,
        avg_order_value: aovRow.aov
    };
}

// ---------- Analytics (time series) ----------
async function ordersOverTime({ from, to, granularity = "month" }) {
    const period = normalizePeriod({ from, to });
    const g = clampGranularity(granularity);

    return db.any(
        `
    SELECT
      date_trunc($3, created_at) AS bucket,
      COUNT(*) FILTER (WHERE status NOT IN ('canceled','failed'))::int AS orders,
      COALESCE(SUM(total_price) FILTER (WHERE status NOT IN ('canceled','failed')),0)::numeric AS revenue
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
    GROUP BY 1
    ORDER BY 1 ASC
    `,
        [period.from, period.to, g]
    );
}

async function revenueOverTime({ from, to, granularity = "month" }) {
    const period = normalizePeriod({ from, to });
    const g = clampGranularity(granularity);

    return db.any(
        `
    SELECT
      date_trunc($3, created_at) AS bucket,
      COALESCE(SUM(total_price) FILTER (WHERE status NOT IN ('canceled','failed')),0)::numeric AS revenue
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
    GROUP BY 1
    ORDER BY 1 ASC
    `,
        [period.from, period.to, g]
    );
}

async function ordersByStatus({ from, to }) {
    const period = normalizePeriod({ from, to });

    return db.any(
        `
    SELECT status, COUNT(*)::int AS count
    FROM orders
    WHERE created_at >= $1 AND created_at < $2
    GROUP BY status
    ORDER BY status
    `,
        [period.from, period.to]
    );
}

// ---------- Analytics (top products) ----------
async function topProducts({ from, to, limit = 8 }) {
    const period = normalizePeriod({ from, to });
    const lim = Number.isFinite(+limit) ? Math.max(1, Math.min(+limit, 50)) : 8;

    return db.any(
        `
    SELECT
      p.id,
      p.name,
      COALESCE(SUM(oi.quantity), 0)::int AS qty,
      COALESCE(SUM(oi.quantity * COALESCE(oi.unit_price, oi.price, p.price, 0)), 0)::numeric AS revenue
    FROM order_items oi
    JOIN orders o   ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.created_at >= $1 AND o.created_at < $2
      AND o.status NOT IN ('canceled','failed')
    GROUP BY p.id, p.name
    ORDER BY revenue DESC
    LIMIT $3
    `,
        [period.from, period.to, lim]
    );
}

module.exports = {
    // people
    getAdmins,
    addAdmin,
    deleteAdmin,
    setUserRole,

    // analytics
    metricsOverview,
    ordersOverTime,
    revenueOverTime,
    ordersByStatus,
    topProducts,
};