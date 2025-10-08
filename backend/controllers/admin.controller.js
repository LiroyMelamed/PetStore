// backend/controllers/admins.controller.js
const db = require("../config/db");
const adminsService = require("../services/admin.service");

// ----- People -----
async function getAdmins(req, res) {
    try {
        const admins = await adminsService.getAdmins();
        res.json(admins);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function addAdmin(req, res) {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId is required" });
        const admin = await adminsService.addAdmin(userId);
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteAdmin(req, res) {
    try {
        const { id } = req.params;
        const out = await adminsService.deleteAdmin(id);
        res.json(out);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function setUserRole(req, res) {
    try {
        const { id } = req.params;
        const { role } = req.body; // 'user' | 'manager' | 'admin'
        if (!["user", "manager", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        const row = await adminsService.setUserRole(id, role);
        if (!row) return res.status(404).json({ error: "User not found" });
        res.json(row);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// ----- Analytics -----
function pickPeriod(req) {
    const { from, to } = req.query || {};
    return { from, to };
}

async function metricsOverview(req, res) {
    try {
        const data = await adminsService.metricsOverview(pickPeriod(req));
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function ordersOverTime(req, res) {
    try {
        const { granularity = "month" } = req.query || {};
        const data = await adminsService.ordersOverTime({ ...pickPeriod(req), granularity });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function revenueOverTime(req, res) {
    try {
        const { granularity = "month" } = req.query || {};
        const data = await adminsService.revenueOverTime({ ...pickPeriod(req), granularity });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function ordersByStatus(req, res) {
    try {
        const data = await adminsService.ordersByStatus(pickPeriod(req));
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function topProducts(req, res) {
    try {
        const { limit = 8 } = req.query || {};
        const data = await adminsService.topProducts({ ...pickPeriod(req), limit });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getAdmins,
    addAdmin,
    deleteAdmin,
    setUserRole,
    metricsOverview,
    ordersOverTime,
    revenueOverTime,
    ordersByStatus,
    topProducts,
};